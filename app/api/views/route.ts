import { NextRequest, NextResponse } from "next/server"
import { viewRepository, type ApiResponse } from "@/lib/repositories"

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse<null>>> {
  try {
    const { postId } = await request.json()

    if (!postId) {
      return NextResponse.json(
        { success: false, error: "postId is required" },
        { status: 400 }
      )
    }

    // IP 추출 (Next.js에서 제공하는 헤더 사용)
    const forwarded = request.headers.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown"

    // Repository를 통한 조회 추적
    const isNewView = await viewRepository.trackView(postId, ip)

    return NextResponse.json({
      success: true,
      data: null,
      meta: { isNewView },
    } as ApiResponse<null> & { meta: { isNewView: boolean } })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { success: false, error: `Failed to track view: ${message}` },
      { status: 500 }
    )
  }
}
