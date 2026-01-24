'use client'

import { useUser } from '@/hooks/use-user'
import { LoginModal } from '@/components/auth/login-modal'
import { UserMenu } from '@/components/auth/user-menu'
import { Skeleton } from '@/components/ui/skeleton'

export function Header() {
  const { user, isLoading } = useUser()

  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-foreground">공구 파인더</h1>
        <p className="text-sm text-muted-foreground">인스타 공구 모아보기</p>
      </div>
      <div>
        {isLoading ? (
          <Skeleton className="h-10 w-32" />
        ) : user ? (
          <UserMenu user={user} />
        ) : (
          <LoginModal />
        )}
      </div>
    </header>
  )
}
