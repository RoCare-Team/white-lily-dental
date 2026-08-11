/**
 * Minimal in-memory sliding-window limiter.
 *
 * Per-process only — good enough to blunt form spam and password guessing on a
 * single server. Behind several instances each gets its own counter; move to a
 * shared store (Redis / an Atlas TTL collection) if that becomes a problem.
 */

const buckets = new Map();

export function rateLimit(key, { limit, windowMs }) {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);

  if (hits.length >= limit) {
    buckets.set(key, hits);
    return {
      ok: false,
      retryAfter: Math.ceil((hits[0] + windowMs - now) / 1000),
    };
  }

  hits.push(now);
  buckets.set(key, hits);

  // Opportunistic cleanup so the map does not grow without bound.
  if (buckets.size > 5000) {
    for (const [k, times] of buckets) {
      if (times.every((t) => now - t >= windowMs)) buckets.delete(k);
    }
  }

  return { ok: true };
}

/** Best-effort client IP from the proxy headers Vercel/Nginx set. */
export function clientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}
