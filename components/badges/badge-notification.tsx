'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import type { Badge } from '@/types/badges'
import { cn } from '@/lib/utils'

interface BadgeNotificationProps {
  badge: Badge
  onDismiss?: () => void
}

/**
 * 뱃지 획득 알림 토스트 컴포넌트
 *
 * @param badge - 획득한 뱃지 정보
 * @param onDismiss - 닫기 콜백 (제공 시 5초 후 자동 닫힘)
 */
export function BadgeNotification({ badge, onDismiss }: BadgeNotificationProps) {
  // 5초 후 자동 닫기
  useEffect(() => {
    if (!onDismiss) return

    const timer = setTimeout(() => {
      onDismiss()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onDismiss])

  return (
    <Card
      data-testid="badge-notification"
      role="alert"
      className={cn(
        'flex items-start gap-3 p-4 border-2 border-violet-500 shadow-lg',
        'bg-gradient-to-br from-violet-50 to-purple-50',
        'animate-in fade-in slide-in-from-bottom-5 duration-500',
      )}
    >
      {/* 뱃지 아이콘 */}
      <div
        data-testid="badge-notification-icon"
        className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-white border-2 border-violet-300 text-4xl shadow-sm"
      >
        {badge.icon}
      </div>

      {/* 뱃지 정보 */}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-violet-600 uppercase tracking-wide mb-1">
          뱃지 획득!
        </p>
        <h4 className="text-base font-bold text-gray-900 mb-1">{badge.name}</h4>
        <p className="text-sm text-gray-600">{badge.description}</p>
      </div>

      {/* 닫기 버튼 */}
      <button
        onClick={onDismiss}
        className="flex-shrink-0 p-1 rounded-full hover:bg-gray-100 transition-colors"
        aria-label="알림 닫기"
      >
        <X className="w-5 h-5 text-gray-400" />
      </button>
    </Card>
  )
}
