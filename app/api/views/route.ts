import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";
import type { NewPostView } from "@/types/database.types";

// 중복 조회 방지 시간 (분)
const DUPLICATE_VIEW_MINUTES = 30;

export async function POST(request: NextRequest) {
  try {
    const { postId } = await request.json();

    if (!postId) {
      return NextResponse.json({ error: "postId is required" }, { status: 400 });
    }

    const supabase = await createClient();

    // IP 추출 (Next.js에서 제공하는 헤더 사용)
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

    // 최근 N분 내 같은 IP의 조회가 있는지 확인
    const cutoffTime = new Date(
      Date.now() - DUPLICATE_VIEW_MINUTES * 60 * 1000
    ).toISOString();

    const { data: recentView } = await supabase
      .from("post_views")
      .select("id")
      .eq("post_id", postId)
      .eq("viewer_ip", ip)
      .gte("viewed_at", cutoffTime)
      .limit(1)
      .single();

    // 중복 조회가 아닌 경우에만 카운트 증가
    if (!recentView) {
      // 조회 로그 기록
      const viewData: NewPostView = {
        post_id: postId,
        viewer_ip: ip,
      };
      await supabase.from("post_views").insert(viewData as never);

      // view_count 증가
      await (supabase.rpc as Function)("increment_view_count", { post_id: postId });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("View tracking error:", error);
    return NextResponse.json(
      { error: "Failed to track view" },
      { status: 500 }
    );
  }
}
