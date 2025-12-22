"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addGonggu, type FormState } from "./actions";

const CATEGORIES = [
  { value: "식품", label: "식품" },
  { value: "패션", label: "패션" },
  { value: "육아", label: "육아" },
  { value: "생활", label: "생활" },
];

export function GongguForm() {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    addGonggu,
    null
  );

  return (
    <Card className="rounded-xl">
      <CardContent className="p-4">
        <form action={formAction} className="space-y-4">
          {/* 판매자 정보 */}
          <div className="space-y-4 pb-4 border-b">
            <h3 className="font-medium text-sm text-muted-foreground">판매자 정보</h3>

            <div className="space-y-2">
              <Label htmlFor="instagram_username">인스타그램 아이디 *</Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 text-sm text-muted-foreground bg-muted border border-r-0 rounded-l-lg">
                  @
                </span>
                <Input
                  id="instagram_username"
                  name="instagram_username"
                  placeholder="username"
                  className="rounded-l-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">카테고리</Label>
              <Select name="category">
                <SelectTrigger>
                  <SelectValue placeholder="선택" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 공구 정보 */}
          <div className="space-y-4">
            <h3 className="font-medium text-sm text-muted-foreground">공구 정보</h3>

            <div className="space-y-2">
              <Label htmlFor="instagram_url">인스타그램 게시물 URL *</Label>
              <Input
                id="instagram_url"
                name="instagram_url"
                type="url"
                placeholder="https://instagram.com/p/..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">공구 제목 *</Label>
              <Input
                id="title"
                name="title"
                placeholder="예: 제주 감귤 5kg 공구"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">가격 (원)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                placeholder="29000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">마감일</Label>
              <Input
                id="deadline"
                name="deadline"
                type="datetime-local"
              />
            </div>
          </div>

          {/* 상태 메시지 */}
          {state && (
            <div
              className={`p-3 rounded-lg text-sm ${
                state.success
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {state.message}
            </div>
          )}

          {/* 제출 버튼 */}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "등록 중..." : "공구 등록"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
