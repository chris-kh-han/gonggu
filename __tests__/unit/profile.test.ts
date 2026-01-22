import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getUserProfile, getUserStats, getUserBadges } from '@/lib/profile'
import type { SupabaseClient } from '@supabase/supabase-js'

// Mock Supabase client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

describe('getUserProfile', () => {
  let mockSupabase: SupabaseClient

  beforeEach(() => {
    mockSupabase = {
      from: vi.fn(),
    } as any
  })

  it('should return user profile data when user exists', async () => {
    const mockProfile = {
      id: 'user-123',
      email: 'test@example.com',
      nickname: 'TestUser',
      avatar_url: null,
      created_at: '2024-01-15T00:00:00Z',
    }

    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: mockProfile,
            error: null,
          }),
        }),
      }),
    })

    mockSupabase.from = mockFrom

    const result = await getUserProfile(mockSupabase, 'user-123')

    expect(result).toEqual(mockProfile)
    expect(mockFrom).toHaveBeenCalledWith('profiles')
  })

  it('should return null when user does not exist', async () => {
    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Not found' },
          }),
        }),
      }),
    })

    mockSupabase.from = mockFrom

    const result = await getUserProfile(mockSupabase, 'nonexistent')

    expect(result).toBeNull()
  })

  it('should handle database errors gracefully', async () => {
    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockRejectedValue(new Error('Database error')),
        }),
      }),
    })

    mockSupabase.from = mockFrom

    const result = await getUserProfile(mockSupabase, 'user-123')

    expect(result).toBeNull()
  })
})

describe('getUserStats', () => {
  let mockSupabase: SupabaseClient

  beforeEach(() => {
    mockSupabase = {
      from: vi.fn(),
    } as any
  })

  it('should return user stats when they exist', async () => {
    const mockStats = {
      user_id: 'user-123',
      posts_created: 3,
      posts_viewed: 15,
      bookmarks_count: 5,
    }

    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: mockStats,
            error: null,
          }),
        }),
      }),
    })

    mockSupabase.from = mockFrom

    const result = await getUserStats(mockSupabase, 'user-123')

    expect(result).toEqual({
      postsCreated: 3,
      postsViewed: 15,
      bookmarksCount: 5,
    })
  })

  it('should return zero stats when user has no stats', async () => {
    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Not found' },
          }),
        }),
      }),
    })

    mockSupabase.from = mockFrom

    const result = await getUserStats(mockSupabase, 'user-123')

    expect(result).toEqual({
      postsCreated: 0,
      postsViewed: 0,
      bookmarksCount: 0,
    })
  })

  it('should handle database errors and return zero stats', async () => {
    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockRejectedValue(new Error('Database error')),
        }),
      }),
    })

    mockSupabase.from = mockFrom

    const result = await getUserStats(mockSupabase, 'user-123')

    expect(result).toEqual({
      postsCreated: 0,
      postsViewed: 0,
      bookmarksCount: 0,
    })
  })
})

describe('getUserBadges', () => {
  let mockSupabase: SupabaseClient

  beforeEach(() => {
    mockSupabase = {
      from: vi.fn(),
    } as any
  })

  it('should return array of badge IDs', async () => {
    const mockBadges = [
      { badge_id: 'first_post' },
      { badge_id: 'explorer' },
    ]

    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: mockBadges,
          error: null,
        }),
      }),
    })

    mockSupabase.from = mockFrom

    const result = await getUserBadges(mockSupabase, 'user-123')

    expect(result).toEqual(['first_post', 'explorer'])
    expect(mockFrom).toHaveBeenCalledWith('user_badges')
  })

  it('should return empty array when user has no badges', async () => {
    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      }),
    })

    mockSupabase.from = mockFrom

    const result = await getUserBadges(mockSupabase, 'user-123')

    expect(result).toEqual([])
  })

  it('should handle null data gracefully', async () => {
    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Not found' },
        }),
      }),
    })

    mockSupabase.from = mockFrom

    const result = await getUserBadges(mockSupabase, 'user-123')

    expect(result).toEqual([])
  })

  it('should handle database errors and return empty array', async () => {
    const mockFrom = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockRejectedValue(new Error('Database error')),
      }),
    })

    mockSupabase.from = mockFrom

    const result = await getUserBadges(mockSupabase, 'user-123')

    expect(result).toEqual([])
  })
})
