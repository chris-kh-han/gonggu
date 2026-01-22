import { describe, it, expect } from 'vitest'
import { checkBadgeCondition, getBadgesToAward, BADGE_DEFINITIONS } from '@/lib/badges'
import type { UserStats, Badge } from '@/types/badges'

describe('badges', () => {
  describe('BADGE_DEFINITIONS', () => {
    it('should have all required badge definitions', () => {
      expect(BADGE_DEFINITIONS).toHaveProperty('first_post')
      expect(BADGE_DEFINITIONS).toHaveProperty('active_poster')
      expect(BADGE_DEFINITIONS).toHaveProperty('explorer')
      expect(BADGE_DEFINITIONS).toHaveProperty('collector')
    })

    it('should have proper structure for each badge', () => {
      const badge = BADGE_DEFINITIONS.first_post
      expect(badge).toHaveProperty('slug')
      expect(badge).toHaveProperty('name')
      expect(badge).toHaveProperty('description')
      expect(badge).toHaveProperty('icon')
      expect(badge).toHaveProperty('condition')
      expect(typeof badge.condition).toBe('function')
    })
  })

  describe('checkBadgeCondition', () => {
    it('should return true for first_post when user has 1 post', () => {
      const userStats: UserStats = {
        postsCreated: 1,
        postsViewed: 0,
        bookmarksCount: 0,
      }
      expect(checkBadgeCondition('first_post', userStats)).toBe(true)
    })

    it('should return false for first_post when user has 0 posts', () => {
      const userStats: UserStats = {
        postsCreated: 0,
        postsViewed: 0,
        bookmarksCount: 0,
      }
      expect(checkBadgeCondition('first_post', userStats)).toBe(false)
    })

    it('should return true for active_poster when user has 5+ posts', () => {
      const userStats: UserStats = {
        postsCreated: 5,
        postsViewed: 0,
        bookmarksCount: 0,
      }
      expect(checkBadgeCondition('active_poster', userStats)).toBe(true)
    })

    it('should return false for active_poster when user has less than 5 posts', () => {
      const userStats: UserStats = {
        postsCreated: 4,
        postsViewed: 0,
        bookmarksCount: 0,
      }
      expect(checkBadgeCondition('active_poster', userStats)).toBe(false)
    })

    it('should return true for explorer when user has 10+ views', () => {
      const userStats: UserStats = {
        postsCreated: 0,
        postsViewed: 10,
        bookmarksCount: 0,
      }
      expect(checkBadgeCondition('explorer', userStats)).toBe(true)
    })

    it('should return false for explorer when user has less than 10 views', () => {
      const userStats: UserStats = {
        postsCreated: 0,
        postsViewed: 9,
        bookmarksCount: 0,
      }
      expect(checkBadgeCondition('explorer', userStats)).toBe(false)
    })

    it('should return true for collector when user has 5+ bookmarks', () => {
      const userStats: UserStats = {
        postsCreated: 0,
        postsViewed: 0,
        bookmarksCount: 5,
      }
      expect(checkBadgeCondition('collector', userStats)).toBe(true)
    })

    it('should return false for collector when user has less than 5 bookmarks', () => {
      const userStats: UserStats = {
        postsCreated: 0,
        postsViewed: 0,
        bookmarksCount: 4,
      }
      expect(checkBadgeCondition('collector', userStats)).toBe(false)
    })

    it('should return false for unknown badge slug', () => {
      const userStats: UserStats = {
        postsCreated: 100,
        postsViewed: 100,
        bookmarksCount: 100,
      }
      expect(checkBadgeCondition('unknown_badge', userStats)).toBe(false)
    })

    it('should handle edge case with exact threshold values', () => {
      const userStats: UserStats = {
        postsCreated: 1,
        postsViewed: 10,
        bookmarksCount: 5,
      }
      expect(checkBadgeCondition('first_post', userStats)).toBe(true)
      expect(checkBadgeCondition('explorer', userStats)).toBe(true)
      expect(checkBadgeCondition('collector', userStats)).toBe(true)
    })
  })

  describe('getBadgesToAward', () => {
    it('should return empty array when no badges are earned', () => {
      const userStats: UserStats = {
        postsCreated: 0,
        postsViewed: 0,
        bookmarksCount: 0,
      }
      const earnedBadges: string[] = []
      const result = getBadgesToAward(userStats, earnedBadges)
      expect(result).toEqual([])
    })

    it('should return first_post badge when condition is met', () => {
      const userStats: UserStats = {
        postsCreated: 1,
        postsViewed: 0,
        bookmarksCount: 0,
      }
      const earnedBadges: string[] = []
      const result = getBadgesToAward(userStats, earnedBadges)

      expect(result).toHaveLength(1)
      expect(result[0].slug).toBe('first_post')
      expect(result[0]).toHaveProperty('name')
      expect(result[0]).toHaveProperty('description')
      expect(result[0]).toHaveProperty('icon')
    })

    it('should return multiple badges when multiple conditions are met', () => {
      const userStats: UserStats = {
        postsCreated: 5,
        postsViewed: 10,
        bookmarksCount: 5,
      }
      const earnedBadges: string[] = []
      const result = getBadgesToAward(userStats, earnedBadges)

      expect(result.length).toBeGreaterThan(1)
      const slugs = result.map(b => b.slug)
      expect(slugs).toContain('first_post')
      expect(slugs).toContain('active_poster')
      expect(slugs).toContain('explorer')
      expect(slugs).toContain('collector')
    })

    it('should exclude already earned badges', () => {
      const userStats: UserStats = {
        postsCreated: 5,
        postsViewed: 10,
        bookmarksCount: 5,
      }
      const earnedBadges: string[] = ['first_post', 'explorer']
      const result = getBadgesToAward(userStats, earnedBadges)

      const slugs = result.map(b => b.slug)
      expect(slugs).not.toContain('first_post')
      expect(slugs).not.toContain('explorer')
      expect(slugs).toContain('active_poster')
      expect(slugs).toContain('collector')
    })

    it('should handle case where all badges are already earned', () => {
      const userStats: UserStats = {
        postsCreated: 10,
        postsViewed: 20,
        bookmarksCount: 10,
      }
      const earnedBadges: string[] = ['first_post', 'active_poster', 'explorer', 'collector']
      const result = getBadgesToAward(userStats, earnedBadges)

      expect(result).toEqual([])
    })

    it('should only return badges where condition is met', () => {
      const userStats: UserStats = {
        postsCreated: 3,
        postsViewed: 15,
        bookmarksCount: 2,
      }
      const earnedBadges: string[] = []
      const result = getBadgesToAward(userStats, earnedBadges)

      const slugs = result.map(b => b.slug)
      expect(slugs).toContain('first_post')
      expect(slugs).toContain('explorer')
      expect(slugs).not.toContain('active_poster') // needs 5 posts
      expect(slugs).not.toContain('collector') // needs 5 bookmarks
    })

    it('should handle null/undefined earned badges gracefully', () => {
      const userStats: UserStats = {
        postsCreated: 1,
        postsViewed: 0,
        bookmarksCount: 0,
      }
      const result = getBadgesToAward(userStats, [])

      expect(result).toHaveLength(1)
      expect(result[0].slug).toBe('first_post')
    })

    it('should preserve badge order and structure', () => {
      const userStats: UserStats = {
        postsCreated: 1,
        postsViewed: 0,
        bookmarksCount: 0,
      }
      const earnedBadges: string[] = []
      const result = getBadgesToAward(userStats, earnedBadges)

      expect(result[0]).toMatchObject({
        slug: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        icon: expect.any(String),
      })
    })
  })

  describe('edge cases', () => {
    it('should handle negative stats values', () => {
      const userStats: UserStats = {
        postsCreated: -1,
        postsViewed: -5,
        bookmarksCount: -10,
      }
      const result = getBadgesToAward(userStats, [])
      expect(result).toEqual([])
    })

    it('should handle very large stats values', () => {
      const userStats: UserStats = {
        postsCreated: 999999,
        postsViewed: 999999,
        bookmarksCount: 999999,
      }
      const earnedBadges: string[] = []
      const result = getBadgesToAward(userStats, earnedBadges)

      // All badges should be awarded
      expect(result.length).toBe(4)
    })

    it('should handle zero stats', () => {
      const userStats: UserStats = {
        postsCreated: 0,
        postsViewed: 0,
        bookmarksCount: 0,
      }
      const result = getBadgesToAward(userStats, [])
      expect(result).toEqual([])
    })
  })
})
