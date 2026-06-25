/**
 * Simple in-memory rate limiter for Next.js API routes.
 * Suitable for single-instance deployments (Vercel serverless per-region).
 * For multi-region scale, swap the Map with Upstash Redis.
 */

interface RateEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateEntry>()

interface RateLimitOptions {
  /** Identifier key (e.g. IP address) */
  key: string
  /** Max requests allowed per window */
  limit: number
  /** Window duration in milliseconds */
  windowMs: number
}

interface RateLimitResult {
  success: boolean
  remaining: number
  resetAt: number
}

export function rateLimit({ key, limit, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    // Fresh window
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { success: true, remaining: limit - 1, resetAt: now + windowMs }
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count++
  return { success: true, remaining: limit - entry.count, resetAt: entry.resetAt }
}

/**
 * Extract a best-effort IP from the request headers.
 * Vercel forwards the real IP in `x-forwarded-for`.
 */
export function getIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return 'unknown'
}
