import { createClient as createBrowserClient } from '@/lib/supabase/client'

/**
 * Sign in with Kakao OAuth
 * @param redirectTo - Optional redirect URL after successful sign in
 */
export async function signInWithKakao(redirectTo?: string) {
  const supabase = createBrowserClient()

  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin
    : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const callbackUrl = `${baseUrl}/auth/callback${redirectTo ? `?next=${encodeURIComponent(redirectTo)}` : ''}`

  return await supabase.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo: callbackUrl,
    },
  })
}

/**
 * Sign in with Google OAuth
 * @param redirectTo - Optional redirect URL after successful sign in
 */
export async function signInWithGoogle(redirectTo?: string) {
  const supabase = createBrowserClient()

  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin
    : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const callbackUrl = `${baseUrl}/auth/callback${redirectTo ? `?next=${encodeURIComponent(redirectTo)}` : ''}`

  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: callbackUrl,
    },
  })
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const supabase = createBrowserClient()
  return await supabase.auth.signOut()
}

/**
 * Sign in with Naver OAuth (custom implementation)
 * @param redirectTo - Optional redirect URL after successful sign in
 */
export function signInWithNaver(redirectTo?: string) {
  const baseUrl = typeof window !== 'undefined'
    ? window.location.origin
    : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const naverAuthUrl = `${baseUrl}/auth/naver${redirectTo ? `?next=${encodeURIComponent(redirectTo)}` : ''}`

  window.location.href = naverAuthUrl
}
