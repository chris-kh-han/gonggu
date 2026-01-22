'use client'

import { Lock } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { Badge } from '@/types/badges'
import { cn } from '@/lib/utils'

interface BadgeIconProps {
  badge: Badge
  earned: boolean
  size: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'w-12 h-12 text-2xl',
  md: 'w-16 h-16 text-3xl',
  lg: 'w-20 h-20 text-4xl',
}

/**
 * 개별 뱃지 아이콘 컴포넌트
 *
 * @param badge - 뱃지 정보
 * @param earned - 뱃지 획득 여부
 * @param size - 뱃지 크기 (sm, md, lg)
 */
export function BadgeIcon({ badge, earned, size }: BadgeIconProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            data-testid={`badge-icon-${badge.slug}`}
            className={cn(
              'relative flex items-center justify-center rounded-full bg-gradient-to-br border-2 transition-all hover:scale-110',
              sizeClasses[size],
              earned
                ? 'from-violet-100 to-purple-100 border-violet-300 shadow-md'
                : 'from-gray-50 to-gray-100 border-gray-200 opacity-30',
            )}
            aria-label={`${badge.name} 뱃지${earned ? ' (획득됨)' : ' (잠김)'}`}
          >
            <span className="relative z-10">{badge.icon}</span>
            {!earned && (
              <div
                data-testid="lock-icon"
                className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-full"
              >
                <Lock className="w-1/3 h-1/3 text-gray-400" />
              </div>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-1">
            <p className="font-semibold">{badge.name}</p>
            <p className="text-sm text-muted-foreground">{badge.description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
