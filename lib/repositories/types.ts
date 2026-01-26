import type { Database } from '@/types/database.types'

// Base types from database
export type GongguPost = Database['public']['Tables']['gonggu_posts']['Row']
export type Seller = Database['public']['Tables']['sellers']['Row']
export type PostView = Database['public']['Tables']['post_views']['Row']

// Extended types with relations
export type GongguPostWithSeller = GongguPost & {
  sellers: {
    instagram_username: string
    category: string | null
  }
}

export type TrendingPost = GongguPost & {
  trending_score: number
  sellers: {
    instagram_username: string
    category: string | null
  }
}

// Filter types
export interface GongguFilters {
  status?: 'open' | 'closed' | 'upcoming'
  category?: string
  sellerId?: string
}

export interface PaginationOptions {
  page?: number
  limit?: number
}

// DTO types
export interface CreateGongguPostDto {
  seller_id: string
  instagram_url: string
  title: string
  price?: number | null
  deadline?: string | null
  status?: 'open' | 'closed' | 'upcoming'
}

export interface CreateSellerDto {
  instagram_username: string
  category?: string | null
  profile_url?: string | null
}

export interface CreateViewDto {
  post_id: string
  viewer_ip?: string | null
  user_id?: string | null
}

// API Response format (patterns.md)
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    total: number
    page: number
    limit: number
  }
}
