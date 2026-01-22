import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProfileLoading() {
  return (
    <div className="container mx-auto max-w-md py-8 px-4">
      <Skeleton className="h-8 w-32 mb-6" />

      {/* 프로필 카드 스켈레톤 */}
      <Card className="p-6 mb-4">
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-36" />
          </div>
        </div>
      </Card>

      {/* 활동 통계 카드 스켈레톤 */}
      <Card className="p-6 mb-4">
        <Skeleton className="h-6 w-24 mb-4" />
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center space-y-2">
            <Skeleton className="h-8 w-12 mx-auto" />
            <Skeleton className="h-4 w-16 mx-auto" />
          </div>
          <div className="text-center space-y-2">
            <Skeleton className="h-8 w-12 mx-auto" />
            <Skeleton className="h-4 w-20 mx-auto" />
          </div>
          <div className="text-center space-y-2">
            <Skeleton className="h-8 w-12 mx-auto" />
            <Skeleton className="h-4 w-16 mx-auto" />
          </div>
        </div>
      </Card>

      {/* 뱃지 목록 스켈레톤 */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-center">
              <Skeleton className="w-20 h-24 rounded-lg" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
