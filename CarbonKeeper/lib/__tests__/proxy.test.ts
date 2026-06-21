import type { NextRequest } from "next/server";
jest.mock("next/server", () => {
  class MockHeaders {
    private map = new Map<string, string>();
    get(name: string) { return this.map.get(name.toLowerCase()) || null; }
    set(name: string, value: string) { this.map.set(name.toLowerCase(), value); }
  }

  class MockNextResponse {
    status: number;
    body: unknown;
    headers: MockHeaders;

    constructor(body?: unknown, init?: { status?: number; headers?: Record<string, string> }) {
      this.body = body;
      this.status = init?.status || 200;
      this.headers = new MockHeaders();
      if (init?.headers) {
        for (const [k, v] of Object.entries(init.headers)) {
          this.headers.set(k, v);
        }
      }
    }

    static next() {
      return new MockNextResponse(null, { status: 200 });
    }

    static json(body: unknown, init?: { status?: number; headers?: Record<string, string> }) {
      return new MockNextResponse(JSON.stringify(body), init);
    }
  }

  return { NextResponse: MockNextResponse };
});

import { proxy } from "@/proxy";

interface MockedResponse {
  status: number;
  body: string | null;
  headers: {
    get(name: string): string | null;
    set(name: string, value: string): void;
  };
}

class MockNextRequest {
  nextUrl: { pathname: string };
  headers: {
    get(name: string): string | null;
  };

  constructor(pathname: string, headers: Record<string, string> = {}) {
    this.nextUrl = { pathname };
    const lowerHeaders = new Map<string, string>();
    for (const [k, v] of Object.entries(headers)) {
      lowerHeaders.set(k.toLowerCase(), v);
    }
    this.headers = {
      get: (name: string) => lowerHeaders.get(name.toLowerCase()) || null,
    };
  }
}

describe("Next.js 16 Edge Proxy (Rate Limiter)", () => {
  let originalDateNow: typeof Date.now;
  let mockTime = 1000000;

  beforeAll(() => {
    originalDateNow = Date.now;
    global.Date.now = () => mockTime;
  });

  afterAll(() => {
    global.Date.now = originalDateNow;
  });

  beforeEach(() => {
    mockTime = 1000000;
  });

  it("passes through non-API requests", () => {
    const req = new MockNextRequest("/dashboard") as unknown as NextRequest;
    const res = proxy(req) as unknown as MockedResponse;

    expect(res.status).toBe(200);
    expect(res.headers.get("X-RateLimit-Remaining")).toBeNull();
  });

  it("applies rate limiting for API requests and sets header", () => {
    const req = new MockNextRequest("/api/recommend") as unknown as NextRequest;

    let res = proxy(req) as unknown as MockedResponse;
    expect(res.status).toBe(200);
    expect(res.headers.get("X-RateLimit-Remaining")).toBe("29");

    res = proxy(req) as unknown as MockedResponse;
    expect(res.status).toBe(200);
    expect(res.headers.get("X-RateLimit-Remaining")).toBe("28");
  });

  it("respects x-forwarded-for client IP separating limits", () => {
    const req1 = new MockNextRequest("/api/recommend", { "x-forwarded-for": "1.2.3.4" }) as unknown as NextRequest;
    const req2 = new MockNextRequest("/api/recommend", { "x-forwarded-for": "5.6.7.8" }) as unknown as NextRequest;

    const res1 = proxy(req1) as unknown as MockedResponse;
    expect(res1.headers.get("X-RateLimit-Remaining")).toBe("29");

    const res2 = proxy(req2) as unknown as MockedResponse;
    expect(res2.headers.get("X-RateLimit-Remaining")).toBe("29");
  });

  it("triggers 429 after limit exceeded", () => {
    const req = new MockNextRequest("/api/recommend", { "x-forwarded-for": "9.9.9.9" }) as unknown as NextRequest;

    for (let i = 0; i < 30; i++) {
      const res = proxy(req) as unknown as MockedResponse;
      expect(res.status).toBe(200);
    }

    const res = proxy(req) as unknown as MockedResponse;
    expect(res.status).toBe(429);
    expect(JSON.parse(res.body || "{}")).toEqual({ error: "Too Many Requests" });
  });

  it("resets rate limit counter after window passes", () => {
    const req = new MockNextRequest("/api/recommend", { "x-forwarded-for": "8.8.8.8" }) as unknown as NextRequest;

    let res = proxy(req) as unknown as MockedResponse;
    expect(res.headers.get("X-RateLimit-Remaining")).toBe("29");

    mockTime += 61000;

    res = proxy(req) as unknown as MockedResponse;
    expect(res.headers.get("X-RateLimit-Remaining")).toBe("29");
  });
});
