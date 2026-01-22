import type { UserStats, Badge, BadgeDefinition } from '@/types/badges'

/**
 * 뱃지 정의
 * 각 뱃지는 slug, 이름, 설명, 아이콘, 획득 조건을 포함합니다.
 */
export const BADGE_DEFINITIONS: Record<string, BadgeDefinition> = {
  first_post: {
    slug: 'first_post',
    name: '첫 공구',
    description: '첫 번째 공구를 등록했어요',
    icon: '🎉',
    condition: (stats: UserStats) => stats.postsCreated >= 1,
  },
  active_poster: {
    slug: 'active_poster',
    name: '활발한 판매자',
    description: '공구 5개 이상 등록했어요',
    icon: '🔥',
    condition: (stats: UserStats) => stats.postsCreated >= 5,
  },
  explorer: {
    slug: 'explorer',
    name: '탐험가',
    description: '공구 10개 이상 조회했어요',
    icon: '🔍',
    condition: (stats: UserStats) => stats.postsViewed >= 10,
  },
  collector: {
    slug: 'collector',
    name: '수집가',
    description: '찜 5개 이상 저장했어요',
    icon: '💎',
    condition: (stats: UserStats) => stats.bookmarksCount >= 5,
  },
}

/**
 * 특정 뱃지의 획득 조건을 체크합니다.
 *
 * @param badgeSlug - 체크할 뱃지의 slug
 * @param userStats - 유저의 활동 통계
 * @returns 뱃지 획득 조건을 만족하면 true, 아니면 false
 */
export function checkBadgeCondition(badgeSlug: string, userStats: UserStats): boolean {
  const badge = BADGE_DEFINITIONS[badgeSlug]
  if (!badge) {
    return false
  }
  return badge.condition(userStats)
}

/**
 * 유저가 획득할 수 있는 새로운 뱃지 목록을 반환합니다.
 * 이미 획득한 뱃지는 제외됩니다.
 *
 * @param userStats - 유저의 활동 통계
 * @param earnedBadges - 이미 획득한 뱃지 slug 배열
 * @returns 새로 획득할 수 있는 뱃지 배열
 */
export function getBadgesToAward(userStats: UserStats, earnedBadges: string[]): Badge[] {
  const newBadges: Badge[] = []

  for (const [slug, definition] of Object.entries(BADGE_DEFINITIONS)) {
    // 이미 획득한 뱃지는 스킵
    if (earnedBadges.includes(slug)) {
      continue
    }

    // 조건을 만족하는 뱃지만 추가
    if (definition.condition(userStats)) {
      newBadges.push({
        slug: definition.slug,
        name: definition.name,
        description: definition.description,
        icon: definition.icon,
      })
    }
  }

  return newBadges
}
