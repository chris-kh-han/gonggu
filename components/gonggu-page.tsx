'use client'

import { Header } from './header'
import { CategoryFilter } from './category-filter'
import { GongguCard, GongguCardSkeleton } from './gonggu-card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useGongguFilters } from '@/hooks'
import type { GongguPost, Seller } from '@/types/database.types'
import { Flame, Clock, Timer } from 'lucide-react'

type GongguWithSeller = GongguPost & {
  sellers: Pick<Seller, 'instagram_username' | 'category'>
  trending_score?: number
}

interface GongguPageProps {
  latestPosts: GongguWithSeller[]
  trendingPosts: GongguWithSeller[]
}

export function GongguPage({ latestPosts, trendingPosts }: GongguPageProps) {
  const {
    category,
    activeTab,
    isLoading,
    filteredPosts,
    handleCategoryChange,
    handleTabChange,
  } = useGongguFilters({ latestPosts, trendingPosts })

  return (
    <div>
      {/* 헤더 (타이틀) */}
      <Header />

      {/* 카테고리 필터 - sticky */}
      <div className='sticky top-0 z-40 -mx-4 bg-background px-4 py-3'>
        <CategoryFilter selected={category} onSelect={handleCategoryChange} />
      </div>

      {/* 탭 - 모바일: 3개, 데스크톱: 2개 (급상승은 사이드바에) */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className='pt-2'>
        {/* 모바일용 탭 (lg 미만) */}
        <TabsList className='grid w-full grid-cols-3 lg:hidden'>
          <TabsTrigger value='latest' className='gap-1.5'>
            <Clock className='h-4 w-4' />
            최신순
          </TabsTrigger>
          <TabsTrigger value='trending' className='gap-1.5'>
            <Flame className='h-4 w-4' />
            급상승
          </TabsTrigger>
          <TabsTrigger value='deadline' className='gap-1.5'>
            <Timer className='h-4 w-4' />
            마감임박
          </TabsTrigger>
        </TabsList>
        {/* 데스크톱용 탭 (lg 이상) - 급상승은 사이드바에 */}
        <TabsList className='hidden lg:grid w-full grid-cols-2'>
          <TabsTrigger value='latest' className='gap-1.5'>
            <Clock className='h-4 w-4' />
            최신순
          </TabsTrigger>
          <TabsTrigger value='deadline' className='gap-1.5'>
            <Timer className='h-4 w-4' />
            마감임박
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* 공구 리스트 */}
      <div className='pt-4 min-h-[600px]'>
        {isLoading ? (
          <div className='grid gap-4'>
            {[...Array(5)].map((_, i) => (
              <GongguCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className='text-center py-12 text-muted-foreground'>
            {activeTab === 'trending'
              ? '아직 급상승 공구가 없습니다'
              : '공구가 없습니다'}
          </div>
        ) : (
          <div className='grid gap-4'>
            {filteredPosts.map((post, index) => (
              <GongguCard
                key={post.id}
                post={post}
                rank={activeTab === 'trending' ? index + 1 : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
