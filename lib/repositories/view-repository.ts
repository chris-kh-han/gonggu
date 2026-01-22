import { createClient } from '@/lib/supabase/server'
import type { CreateViewDto } from './types'

// 중복 조회 방지 시간 (분)
const DUPLICATE_VIEW_MINUTES = 30

export const viewRepository = {
  /**
   * 최근 조회 기록 확인 (중복 방지용)
   */
  async hasRecentView(postId: string, viewerIp: string): Promise<boolean> {
    const supabase = await createClient()

    const cutoffTime = new Date(
      Date.now() - DUPLICATE_VIEW_MINUTES * 60 * 1000
    ).toISOString()

    const { data } = await supabase
      .from('post_views')
      .select('id')
      .eq('post_id', postId)
      .eq('viewer_ip', viewerIp)
      .gte('viewed_at', cutoffTime)
      .limit(1)
      .single()

    return !!data
  },

  /**
   * 조회 기록 생성
   */
  async create(dto: CreateViewDto): Promise<void> {
    const supabase = await createClient()

    await supabase.from('post_views').insert({
      post_id: dto.post_id,
      viewer_ip: dto.viewer_ip ?? null,
      user_id: dto.user_id ?? null,
    } as never)
  },

  /**
   * 조회수 증가
   */
  async incrementViewCount(postId: string): Promise<void> {
    const supabase = await createClient()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.rpc as any)('increment_view_count', { post_id: postId })
  },

  /**
   * 조회 기록 및 카운트 증가 (중복 체크 포함)
   */
  async trackView(postId: string, viewerIp: string): Promise<boolean> {
    const hasRecent = await this.hasRecentView(postId, viewerIp)

    if (hasRecent) {
      return false // 중복 조회
    }

    await this.create({ post_id: postId, viewer_ip: viewerIp })
    await this.incrementViewCount(postId)

    return true // 새로운 조회
  },
}
