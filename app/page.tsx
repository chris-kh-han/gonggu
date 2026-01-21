import { createClient } from '@/lib/supabase/server';
import { GongguPage } from '@/components/gonggu-page';
import { TrendingSidebar } from '@/components/trending-sidebar';
import { AddGongguModal } from '@/components/gonggu/add-gonggu-modal';
import type { Database } from '@/types/database.types';

type TrendingPost =
  Database['public']['Functions']['get_trending_posts']['Returns'][number];

export default async function Home() {
  const supabase = await createClient();

  // 최신순 + 급상승 데이터 동시 fetch
  const [{ data: latestPosts }, { data: trendingPosts }] = await Promise.all([
    supabase
      .from('gonggu_posts')
      .select(
        `
        *,
        sellers (
          instagram_username,
          category
        )
      `,
      )
      .eq('status', 'open')
      .order('created_at', { ascending: false }),
    (supabase.rpc as Function)('get_trending_posts', {
      limit_count: 20,
    }) as Promise<{ data: TrendingPost[] | null }>,
  ]);

  // 급상승 데이터에 seller 정보 추가
  const trendingPostIds = trendingPosts?.map((p: TrendingPost) => p.id) ?? [];
  const { data: trendingSellers } =
    trendingPostIds.length > 0
      ? await supabase
          .from('gonggu_posts')
          .select(
            `
          id,
          sellers (
            instagram_username,
            category
          )
        `,
          )
          .in('id', trendingPostIds)
      : { data: [] };

  // seller 정보 매핑
  type SellerInfo = { instagram_username: string; category: string | null };
  const sellerMap = new Map<string, SellerInfo>(
    trendingSellers?.map((p: { id: string; sellers: SellerInfo }) => [
      p.id,
      p.sellers,
    ]) ?? [],
  );
  const trendingWithSellers =
    trendingPosts?.map((post: TrendingPost) => ({
      ...post,
      sellers: sellerMap.get(post.id) ?? {
        instagram_username: '',
        category: null,
      },
    })) ?? [];

  return (
    <div className='min-h-[calc(100vh+1px)] bg-background'>
      <div className='mx-auto max-w-6xl px-4 py-6'>
        <div className='flex justify-between gap-8'>
          {/* 메인 컨텐츠 */}
          <main className='flex-1'>
            <GongguPage
              latestPosts={latestPosts ?? []}
              trendingPosts={trendingWithSellers}
            />
          </main>

          {/* 사이드바 - lg 이상에서만 표시 */}
          <aside className='hidden lg:block w-80 shrink-0 mt-16'>
            <div className='sticky top-0'>
              <TrendingSidebar trendingPosts={trendingWithSellers} />
            </div>
          </aside>
        </div>
      </div>

      {/* 공구 추가 FAB + 모달 */}
      <AddGongguModal />
    </div>
  );
}
