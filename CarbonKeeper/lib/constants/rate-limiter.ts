/** Default maximum number of requests allowed per time window. */
export const DEFAULT_LIMIT = 30;

/** Default rate-limiting time window in milliseconds (1 minute). */
export const DEFAULT_WINDOW_MS = 60_000;

/** Interval in milliseconds between automatic cleanup of expired rate-limit entries (10 minutes). */
export const CLEANUP_INTERVAL_MS = 600_000;