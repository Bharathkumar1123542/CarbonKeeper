import type { z } from "zod";
import type { parseOutputSchema } from "@/lib/schemas/parse";
import type { ActivityCategory } from "@/lib/types";

/**
 * Output type for the parse schema, representing structured activity data extracted from natural language.
 */
type ParseOutput = z.infer<typeof parseOutputSchema>;

const KEYWORD_MAP: [RegExp, ActivityCategory, string][] = [
  [/drove|driving|drive|car/i, "transport", "car"],
  [/flew|flight|flying|plane/i, "transport", "flight"],
  [/bus|buss/i, "transport", "bus"],
  [/train|rail|subway|metro/i, "transport", "train"],
  [/bike|biking|bicycle|cycling|cycle/i, "transport", "bike"],
  [/walk|walking|walked/i, "transport", "bike"],
  [/beef|steak|burger|hamburger/i, "food", "beef"],
  [/chicken|poultry/i, "food", "chicken"],
  [/pork|bacon|ham|sausage/i, "food", "pork"],
  [/vegetable|veggie|salad|carrot|broccoli/i, "food", "vegetables"],
  [/rice|grain|cereal/i, "food", "rice"],
  [/electricity|grid|power|energy|electric/i, "energy", "grid_avg"],
  [/solar|renewable/i, "energy", "solar"],
  [/laptop|computer|macbook/i, "shopping", "new_laptop"],
  [/t.?shirt|shirt|tshirt/i, "shopping", "tshirt"],
  [/jeans|denim|pant/i, "shopping", "jeans"],
];

function extractAmount(input: string): number | null {
  const match = input.match(/(\d+[,.]?\d*)\s*(km|kms|kg|kgs|kwh|item|items|hr|hrs|hour|hours)?/i);
  if (match) return parseFloat(match[1].replace(",", ""));
  return null;
}

/**
 * Fallback parser that extracts activity data from natural language using keyword matching.
 * Used when AI parsing fails or is unavailable.
 * @param input - Natural language input string to parse
 * @returns ParseOutput with extracted category, subCategory, and amount
 */
export function parseFallback(input: string): ParseOutput {
  const amount = extractAmount(input) || 1;

  for (const [pattern, cat, sub] of KEYWORD_MAP) {
    if (pattern.test(input)) {
      return { category: cat, subCategory: sub, amount };
    }
  }

  return { category: "transport", subCategory: "car", amount };
}
