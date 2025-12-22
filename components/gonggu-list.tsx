'use client';

import { useState, useMemo } from 'react';
import { GongguCard, GongguCardSkeleton } from './gonggu-card';
import { CategoryFilter } from './category-filter';
import { CATEGORY_GROUPS, isInCategoryGroup, type CategoryGroup } from '@/lib/categories';
import { SortSelect, type SortOption } from './sort-select';
import type { GongguPost, Seller } from '@/types/database.types';

type GongguWithSeller = GongguPost & {
  sellers: Pick<Seller, 'instagram_username' | 'category'>;
};

interface GongguListProps {
  posts: GongguWithSeller[];
}

export function GongguList({ posts }: GongguListProps) {
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState<SortOption>('latest');
  const [isLoading, setIsLoading] = useState(false);

  const handleCategoryChange = (newCategory: string) => {
    setIsLoading(true);
    setCategory(newCategory);
    // 짧은 딜레이로 스켈레톤 표시
    setTimeout(() => setIsLoading(false), 500);
  };

  const filteredAndSorted = useMemo(() => {
    let result = posts;

    // 카테고리 필터
    if (category === '기타') {
      // 어떤 그룹에도 속하지 않는 것들
      result = result.filter(
        (post) =>
          !CATEGORY_GROUPS.some((group) =>
            isInCategoryGroup(post.sellers.category, group)
          )
      );
    } else if (category !== 'all') {
      // 해당 그룹에 속하는 것들
      result = result.filter((post) =>
        isInCategoryGroup(post.sellers.category, category as CategoryGroup)
      );
    }

    // 정렬
    result = [...result].sort((a, b) => {
      if (sort === 'latest') {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } else {
        // 마감임박순: deadline이 없으면 맨 뒤로
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
    });

    return result;
  }, [posts, category, sort]);

  return (
    <div className='space-y-6'>
      {/* 필터 & 정렬 */}
      <div className='space-y-4'>
        <CategoryFilter selected={category} onSelect={handleCategoryChange} />
        <div className='flex justify-end'>
          <SortSelect value={sort} onValueChange={setSort} />
        </div>
      </div>

      {/* 공구 리스트 */}
      {isLoading ? (
        <div className='grid gap-4'>
          {[...Array(3)].map((_, i) => (
            <GongguCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredAndSorted.length === 0 ? (
        <div className='text-center py-12 text-muted-foreground'>
          공구가 없습니다
        </div>
      ) : (
        <div className='grid gap-4'>
          {filteredAndSorted.map((post) => (
            <GongguCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
