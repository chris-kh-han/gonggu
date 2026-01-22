import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { BadgeNotification } from '@/components/badges/badge-notification'
import type { Badge } from '@/types/badges'

describe('BadgeNotification', () => {
  const mockBadge: Badge = {
    slug: 'first_post',
    name: '첫 공구',
    description: '첫 번째 공구를 등록했어요',
    icon: '🎉',
  }

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('rendering', () => {
    it('should render notification with badge icon', () => {
      render(<BadgeNotification badge={mockBadge} />)

      expect(screen.getByText('🎉')).toBeInTheDocument()
    })

    it('should display badge name', () => {
      render(<BadgeNotification badge={mockBadge} />)

      expect(screen.getByText('첫 공구')).toBeInTheDocument()
    })

    it('should display badge description', () => {
      render(<BadgeNotification badge={mockBadge} />)

      expect(screen.getByText('첫 번째 공구를 등록했어요')).toBeInTheDocument()
    })

    it('should show "뱃지 획득" title', () => {
      render(<BadgeNotification badge={mockBadge} />)

      expect(screen.getByText(/뱃지 획득/i)).toBeInTheDocument()
    })

    it('should render with celebration styling', () => {
      render(<BadgeNotification badge={mockBadge} />)

      const notification = screen.getByTestId('badge-notification')
      expect(notification).toBeInTheDocument()
      expect(notification).toHaveClass('border-violet-500')
    })
  })

  describe('animation', () => {
    it('should have animation classes', () => {
      render(<BadgeNotification badge={mockBadge} />)

      const notification = screen.getByTestId('badge-notification')
      expect(notification).toHaveClass('animate-in')
    })

    it('should apply slide-in animation', () => {
      render(<BadgeNotification badge={mockBadge} />)

      const notification = screen.getByTestId('badge-notification')
      // Check for slide animation classes
      expect(notification.className).toMatch(/slide-in|fade-in/)
    })
  })

  describe('auto-dismiss', () => {
    it('should auto-dismiss after timeout when onDismiss provided', () => {
      const onDismiss = vi.fn()

      render(<BadgeNotification badge={mockBadge} onDismiss={onDismiss} />)

      expect(onDismiss).not.toHaveBeenCalled()

      // Fast-forward time by 5 seconds
      vi.advanceTimersByTime(5000)

      expect(onDismiss).toHaveBeenCalledOnce()
    })

    it('should not auto-dismiss when onDismiss not provided', () => {
      render(<BadgeNotification badge={mockBadge} />)

      const notification = screen.getByTestId('badge-notification')
      expect(notification).toBeInTheDocument()

      vi.advanceTimersByTime(10000)

      expect(notification).toBeInTheDocument()
    })

    it('should cleanup timeout on unmount', () => {
      const onDismiss = vi.fn()
      const { unmount } = render(<BadgeNotification badge={mockBadge} onDismiss={onDismiss} />)

      unmount()

      vi.advanceTimersByTime(5000)

      expect(onDismiss).not.toHaveBeenCalled()
    })
  })

  describe('manual dismiss', () => {
    it('should have close button', () => {
      render(<BadgeNotification badge={mockBadge} />)

      const closeButton = screen.getByRole('button', { name: /닫기/i })
      expect(closeButton).toBeInTheDocument()
    })

    it('should call onDismiss when close button clicked', () => {
      const onDismiss = vi.fn()

      render(<BadgeNotification badge={mockBadge} onDismiss={onDismiss} />)

      const closeButton = screen.getByRole('button', { name: /닫기/i })
      closeButton.click()

      expect(onDismiss).toHaveBeenCalledOnce()
    })

    it('should not crash when close button clicked without onDismiss', () => {
      render(<BadgeNotification badge={mockBadge} />)

      const closeButton = screen.getByRole('button', { name: /닫기/i })

      expect(() => closeButton.click()).not.toThrow()
    })
  })

  describe('layout', () => {
    it('should display icon in prominent size', () => {
      render(<BadgeNotification badge={mockBadge} />)

      const iconElement = screen.getByTestId('badge-notification-icon')
      expect(iconElement).toBeInTheDocument()
      expect(iconElement).toHaveClass('text-4xl')
    })

    it('should have vertical layout on mobile', () => {
      render(<BadgeNotification badge={mockBadge} />)

      const notification = screen.getByTestId('badge-notification')
      expect(notification).toHaveClass('flex')
    })

    it('should have appropriate spacing', () => {
      render(<BadgeNotification badge={mockBadge} />)

      const notification = screen.getByTestId('badge-notification')
      expect(notification).toHaveClass('p-4', 'gap-3')
    })
  })

  describe('edge cases', () => {
    it('should handle badge with empty icon', () => {
      const badgeNoIcon: Badge = {
        ...mockBadge,
        icon: '',
      }

      render(<BadgeNotification badge={badgeNoIcon} />)

      const notification = screen.getByTestId('badge-notification')
      expect(notification).toBeInTheDocument()
    })

    it('should handle very long badge name', () => {
      const longNameBadge: Badge = {
        ...mockBadge,
        name: '아주 긴 이름을 가진 뱃지입니다 정말 길어요 매우 길어요',
      }

      render(<BadgeNotification badge={longNameBadge} />)

      expect(screen.getByText(longNameBadge.name)).toBeInTheDocument()
    })

    it('should handle very long description', () => {
      const longDescBadge: Badge = {
        ...mockBadge,
        description: '매우 긴 설명입니다. '.repeat(10),
      }

      render(<BadgeNotification badge={longDescBadge} />)

      // Use partial text match since long text may be wrapped
      expect(screen.getByText(/매우 긴 설명입니다/)).toBeInTheDocument()
    })

    it('should handle special characters in badge data', () => {
      const specialCharBadge: Badge = {
        ...mockBadge,
        name: '첫 공구 <script>alert("test")</script>',
        description: 'Test & " < >',
      }

      render(<BadgeNotification badge={specialCharBadge} />)

      // Should escape HTML
      const notification = screen.getByTestId('badge-notification')
      expect(notification).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have role="alert" for screen readers', () => {
      render(<BadgeNotification badge={mockBadge} />)

      const notification = screen.getByRole('alert')
      expect(notification).toBeInTheDocument()
    })

    it('should have accessible close button', () => {
      render(<BadgeNotification badge={mockBadge} />)

      const closeButton = screen.getByRole('button', { name: /닫기/i })
      expect(closeButton).toHaveAttribute('aria-label', expect.stringContaining('닫기'))
    })

    it('should have appropriate aria attributes', () => {
      render(<BadgeNotification badge={mockBadge} />)

      const notification = screen.getByRole('alert')
      expect(notification).toHaveAttribute('role', 'alert')
    })
  })

  describe('multiple badges', () => {
    it('should render multiple notifications independently', () => {
      const badge1: Badge = {
        slug: 'first_post',
        name: '첫 공구',
        description: '첫 번째 공구를 등록했어요',
        icon: '🎉',
      }

      const badge2: Badge = {
        slug: 'explorer',
        name: '탐험가',
        description: '공구 10개 이상 조회했어요',
        icon: '🔍',
      }

      const { container } = render(
        <>
          <BadgeNotification badge={badge1} />
          <BadgeNotification badge={badge2} />
        </>
      )

      expect(screen.getByText('첫 공구')).toBeInTheDocument()
      expect(screen.getByText('탐험가')).toBeInTheDocument()

      const notifications = container.querySelectorAll('[data-testid="badge-notification"]')
      expect(notifications).toHaveLength(2)
    })
  })
})
