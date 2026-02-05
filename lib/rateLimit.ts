import "server-only";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

/* =========================
   TYPES
========================= */

type RateLimitConfig = {
  key: string;
  limit: number;
  windowSec: number;
};

type RateLimitResult = {
  success: boolean;
  remaining: number;
  reset: number;
};

/* =========================
   REDIS (SAFE INIT)
========================= */

const redis =
  process.env.UPSTASH_REDIS_REST_URL?.startsWith("https://") &&
  process.env.UPSTASH_REDIS_REST_TOKEN &&
  !process.env.UPSTASH_REDIS_REST_URL.includes("your_")
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

/* =========================
   RATELIMITER CACHE
========================= */

const ratelimitCache = new Map<string, Ratelimit>();

function getRateLimiter(limit: number, windowSec: number): Ratelimit {
  const key = `${limit}:${windowSec}`;
  const cached = ratelimitCache.get(key);
  if (cached) return cached;

  const rl = new Ratelimit({
    redis: redis!, // only called when redis exists
    limiter: Ratelimit.slidingWindow(limit, `${windowSec}s`),
    analytics: true,
  });

  ratelimitCache.set(key, rl);
  return rl;
}

/* =========================
   HELPERS
========================= */

export function getClientIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || "unknown";

  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp;

  return "unknown";
}

/* =========================
   PUBLIC API
========================= */

export async function checkRateLimit(
  cfg: RateLimitConfig
): Promise<{
  ok: boolean;
  remaining: number;
  resetMs: number;
}> {
  // 🔓 FAIL-OPEN if Redis is not configured
  if (!redis) {
    return {
      ok: true,
      remaining: cfg.limit,
      resetMs: Date.now() + cfg.windowSec * 1000,
    };
  }

  const rl = getRateLimiter(cfg.limit, cfg.windowSec);
  const res = (await rl.limit(cfg.key)) as RateLimitResult;

  return {
    ok: res.success,
    remaining: res.remaining,
    resetMs: res.reset,
  };
}
