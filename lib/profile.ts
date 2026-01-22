import type { SupabaseClient } from '@supabase/supabase-js'
import type { UserStats } from '@/types/badges'

export interface UserProfile {
  id: string
  email: string
  nickname: string | null
  avatar_url: string | null
  created_at: string
}

/**
 * 사용자 프로필 조회
 *
 * @param supabase - Supabase 클라이언트
 * @param userId - 사용자 ID
 * @returns 프로필 데이터 또는 null
 */
export async function getUserProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error || !data) {
      return null
    }

    return data
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}

/**
 * 사용자 활동 통계 조회
 *
 * @param supabase - Supabase 클라이언트
 * @param userId - 사용자 ID
 * @returns 통계 데이터 (없으면 0으로 초기화된 객체)
 */
export async function getUserStats(
  supabase: SupabaseClient,
  userId: string
): Promise<UserStats> {
  try {
    const { data, error } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', userId)
      .single()

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
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return {
      postsCreated: 0,
      postsViewed: 0,
      bookmarksCount: 0,
    }
  }
}

/**
 * 사용자가 획득한 뱃지 ID 목록 조회
 *
 * @param supabase - Supabase 클라이언트
 * @param userId - 사용자 ID
 * @returns 뱃지 ID 배열
 */
export async function getUserBadges(
  supabase: SupabaseClient,
  userId: string
): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('user_badges')
      .select('badge_id')
      .eq('user_id', userId)

    if (error || !data) {
      return []
    }

    return data.map((row) => row.badge_id)
  } catch (error) {
    console.error('Error fetching user badges:', error)
    return []
  }
}
