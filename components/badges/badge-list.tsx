'use client'

import { useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { BadgeIcon } from './badge-icon'
import type { Badge } from '@/types/badges'

interface BadgeListProps {
  badges: Badge[]
  earnedBadgeIds: string[]
}

/**
 * 뱃지 그리드 목록 컴포넌트
 *
 * @param badges - 전체 뱃지 목록
 * @param earnedBadgeIds - 획득한 뱃지 ID 목록
 */
export function BadgeList({ badges, earnedBadgeIds }: BadgeListProps) {
  // 획득한 뱃지 먼저 정렬
  const sortedBadges = useMemo(() => {
    const earnedSet = new Set(earnedBadgeIds)
    return [...badges].sort((a, b) => {
      const aEarned = earnedSet.has(a.slug)
      const bEarned = earnedSet.has(b.slug)
      if (aEarned === bEarned) return 0
      return aEarned ? -1 : 1
    })
  }, [badges, earnedBadgeIds])

  // 획득한 뱃지 개수 계산 (중복 제거)
  const earnedCount = useMemo(() => {
    const earnedSet = new Set(earnedBadgeIds)
    return badges.filter((badge) => earnedSet.has(badge.slug)).length
  }, [badges, earnedBadgeIds])

  // 빈 상태
  if (badges.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">뱃지가 없습니다</p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      {/* 헤더 */}
      <div data-testid="badge-list-header" className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">뱃지</h3>
        <span className="text-sm font-medium text-violet-600">
          {earnedCount}/{badges.length} 획득
        </span>
      </div>

      {/* 뱃지 그리드 */}
      <div
        data-testid="badge-grid"
        role="list"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
      >
        {sortedBadges.map((badge) => {
          const isEarned = earnedBadgeIds.includes(badge.slug)
          return (
            <div key={badge.slug} className="flex justify-center" role="listitem">
              <BadgeIcon badge={badge} earned={isEarned} size="md" />
            </div>
          )
        })}
      </div>
    </Card>
  )
}
