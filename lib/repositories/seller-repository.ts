import { createClient } from '@/lib/supabase/server'
import type { Seller, CreateSellerDto } from './types'

export const sellerRepository = {
  /**
   * 인스타그램 유저명으로 판매자 조회
   */
  async findByUsername(username: string): Promise<Seller | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('sellers')
      .select('*')
      .eq('instagram_username', username)
      .single()

    if (error) {
      return null
    }

    return data as Seller
  },

  /**
   * ID로 판매자 조회
   */
  async findById(id: string): Promise<Seller | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('sellers')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      return null
    }

    return data as Seller
  },

  /**
   * 판매자 생성
   */
  async create(dto: CreateSellerDto): Promise<Seller> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('sellers')
      .insert({
        instagram_username: dto.instagram_username,
        category: dto.category ?? null,
        profile_url: dto.profile_url ?? `https://instagram.com/${dto.instagram_username}`,
      } as never)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create seller: ${error.message}`)
    }

    return data as Seller
  },

  /**
   * 판매자 찾기 또는 생성
   */
  async findOrCreate(dto: CreateSellerDto): Promise<Seller> {
    const existing = await this.findByUsername(dto.instagram_username)

    if (existing) {
      return existing
    }

    return this.create(dto)
  },
}
