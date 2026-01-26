'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { z } from 'zod';
import { gongguRepository, sellerRepository } from '@/lib/repositories';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';

// Input validation schema
const gongguSchema = z.object({
  instagram_username: z
    .string()
    .min(1, '인스타그램 사용자명을 입력해주세요')
    .max(30, '사용자명이 너무 깁니다')
    .regex(/^[a-zA-Z0-9._]+$/, '올바른 인스타그램 사용자명을 입력해주세요'),
  category: z.string().max(50).optional(),
  instagram_url: z
    .string()
    .min(1, '인스타그램 URL을 입력해주세요')
    .url('올바른 URL 형식이 아닙니다')
    .refine(
      (url) => url.includes('instagram.com'),
      '인스타그램 URL이어야 합니다',
    ),
  title: z
    .string()
    .min(1, '제목을 입력해주세요')
    .max(200, '제목이 너무 깁니다'),
  price: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : null))
    .refine(
      (val) => val === null || (Number.isInteger(val) && val >= 0),
      '올바른 가격을 입력해주세요',
    ),
  deadline: z.string().optional(),
});

export type FormState = {
  success: boolean;
  message: string;
} | null;

export async function addGonggu(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  // Rate limiting
  const headersList = await headers();
  const forwarded = headersList.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';

  const rateLimitResult = checkRateLimit(
    `admin:${ip}`,
    RATE_LIMITS.admin.limit,
    RATE_LIMITS.admin.windowMs,
  );

  if (!rateLimitResult.success) {
    return {
      success: false,
      message: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
    };
  }

  // Parse and validate input
  const rawData = {
    instagram_username: formData.get('instagram_username'),
    category: formData.get('category') || undefined,
    instagram_url: formData.get('instagram_url'),
    title: formData.get('title'),
    price: formData.get('price') || undefined,
    deadline: formData.get('deadline') || undefined,
  };

  const parseResult = gongguSchema.safeParse(rawData);

  if (!parseResult.success) {
    const firstIssue = parseResult.error.issues[0];
    return {
      success: false,
      message: firstIssue?.message || '입력값을 확인해주세요',
    };
  }

  const data = parseResult.data;

  try {
    // 1. 판매자 찾기 또는 생성
    const seller = await sellerRepository.findOrCreate({
      instagram_username: data.instagram_username,
      category: data.category || null,
    });

    // 2. 공구 게시물 생성
    await gongguRepository.create({
      seller_id: seller.id,
      instagram_url: data.instagram_url,
      title: data.title,
      price: data.price,
      deadline: data.deadline || null,
      status: 'open',
    });

    revalidatePath('/');
    return { success: true, message: '공구가 등록되었습니다!' };
  } catch {
    // 에러 메시지 노출하지 않음 (보안)
    return { success: false, message: '공구 등록에 실패했습니다' };
  }
}
