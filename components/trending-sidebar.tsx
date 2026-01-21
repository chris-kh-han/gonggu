"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, TrendingUp } from "lucide-react";
import type { GongguPost, Seller } from "@/types/database.types";

type GongguWithSeller = GongguPost & {
  sellers: Pick<Seller, "instagram_username" | "category">;
  trending_score?: number;
};

interface TrendingSidebarProps {
  trendingPosts: GongguWithSeller[];
}

function formatPrice(price: number | null): string {
  if (!price) return "";
  return price.toLocaleString("ko-KR") + "원";
}

function SidebarItem({
  post,
  rank,
}: {
  post: GongguWithSeller;
  rank: number;
}) {
  return (
    <a
      href={post.instagram_url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 py-3 border-b last:border-b-0 hover:bg-muted/50 -mx-2 px-2 rounded transition-colors"
    >
      <span
        className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
          rank <= 3
            ? "bg-gradient-to-br from-orange-400 to-red-500 text-white"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {rank}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium line-clamp-2 leading-tight">
          {post.title}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">
            @{post.sellers.instagram_username}
          </span>
          {post.price && (
            <span className="text-xs font-medium text-primary">
              {formatPrice(post.price)}
            </span>
          )}
        </div>
      </div>
      {post.view_count > 0 && (
        <span className="text-xs text-muted-foreground shrink-0">
          👀 {post.view_count}
        </span>
      )}
    </a>
  );
}

export function TrendingSidebar({ trendingPosts }: TrendingSidebarProps) {
  // 상위 5개만 표시
  const topTrending = trendingPosts.slice(0, 5);

  // 인기순 (총 조회수 기반) - 나중에 좋아요 기반으로 변경 예정
  const topPopular = [...trendingPosts]
    .sort((a, b) => (b.view_count ?? 0) - (a.view_count ?? 0))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* 급상승 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Flame className="h-4 w-4 text-orange-500" />
            급상승
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {topTrending.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              아직 급상승 공구가 없습니다
            </p>
          ) : (
            <div>
              {topTrending.map((post, index) => (
                <SidebarItem key={post.id} post={post} rank={index + 1} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 인기 공구 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4 text-violet-500" />
            인기 공구
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {topPopular.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              아직 인기 공구가 없습니다
            </p>
          ) : (
            <div>
              {topPopular.map((post, index) => (
                <SidebarItem key={post.id} post={post} rank={index + 1} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
