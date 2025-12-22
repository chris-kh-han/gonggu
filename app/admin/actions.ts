"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type FormState = {
  success: boolean;
  message: string;
} | null;

export async function addGonggu(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();

  const instagram_username = formData.get("instagram_username") as string;
  const category = formData.get("category") as string;
  const instagram_url = formData.get("instagram_url") as string;
  const title = formData.get("title") as string;
  const price = formData.get("price") as string;
  const deadline = formData.get("deadline") as string;

  if (!instagram_username || !instagram_url || !title) {
    return { success: false, message: "필수 항목을 입력해주세요" };
  }

  // 1. 판매자 찾기 또는 생성
  let sellerId: string;

  const { data: existingSeller } = await supabase
    .from("sellers")
    .select("id")
    .eq("instagram_username", instagram_username)
    .single();

  if (existingSeller) {
    sellerId = existingSeller.id;
  } else {
    const { data: newSeller, error: sellerError } = await supabase
      .from("sellers")
      .insert({
        instagram_username,
        category: category || null,
        profile_url: `https://instagram.com/${instagram_username}`,
      })
      .select("id")
      .single();

    if (sellerError || !newSeller) {
      return { success: false, message: "판매자 생성 실패: " + sellerError?.message };
    }
    sellerId = newSeller.id;
  }

  // 2. 공구 게시물 생성
  const { error: postError } = await supabase.from("gonggu_posts").insert({
    seller_id: sellerId,
    instagram_url,
    title,
    price: price ? parseInt(price, 10) : null,
    deadline: deadline || null,
    status: "open",
  });

  if (postError) {
    return { success: false, message: "공구 등록 실패: " + postError.message };
  }

  revalidatePath("/");
  return { success: true, message: "공구가 등록되었습니다!" };
}
