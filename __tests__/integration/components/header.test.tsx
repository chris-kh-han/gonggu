import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from '@/components/header'
import * as useUserHook from '@/hooks/use-user'
import type { User } from '@supabase/supabase-js'

// Mock useUser hook
vi.mock('@/hooks/use-user', () => ({
  useUser: vi.fn(),
}))

// Mock auth functions (used by child components)
vi.mock('@/lib/auth', () => ({
  signInWithKakao: vi.fn(),
  signInWithGoogle: vi.fn(),
  signOut: vi.fn(),
}))

describe('Header Component', () => {
  const mockUser: User = {
    id: 'test-user-id',
    email: 'test@example.com',
    user_metadata: {
      name: '테스트유저',
      avatar_url: 'https://example.com/avatar.jpg',
    },
    app_metadata: {},
    aud: 'authenticated',
    created_at: '2024-01-01',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('should render header with title', () => {
      vi.mocked(useUserHook.useUser).mockReturnValue({
        user: null,
        isLoading: false,
        error: null,
      })

      render(<Header />)

      expect(screen.getByText('공구 파인더')).toBeInTheDocument()
      expect(screen.getByText('인스타 공구 모아보기')).toBeInTheDocument()
    })

    it('should use header tag for semantic HTML', () => {
      vi.mocked(useUserHook.useUser).mockReturnValue({
        user: null,
        isLoading: false,
        error: null,
      })

      const { container } = render(<Header />)

      const header = container.querySelector('header')
      expect(header).toBeInTheDocument()
    })
  })

  describe('Loading State', () => {
    it('should show loading skeleton when user is loading', () => {
      vi.mocked(useUserHook.useUser).mockReturnValue({
        user: null,
        isLoading: true,
        error: null,
      })

      render(<Header />)

      // Should not show login buttons or user menu while loading
      expect(screen.queryByRole('button', { name: /카카오/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /구글/i })).not.toBeInTheDocument()
    })
  })

  describe('Unauthenticated State', () => {
    it('should display LoginButton when user is not logged in', () => {
      vi.mocked(useUserHook.useUser).mockReturnValue({
        user: null,
        isLoading: false,
        error: null,
      })

      render(<Header />)

      expect(screen.getByRole('button', { name: /카카오.*로그인/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /구글.*로그인/i })).toBeInTheDocument()
    })

    it('should not display UserMenu when user is not logged in', () => {
      vi.mocked(useUserHook.useUser).mockReturnValue({
        user: null,
        isLoading: false,
        error: null,
      })

      render(<Header />)

      expect(screen.queryByText('테스트유저')).not.toBeInTheDocument()
    })
  })

  describe('Authenticated State', () => {
    it('should display UserMenu when user is logged in', () => {
      vi.mocked(useUserHook.useUser).mockReturnValue({
        user: mockUser,
        isLoading: false,
        error: null,
      })

      render(<Header />)

      expect(screen.getByText('테스트유저')).toBeInTheDocument()
    })

    it('should not display LoginButton when user is logged in', () => {
      vi.mocked(useUserHook.useUser).mockReturnValue({
        user: mockUser,
        isLoading: false,
        error: null,
      })

      render(<Header />)

      expect(screen.queryByRole('button', { name: /카카오.*로그인/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /구글.*로그인/i })).not.toBeInTheDocument()
    })

    it('should pass user data to UserMenu', () => {
      vi.mocked(useUserHook.useUser).mockReturnValue({
        user: mockUser,
        isLoading: false,
        error: null,
      })

      render(<Header />)

      expect(screen.getByText('테스트유저')).toBeInTheDocument()
      expect(screen.getByAltText(/테스트유저/)).toHaveAttribute(
        'src',
        expect.stringContaining('avatar.jpg')
      )
    })
  })

  describe('Error State', () => {
    it('should handle auth error gracefully', () => {
      vi.mocked(useUserHook.useUser).mockReturnValue({
        user: null,
        isLoading: false,
        error: {
          message: 'Auth error',
          name: 'AuthError',
          status: 401,
          code: 'auth_error',
          __isAuthError: true,
        } as any,
      })

      render(<Header />)

      // Should still render header and show login options
      expect(screen.getByText('공구 파인더')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /카카오.*로그인/i })).toBeInTheDocument()
    })

    it('should not crash when error occurs', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      vi.mocked(useUserHook.useUser).mockReturnValue({
        user: null,
        isLoading: false,
        error: {
          message: 'Unknown error',
          name: 'Error',
          status: 500,
          code: 'unknown_error',
          __isAuthError: true,
        } as any,
      })

      expect(() => render(<Header />)).not.toThrow()

      consoleErrorSpy.mockRestore()
    })
  })

  describe('State Transitions', () => {
    it('should transition from loading to unauthenticated', () => {
      const { rerender } = render(<Header />)

      // Initial loading state
      vi.mocked(useUserHook.useUser).mockReturnValue({
        user: null,
        isLoading: true,
        error: null,
      })
      rerender(<Header />)

      expect(screen.queryByRole('button', { name: /카카오/i })).not.toBeInTheDocument()

      // Loaded, no user
      vi.mocked(useUserHook.useUser).mockReturnValue({
        user: null,
        isLoading: false,
        error: null,
      })
      rerender(<Header />)

      expect(screen.getByRole('button', { name: /카카오.*로그인/i })).toBeInTheDocument()
    })

    it('should transition from loading to authenticated', () => {
      const { rerender } = render(<Header />)

      // Initial loading state
      vi.mocked(useUserHook.useUser).mockReturnValue({
        user: null,
        isLoading: true,
        error: null,
      })
      rerender(<Header />)

      // Loaded, with user
      vi.mocked(useUserHook.useUser).mockReturnValue({
        user: mockUser,
        isLoading: false,
        error: null,
      })
      rerender(<Header />)

      expect(screen.getByText('테스트유저')).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /카카오/i })).not.toBeInTheDocument()
    })
  })

  describe('Layout and Styling', () => {
    it('should position auth components on the right side', () => {
      vi.mocked(useUserHook.useUser).mockReturnValue({
        user: null,
        isLoading: false,
        error: null,
      })

      const { container } = render(<Header />)

      const header = container.querySelector('header')
      expect(header).toHaveClass(/flex|grid/)
    })

    it('should have proper spacing between title and auth section', () => {
      vi.mocked(useUserHook.useUser).mockReturnValue({
        user: mockUser,
        isLoading: false,
        error: null,
      })

      const { container } = render(<Header />)

      const header = container.querySelector('header')
      expect(header).toHaveClass(/justify-between|space-x/)
    })
  })

  describe('Responsive Design', () => {
    it('should be mobile-friendly', () => {
      vi.mocked(useUserHook.useUser).mockReturnValue({
        user: null,
        isLoading: false,
        error: null,
      })

      const { container } = render(<Header />)

      const header = container.querySelector('header')
      // Should use responsive utility classes
      expect(header?.className).toBeTruthy()
    })
  })

  describe('Integration', () => {
    it('should render both title and auth components together', () => {
      vi.mocked(useUserHook.useUser).mockReturnValue({
        user: mockUser,
        isLoading: false,
        error: null,
      })

      render(<Header />)

      // Header content
      expect(screen.getByText('공구 파인더')).toBeInTheDocument()
      expect(screen.getByText('인스타 공구 모아보기')).toBeInTheDocument()

      // Auth content
      expect(screen.getByText('테스트유저')).toBeInTheDocument()
    })
  })
})
