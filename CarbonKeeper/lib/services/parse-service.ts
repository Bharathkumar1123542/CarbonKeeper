import type { ParseResult } from "@/lib/agents/orchestrator";

/**
 * Parses natural language input into structured activity data.
 *
 * @param input - Raw user input (e.g., "I drove 20 miles").
 * @param region - User's geographic region for context.
 * @returns Parsed activity data with category, subcategory, and amount.
 * @throws {Error} If the API request fails.
 *
 * @example
 * ```ts
 * const result = await parseActivity("I drove 12km", "us-east");
 * // { category: "transport", subCategory: "car", amount: 12 }
 * ```
 */
export async function parseActivity(
  input: string,
  region: string,
): Promise<ParseResult> {
  const res = await fetch("/api/parse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input, region }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to parse input");
  }
  return res.json();
}
