/**
 * Simple in-memory rate limiter
 * For production, consider using Upstash Redis or similar
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

const store = new Map<string, RateLimitEntry>()

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (entry.resetTime < now) {
      store.delete(key)
    }
  }
}, 5 * 60 * 1000)

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
}

/**
 * Check rate limit for a given identifier
 * @param identifier - Unique identifier (e.g., IP address)
 * @param limit - Maximum requests allowed
 * @param windowMs - Time window in milliseconds
 */
export function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now()
  const entry = store.get(identifier)

  if (!entry || entry.resetTime < now) {
    // Create new entry
    store.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    })
    return {
      success: true,
      remaining: limit - 1,
      resetTime: now + windowMs,
    }
  }

  if (entry.count >= limit) {
    return {
      success: false,
      remaining: 0,
      resetTime: entry.resetTime,
    }
  }

  // Increment count
  entry.count++
  return {
    success: true,
    remaining: limit - entry.count,
    resetTime: entry.resetTime,
  }
}

/**
 * Rate limit configuration presets
 */
export const RATE_LIMITS = {
  // 100 requests per minute for view tracking
  views: { limit: 100, windowMs: 60 * 1000 },
  // 10 requests per minute for admin actions
  admin: { limit: 10, windowMs: 60 * 1000 },
  // 20 requests per minute for auth
  auth: { limit: 20, windowMs: 60 * 1000 },
} as const
