import { createClient } from "@/lib/supabase/server";
import { GongguList } from "@/components/gonggu-list";
import { AddGongguModal } from "@/components/gonggu/add-gonggu-modal";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function Home() {
  const supabase = await createClient();

  // 최소 1.5초 로딩 표시
  const [{ data: posts }] = await Promise.all([
    supabase
      .from("gonggu_posts")
      .select(`
        *,
        sellers (
          instagram_username,
          category
        )
      `)
      .eq("status", "open")
      .order("created_at", { ascending: false }),
    sleep(1500),
  ]);

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-md px-4 py-6">
        {/* 헤더 */}
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">공구 파인더</h1>
          <p className="text-sm text-muted-foreground">
            인스타 공구 모아보기
          </p>
        </header>

        {/* 공구 리스트 */}
        <GongguList posts={posts ?? []} />
      </main>

      {/* 공구 추가 FAB + 모달 */}
      <AddGongguModal />
    </div>
  );
}
