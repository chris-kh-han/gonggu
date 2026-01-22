import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import ProfilePage from '@/app/profile/page'

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

// Mock Supabase server client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

// Mock profile library functions
vi.mock('@/lib/profile', () => ({
  getUserProfile: vi.fn(),
  getUserStats: vi.fn(),
  getUserBadges: vi.fn(),
}))

// Mock BadgeList component
vi.mock('@/components/badges/badge-list', () => ({
  BadgeList: ({ badges, earnedBadgeIds }: any) => (
    <div data-testid="badge-list">
      <span>Badges: {badges.length}</span>
      <span>Earned: {earnedBadgeIds.length}</span>
    </div>
  ),
}))

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserProfile, getUserStats, getUserBadges } from '@/lib/profile'

const mockRedirect = redirect as any
const mockCreateClient = createClient as any
const mockGetUserProfile = getUserProfile as any
const mockGetUserStats = getUserStats as any
const mockGetUserBadges = getUserBadges as any

describe('ProfilePage', () => {
  let mockSupabase: any

  beforeEach(() => {
    vi.clearAllMocks()

    mockSupabase = {
      auth: {
        getUser: vi.fn(),
      },
    }

    mockCreateClient.mockResolvedValue(mockSupabase)
  })

  it('should redirect to login when user is not authenticated', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    })

    // redirect() throws an error in Next.js
    mockRedirect.mockImplementation(() => {
      throw new Error('NEXT_REDIRECT')
    })

    await expect(ProfilePage()).rejects.toThrow()
    expect(mockRedirect).toHaveBeenCalledWith('/login')
  })

  it('should display user profile information', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
    }

    const mockProfile = {
      id: 'user-123',
      email: 'test@example.com',
      nickname: 'TestUser',
      avatar_url: null,
      created_at: '2024-01-15T00:00:00Z',
    }

    const mockStats = {
      postsCreated: 3,
      postsViewed: 15,
      bookmarksCount: 5,
    }

    const mockBadgeIds = ['first_post', 'explorer']

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })

    mockGetUserProfile.mockResolvedValue(mockProfile)
    mockGetUserStats.mockResolvedValue(mockStats)
    mockGetUserBadges.mockResolvedValue(mockBadgeIds)

    const result = await ProfilePage()
    render(result)

    // Check profile information
    expect(screen.getByText('TestUser')).toBeDefined()
    expect(screen.getByText('test@example.com')).toBeDefined()
    expect(screen.getByText(/2024\.\s*01\.\s*15/)).toBeDefined()

    // Check stats
    expect(screen.getByText('등록 공구')).toBeDefined()
    expect(screen.getByText('조회한 공구')).toBeDefined()
    expect(screen.getByText('찜한 공구')).toBeDefined()
  })

  it('should display default nickname when nickname is null', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
    }

    const mockProfile = {
      id: 'user-123',
      email: 'test@example.com',
      nickname: null,
      avatar_url: null,
      created_at: '2024-01-15T00:00:00Z',
    }

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })

    mockGetUserProfile.mockResolvedValue(mockProfile)
    mockGetUserStats.mockResolvedValue({
      postsCreated: 0,
      postsViewed: 0,
      bookmarksCount: 0,
    })
    mockGetUserBadges.mockResolvedValue([])

    const result = await ProfilePage()
    render(result)

    expect(screen.getByText('사용자')).toBeDefined()
  })

  it('should render BadgeList with correct props', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
    }

    const mockProfile = {
      id: 'user-123',
      email: 'test@example.com',
      nickname: 'TestUser',
      avatar_url: null,
      created_at: '2024-01-15T00:00:00Z',
    }

    const mockBadgeIds = ['first_post', 'explorer']

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })

    mockGetUserProfile.mockResolvedValue(mockProfile)
    mockGetUserStats.mockResolvedValue({
      postsCreated: 1,
      postsViewed: 10,
      bookmarksCount: 0,
    })
    mockGetUserBadges.mockResolvedValue(mockBadgeIds)

    const result = await ProfilePage()
    render(result)

    const badgeList = screen.getByTestId('badge-list')
    expect(badgeList).toBeDefined()
    expect(screen.getByText(/Badges: 4/)).toBeDefined() // All badges from BADGE_DEFINITIONS
    expect(screen.getByText(/Earned: 2/)).toBeDefined() // Earned badges
  })

  it('should handle missing profile data gracefully', async () => {
    const mockUser = {
      id: 'user-123',
      email: 'test@example.com',
    }

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })

    mockGetUserProfile.mockResolvedValue(null)
    mockGetUserStats.mockResolvedValue({
      postsCreated: 0,
      postsViewed: 0,
      bookmarksCount: 0,
    })
    mockGetUserBadges.mockResolvedValue([])

    const result = await ProfilePage()
    render(result)

    // Should still render with email from auth user
    expect(screen.getByText('test@example.com')).toBeDefined()
  })
})
