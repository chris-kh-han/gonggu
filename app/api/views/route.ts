import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { viewRepository, type ApiResponse } from '@/lib/repositories';
import { checkRateLimit, RATE_LIMITS } from '@/lib/rate-limit';

// Input validation schema
const viewSchema = z.object({
  postId: z.string().uuid('올바른 게시물 ID가 아닙니다'),
});

export async function POST(
  request: NextRequest,
): Promise<NextResponse<ApiResponse<null>>> {
  // Rate limiting
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';

  const rateLimitResult = checkRateLimit(
    `views:${ip}`,
    RATE_LIMITS.views.limit,
    RATE_LIMITS.views.windowMs,
  );

  if (!rateLimitResult.success) {
    return NextResponse.json(
      { success: false, error: '요청이 너무 많습니다' },
      {
        status: 429,
        headers: {
          'Retry-After': String(
            Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000),
          ),
        },
      },
    );
  }

  try {
    const body = await request.json();

    // Validate input
    const parseResult = viewSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: '잘못된 요청입니다' },
        { status: 400 },
      );
    }

    const { postId } = parseResult.data;

    // Repository를 통한 조회 추적
    const isNewView = await viewRepository.trackView(postId, ip);

    return NextResponse.json({
      success: true,
      data: null,
      meta: { isNewView },
    } as ApiResponse<null> & { meta: { isNewView: boolean } });
  } catch {
    // 내부 에러 메시지 노출하지 않음 (보안)
    return NextResponse.json(
      { success: false, error: '요청을 처리할 수 없습니다' },
      { status: 500 },
    );
  }
}
