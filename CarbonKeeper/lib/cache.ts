import { CACHE_CLEANUP_INTERVAL_MS, CACHE_TTL_MS } from "@/lib/constants/cache";

/**
 * A generic in-memory cache with TTL-based expiration and automatic cleanup.
 *
 * @typeParam T - The type of values stored in the cache.
 */
class AICache<T = unknown> {
  private cache = new Map<string, { value: T; timestamp: number }>();
  private readonly TTL_MS: number;
  private cleanupInterval: ReturnType<typeof setInterval> | null = null;

  /**
   * Creates a new AICache instance.
   *
   * @param ttlMs - Time-to-live in milliseconds for cached entries. Defaults to `CACHE_TTL_MS`.
   */
  constructor(ttlMs = CACHE_TTL_MS) {
    this.TTL_MS = ttlMs;
  }

  private ensureCleanup(): void {
    if (this.cleanupInterval !== null) return;
    if (typeof process !== "undefined" && process.env.NODE_ENV === "test")
      return;

    this.cleanupInterval = setInterval(
      () => this.evictStale(),
      CACHE_CLEANUP_INTERVAL_MS,
    );
    if (this.cleanupInterval.unref) this.cleanupInterval.unref();
  }

  private evictStale(): void {
    const cutoff = Date.now() - this.TTL_MS;
    for (const [key, entry] of this.cache) {
      if (entry.timestamp < cutoff) this.cache.delete(key);
    }
  }

  /**
   * Retrieves a cached value by key, returning null if missing or expired.
   *
   * @param key - The cache key to look up.
   * @returns The cached value, or `null` if not found or expired.
   * @example
   * ```ts
   * const value = aiCache.get("myKey");
   * ```
   */
  get(key: string): T | null {
    this.ensureCleanup();
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() - item.timestamp > this.TTL_MS) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  /**
   * Stores a value in the cache with the given key.
   *
   * @param key - The cache key.
   * @param value - The value to cache.
   * @example
   * ```ts
   * aiCache.set("myKey", { result: 42 });
   * ```
   */
  set(key: string, value: T): void {
    this.ensureCleanup();
    this.cache.set(key, { value, timestamp: Date.now() });
  }

  /**
   * Generates a deterministic cache key from a prefix and a request body object.
   *
   * @param prefix - A string prefix to namespace the key (e.g. endpoint name).
   * @param body - The request body to serialize into the key.
   * @returns A string key composed of the prefix and JSON-serialized body.
   * @example
   * ```ts
   * const key = aiCache.generateKey("recommend", { prompt: "hello" });
   * // 'recommend_{"prompt":"hello"}'
   * ```
   */
  generateKey(prefix: string, body: Record<string, unknown>): string {
    return prefix + "_" + JSON.stringify(body);
  }

  /**
   * Removes all entries from the cache.
   *
   * @example
   * ```ts
   * aiCache.clear();
   * ```
   */
  clear(): void {
    this.cache.clear();
  }
}

/**
 * Singleton AI cache instance used for caching AI request results.
 */
export const aiCache = new AICache();
