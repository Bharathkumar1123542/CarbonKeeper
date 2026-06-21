import { getAIClient, generateContentSafe } from "@/lib/agents/client";
import { Activity } from "@/lib/types";
import { getRegionLabel } from "@/lib/emissions";
import { buildInsightPrompt } from "./prompts/insight.prompt";

/**
 * Generates a personalized carbon footprint insight based on activity history.
 * @param history - Array of user activities to analyze for today's emissions
 * @param budget - Daily carbon budget in kg CO₂
 * @param region - Optional region context for localized insight
 * @returns Promise resolving to an insight string, or empty string if generation fails
 */
export async function generateInsight(
  history: Activity[],
  budget: number,
  region?: string,
): Promise<string> {
  const ai = getAIClient();

  const todayEmissions = history.reduce((sum, a) => sum + a.co2e, 0);
  const percentage = Math.round((todayEmissions / budget) * 100);

  const regionContext = region
    ? `\nUser's Region: ${getRegionLabel(region)} — mention how their local context affects their footprint.`
    : "";

  const prompt = buildInsightPrompt(percentage, budget, todayEmissions, regionContext);

  const response = await generateContentSafe(ai, prompt);
  return response || "";
}
