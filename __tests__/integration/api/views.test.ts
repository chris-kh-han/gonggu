import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '@/app/api/views/route'

// Mock Supabase client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() =>
    Promise.resolve({
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          eq: vi.fn(() => ({
            eq: vi.fn(() => ({
              gte: vi.fn(() => ({
                limit: vi.fn(() => ({
                  single: vi.fn(() => Promise.resolve({ data: null })),
                })),
              })),
            })),
          })),
        })),
        insert: vi.fn(() => Promise.resolve({ error: null })),
      })),
      rpc: vi.fn(() => Promise.resolve({ error: null })),
    })
  ),
}))

describe('POST /api/views', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return 400 if postId is missing', async () => {
    const request = new NextRequest('http://localhost:3000/api/views', {
      method: 'POST',
      body: JSON.stringify({}),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('postId is required')
  })

  it('should return success for valid postId', async () => {
    const request = new NextRequest('http://localhost:3000/api/views', {
      method: 'POST',
      body: JSON.stringify({ postId: 'test-post-id' }),
      headers: {
        'x-forwarded-for': '127.0.0.1',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
  })

  it('should handle missing x-forwarded-for header', async () => {
    const request = new NextRequest('http://localhost:3000/api/views', {
      method: 'POST',
      body: JSON.stringify({ postId: 'test-post-id' }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
  })
})
