/**
 * Custom error class for application-specific errors.
 * Provides structured error handling for API routes and services.
 *
 * @example
 * ```ts
 * throw new AppError("Invalid input", 400);
 * throw new AppError("AI service unavailable", 502);
 * ```
 */
export class AppError extends Error {
  /** HTTP status code for the error. */
  public readonly status: number;

  /** Optional error code for programmatic handling. */
  public readonly code?: string;

  /**
   * Creates a new AppError.
   *
   * @param message - Human-readable error message.
   * @param status - HTTP status code (default: 500).
   * @param code - Optional error code for programmatic handling.
   */
  constructor(message: string, status = 500, code?: string) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
  }

  /**
   * Converts the error to a JSON-serializable object.
   *
   * @returns Object containing error message, status, and optional code.
   */
  toJSON() {
    return {
      error: this.message,
      status: this.status,
      code: this.code,
    };
  }
}

/**
 * Checks if an error is an AppError instance.
 *
 * @param error - The error to check.
 * @returns True if the error is an AppError.
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}
