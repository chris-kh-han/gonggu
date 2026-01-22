import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

// Mock Supabase server client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT: ${url}`)
  }),
}))

describe('GET /auth/callback', () => {
  let mockSupabaseClient: any
  let createClientMock: any

  beforeEach(async () => {
    vi.clearAllMocks()
    vi.resetModules()

    mockSupabaseClient = {
      auth: {
        exchangeCodeForSession: vi.fn(),
      },
    }

    const supabaseServerModule = await import('@/lib/supabase/server')
    createClientMock = vi.mocked(supabaseServerModule.createClient)
    createClientMock.mockResolvedValue(mockSupabaseClient)
  })

  it('should exchange code for session and redirect to home', async () => {
    const { GET } = await import('@/app/auth/callback/route')
    const { redirect } = await import('next/navigation')

    mockSupabaseClient.auth.exchangeCodeForSession.mockResolvedValue({
      data: {
        session: {
          access_token: 'mock-token',
          refresh_token: 'mock-refresh-token',
        },
      },
      error: null,
    })

    const request = new NextRequest(
      'http://localhost:3000/auth/callback?code=mock-auth-code'
    )

    try {
      await GET(request)
    } catch (error: any) {
      // next/navigation redirect throws an error
      expect(error.message).toBe('NEXT_REDIRECT: /')
    }

    expect(mockSupabaseClient.auth.exchangeCodeForSession).toHaveBeenCalledWith(
      'mock-auth-code'
    )
    expect(redirect).toHaveBeenCalledWith('/')
  })

  it('should redirect to custom next parameter if provided', async () => {
    const { GET } = await import('@/app/auth/callback/route')
    const { redirect } = await import('next/navigation')

    mockSupabaseClient.auth.exchangeCodeForSession.mockResolvedValue({
      data: { session: { access_token: 'mock-token' } },
      error: null,
    })

    const request = new NextRequest(
      'http://localhost:3000/auth/callback?code=mock-code&next=/dashboard'
    )

    try {
      await GET(request)
    } catch (error: any) {
      expect(error.message).toBe('NEXT_REDIRECT: /dashboard')
    }

    expect(redirect).toHaveBeenCalledWith('/dashboard')
  })

  it('should redirect to error page when code is missing', async () => {
    const { GET } = await import('@/app/auth/callback/route')
    const { redirect } = await import('next/navigation')

    const request = new NextRequest('http://localhost:3000/auth/callback')

    try {
      await GET(request)
    } catch (error: any) {
      expect(error.message).toContain('NEXT_REDIRECT')
      expect(error.message).toContain('error')
    }

    expect(redirect).toHaveBeenCalledWith('/?error=missing_code')
  })

  it('should redirect to error page when code exchange fails', async () => {
    const { GET } = await import('@/app/auth/callback/route')
    const { redirect } = await import('next/navigation')

    mockSupabaseClient.auth.exchangeCodeForSession.mockResolvedValue({
      data: { session: null },
      error: { message: 'Invalid code', name: 'AuthError' },
    })

    const request = new NextRequest(
      'http://localhost:3000/auth/callback?code=invalid-code'
    )

    try {
      await GET(request)
    } catch (error: any) {
      expect(error.message).toContain('NEXT_REDIRECT')
      expect(error.message).toContain('auth_error')
    }

    expect(redirect).toHaveBeenCalledWith('/?error=auth_error')
  })

  it('should handle URL-encoded next parameter correctly', async () => {
    const { GET } = await import('@/app/auth/callback/route')
    const { redirect } = await import('next/navigation')

    mockSupabaseClient.auth.exchangeCodeForSession.mockResolvedValue({
      data: { session: { access_token: 'mock-token' } },
      error: null,
    })

    const request = new NextRequest(
      'http://localhost:3000/auth/callback?code=mock-code&next=%2Fprofile%3Ftab%3Dsettings'
    )

    try {
      await GET(request)
    } catch (error: any) {
      expect(error.message).toBe('NEXT_REDIRECT: /profile?tab=settings')
    }

    expect(redirect).toHaveBeenCalledWith('/profile?tab=settings')
  })

  it('should prevent open redirect attacks', async () => {
    const { GET } = await import('@/app/auth/callback/route')
    const { redirect } = await import('next/navigation')

    mockSupabaseClient.auth.exchangeCodeForSession.mockResolvedValue({
      data: { session: { access_token: 'mock-token' } },
      error: null,
    })

    // Try to redirect to external URL
    const request = new NextRequest(
      'http://localhost:3000/auth/callback?code=mock-code&next=https://evil.com'
    )

    try {
      await GET(request)
    } catch (error: any) {
      // Should redirect to home instead of external URL
      expect(error.message).toBe('NEXT_REDIRECT: /')
    }

    expect(redirect).toHaveBeenCalledWith('/')
  })

  it('should handle session with user metadata', async () => {
    const { GET } = await import('@/app/auth/callback/route')

    mockSupabaseClient.auth.exchangeCodeForSession.mockResolvedValue({
      data: {
        session: {
          access_token: 'mock-token',
          user: {
            id: 'user-123',
            email: 'test@example.com',
            user_metadata: {
              avatar_url: 'https://avatar.url',
              full_name: 'Test User',
            },
          },
        },
      },
      error: null,
    })

    const request = new NextRequest(
      'http://localhost:3000/auth/callback?code=mock-code'
    )

    try {
      await GET(request)
    } catch (error: any) {
      expect(error.message).toBe('NEXT_REDIRECT: /')
    }

    expect(mockSupabaseClient.auth.exchangeCodeForSession).toHaveBeenCalledWith(
      'mock-code'
    )
  })

  describe('Edge Cases', () => {
    it('should handle empty code parameter', async () => {
      const { GET } = await import('@/app/auth/callback/route')
      const { redirect } = await import('next/navigation')

      const request = new NextRequest(
        'http://localhost:3000/auth/callback?code='
      )

      try {
        await GET(request)
      } catch (error: any) {
        expect(error.message).toContain('NEXT_REDIRECT')
      }

      expect(redirect).toHaveBeenCalledWith('/?error=missing_code')
    })

    it('should handle malformed code parameter', async () => {
      const { GET } = await import('@/app/auth/callback/route')
      const { redirect } = await import('next/navigation')

      mockSupabaseClient.auth.exchangeCodeForSession.mockResolvedValue({
        data: { session: null },
        error: { message: 'Malformed code', name: 'AuthError' },
      })

      const request = new NextRequest(
        'http://localhost:3000/auth/callback?code=malformed@#$%'
      )

      try {
        await GET(request)
      } catch (error: any) {
        expect(error.message).toContain('auth_error')
      }

      expect(redirect).toHaveBeenCalledWith('/?error=auth_error')
    })

    it('should handle network timeout errors', async () => {
      const { GET } = await import('@/app/auth/callback/route')

      mockSupabaseClient.auth.exchangeCodeForSession.mockRejectedValue(
        new Error('Network timeout')
      )

      const request = new NextRequest(
        'http://localhost:3000/auth/callback?code=mock-code'
      )

      // Network errors should throw and not be caught
      await expect(GET(request)).rejects.toThrow('Network timeout')
    })
  })
})
