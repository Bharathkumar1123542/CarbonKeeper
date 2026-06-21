import type { Activity } from "@/lib/types";
import { calculateActivityEmissions } from "@/lib/agents/calculator";
import type { ParseResult } from "@/lib/agents/orchestrator";

/**
 * Builds an Activity object from parsed input data.
 *
 * @param rawInput - The original user input string.
 * @param parsed - The parsed activity data from the AI.
 * @param region - User's geographic region for emission calculations.
 * @returns A complete Activity object with computed emissions.
 *
 * @example
 * ```ts
 * const activity = buildActivity(
 *   "I drove 12km",
 *   { category: "transport", subCategory: "car", amount: 12 },
 *   "us-east"
 * );
 * ```
 */
export function buildActivity(
  rawInput: string,
  parsed: ParseResult,
  region: string,
): Activity {
  const data = calculateActivityEmissions(
    parsed.category ?? "transport",
    parsed.subCategory ?? "car",
    parsed.amount ?? 1,
    rawInput,
    region,
  );
  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    ...data,
  };
}
