import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginButton } from '@/components/auth/login-button'
import * as auth from '@/lib/auth'

// Mock auth functions
vi.mock('@/lib/auth', () => ({
  signInWithKakao: vi.fn(),
  signInWithGoogle: vi.fn(),
}))

describe('LoginButton Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render Kakao login button', () => {
      render(<LoginButton />)

      const kakaoButton = screen.getByRole('button', { name: /카카오.*로그인/i })
      expect(kakaoButton).toBeInTheDocument()
    })

    it('should render Google login button', () => {
      render(<LoginButton />)

      const googleButton = screen.getByRole('button', { name: /구글.*로그인/i })
      expect(googleButton).toBeInTheDocument()
    })

    it('should have yellow background for Kakao button', () => {
      render(<LoginButton />)

      const kakaoButton = screen.getByRole('button', { name: /카카오.*로그인/i })
      // Kakao brand color is typically yellow (#FEE500)
      expect(kakaoButton).toHaveClass(/bg-\[#FEE500\]|bg-yellow/)
    })

    it('should have border/outline style for Google button', () => {
      render(<LoginButton />)

      const googleButton = screen.getByRole('button', { name: /구글.*로그인/i })
      expect(googleButton).toHaveClass(/border|outline/)
    })
  })

  describe('User Interactions', () => {
    it('should call signInWithKakao when Kakao button is clicked', async () => {
      const user = userEvent.setup()
      const signInWithKakaoMock = vi.mocked(auth.signInWithKakao)

      render(<LoginButton />)

      const kakaoButton = screen.getByRole('button', { name: /카카오.*로그인/i })
      await user.click(kakaoButton)

      expect(signInWithKakaoMock).toHaveBeenCalledTimes(1)
    })

    it('should call signInWithGoogle when Google button is clicked', async () => {
      const user = userEvent.setup()
      const signInWithGoogleMock = vi.mocked(auth.signInWithGoogle)

      render(<LoginButton />)

      const googleButton = screen.getByRole('button', { name: /구글.*로그인/i })
      await user.click(googleButton)

      expect(signInWithGoogleMock).toHaveBeenCalledTimes(1)
    })

    it('should pass redirectTo parameter if provided', async () => {
      const user = userEvent.setup()
      const signInWithKakaoMock = vi.mocked(auth.signInWithKakao)

      render(<LoginButton redirectTo="/my-profile" />)

      const kakaoButton = screen.getByRole('button', { name: /카카오.*로그인/i })
      await user.click(kakaoButton)

      expect(signInWithKakaoMock).toHaveBeenCalledWith('/my-profile')
    })
  })

  describe('Error Handling', () => {
    it('should handle signInWithKakao errors gracefully', async () => {
      const user = userEvent.setup()
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      vi.mocked(auth.signInWithKakao).mockRejectedValueOnce(new Error('OAuth failed'))

      render(<LoginButton />)

      const kakaoButton = screen.getByRole('button', { name: /카카오.*로그인/i })
      await user.click(kakaoButton)

      // Should log error but not crash
      expect(consoleErrorSpy).toHaveBeenCalled()
      consoleErrorSpy.mockRestore()
    })

    it('should handle signInWithGoogle errors gracefully', async () => {
      const user = userEvent.setup()
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      vi.mocked(auth.signInWithGoogle).mockRejectedValueOnce(new Error('OAuth failed'))

      render(<LoginButton />)

      const googleButton = screen.getByRole('button', { name: /구글.*로그인/i })
      await user.click(googleButton)

      expect(consoleErrorSpy).toHaveBeenCalled()
      consoleErrorSpy.mockRestore()
    })
  })

  describe('Accessibility', () => {
    it('should have accessible button elements', () => {
      render(<LoginButton />)

      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(3) // Kakao, Naver, Google

      buttons.forEach(button => {
        expect(button).toBeEnabled()
      })
    })

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()
      const signInWithKakaoMock = vi.mocked(auth.signInWithKakao)

      render(<LoginButton />)

      // Tab to first button and press Enter
      await user.tab()
      await user.keyboard('{Enter}')

      expect(signInWithKakaoMock).toHaveBeenCalledTimes(1)
    })
  })
})
