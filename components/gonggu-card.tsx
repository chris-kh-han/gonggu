"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { GongguPost, Seller } from "@/types/database.types";

type GongguWithSeller = GongguPost & {
  sellers: Pick<Seller, "instagram_username" | "category">;
};

interface GongguCardProps {
  post: GongguWithSeller;
}

function formatDeadline(deadline: string | null): string {
  if (!deadline) return "";

  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return "마감";
  if (diffDays === 0) return "오늘 마감";
  if (diffDays === 1) return "내일 마감";
  return `D-${diffDays}`;
}

function formatPrice(price: number | null): string {
  if (!price) return "";
  return price.toLocaleString("ko-KR") + "원";
}

export function GongguCardSkeleton() {
  return (
    <Card className="p-4 rounded-xl shadow-sm">
      <CardContent className="p-0 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-5 flex-1" />
          <Skeleton className="h-5 w-14 shrink-0" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-5 w-12" />
      </CardContent>
    </Card>
  );
}

export function GongguCard({ post }: GongguCardProps) {
  const deadlineText = formatDeadline(post.deadline);
  const isUrgent = post.deadline && new Date(post.deadline).getTime() - new Date().getTime() < 1000 * 60 * 60 * 24 * 3;

  return (
    <a
      href={post.instagram_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
    >
      <Card className="p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-0 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground line-clamp-2 flex-1">
              {post.title}
            </h3>
            {post.status === "open" && deadlineText && (
              <Badge
                variant={isUrgent ? "destructive" : "secondary"}
                className="shrink-0"
              >
                {deadlineText}
              </Badge>
            )}
            {post.status === "closed" && (
              <Badge variant="outline" className="shrink-0">마감</Badge>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              @{post.sellers.instagram_username}
            </span>
            {post.price && (
              <span className="font-medium text-primary">
                {formatPrice(post.price)}
              </span>
            )}
          </div>

          {post.sellers.category && (
            <Badge variant="outline" className="text-xs">
              {post.sellers.category}
            </Badge>
          )}
        </CardContent>
      </Card>
    </a>
  );
}
