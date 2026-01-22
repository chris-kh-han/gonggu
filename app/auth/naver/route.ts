import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const next = searchParams.get('next') || '/'

  const clientId = process.env.NAVER_CLIENT_ID
  if (!clientId) {
    return NextResponse.redirect(new URL('/?error=naver_not_configured', request.url))
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const redirectUri = `${baseUrl}/auth/naver/callback`
  const state = Buffer.from(JSON.stringify({ next })).toString('base64')

  const naverAuthUrl = new URL('https://nid.naver.com/oauth2.0/authorize')
  naverAuthUrl.searchParams.set('response_type', 'code')
  naverAuthUrl.searchParams.set('client_id', clientId)
  naverAuthUrl.searchParams.set('redirect_uri', redirectUri)
  naverAuthUrl.searchParams.set('state', state)

  return NextResponse.redirect(naverAuthUrl.toString())
}
