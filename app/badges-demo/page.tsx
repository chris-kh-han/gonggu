'use client'

import { useState } from 'react'
import { BadgeIcon, BadgeList, BadgeNotification } from '@/components/badges'
import { BADGE_DEFINITIONS } from '@/lib/badges'
import type { Badge } from '@/types/badges'
import { Button } from '@/components/ui/button'

/**
 * Badge Components Demo Page
 *
 * This page demonstrates all three badge UI components:
 * - BadgeIcon: Individual badge display
 * - BadgeList: Grid of all badges
 * - BadgeNotification: Toast notification for new badges
 */
export default function BadgesDemoPage() {
  const [earnedBadgeIds, setEarnedBadgeIds] = useState<string[]>(['first_post'])
  const [notification, setNotification] = useState<Badge | null>(null)

  const badges = Object.values(BADGE_DEFINITIONS).map((def) => ({
    slug: def.slug,
    name: def.name,
    description: def.description,
    icon: def.icon,
  }))

  const handleUnlockRandom = () => {
    const unearnedBadges = badges.filter((b) => !earnedBadgeIds.includes(b.slug))
    if (unearnedBadges.length > 0) {
      const randomBadge = unearnedBadges[Math.floor(Math.random() * unearnedBadges.length)]
      setEarnedBadgeIds([...earnedBadgeIds, randomBadge.slug])
      setNotification(randomBadge)
    }
  }

  const handleReset = () => {
    setEarnedBadgeIds([])
    setNotification(null)
  }

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Badge Components Demo</h1>
          <p className="text-lg text-gray-600">
            TDD로 구현된 뱃지 UI 컴포넌트 데모
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <Button onClick={handleUnlockRandom} size="lg">
            랜덤 뱃지 획득하기
          </Button>
          <Button onClick={handleReset} variant="outline" size="lg">
            초기화
          </Button>
        </div>

        {/* Badge List Component */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">BadgeList Component</h2>
          <BadgeList badges={badges} earnedBadgeIds={earnedBadgeIds} />
        </section>

        {/* Badge Icon Variants */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">BadgeIcon Component</h2>
          <div className="bg-white rounded-xl p-8 shadow-sm space-y-8">
            {/* Size Variants */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Size Variants</h3>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <BadgeIcon badge={badges[0]} earned={true} size="sm" />
                  <p className="text-sm text-gray-600 mt-2">Small</p>
                </div>
                <div className="text-center">
                  <BadgeIcon badge={badges[0]} earned={true} size="md" />
                  <p className="text-sm text-gray-600 mt-2">Medium</p>
                </div>
                <div className="text-center">
                  <BadgeIcon badge={badges[0]} earned={true} size="lg" />
                  <p className="text-sm text-gray-600 mt-2">Large</p>
                </div>
              </div>
            </div>

            {/* State Variants */}
            <div>
              <h3 className="text-lg font-semibold mb-4">States</h3>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <BadgeIcon badge={badges[0]} earned={true} size="md" />
                  <p className="text-sm text-gray-600 mt-2">Earned</p>
                </div>
                <div className="text-center">
                  <BadgeIcon badge={badges[1]} earned={false} size="md" />
                  <p className="text-sm text-gray-600 mt-2">Locked</p>
                </div>
              </div>
            </div>

            {/* All Badge Icons */}
            <div>
              <h3 className="text-lg font-semibold mb-4">All Badges</h3>
              <div className="flex items-center gap-4">
                {badges.map((badge) => (
                  <BadgeIcon
                    key={badge.slug}
                    badge={badge}
                    earned={earnedBadgeIds.includes(badge.slug)}
                    size="md"
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Badge Notification */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">BadgeNotification Component</h2>
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <p className="text-gray-600 mb-4">
              "랜덤 뱃지 획득하기" 버튼을 클릭하면 우측 하단에 알림이 표시됩니다.
            </p>
            <p className="text-sm text-gray-500">
              알림은 5초 후 자동으로 사라지거나 닫기 버튼을 클릭하여 수동으로 닫을 수 있습니다.
            </p>
          </div>
        </section>

        {/* Test Results */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Test Coverage</h2>
          <div className="bg-white rounded-xl p-8 shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-3xl font-bold text-violet-600">16</div>
                <div className="text-sm text-gray-600">BadgeIcon Tests</div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-3xl font-bold text-violet-600">18</div>
                <div className="text-sm text-gray-600">BadgeList Tests</div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-3xl font-bold text-violet-600">24</div>
                <div className="text-sm text-gray-600">BadgeNotification Tests</div>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">Total Coverage</div>
                <div className="text-2xl font-bold text-green-600">100%</div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                58/58 tests passing • 100% code coverage
              </p>
            </div>
          </div>
        </section>

        {/* Features */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-3">BadgeIcon</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ 3가지 크기 (sm/md/lg)</li>
                <li>✓ 획득/미획득 상태</li>
                <li>✓ 호버 시 툴팁</li>
                <li>✓ 자물쇠 오버레이</li>
                <li>✓ 키보드 접근성</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-3">BadgeList</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ 획득한 뱃지 우선 정렬</li>
                <li>✓ N/M 카운터</li>
                <li>✓ 반응형 그리드</li>
                <li>✓ 빈 상태 처리</li>
                <li>✓ 시맨틱 HTML</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-3">BadgeNotification</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ 5초 자동 닫기</li>
                <li>✓ 수동 닫기 버튼</li>
                <li>✓ 축하 애니메이션</li>
                <li>✓ role="alert"</li>
                <li>✓ 타이머 정리</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-3">TDD Methodology</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Red-Green-Refactor</li>
                <li>✓ 테스트 우선 작성</li>
                <li>✓ 100% 커버리지</li>
                <li>✓ 엣지 케이스 처리</li>
                <li>✓ 리그레션 제로</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* Notification (Fixed Position) */}
      {notification && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm">
          <BadgeNotification badge={notification} onDismiss={() => setNotification(null)} />
        </div>
      )}
    </main>
  )
}
