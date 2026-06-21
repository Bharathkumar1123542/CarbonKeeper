import { NextResponse } from "next/server";
import { z } from "zod";
import { aiCache } from "@/lib/cache";
import { isAppError } from "@/lib/errors";

/**
 * Configuration options for creating an AI-powered API route.
 *
 * @typeParam TInput - The validated input type.
 * @typeParam TOutput - The output type from the AI handler.
 */
interface AIHandlerOptions<TInput, TOutput> {
  /** Zod schema for input validation. */
  schema: z.ZodSchema<TInput>;
  /** Prefix for cache keys. */
  cachePrefix: string;
  /** Function to generate cache key from input. */
  cacheKeyFn: (input: TInput) => Record<string, unknown>;
  /** Main AI handler function. */
  handler: (
    input: TInput,
    apiKey?: string,
  ) => Promise<TOutput | null | undefined>;
  /** Function to transform output for response. */
  responseFn: (output: TOutput | null | undefined) => Record<string, unknown>;
  /** Optional fallback handler when AI fails. */
  fallbackHandler?: (input: TInput) => TOutput | null | undefined;
  /** Optional custom error handler. */
  errorHandler?: (error: unknown) => { error: string; status: number } | null | undefined;
}

/**
 * Creates a standardized AI-powered API route with caching, validation, and error handling.
 *
 * @typeParam TInput - The validated input type.
 * @typeParam TOutput - The output type from the AI handler.
 * @param options - Configuration for the route.
 * @returns A Next.js API route handler.
 *
 * @example
 * ```ts
 * export const POST = createAIRoute({
 *   schema: parseInputSchema,
 *   cachePrefix: "parse",
 *   cacheKeyFn: (input) => ({ input: input.input }),
 *   handler: async (input) => parseInput(input.input),
 *   responseFn: (res) => ({ result: res }),
 * });
 * ```
 */
export function createAIRoute<TInput, TOutput>(
  options: AIHandlerOptions<TInput, TOutput>,
) {
  return async function POST(req: Request): Promise<NextResponse> {
    try {
      const body = await req.json();
      const validatedInput = options.schema.parse(body);
      const apiKeyOverride = req.headers.get("x-api-key") || undefined;

      const cacheKey = aiCache.generateKey(
        options.cachePrefix,
        options.cacheKeyFn(validatedInput),
      );
      const cached = aiCache.get(cacheKey) as TOutput | null | undefined;
      if (cached !== null && cached !== undefined) {
        return NextResponse.json(options.responseFn(cached));
      }

      let output: TOutput | null | undefined = await options.handler(validatedInput, apiKeyOverride);

      if (
        (output === null || output === undefined || output === "") &&
        options.fallbackHandler
      ) {
        output = options.fallbackHandler(validatedInput);
      }

      if (output !== null && output !== undefined && output !== "") {
        aiCache.set(cacheKey, output);
      }

      return NextResponse.json(options.responseFn(output));
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: "Invalid input data provided." },
          { status: 400 },
        );
      }
      if (isAppError(error)) {
        return NextResponse.json(error.toJSON(), { status: error.status });
      }
      if (options.errorHandler) {
        const routeError = options.errorHandler(error);
        if (routeError) {
          return NextResponse.json(
            { error: routeError.error },
            { status: routeError.status },
          );
        }
      }
      return NextResponse.json(
        { error: "An unexpected error occurred during processing." },
        { status: 500 },
      );
    }
  };
}