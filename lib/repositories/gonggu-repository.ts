import { createClient } from '@/lib/supabase/server'
import type {
  GongguPostWithSeller,
  TrendingPost,
  GongguFilters,
  CreateGongguPostDto,
  GongguPost,
} from './types'
import type { Database } from '@/types/database.types'

type DbTrendingPost =
  Database['public']['Functions']['get_trending_posts']['Returns'][number]

export const gongguRepository = {
  /**
   * 공구 목록 조회 (판매자 정보 포함)
   */
  async findAll(filters?: GongguFilters): Promise<GongguPostWithSeller[]> {
    const supabase = await createClient()

    let query = supabase.from('gonggu_posts').select(`
      *,
      sellers (
        instagram_username,
        category
      )
    `)

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }

    if (filters?.sellerId) {
      query = query.eq('seller_id', filters.sellerId)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch gonggu posts: ${error.message}`)
    }

    return (data ?? []) as GongguPostWithSeller[]
  },

  /**
   * 급상승 공구 조회
   */
  async findTrending(limit: number = 20): Promise<TrendingPost[]> {
    const supabase = await createClient()

    // RPC로 트렌딩 데이터 조회
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: trendingPosts, error: trendingError } = (await (supabase.rpc as any)(
      'get_trending_posts',
      { limit_count: limit }
    )) as { data: DbTrendingPost[] | null; error: Error | null }

    if (trendingError) {
      throw new Error(`Failed to fetch trending posts: ${trendingError.message}`)
    }

    if (!trendingPosts?.length) {
      return []
    }

    // 판매자 정보 추가 조회
    const postIds = trendingPosts.map((p) => p.id)
    const { data: postsWithSellers } = await supabase
      .from('gonggu_posts')
      .select(`
        id,
        sellers (
          instagram_username,
          category
        )
      `)
      .in('id', postIds)

    // 판매자 정보 매핑
    type SellerInfo = { instagram_username: string; category: string | null }
    const sellerMap = new Map<string, SellerInfo>(
      postsWithSellers?.map((p: { id: string; sellers: SellerInfo }) => [
        p.id,
        p.sellers,
      ]) ?? []
    )

    return trendingPosts.map((post) => ({
      ...post,
      sellers: sellerMap.get(post.id) ?? {
        instagram_username: '',
        category: null,
      },
    }))
  },

  /**
   * ID로 공구 조회
   */
  async findById(id: string): Promise<GongguPostWithSeller | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('gonggu_posts')
      .select(`
        *,
        sellers (
          instagram_username,
          category
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      return null
    }

    return data as GongguPostWithSeller
  },

  /**
   * 공구 생성
   */
  async create(dto: CreateGongguPostDto): Promise<GongguPost> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('gonggu_posts')
      .insert({
        seller_id: dto.seller_id,
        instagram_url: dto.instagram_url,
        title: dto.title,
        price: dto.price ?? null,
        deadline: dto.deadline ?? null,
        status: dto.status ?? 'open',
      } as never)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create gonggu post: ${error.message}`)
    }

    return data as GongguPost
  },

  /**
   * 공구 상태 업데이트
   */
  async updateStatus(
    id: string,
    status: 'open' | 'closed' | 'upcoming'
  ): Promise<GongguPost> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('gonggu_posts')
      .update({ status } as never)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update gonggu post status: ${error.message}`)
    }

    return data as GongguPost
  },
}
