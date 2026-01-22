import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BadgeList } from '@/components/badges/badge-list'
import type { Badge } from '@/types/badges'

describe('BadgeList', () => {
  const mockBadges: Badge[] = [
    {
      slug: 'first_post',
      name: '첫 공구',
      description: '첫 번째 공구를 등록했어요',
      icon: '🎉',
    },
    {
      slug: 'active_poster',
      name: '활발한 판매자',
      description: '공구 5개 이상 등록했어요',
      icon: '🔥',
    },
    {
      slug: 'explorer',
      name: '탐험가',
      description: '공구 10개 이상 조회했어요',
      icon: '🔍',
    },
    {
      slug: 'collector',
      name: '수집가',
      description: '찜 5개 이상 저장했어요',
      icon: '💎',
    },
  ]

  describe('rendering', () => {
    it('should render all badges', () => {
      render(<BadgeList badges={mockBadges} earnedBadgeIds={[]} />)

      expect(screen.getByTestId('badge-icon-first_post')).toBeInTheDocument()
      expect(screen.getByTestId('badge-icon-active_poster')).toBeInTheDocument()
      expect(screen.getByTestId('badge-icon-explorer')).toBeInTheDocument()
      expect(screen.getByTestId('badge-icon-collector')).toBeInTheDocument()
    })

    it('should render in grid layout', () => {
      render(<BadgeList badges={mockBadges} earnedBadgeIds={[]} />)

      const gridContainer = screen.getByTestId('badge-grid')
      expect(gridContainer).toBeInTheDocument()
      expect(gridContainer).toHaveClass('grid')
    })

    it('should render empty state when no badges', () => {
      render(<BadgeList badges={[]} earnedBadgeIds={[]} />)

      expect(screen.getByText(/뱃지가 없습니다/i)).toBeInTheDocument()
    })
  })

  describe('counter display', () => {
    it('should show correct count when no badges earned', () => {
      render(<BadgeList badges={mockBadges} earnedBadgeIds={[]} />)

      expect(screen.getByText('0/4 획득')).toBeInTheDocument()
    })

    it('should show correct count when some badges earned', () => {
      render(
        <BadgeList badges={mockBadges} earnedBadgeIds={['first_post', 'explorer']} />
      )

      expect(screen.getByText('2/4 획득')).toBeInTheDocument()
    })

    it('should show correct count when all badges earned', () => {
      render(
        <BadgeList
          badges={mockBadges}
          earnedBadgeIds={['first_post', 'active_poster', 'explorer', 'collector']}
        />
      )

      expect(screen.getByText('4/4 획득')).toBeInTheDocument()
    })

    it('should display counter in header section', () => {
      render(<BadgeList badges={mockBadges} earnedBadgeIds={['first_post']} />)

      const header = screen.getByTestId('badge-list-header')
      expect(header).toBeInTheDocument()
      expect(header).toHaveTextContent('1/4 획득')
    })
  })

  describe('sorting', () => {
    it('should display earned badges first', () => {
      const { container } = render(
        <BadgeList badges={mockBadges} earnedBadgeIds={['explorer', 'collector']} />
      )

      const badgeElements = container.querySelectorAll('[data-testid^="badge-icon-"]')
      const badgeIds = Array.from(badgeElements).map((el) =>
        el.getAttribute('data-testid')?.replace('badge-icon-', '')
      )

      // Earned badges (explorer, collector) should come before unearned ones
      const explorerIndex = badgeIds.indexOf('explorer')
      const collectorIndex = badgeIds.indexOf('collector')
      const firstPostIndex = badgeIds.indexOf('first_post')
      const activePosterIndex = badgeIds.indexOf('active_poster')

      expect(explorerIndex).toBeLessThan(firstPostIndex)
      expect(collectorIndex).toBeLessThan(activePosterIndex)
    })

    it('should maintain stable order for earned badges', () => {
      const { rerender, container } = render(
        <BadgeList badges={mockBadges} earnedBadgeIds={['first_post', 'active_poster']} />
      )

      const getFirstBadgeId = () => {
        const firstBadge = container.querySelector('[data-testid^="badge-icon-"]')
        return firstBadge?.getAttribute('data-testid')?.replace('badge-icon-', '')
      }

      const firstRender = getFirstBadgeId()

      // Re-render with same props
      rerender(
        <BadgeList badges={mockBadges} earnedBadgeIds={['first_post', 'active_poster']} />
      )

      expect(getFirstBadgeId()).toBe(firstRender)
    })
  })

  describe('badge states', () => {
    it('should mark earned badges correctly', () => {
      render(<BadgeList badges={mockBadges} earnedBadgeIds={['first_post', 'explorer']} />)

      const firstPostBadge = screen.getByTestId('badge-icon-first_post')
      const activePosterBadge = screen.getByTestId('badge-icon-active_poster')

      // Earned badges should not have opacity-30 class
      expect(firstPostBadge).not.toHaveClass('opacity-30')

      // Unearned badges should have opacity-30 class
      expect(activePosterBadge).toHaveClass('opacity-30')
    })

    it('should show lock icons only on unearned badges', () => {
      render(<BadgeList badges={mockBadges} earnedBadgeIds={['first_post']} />)

      // Count lock icons (should be 3 for unearned badges)
      const lockIcons = screen.getAllByTestId('lock-icon')
      expect(lockIcons).toHaveLength(3)
    })
  })

  describe('responsive grid', () => {
    it('should have responsive grid classes', () => {
      render(<BadgeList badges={mockBadges} earnedBadgeIds={[]} />)

      const grid = screen.getByTestId('badge-grid')
      expect(grid).toHaveClass('grid-cols-2')
      expect(grid).toHaveClass('sm:grid-cols-3')
      expect(grid).toHaveClass('md:grid-cols-4')
    })
  })

  describe('edge cases', () => {
    it('should handle empty earnedBadgeIds array', () => {
      render(<BadgeList badges={mockBadges} earnedBadgeIds={[]} />)

      expect(screen.getByText('0/4 획득')).toBeInTheDocument()
    })

    it('should handle earnedBadgeIds with non-existent badges', () => {
      render(
        <BadgeList badges={mockBadges} earnedBadgeIds={['non_existent', 'first_post']} />
      )

      // Should only count existing earned badges
      expect(screen.getByText('1/4 획득')).toBeInTheDocument()
    })

    it('should handle single badge', () => {
      render(<BadgeList badges={[mockBadges[0]]} earnedBadgeIds={[]} />)

      expect(screen.getByText('0/1 획득')).toBeInTheDocument()
      expect(screen.getByTestId('badge-icon-first_post')).toBeInTheDocument()
    })

    it('should handle duplicate earnedBadgeIds', () => {
      render(
        <BadgeList
          badges={mockBadges}
          earnedBadgeIds={['first_post', 'first_post', 'explorer']}
        />
      )

      // Should only count unique earned badges
      expect(screen.getByText('2/4 획득')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have semantic list structure', () => {
      render(<BadgeList badges={mockBadges} earnedBadgeIds={[]} />)

      const grid = screen.getByTestId('badge-grid')
      expect(grid).toHaveAttribute('role', 'list')
    })

    it('should have accessible counter text', () => {
      render(<BadgeList badges={mockBadges} earnedBadgeIds={['first_post']} />)

      const counter = screen.getByText('1/4 획득')
      expect(counter).toBeInTheDocument()
    })
  })
})
