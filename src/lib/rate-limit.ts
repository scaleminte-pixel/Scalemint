/**
 * Simple in-memory rate limiter for API endpoints.
 * Suitable for single-instance deployments (PM2 single instance).
 * For multi-instance, replace with Redis-backed solution.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup stale entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  store.forEach((entry, key) => {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  });
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  /** Max number of requests allowed in the window */
  maxRequests: number;
  /** Window duration in seconds */
  windowSeconds: number;
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  const key = identifier;
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    // First request or window expired
    store.set(key, {
      count: 1,
      resetAt: now + config.windowSeconds * 1000,
    });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (entry.count < config.maxRequests) {
    entry.count++;
    return { allowed: true, retryAfterSeconds: 0 };
  }

  // Rate limit exceeded
  const retryAfterSeconds = Math.ceil((entry.resetAt - now) / 1000);
  return { allowed: false, retryAfterSeconds };
}

/**
 * Extract client IP from request headers.
 * Works behind reverse proxies (nginx, Cloudflare, etc.)
 */
export function getClientIp(request: Request): string {
  const headers = new Headers(request.headers);
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    headers.get('cf-connecting-ip') ||
    'unknown'
  );
}
