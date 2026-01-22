import { gongguRepository } from '@/lib/repositories'
import { GongguPage } from '@/components/gonggu-page'
import { TrendingSidebar } from '@/components/trending-sidebar'
import { AddGongguModal } from '@/components/gonggu/add-gonggu-modal'

export default async function Home() {
  // Repository를 통한 데이터 조회
  const [latestPosts, trendingPosts] = await Promise.all([
    gongguRepository.findAll({ status: 'open' }),
    gongguRepository.findTrending(20),
  ])

  return (
    <div className='min-h-[calc(100vh+1px)] bg-background'>
      <div className='mx-auto max-w-6xl px-4 py-6'>
        <div className='flex justify-between gap-8'>
          {/* 메인 컨텐츠 */}
          <main className='flex-1'>
            <GongguPage
              latestPosts={latestPosts}
              trendingPosts={trendingPosts}
            />
          </main>

          {/* 사이드바 - lg 이상에서만 표시 */}
          <aside className='hidden lg:block w-80 shrink-0 mt-16'>
            <div className='sticky top-0'>
              <TrendingSidebar trendingPosts={trendingPosts} />
            </div>
          </aside>
        </div>
      </div>

      {/* 공구 추가 FAB + 모달 */}
      <AddGongguModal />
    </div>
  )
}
