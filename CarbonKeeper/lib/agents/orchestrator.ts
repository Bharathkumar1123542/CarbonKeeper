import type { z } from "zod";
import { getAIClient, generateContentSafe } from "@/lib/agents/client";
import { getRegionLabel } from "@/lib/emissions";
import { parseOutputSchema } from "@/lib/schemas/parse";
import { buildParsePrompt } from "./prompts/parse.prompt";

/**
 * Partial result from parsing natural language input into structured activity data.
 * Fields are optional as the parser may not extract all information.
 */
export type ParseResult = Partial<z.infer<typeof parseOutputSchema>>;

/**
 * Parses a natural language input string into structured activity data using the AI agent.
 * Handles graceful fallbacks and strict Zod validation on the output.
 * 
 * @param input - The raw natural language input (e.g., "drove 10 miles").
 * @param region - Optional region context to improve AI categorization.
 * @returns A Promise resolving to a strongly-typed ParseResult.
 */
export async function parseNaturalLanguage(
  input: string,
  region?: string,
): Promise<ParseResult> {
  const ai = getAIClient();

  const regionContext = region
    ? `User's Region: ${getRegionLabel(region)}`
    : "";

  const prompt = buildParsePrompt(input, regionContext);

  const text = await generateContentSafe(ai, prompt);
  if (!text) return {};

  try {
    const parsed = JSON.parse(text);
    const result = parseOutputSchema.safeParse(parsed);
    if (result.success) {
      return result.data;
    }
    return {};
  } catch {
    return {};
  }
}
