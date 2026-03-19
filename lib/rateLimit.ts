import "server-only";

import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { NextResponse } from "next/server";

/* =========================
   TYPES
========================= */

export type RateLimitConfig = {
  key: string;
  limit: number;
  windowSec: number;
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

function getRateLimiter(
  limit: number,
  windowSec: number
): Ratelimit | null {
  if (!redis) return null;

  const cacheKey = `${limit}:${windowSec}`;
  const cached = ratelimitCache.get(cacheKey);
  if (cached) return cached;

  const rl = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, `${windowSec}s`),
    analytics: true,
  });

  ratelimitCache.set(cacheKey, rl);
  return rl;
}

/* =========================
   IP EXTRACTION (PRODUCTION SAFE)
========================= */

export function getClientIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }

  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp;

  return "unknown";
}

/* =========================
   LOW-LEVEL CHECK
========================= */

export async function checkRateLimit(
  cfg: RateLimitConfig
): Promise<{
  ok: boolean;
  remaining: number;
  resetMs: number;
}> {
  // 🔓 FAIL-OPEN if Redis not configured
  if (!redis) {
    return {
      ok: true,
      remaining: cfg.limit,
      resetMs: Date.now() + cfg.windowSec * 1000,
    };
  }

  const rl = getRateLimiter(cfg.limit, cfg.windowSec);
  if (!rl) {
    return {
      ok: true,
      remaining: cfg.limit,
      resetMs: Date.now() + cfg.windowSec * 1000,
    };
  }

  try {
    const result = await rl.limit(cfg.key);

    return {
      ok: result.success,
      remaining: result.remaining,
      resetMs: result.reset,
    };
  } catch (err) {
    // 🔓 FAIL-OPEN on Redis network errors
    console.error("Rate limit check failed:", err);

    return {
      ok: true,
      remaining: cfg.limit,
      resetMs: Date.now() + cfg.windowSec * 1000,
    };
  }
}

/* =========================
   IP KEY BUILDER
========================= */

export function buildIpRateLimitKey(
  headers: Headers,
  routeKey: string
): string {
  const ip = getClientIp(headers);
  return `ip:${ip}:${routeKey}`;
}

/* =========================
   STANDARD 429 RESPONSE
========================= */

function buildRateLimitResponse(
  remaining: number,
  resetMs: number
): NextResponse {
  const retryAfterSec = Math.max(
    1,
    Math.ceil((resetMs - Date.now()) / 1000)
  );

  const res = NextResponse.json(
    { error: "Too many requests" },
    { status: 429 }
  );

  res.headers.set("Retry-After", retryAfterSec.toString());
  res.headers.set("X-RateLimit-Remaining", remaining.toString());
  res.headers.set("X-RateLimit-Reset", resetMs.toString());

  return res;
}

/* =========================
   HIGH-LEVEL IP ENFORCER
========================= */

export async function enforceIpRateLimit(opts: {
  headers: Headers;
  routeKey: string;
  limit: number;
  windowSec: number;
}): Promise<
  { allowed: true } | { allowed: false; response: NextResponse }
> {
  const key = buildIpRateLimitKey(opts.headers, opts.routeKey);

  const result = await checkRateLimit({
    key,
    limit: opts.limit,
    windowSec: opts.windowSec,
  });

  if (!result.ok) {
    return {
      allowed: false,
      response: buildRateLimitResponse(
        result.remaining,
        result.resetMs
      ),
    };
  }

  return { allowed: true };
}

/* =========================
   STRIPE INVALID SIGNATURE LIMITER
========================= */

export async function rateLimitInvalidStripeAttempt(
  req: Request
): Promise<NextResponse | null> {
  const enforcement = await enforceIpRateLimit({
    headers: req.headers,
    routeKey: "stripe:webhook:invalid",
    limit: 30,
    windowSec: 60,
  });

  if (!enforcement.allowed) {
    return enforcement.response;
  }

  return null;
}
