import { describe, it, expect } from 'vitest'
import { getBadgesToAward, BADGE_DEFINITIONS } from '@/lib/badges'
import type { UserStats } from '@/types/badges'

describe('Badge System Integration', () => {
  describe('User Journey: New User', () => {
    it('should award first_post badge after creating first post', () => {
      const newUserStats: UserStats = {
        postsCreated: 0,
        postsViewed: 0,
        bookmarksCount: 0,
      }

      // 새 유저는 뱃지가 없어야 함
      let badges = getBadgesToAward(newUserStats, [])
      expect(badges).toHaveLength(0)

      // 첫 공구 등록 후
      const afterFirstPost: UserStats = {
        postsCreated: 1,
        postsViewed: 0,
        bookmarksCount: 0,
      }

      badges = getBadgesToAward(afterFirstPost, [])
      expect(badges).toHaveLength(1)
      expect(badges[0].slug).toBe('first_post')
      expect(badges[0].name).toBe('첫 공구')
    })
  })

  describe('User Journey: Active Seller', () => {
    it('should progressively award badges as user posts more', () => {
      let earnedBadges: string[] = []

      // 첫 번째 공구
      const stats1: UserStats = {
        postsCreated: 1,
        postsViewed: 5,
        bookmarksCount: 0,
      }

      let newBadges = getBadgesToAward(stats1, earnedBadges)
      expect(newBadges).toHaveLength(1)
      expect(newBadges[0].slug).toBe('first_post')
      earnedBadges = [...earnedBadges, ...newBadges.map(b => b.slug)]

      // 다섯 번째 공구
      const stats2: UserStats = {
        postsCreated: 5,
        postsViewed: 15,
        bookmarksCount: 3,
      }

      newBadges = getBadgesToAward(stats2, earnedBadges)
      expect(newBadges.length).toBeGreaterThan(0)
      const slugs = newBadges.map(b => b.slug)
      expect(slugs).toContain('active_poster')
      expect(slugs).toContain('explorer')
      expect(slugs).not.toContain('first_post') // 이미 획득함
    })
  })

  describe('User Journey: Browser User', () => {
    it('should award explorer badge to users who browse without posting', () => {
      const browserStats: UserStats = {
        postsCreated: 0,
        postsViewed: 20,
        bookmarksCount: 8,
      }

      const badges = getBadgesToAward(browserStats, [])
      const slugs = badges.map(b => b.slug)

      expect(slugs).toContain('explorer')
      expect(slugs).toContain('collector')
      expect(slugs).not.toContain('first_post')
      expect(slugs).not.toContain('active_poster')
    })
  })

  describe('User Journey: Complete Profile', () => {
    it('should award all badges for a highly active user', () => {
      const superUserStats: UserStats = {
        postsCreated: 10,
        postsViewed: 50,
        bookmarksCount: 15,
      }

      const badges = getBadgesToAward(superUserStats, [])
      const slugs = badges.map(b => b.slug)

      // 모든 뱃지 획득
      expect(badges).toHaveLength(4)
      expect(slugs).toContain('first_post')
      expect(slugs).toContain('active_poster')
      expect(slugs).toContain('explorer')
      expect(slugs).toContain('collector')
    })

    it('should not re-award badges that are already earned', () => {
      const superUserStats: UserStats = {
        postsCreated: 100,
        postsViewed: 500,
        bookmarksCount: 50,
      }

      // 모든 뱃지를 이미 획득한 상태
      const allBadgeSlugs = Object.keys(BADGE_DEFINITIONS)
      const badges = getBadgesToAward(superUserStats, allBadgeSlugs)

      expect(badges).toHaveLength(0)
    })
  })

  describe('Badge Metadata Validation', () => {
    it('should have Korean names for all badges', () => {
      Object.values(BADGE_DEFINITIONS).forEach(badge => {
        expect(badge.name).toMatch(/[\u3131-\uD79D]/) // 한글 포함 체크
      })
    })

    it('should have descriptive text for all badges', () => {
      Object.values(BADGE_DEFINITIONS).forEach(badge => {
        expect(badge.description.length).toBeGreaterThan(5)
        expect(badge.description).toMatch(/[\u3131-\uD79D]/) // 한글 포함 체크
      })
    })

    it('should have emoji icons for all badges', () => {
      Object.values(BADGE_DEFINITIONS).forEach(badge => {
        expect(badge.icon).toBeTruthy()
        expect(badge.icon.length).toBeGreaterThan(0)
      })
    })

    it('should have unique slugs for all badges', () => {
      const slugs = Object.keys(BADGE_DEFINITIONS)
      const uniqueSlugs = new Set(slugs)
      expect(slugs.length).toBe(uniqueSlugs.size)
    })
  })

  describe('Performance', () => {
    it('should handle large user stats efficiently', () => {
      const largeStats: UserStats = {
        postsCreated: 1000000,
        postsViewed: 5000000,
        bookmarksCount: 100000,
      }

      const start = performance.now()
      const badges = getBadgesToAward(largeStats, [])
      const duration = performance.now() - start

      expect(badges.length).toBeGreaterThan(0)
      expect(duration).toBeLessThan(10) // 10ms 이하
    })

    it('should handle checking many badges efficiently', () => {
      const stats: UserStats = {
        postsCreated: 5,
        postsViewed: 10,
        bookmarksCount: 5,
      }

      const start = performance.now()
      for (let i = 0; i < 1000; i++) {
        getBadgesToAward(stats, [])
      }
      const duration = performance.now() - start

      expect(duration).toBeLessThan(100) // 1000회 호출에 100ms 이하
    })
  })

  describe('Badge Condition Thresholds', () => {
    it('should not award badges for values just below threshold', () => {
      const almostThereStats: UserStats = {
        postsCreated: 4, // active_poster는 5개 필요
        postsViewed: 9,  // explorer는 10개 필요
        bookmarksCount: 4, // collector는 5개 필요
      }

      const badges = getBadgesToAward(almostThereStats, [])
      const slugs = badges.map(b => b.slug)

      expect(slugs).toContain('first_post') // 1개 필요
      expect(slugs).not.toContain('active_poster')
      expect(slugs).not.toContain('explorer')
      expect(slugs).not.toContain('collector')
    })

    it('should award badges at exact threshold values', () => {
      const exactThresholdStats: UserStats = {
        postsCreated: 5,  // active_poster 정확히 5개
        postsViewed: 10,  // explorer 정확히 10개
        bookmarksCount: 5, // collector 정확히 5개
      }

      const badges = getBadgesToAward(exactThresholdStats, [])
      const slugs = badges.map(b => b.slug)

      expect(badges.length).toBe(4)
      expect(slugs).toContain('first_post')
      expect(slugs).toContain('active_poster')
      expect(slugs).toContain('explorer')
      expect(slugs).toContain('collector')
    })
  })

  describe('Realistic User Scenarios', () => {
    it('should handle typical casual user pattern', () => {
      const casualUser: UserStats = {
        postsCreated: 0,
        postsViewed: 15,
        bookmarksCount: 3,
      }

      const badges = getBadgesToAward(casualUser, [])
      const slugs = badges.map(b => b.slug)

      // 캐주얼 유저는 explorer만 획득
      expect(badges).toHaveLength(1)
      expect(slugs).toContain('explorer')
    })

    it('should handle typical seller pattern', () => {
      const sellerUser: UserStats = {
        postsCreated: 8,
        postsViewed: 5,
        bookmarksCount: 2,
      }

      const badges = getBadgesToAward(sellerUser, [])
      const slugs = badges.map(b => b.slug)

      // 판매자는 first_post, active_poster 획득
      expect(badges.length).toBeGreaterThanOrEqual(2)
      expect(slugs).toContain('first_post')
      expect(slugs).toContain('active_poster')
    })

    it('should handle power user pattern', () => {
      const powerUser: UserStats = {
        postsCreated: 3,
        postsViewed: 25,
        bookmarksCount: 12,
      }

      const badges = getBadgesToAward(powerUser, [])
      const slugs = badges.map(b => b.slug)

      // 파워 유저는 first_post, explorer, collector 획득
      expect(badges).toHaveLength(3)
      expect(slugs).toContain('first_post')
      expect(slugs).toContain('explorer')
      expect(slugs).toContain('collector')
    })
  })
})
