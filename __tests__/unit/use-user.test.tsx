import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import type { User } from '@supabase/supabase-js'

// Mock Supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(),
}))

describe('useUser Hook', () => {
  let mockSupabaseClient: any
  let mockAuthClient: any

  beforeEach(async () => {
    vi.clearAllMocks()

    mockAuthClient = {
      getUser: vi.fn(),
      onAuthStateChange: vi.fn(),
    }

    mockSupabaseClient = {
      auth: mockAuthClient,
    }

    const { createClient } = vi.mocked(await import('@/lib/supabase/client'))
    createClient.mockReturnValue(mockSupabaseClient)
  })

  describe('Initial State', () => {
    it('should start with loading state', async () => {
      mockAuthClient.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      mockAuthClient.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      })

      const { useUser } = await import('@/hooks/use-user')
      const { result } = renderHook(() => useUser())

      expect(result.current.isLoading).toBe(true)
      expect(result.current.user).toBeNull()
    })

    it('should set user when authenticated', async () => {
      const mockUser: User = {
        id: 'user-123',
        email: 'test@example.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      }

      mockAuthClient.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      mockAuthClient.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      })

      const { useUser } = await import('@/hooks/use-user')
      const { result } = renderHook(() => useUser())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.user).toEqual(mockUser)
      expect(result.current.error).toBeNull()
    })

    it('should set null when not authenticated', async () => {
      mockAuthClient.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      mockAuthClient.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      })

      const { useUser } = await import('@/hooks/use-user')
      const { result } = renderHook(() => useUser())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.user).toBeNull()
      expect(result.current.error).toBeNull()
    })

    it('should set error when getUser fails', async () => {
      const mockError = { message: 'Auth error', name: 'AuthError', status: 401 }

      mockAuthClient.getUser.mockResolvedValue({
        data: { user: null },
        error: mockError,
      })

      mockAuthClient.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      })

      const { useUser } = await import('@/hooks/use-user')
      const { result } = renderHook(() => useUser())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.user).toBeNull()
      expect(result.current.error).toEqual(mockError)
    })
  })

  describe('Auth State Changes', () => {
    it('should subscribe to auth state changes', async () => {
      mockAuthClient.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      mockAuthClient.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      })

      const { useUser } = await import('@/hooks/use-user')
      renderHook(() => useUser())

      await waitFor(() => {
        expect(mockAuthClient.onAuthStateChange).toHaveBeenCalledTimes(1)
      })

      expect(mockAuthClient.onAuthStateChange).toHaveBeenCalledWith(
        expect.any(Function)
      )
    })

    it('should update user on SIGNED_IN event', async () => {
      const mockUser: User = {
        id: 'user-123',
        email: 'test@example.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      }

      let authStateCallback: any

      mockAuthClient.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      mockAuthClient.onAuthStateChange.mockImplementation((callback) => {
        authStateCallback = callback
        return {
          data: { subscription: { unsubscribe: vi.fn() } },
        }
      })

      const { useUser } = await import('@/hooks/use-user')
      const { result } = renderHook(() => useUser())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Simulate SIGNED_IN event
      authStateCallback('SIGNED_IN', { user: mockUser })

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser)
      })
    })

    it('should clear user on SIGNED_OUT event', async () => {
      const mockUser: User = {
        id: 'user-123',
        email: 'test@example.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      }

      let authStateCallback: any

      mockAuthClient.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      mockAuthClient.onAuthStateChange.mockImplementation((callback) => {
        authStateCallback = callback
        return {
          data: { subscription: { unsubscribe: vi.fn() } },
        }
      })

      const { useUser } = await import('@/hooks/use-user')
      const { result } = renderHook(() => useUser())

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser)
      })

      // Simulate SIGNED_OUT event
      authStateCallback('SIGNED_OUT', { user: null })

      await waitFor(() => {
        expect(result.current.user).toBeNull()
      })
    })

    it('should update user on TOKEN_REFRESHED event', async () => {
      const mockUser: User = {
        id: 'user-123',
        email: 'test@example.com',
        app_metadata: {},
        user_metadata: {
          full_name: 'Updated Name',
        },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      }

      let authStateCallback: any

      mockAuthClient.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      mockAuthClient.onAuthStateChange.mockImplementation((callback) => {
        authStateCallback = callback
        return {
          data: { subscription: { unsubscribe: vi.fn() } },
        }
      })

      const { useUser } = await import('@/hooks/use-user')
      const { result } = renderHook(() => useUser())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Simulate TOKEN_REFRESHED event with updated user
      const updatedUser = { ...mockUser, user_metadata: { full_name: 'New Name' } }
      authStateCallback('TOKEN_REFRESHED', { user: updatedUser })

      await waitFor(() => {
        expect(result.current.user?.user_metadata?.full_name).toBe('New Name')
      })
    })
  })

  describe('Cleanup', () => {
    it('should unsubscribe on unmount', async () => {
      const mockUnsubscribe = vi.fn()

      mockAuthClient.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      mockAuthClient.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: mockUnsubscribe } },
      })

      const { useUser } = await import('@/hooks/use-user')
      const { unmount } = renderHook(() => useUser())

      await waitFor(() => {
        expect(mockAuthClient.onAuthStateChange).toHaveBeenCalledTimes(1)
      })

      unmount()

      expect(mockUnsubscribe).toHaveBeenCalledTimes(1)
    })

    it('should handle multiple mount/unmount cycles', async () => {
      const mockUnsubscribe = vi.fn()

      mockAuthClient.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      mockAuthClient.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: mockUnsubscribe } },
      })

      const { useUser } = await import('@/hooks/use-user')

      const { unmount: unmount1 } = renderHook(() => useUser())
      await waitFor(() => expect(mockAuthClient.onAuthStateChange).toHaveBeenCalled())
      unmount1()

      const { unmount: unmount2 } = renderHook(() => useUser())
      await waitFor(() => expect(mockAuthClient.onAuthStateChange).toHaveBeenCalled())
      unmount2()

      expect(mockUnsubscribe).toHaveBeenCalledTimes(2)
    })
  })

  describe('Edge Cases', () => {
    it('should handle missing user metadata', async () => {
      const mockUser: User = {
        id: 'user-123',
        email: 'test@example.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      }

      mockAuthClient.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      mockAuthClient.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      })

      const { useUser } = await import('@/hooks/use-user')
      const { result } = renderHook(() => useUser())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.user?.user_metadata).toEqual({})
    })

    it('should handle network errors during initial load', async () => {
      mockAuthClient.getUser.mockRejectedValue(new Error('Network error'))

      mockAuthClient.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      })

      const { useUser } = await import('@/hooks/use-user')
      const { result } = renderHook(() => useUser())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(result.current.user).toBeNull()
      expect(result.current.error).toBeTruthy()
    })

    it('should handle rapid auth state changes', async () => {
      let authStateCallback: any

      mockAuthClient.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      mockAuthClient.onAuthStateChange.mockImplementation((callback) => {
        authStateCallback = callback
        return {
          data: { subscription: { unsubscribe: vi.fn() } },
        }
      })

      const { useUser } = await import('@/hooks/use-user')
      const { result } = renderHook(() => useUser())

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      const mockUser: User = {
        id: 'user-123',
        email: 'test@example.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      }

      // Rapid state changes
      authStateCallback('SIGNED_IN', { user: mockUser })
      authStateCallback('TOKEN_REFRESHED', { user: mockUser })
      authStateCallback('SIGNED_OUT', { user: null })

      await waitFor(() => {
        expect(result.current.user).toBeNull()
      })
    })

    it('should handle missing subscription object', async () => {
      mockAuthClient.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      mockAuthClient.onAuthStateChange.mockReturnValue({
        data: { subscription: null },
      })

      const { useUser } = await import('@/hooks/use-user')

      // Should not throw
      expect(() => renderHook(() => useUser())).not.toThrow()
    })
  })
})
