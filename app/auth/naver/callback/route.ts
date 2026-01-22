import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

interface NaverTokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  error?: string
  error_description?: string
}

interface NaverUserResponse {
  resultcode: string
  message: string
  response: {
    id: string
    nickname?: string
    email?: string
    profile_image?: string
    name?: string
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  // Parse state to get redirect URL
  let next = '/'
  if (state) {
    try {
      const parsed = JSON.parse(Buffer.from(state, 'base64').toString())
      next = parsed.next || '/'
    } catch {
      // Ignore parse error
    }
  }

  if (error || !code) {
    return NextResponse.redirect(new URL('/?error=naver_auth_failed', request.url))
  }

  const clientId = process.env.NAVER_CLIENT_ID
  const clientSecret = process.env.NAVER_CLIENT_SECRET
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL('/?error=naver_not_configured', request.url))
  }

  try {
    // 1. Exchange code for access token
    const tokenUrl = new URL('https://nid.naver.com/oauth2.0/token')
    tokenUrl.searchParams.set('grant_type', 'authorization_code')
    tokenUrl.searchParams.set('client_id', clientId)
    tokenUrl.searchParams.set('client_secret', clientSecret)
    tokenUrl.searchParams.set('code', code)
    tokenUrl.searchParams.set('state', state || '')

    const tokenRes = await fetch(tokenUrl.toString())
    const tokenData: NaverTokenResponse = await tokenRes.json()

    if (tokenData.error) {
      console.error('Naver token error:', tokenData.error_description)
      return NextResponse.redirect(new URL('/?error=naver_token_failed', request.url))
    }

    // 2. Fetch user info from Naver
    const userRes = await fetch('https://openapi.naver.com/v1/nid/me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })
    const userData: NaverUserResponse = await userRes.json()

    if (userData.resultcode !== '00') {
      return NextResponse.redirect(new URL('/?error=naver_user_failed', request.url))
    }

    const naverUser = userData.response
    const email = naverUser.email || `naver_${naverUser.id}@naver.local`

    // 3. Create or get user via Supabase Admin API
    const supabaseAdmin = createAdminClient()

    // Find existing user by naver_id or email
    const { data: users } = await supabaseAdmin.auth.admin.listUsers()
    let user = users?.users.find(
      (u) => u.user_metadata?.naver_id === naverUser.id || u.email === email
    )

    if (!user) {
      // Create new user
      const { data: newUserData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: {
          provider: 'naver',
          naver_id: naverUser.id,
          name: naverUser.nickname || naverUser.name,
          avatar_url: naverUser.profile_image,
        },
      })

      if (createError || !newUserData.user) {
        console.error('Create user error:', createError)
        return NextResponse.redirect(new URL('/?error=user_creation_failed', request.url))
      }

      user = newUserData.user
    } else {
      // Update existing user metadata
      await supabaseAdmin.auth.admin.updateUserById(user.id, {
        user_metadata: {
          provider: 'naver',
          naver_id: naverUser.id,
          name: naverUser.nickname || naverUser.name,
          avatar_url: naverUser.profile_image,
        },
      })
    }

    // 4. Generate magic link and extract session
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: user.email!,
    })

    if (linkError || !linkData.properties?.hashed_token) {
      console.error('Link generation error:', linkError)
      return NextResponse.redirect(new URL('/?error=session_failed', request.url))
    }

    // 5. Verify the magic link to get session
    const verifyUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/verify`
    const verifyRes = await fetch(verifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
      },
      body: JSON.stringify({
        token_hash: linkData.properties.hashed_token,
        type: 'magiclink',
      }),
    })

    const session = await verifyRes.json()

    // 6. Set session cookies and redirect
    const response = NextResponse.redirect(new URL(next.startsWith('/') ? next : '/', request.url))

    if (session.access_token && session.refresh_token) {
      // Supabase SSR expects cookies in specific format
      const projectRef = process.env.NEXT_PUBLIC_SUPABASE_URL?.match(/https:\/\/([^.]+)/)?.[1]
      const cookieName = `sb-${projectRef}-auth-token`

      response.cookies.set(cookieName, JSON.stringify({
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: Math.floor(Date.now() / 1000) + session.expires_in,
      }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      })
    }

    return response

  } catch (err) {
    console.error('Naver callback error:', err)
    return NextResponse.redirect(new URL('/?error=naver_callback_failed', request.url))
  }
}
