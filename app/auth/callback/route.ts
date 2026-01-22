import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const next = searchParams.get('next') || '/'

  // If no code is present, redirect to error page
  if (!code) {
    redirect('/?error=missing_code')
  }

  const supabase = await createClient()

  // Exchange the code for a session
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('Auth callback error:', error)
    redirect('/?error=auth_error')
  }

  // Prevent open redirect attacks - only allow relative URLs
  const redirectUrl = next.startsWith('/')
    ? next
    : '/'

  redirect(redirectUrl)
}
