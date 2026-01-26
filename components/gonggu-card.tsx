'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { getCategoryColor } from '@/lib/categories';
import { cn } from '@/lib/utils';
import { XCircle } from 'lucide-react';
import type { GongguPost, Seller } from '@/types/database.types';

type GongguWithSeller = GongguPost & {
  sellers: Pick<Seller, 'instagram_username' | 'category'>;
};

interface GongguCardProps {
  post: GongguWithSeller;
  rank?: number;
}

type DeadlineStatus = 'closed' | 'urgent' | 'normal';

function formatDeadline(
  deadline: string | null,
  now: Date,
): { text: string; status: DeadlineStatus } {
  if (!deadline) return { text: '', status: 'normal' };

  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - now.getTime();
  const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let text = '';
  let status: DeadlineStatus = 'normal';

  if (diffTime <= 0) {
    text = '마감';
    status = 'closed';
  } else if (diffHours <= 24) {
    text = `${diffHours}시간 남음`;
    status = 'urgent';
  } else if (diffDays === 1) {
    text = '내일 마감';
    status = 'normal';
  } else {
    text = `D-${diffDays}`;
    status = 'normal';
  }

  return { text, status };
}

function formatPrice(price: number | null): string {
  if (!price) return '';
  return price.toLocaleString('ko-KR') + '원';
}

export function GongguCardSkeleton() {
  return (
    <Card className='rounded-xl p-4 shadow-sm'>
      <CardContent className='space-y-3 p-0'>
        <div className='flex items-start justify-between gap-2'>
          <Skeleton className='h-5 flex-1' />
          <Skeleton className='h-5 w-14 shrink-0' />
        </div>
        <div className='flex items-center justify-between'>
          <Skeleton className='h-4 w-24' />
          <Skeleton className='h-4 w-20' />
        </div>
        <Skeleton className='h-5 w-12' />
      </CardContent>
    </Card>
  );
}

export function GongguCard({ post, rank }: GongguCardProps) {
  const [deadlineInfo, setDeadlineInfo] = useState<{
    text: string;
    status: DeadlineStatus;
  }>({ text: '', status: 'normal' });
  const categoryColor = getCategoryColor(post.sellers.category);

  useEffect(() => {
    setDeadlineInfo(formatDeadline(post.deadline, new Date()));
  }, [post.deadline]);

  return (
    <a
      href={post.instagram_url}
      target='_blank'
      rel='noopener noreferrer'
      className='block'
    >
      <Card
        className={cn(
          'cursor-pointer overflow-hidden rounded-xl border-l-4 p-4 shadow-sm transition-shadow hover:shadow-md',
          categoryColor.borderAccent,
          categoryColor.bgLight,
        )}
      >
        <CardContent className='space-y-3 p-0'>
          <div className='flex items-start justify-between gap-2'>
            <div className='flex min-w-0 flex-1 items-start gap-2'>
              {rank && (
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    rank <= 3
                      ? 'bg-linear-to-br from-orange-400 to-red-500 text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {rank}
                </span>
              )}
              <h3 className='text-foreground line-clamp-2 font-semibold'>
                {post.title}
              </h3>
            </div>
            {post.status === 'open' && deadlineInfo.text && (
              <Badge
                variant='outline'
                className={cn(
                  'shrink-0',
                  deadlineInfo.status === 'closed' &&
                    'border-black bg-black text-white',
                  deadlineInfo.status === 'urgent' &&
                    'border-gray-200 bg-white text-red-600',
                  deadlineInfo.status === 'normal' &&
                    'border-gray-200 bg-white text-gray-900',
                )}
              >
                {deadlineInfo.status === 'closed' && (
                  <XCircle className='h-3 w-3' />
                )}
                {deadlineInfo.text}
              </Badge>
            )}
            {post.status === 'closed' && (
              <Badge
                variant='outline'
                className='shrink-0 border-black bg-black text-white'
              >
                <XCircle className='h-3 w-3' />
                마감
              </Badge>
            )}
          </div>

          <div className='flex items-center justify-between text-sm'>
            <span className='text-muted-foreground'>
              @{post.sellers.instagram_username}
            </span>
            {post.price && (
              <span className={cn('font-medium', categoryColor.text)}>
                {formatPrice(post.price)}
              </span>
            )}
          </div>

          {post.sellers.category && (
            <Badge
              variant='outline'
              className={cn(
                'bg-white text-xs',
                getCategoryColor(post.sellers.category).text,
                getCategoryColor(post.sellers.category).border,
              )}
            >
              {post.sellers.category}
            </Badge>
          )}
        </CardContent>
      </Card>
    </a>
  );
}
