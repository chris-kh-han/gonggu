'use client';

import { useState, useMemo } from 'react';
import { Header } from './header';
import { CategoryFilter } from './category-filter';
import { GongguCard, GongguCardSkeleton } from './gonggu-card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CATEGORY_GROUPS, isInCategoryGroup, type CategoryGroup } from '@/lib/categories';
import type { GongguPost, Seller } from '@/types/database.types';
import { Flame, Clock, Timer } from 'lucide-react';

type GongguWithSeller = GongguPost & {
  sellers: Pick<Seller, 'instagram_username' | 'category'>;
  trending_score?: number;
};

type TabType = 'latest' | 'trending' | 'deadline';

interface GongguPageProps {
  latestPosts: GongguWithSeller[];
  trendingPosts: GongguWithSeller[];
}

export function GongguPage({ latestPosts, trendingPosts }: GongguPageProps) {
  const [category, setCategory] = useState('all');
  const [activeTab, setActiveTab] = useState<TabType>('latest');
  const [isLoading, setIsLoading] = useState(false);

  const handleCategoryChange = (newCategory: string) => {
    setIsLoading(true);
    setCategory(newCategory);
    setTimeout(() => setIsLoading(false), 300);
  };

  const handleTabChange = (tab: string) => {
    setIsLoading(true);
    setActiveTab(tab as TabType);
    setTimeout(() => setIsLoading(false), 300);
  };

  // 현재 탭에 따른 데이터 소스 선택
  const basePosts = activeTab === 'trending' ? trendingPosts : latestPosts;

  const filteredPosts = useMemo(() => {
    let result = basePosts;

    // 카테고리 필터
    if (category === '기타') {
      result = result.filter(
        (post) =>
          !CATEGORY_GROUPS.some((group) =>
            isInCategoryGroup(post.sellers.category, group)
          )
      );
    } else if (category !== 'all') {
      result = result.filter((post) =>
        isInCategoryGroup(post.sellers.category, category as CategoryGroup)
      );
    }

    // 탭별 정렬
    if (activeTab === 'deadline') {
      result = [...result].sort((a, b) => {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      });
    }
    // trending과 latest는 이미 서버에서 정렬됨

    return result;
  }, [basePosts, category, activeTab]);

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
  );
}
