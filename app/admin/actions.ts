"use server"

import { revalidatePath } from "next/cache"
import { gongguRepository, sellerRepository } from "@/lib/repositories"

export type FormState = {
  success: boolean
  message: string
} | null

export async function addGonggu(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const instagram_username = formData.get("instagram_username") as string
  const category = formData.get("category") as string
  const instagram_url = formData.get("instagram_url") as string
  const title = formData.get("title") as string
  const price = formData.get("price") as string
  const deadline = formData.get("deadline") as string

  if (!instagram_username || !instagram_url || !title) {
    return { success: false, message: "필수 항목을 입력해주세요" }
  }

  try {
    // 1. 판매자 찾기 또는 생성
    const seller = await sellerRepository.findOrCreate({
      instagram_username,
      category: category || null,
    })

    // 2. 공구 게시물 생성
    await gongguRepository.create({
      seller_id: seller.id,
      instagram_url,
      title,
      price: price ? parseInt(price, 10) : null,
      deadline: deadline || null,
      status: "open",
    })

    revalidatePath("/")
    return { success: true, message: "공구가 등록되었습니다!" }
  } catch (error) {
    const message = error instanceof Error ? error.message : "알 수 없는 오류"
    return { success: false, message: `공구 등록 실패: ${message}` }
  }
}
