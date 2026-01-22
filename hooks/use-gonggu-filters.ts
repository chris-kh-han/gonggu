'use client'

import { useState, useMemo, useCallback } from 'react'
import { CATEGORY_GROUPS, isInCategoryGroup, type CategoryGroup } from '@/lib/categories'
import type { GongguPost, Seller } from '@/types/database.types'

type GongguWithSeller = GongguPost & {
  sellers: Pick<Seller, 'instagram_username' | 'category'>
  trending_score?: number
}

export type TabType = 'latest' | 'trending' | 'deadline'

interface UseGongguFiltersProps {
  latestPosts: GongguWithSeller[]
  trendingPosts: GongguWithSeller[]
}

interface UseGongguFiltersReturn {
  category: string
  activeTab: TabType
  isLoading: boolean
  filteredPosts: GongguWithSeller[]
  handleCategoryChange: (newCategory: string) => void
  handleTabChange: (tab: string) => void
}

export function useGongguFilters({
  latestPosts,
  trendingPosts,
}: UseGongguFiltersProps): UseGongguFiltersReturn {
  const [category, setCategory] = useState('all')
  const [activeTab, setActiveTab] = useState<TabType>('latest')
  const [isLoading, setIsLoading] = useState(false)

  const handleCategoryChange = useCallback((newCategory: string) => {
    setIsLoading(true)
    setCategory(newCategory)
    setTimeout(() => setIsLoading(false), 300)
  }, [])

  const handleTabChange = useCallback((tab: string) => {
    setIsLoading(true)
    setActiveTab(tab as TabType)
    setTimeout(() => setIsLoading(false), 300)
  }, [])

  // 현재 탭에 따른 데이터 소스 선택
  const basePosts = activeTab === 'trending' ? trendingPosts : latestPosts

  const filteredPosts = useMemo(() => {
    let result = basePosts

    // 카테고리 필터
    if (category === '기타') {
      result = result.filter(
        (post) =>
          !CATEGORY_GROUPS.some((group) =>
            isInCategoryGroup(post.sellers.category, group)
          )
      )
    } else if (category !== 'all') {
      result = result.filter((post) =>
        isInCategoryGroup(post.sellers.category, category as CategoryGroup)
      )
    }

    // 탭별 정렬
    if (activeTab === 'deadline') {
      result = [...result].sort((a, b) => {
        if (!a.deadline) return 1
        if (!b.deadline) return -1
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
      })
    }
    // trending과 latest는 이미 서버에서 정렬됨

    return result
  }, [basePosts, category, activeTab])

  return {
    category,
    activeTab,
    isLoading,
    filteredPosts,
    handleCategoryChange,
    handleTabChange,
  }
}
