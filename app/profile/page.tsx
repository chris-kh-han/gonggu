import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { profileRepository } from '@/lib/repositories'
import { Card } from '@/components/ui/card'
import { BadgeList } from '@/components/badges/badge-list'
import { BADGE_DEFINITIONS } from '@/lib/badges'
import type { Badge } from '@/types/badges'

export default async function ProfilePage() {
  const supabase = await createClient()

  // 인증 확인
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Repository를 통한 데이터 조회
  const [profile, stats, badgeIds] = await Promise.all([
    profileRepository.findById(user.id),
    profileRepository.getStats(user.id),
    profileRepository.getBadges(user.id),
  ])

  // 전체 뱃지 목록
  const allBadges: Badge[] = Object.values(BADGE_DEFINITIONS).map((def) => ({
    slug: def.slug,
    name: def.name,
    description: def.description,
    icon: def.icon,
  }))

  // 프로필 데이터 (fallback to user data)
  const displayName = profile?.nickname || '사용자'
  const displayEmail = profile?.email || user.email || ''
  const joinDate = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    : ''

  return (
    <div className="container mx-auto max-w-md py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">마이페이지</h1>

      {/* 프로필 카드 */}
      <Card className="p-6 mb-4">
        <div className="flex items-center gap-4 mb-4">
          {/* 아바타 */}
          <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center text-2xl">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={displayName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-violet-600">👤</span>
            )}
          </div>

          {/* 기본 정보 */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{displayName}</h2>
            <p className="text-sm text-muted-foreground">{displayEmail}</p>
            {joinDate && (
              <p className="text-xs text-muted-foreground mt-1">
                가입일: {joinDate}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* 활동 통계 카드 */}
      <Card className="p-6 mb-4">
        <h3 className="text-lg font-semibold mb-4">내 활동</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-violet-600">
              {stats.postsCreated}개
            </p>
            <p className="text-sm text-muted-foreground">등록 공구</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-violet-600">
              {stats.postsViewed}개
            </p>
            <p className="text-sm text-muted-foreground">조회한 공구</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-violet-600">
              {stats.bookmarksCount}개
            </p>
            <p className="text-sm text-muted-foreground">찜한 공구</p>
          </div>
        </div>
      </Card>

      {/* 뱃지 목록 */}
      <BadgeList badges={allBadges} earnedBadgeIds={badgeIds} />
    </div>
  )
}
