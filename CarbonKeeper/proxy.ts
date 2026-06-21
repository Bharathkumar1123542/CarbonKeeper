import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { DEFAULT_LIMIT, DEFAULT_WINDOW_MS, CLEANUP_INTERVAL_MS } from "@/lib/constants/rate-limiter";

interface RateLimitEntry {
  count: number;
  lastReset: number;
}

function createRateLimiter(
  windowMs = DEFAULT_WINDOW_MS,
  limit = DEFAULT_LIMIT,
) {
  const rateLimitMap = new Map<string, RateLimitEntry>();
  let cleanupInterval: ReturnType<typeof setInterval> | null = null;

  const ensureCleanup = () => {
    if (cleanupInterval !== null) return;
    if (typeof process !== "undefined" && process.env.NODE_ENV === "test") return;

    cleanupInterval = setInterval(() => {
      const cutoff = Date.now() - windowMs;
      for (const [key, entry] of rateLimitMap) {
        if (entry.lastReset < cutoff) rateLimitMap.delete(key);
      }
    }, CLEANUP_INTERVAL_MS);

    if (cleanupInterval.unref) cleanupInterval.unref();
  };

  return function rateLimitHandler(req: NextRequest): Response {
    ensureCleanup();

    if (!req.nextUrl.pathname.startsWith("/api/")) return NextResponse.next();

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "127.0.0.1";
    const now = Date.now();

    const record = rateLimitMap.get(ip);
    if (!record || now - record.lastReset > windowMs) {
      rateLimitMap.set(ip, { count: 1, lastReset: now });
      const res = NextResponse.next();
      res.headers.set("X-RateLimit-Remaining", String(limit - 1));
      return res;
    }

    record.count++;
    const res = NextResponse.next();
    res.headers.set("X-RateLimit-Remaining", String(Math.max(0, limit - record.count)));

    if (record.count > limit) {
      return new NextResponse(JSON.stringify({ error: "Too Many Requests" }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      });
    }

    return res;
  };
}

const rateLimitHandler = createRateLimiter();

export function proxy(req: NextRequest) {
  return rateLimitHandler(req);
}

export const config = {
  matcher: ["/api/:path*"],
};
