import { createClient } from '@/lib/supabase/server'
import type { UserStats } from '@/types/badges'

export interface UserProfile {
  id: string
  email: string
  nickname: string | null
  avatar_url: string | null
  created_at: string
}

// user_stats 테이블 타입 (database.types.ts에 정의되지 않음)
interface UserStatsRow {
  user_id: string
  posts_created: number
  posts_viewed: number
  bookmarks_count: number
}

// user_badges 테이블 타입 (database.types.ts에 정의되지 않음)
interface UserBadgeRow {
  user_id: string
  badge_id: string
}

export const profileRepository = {
  /**
   * 사용자 프로필 조회
   */
  async findById(userId: string): Promise<UserProfile | null> {
    const supabase = await createClient()

    // profiles 테이블은 database.types.ts에 정의되지 않아 any 캐스팅 필요
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error || !data) {
      return null
    }

    return data as UserProfile
  },

  /**
   * 사용자 활동 통계 조회
   */
  async getStats(userId: string): Promise<UserStats> {
    const supabase = await createClient()

    // user_stats 테이블은 database.types.ts에 정의되지 않아 any 캐스팅 필요
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single() as { data: UserStatsRow | null; error: Error | null }

    if (error || !data) {
      return {
        postsCreated: 0,
        postsViewed: 0,
        bookmarksCount: 0,
      }
    }

    return {
      postsCreated: data.posts_created,
      postsViewed: data.posts_viewed,
      bookmarksCount: data.bookmarks_count,
    }
  },

  /**
   * 사용자가 획득한 뱃지 ID 목록 조회
   */
  async getBadges(userId: string): Promise<string[]> {
    const supabase = await createClient()

    // user_badges 테이블은 database.types.ts에 정의되지 않아 any 캐스팅 필요
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('user_badges')
      .select('badge_id')
      .eq('user_id', userId) as { data: UserBadgeRow[] | null; error: Error | null }

    if (error || !data) {
      return []
    }

    return data.map((row) => row.badge_id)
  },
}
