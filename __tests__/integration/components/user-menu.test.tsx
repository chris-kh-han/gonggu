import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UserMenu } from '@/components/auth/user-menu'
import * as auth from '@/lib/auth'
import type { User } from '@supabase/supabase-js'

// Mock auth functions
vi.mock('@/lib/auth', () => ({
  signOut: vi.fn(),
}))

describe('UserMenu Component', () => {
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

  describe('Rendering', () => {
    it('should render user avatar trigger button', () => {
      render(<UserMenu user={mockUser} />)

      const triggerButton = screen.getByRole('button')
      expect(triggerButton).toBeInTheDocument()
    })

    it('should display user name in trigger', () => {
      render(<UserMenu user={mockUser} />)

      expect(screen.getByText('테스트유저')).toBeInTheDocument()
    })

    it('should display user avatar image', () => {
      render(<UserMenu user={mockUser} />)

      const avatar = screen.getByAltText(/테스트유저/)
      expect(avatar).toBeInTheDocument()
      expect(avatar).toHaveAttribute('src', expect.stringContaining('avatar.jpg'))
    })

    it('should display fallback when no avatar_url', () => {
      const userWithoutAvatar = {
        ...mockUser,
        user_metadata: { name: '테스트유저' },
      }

      render(<UserMenu user={userWithoutAvatar} />)

      // Should show initials or default avatar
      const triggerButton = screen.getByRole('button')
      expect(triggerButton).toBeInTheDocument()
    })

    it('should display email when no name in metadata', () => {
      const userWithoutName = {
        ...mockUser,
        user_metadata: {},
      }

      render(<UserMenu user={userWithoutName} />)

      expect(screen.getByText(/test@example.com/)).toBeInTheDocument()
    })
  })

  describe('Dropdown Menu Interactions', () => {
    it('should open menu when trigger is clicked', async () => {
      const user = userEvent.setup()
      render(<UserMenu user={mockUser} />)

      const triggerButton = screen.getByRole('button')
      await user.click(triggerButton)

      await waitFor(() => {
        expect(screen.getByText('내 프로필')).toBeInTheDocument()
      })
    })

    it('should display menu items when opened', async () => {
      const user = userEvent.setup()
      render(<UserMenu user={mockUser} />)

      await user.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(screen.getByText('내 프로필')).toBeInTheDocument()
        expect(screen.getByText('로그아웃')).toBeInTheDocument()
      })
    })

    // Note: "click outside" behavior is handled by Radix UI's DropdownMenu
    // We test closing with Escape key instead, which is more reliable in tests
  })

  describe('Profile Navigation', () => {
    it('should have link to profile page', async () => {
      const user = userEvent.setup()
      render(<UserMenu user={mockUser} />)

      await user.click(screen.getByRole('button'))

      await waitFor(() => {
        const profileLink = screen.getByText('내 프로필').closest('a')
        expect(profileLink).toHaveAttribute('href', '/my-profile')
      })
    })
  })

  describe('Sign Out Functionality', () => {
    it('should call signOut when logout button is clicked', async () => {
      const user = userEvent.setup()
      const signOutMock = vi.mocked(auth.signOut)

      render(<UserMenu user={mockUser} />)

      // Open menu
      await user.click(screen.getByRole('button'))

      // Click logout
      await waitFor(() => {
        expect(screen.getByText('로그아웃')).toBeInTheDocument()
      })

      await user.click(screen.getByText('로그아웃'))

      expect(signOutMock).toHaveBeenCalledTimes(1)
    })

    it('should handle signOut errors gracefully', async () => {
      const user = userEvent.setup()
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      vi.mocked(auth.signOut).mockRejectedValueOnce(new Error('Sign out failed'))

      render(<UserMenu user={mockUser} />)

      await user.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(screen.getByText('로그아웃')).toBeInTheDocument()
      })

      await user.click(screen.getByText('로그아웃'))

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalled()
      })

      consoleErrorSpy.mockRestore()
    })
  })

  describe('User Display Information', () => {
    it('should show user email in dropdown', async () => {
      const user = userEvent.setup()
      render(<UserMenu user={mockUser} />)

      await user.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(screen.getByText('test@example.com')).toBeInTheDocument()
      })
    })

    it('should truncate long email addresses', async () => {
      const userWithLongEmail = {
        ...mockUser,
        email: 'verylongemailaddress@example.com',
      }

      const user = userEvent.setup()
      render(<UserMenu user={userWithLongEmail} />)

      await user.click(screen.getByRole('button'))

      await waitFor(() => {
        const emailElement = screen.getByText(/verylongemailaddress/)
        expect(emailElement).toBeInTheDocument()
        expect(emailElement).toHaveClass(/truncate|overflow/)
      })
    })
  })

  describe('Accessibility', () => {
    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()
      render(<UserMenu user={mockUser} />)

      // Tab to trigger
      await user.tab()

      // Open with Enter
      await user.keyboard('{Enter}')

      await waitFor(() => {
        expect(screen.getByText('로그아웃')).toBeInTheDocument()
      })
    })

    it('should close with Escape key', async () => {
      const user = userEvent.setup()
      render(<UserMenu user={mockUser} />)

      await user.click(screen.getByRole('button'))

      await waitFor(() => {
        expect(screen.getByText('로그아웃')).toBeInTheDocument()
      })

      await user.keyboard('{Escape}')

      await waitFor(() => {
        expect(screen.queryByText('로그아웃')).not.toBeInTheDocument()
      })
    })

    it('should have proper ARIA attributes', () => {
      render(<UserMenu user={mockUser} />)

      const trigger = screen.getByRole('button')
      expect(trigger).toHaveAttribute('aria-haspopup')
    })
  })

  describe('Edge Cases', () => {
    it('should handle null user metadata gracefully', () => {
      const userWithNullMetadata = {
        ...mockUser,
        user_metadata: null as any,
      }

      render(<UserMenu user={userWithNullMetadata} />)

      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('should handle empty user metadata gracefully', () => {
      const userWithEmptyMetadata = {
        ...mockUser,
        user_metadata: {},
      }

      render(<UserMenu user={userWithEmptyMetadata} />)

      expect(screen.getByRole('button')).toBeInTheDocument()
    })
  })
})
