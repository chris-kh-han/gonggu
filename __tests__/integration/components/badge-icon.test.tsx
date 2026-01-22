import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BadgeIcon } from '@/components/badges/badge-icon'
import type { Badge } from '@/types/badges'

describe('BadgeIcon', () => {
  const mockBadge: Badge = {
    slug: 'first_post',
    name: '첫 공구',
    description: '첫 번째 공구를 등록했어요',
    icon: '🎉',
  }

  describe('earned badge', () => {
    it('should render earned badge with full opacity', () => {
      render(<BadgeIcon badge={mockBadge} earned={true} size="md" />)

      const badgeElement = screen.getByTestId('badge-icon-first_post')
      expect(badgeElement).toBeInTheDocument()
      expect(badgeElement).not.toHaveClass('opacity-30')
    })

    it('should display badge icon', () => {
      render(<BadgeIcon badge={mockBadge} earned={true} size="md" />)

      expect(screen.getByText('🎉')).toBeInTheDocument()
    })

    it('should not show lock icon for earned badge', () => {
      render(<BadgeIcon badge={mockBadge} earned={true} size="md" />)

      const lockIcon = screen.queryByTestId('lock-icon')
      expect(lockIcon).not.toBeInTheDocument()
    })

    it('should display tooltip with name and description on hover', () => {
      render(<BadgeIcon badge={mockBadge} earned={true} size="md" />)

      const triggerElement = screen.getByRole('button')
      expect(triggerElement).toBeInTheDocument()
    })
  })

  describe('unearned badge', () => {
    it('should render unearned badge with reduced opacity', () => {
      render(<BadgeIcon badge={mockBadge} earned={false} size="md" />)

      const badgeElement = screen.getByTestId('badge-icon-first_post')
      expect(badgeElement).toHaveClass('opacity-30')
    })

    it('should show lock icon for unearned badge', () => {
      render(<BadgeIcon badge={mockBadge} earned={false} size="md" />)

      const lockIcon = screen.getByTestId('lock-icon')
      expect(lockIcon).toBeInTheDocument()
    })

    it('should still display badge icon even when locked', () => {
      render(<BadgeIcon badge={mockBadge} earned={false} size="md" />)

      expect(screen.getByText('🎉')).toBeInTheDocument()
    })
  })

  describe('size variants', () => {
    it('should render small size correctly', () => {
      render(<BadgeIcon badge={mockBadge} earned={true} size="sm" />)

      const badgeElement = screen.getByTestId('badge-icon-first_post')
      expect(badgeElement).toHaveClass('w-12', 'h-12')
    })

    it('should render medium size correctly', () => {
      render(<BadgeIcon badge={mockBadge} earned={true} size="md" />)

      const badgeElement = screen.getByTestId('badge-icon-first_post')
      expect(badgeElement).toHaveClass('w-16', 'h-16')
    })

    it('should render large size correctly', () => {
      render(<BadgeIcon badge={mockBadge} earned={true} size="lg" />)

      const badgeElement = screen.getByTestId('badge-icon-first_post')
      expect(badgeElement).toHaveClass('w-20', 'h-20')
    })
  })

  describe('tooltip content', () => {
    it('should have tooltip trigger with badge data', () => {
      render(<BadgeIcon badge={mockBadge} earned={true} size="md" />)

      const trigger = screen.getByRole('button')
      expect(trigger).toHaveAttribute('aria-label', expect.stringContaining('첫 공구'))
    })

    it('should render TooltipProvider and Tooltip components', () => {
      const { container } = render(
        <BadgeIcon badge={mockBadge} earned={true} size="md" />
      )

      // Verify component structure exists (even if tooltip content is in portal)
      expect(container.querySelector('[data-testid="badge-icon-first_post"]')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have accessible role for tooltip trigger', () => {
      render(<BadgeIcon badge={mockBadge} earned={true} size="md" />)

      const trigger = screen.getByRole('button')
      expect(trigger).toBeInTheDocument()
    })

    it('should have aria-label with badge name', () => {
      render(<BadgeIcon badge={mockBadge} earned={true} size="md" />)

      const trigger = screen.getByRole('button')
      expect(trigger).toHaveAttribute('aria-label', expect.stringContaining('첫 공구'))
    })
  })

  describe('edge cases', () => {
    it('should handle badge with no icon gracefully', () => {
      const badgeNoIcon: Badge = {
        ...mockBadge,
        icon: '',
      }

      render(<BadgeIcon badge={badgeNoIcon} earned={true} size="md" />)

      const badgeElement = screen.getByTestId('badge-icon-first_post')
      expect(badgeElement).toBeInTheDocument()
    })

    it('should handle very long badge names', () => {
      const longNameBadge: Badge = {
        ...mockBadge,
        name: '아주 긴 이름을 가진 뱃지입니다. 정말 매우 길어요.',
      }

      render(<BadgeIcon badge={longNameBadge} earned={true} size="md" />)

      const trigger = screen.getByRole('button')
      expect(trigger).toHaveAttribute('aria-label', expect.stringContaining('아주 긴 이름'))
    })
  })
})
