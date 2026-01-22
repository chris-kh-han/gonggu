import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { SupabaseClient, User } from '@supabase/supabase-js'

// Mock Supabase clients before importing auth module
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(),
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

describe('Auth Functions', () => {
  let mockSupabaseClient: Partial<SupabaseClient>
  let mockAuthClient: any

  beforeEach(async () => {
    vi.clearAllMocks()

    // Mock auth client
    mockAuthClient = {
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
      getUser: vi.fn(),
    }

    // Mock Supabase client
    mockSupabaseClient = {
      auth: mockAuthClient,
    }

    // Setup default mock implementations
    const { createClient: createBrowserClient } = vi.mocked(
      await import('@/lib/supabase/client')
    )
    createBrowserClient.mockReturnValue(mockSupabaseClient as SupabaseClient)
  })

  describe('signInWithKakao', () => {
    it('should call signInWithOAuth with kakao provider', async () => {
      const { signInWithKakao } = await import('@/lib/auth')

      mockAuthClient.signInWithOAuth.mockResolvedValue({
        data: { url: 'https://kakao.oauth.url' },
        error: null,
      })

      const result = await signInWithKakao()

      expect(mockAuthClient.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'kakao',
        options: {
          redirectTo: 'http://localhost:3000/auth/callback',
        },
      })
      expect(result.error).toBeNull()
      expect(result.data?.url).toBeTruthy()
    })

    it('should return error when OAuth fails', async () => {
      const { signInWithKakao } = await import('@/lib/auth')

      const mockError = { message: 'OAuth failed', name: 'AuthError', status: 400 }
      mockAuthClient.signInWithOAuth.mockResolvedValue({
        data: { url: null },
        error: mockError,
      })

      const result = await signInWithKakao()

      expect(result.error).toEqual(mockError)
      expect(result.data?.url).toBeNull()
    })

    it('should include custom redirectTo if provided', async () => {
      const { signInWithKakao } = await import('@/lib/auth')

      mockAuthClient.signInWithOAuth.mockResolvedValue({
        data: { url: 'https://kakao.oauth.url' },
        error: null,
      })

      await signInWithKakao('/custom-redirect')

      expect(mockAuthClient.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'kakao',
        options: {
          redirectTo: 'http://localhost:3000/auth/callback?next=%2Fcustom-redirect',
        },
      })
    })
  })

  describe('signInWithGoogle', () => {
    it('should call signInWithOAuth with google provider', async () => {
      const { signInWithGoogle } = await import('@/lib/auth')

      mockAuthClient.signInWithOAuth.mockResolvedValue({
        data: { url: 'https://google.oauth.url' },
        error: null,
      })

      const result = await signInWithGoogle()

      expect(mockAuthClient.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:3000/auth/callback',
        },
      })
      expect(result.error).toBeNull()
      expect(result.data?.url).toBeTruthy()
    })

    it('should return error when OAuth fails', async () => {
      const { signInWithGoogle } = await import('@/lib/auth')

      const mockError = { message: 'OAuth failed', name: 'AuthError', status: 400 }
      mockAuthClient.signInWithOAuth.mockResolvedValue({
        data: { url: null },
        error: mockError,
      })

      const result = await signInWithGoogle()

      expect(result.error).toEqual(mockError)
    })

    it('should include custom redirectTo if provided', async () => {
      const { signInWithGoogle } = await import('@/lib/auth')

      mockAuthClient.signInWithOAuth.mockResolvedValue({
        data: { url: 'https://google.oauth.url' },
        error: null,
      })

      await signInWithGoogle('/dashboard')

      expect(mockAuthClient.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:3000/auth/callback?next=%2Fdashboard',
        },
      })
    })
  })

  describe('signOut', () => {
    it('should call auth.signOut successfully', async () => {
      const { signOut } = await import('@/lib/auth')

      mockAuthClient.signOut.mockResolvedValue({
        error: null,
      })

      const result = await signOut()

      expect(mockAuthClient.signOut).toHaveBeenCalledTimes(1)
      expect(result.error).toBeNull()
    })

    it('should return error when signOut fails', async () => {
      const { signOut } = await import('@/lib/auth')

      const mockError = { message: 'Sign out failed', name: 'AuthError', status: 500 }
      mockAuthClient.signOut.mockResolvedValue({
        error: mockError,
      })

      const result = await signOut()

      expect(result.error).toEqual(mockError)
    })
  })

  describe('getCurrentUser (server-side)', () => {
    it('should return user when authenticated', async () => {
      const mockUser: User = {
        id: 'user-123',
        email: 'test@example.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      }

      // Mock server client for this test
      const { createClient: createServerClient } = vi.mocked(
        await import('@/lib/supabase/server')
      )

      const mockServerAuthClient = {
        getUser: vi.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null,
        }),
      }

      createServerClient.mockResolvedValue({
        auth: mockServerAuthClient,
      } as any)

      const { getCurrentUser } = await import('@/lib/auth.server')
      const result = await getCurrentUser()

      expect(mockServerAuthClient.getUser).toHaveBeenCalledTimes(1)
      expect(result.data?.user).toEqual(mockUser)
      expect(result.error).toBeNull()
    })

    it('should return null when not authenticated', async () => {
      const { createClient: createServerClient } = vi.mocked(
        await import('@/lib/supabase/server')
      )

      const mockServerAuthClient = {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: null,
        }),
      }

      createServerClient.mockResolvedValue({
        auth: mockServerAuthClient,
      } as any)

      const { getCurrentUser } = await import('@/lib/auth.server')
      const result = await getCurrentUser()

      expect(result.data?.user).toBeNull()
      expect(result.error).toBeNull()
    })

    it('should return error when getUser fails', async () => {
      const { createClient: createServerClient } = vi.mocked(
        await import('@/lib/supabase/server')
      )

      const mockError = { message: 'Auth error', name: 'AuthError', status: 401 }
      const mockServerAuthClient = {
        getUser: vi.fn().mockResolvedValue({
          data: { user: null },
          error: mockError,
        }),
      }

      createServerClient.mockResolvedValue({
        auth: mockServerAuthClient,
      } as any)

      const { getCurrentUser } = await import('@/lib/auth.server')
      const result = await getCurrentUser()

      expect(result.error).toEqual(mockError)
    })
  })

  describe('Edge Cases', () => {
    it('should handle network errors gracefully', async () => {
      const { signInWithKakao } = await import('@/lib/auth')

      mockAuthClient.signInWithOAuth.mockRejectedValue(
        new Error('Network error')
      )

      await expect(signInWithKakao()).rejects.toThrow('Network error')
    })

    it('should handle empty redirectTo parameter', async () => {
      const { signInWithGoogle } = await import('@/lib/auth')

      mockAuthClient.signInWithOAuth.mockResolvedValue({
        data: { url: 'https://google.oauth.url' },
        error: null,
      })

      await signInWithGoogle('')

      expect(mockAuthClient.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:3000/auth/callback',
        },
      })
    })

    it('should handle undefined user metadata', async () => {
      const mockUser: User = {
        id: 'user-123',
        email: 'test@example.com',
        app_metadata: {},
        user_metadata: {}, // Empty metadata
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      }

      const { createClient: createServerClient } = vi.mocked(
        await import('@/lib/supabase/server')
      )

      const mockServerAuthClient = {
        getUser: vi.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null,
        }),
      }

      createServerClient.mockResolvedValue({
        auth: mockServerAuthClient,
      } as any)

      const { getCurrentUser } = await import('@/lib/auth.server')
      const result = await getCurrentUser()

      expect(result.data?.user).toEqual(mockUser)
      expect(result.data?.user?.user_metadata).toEqual({})
    })
  })
})
