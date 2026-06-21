import { getAIClient, generateContentSafe } from "@/lib/agents/client";
import { Activity, Recommendation } from "@/lib/types";
import { getRegionLabel } from "@/lib/emissions";
import { recommendationArraySchema } from "@/lib/schemas/recommend";
import {
  formatActivitySummaryLine,
  formatRecentActivities,
} from "@/lib/utils/activity-context";
import { buildRecommendPrompt } from "./prompts/recommend.prompt";

/**
 * Generates personalized carbon-reduction recommendations based on user activities.
 * @param activities - Array of recent user activities to analyze
 * @param region - Optional region context for localized recommendations
 * @returns Promise resolving to an array of Recommendation objects, or empty array if none generated
 */
export async function getRecommendations(
  activities: Activity[],
  region?: string,
): Promise<Recommendation[]> {
  if (activities.length === 0) return [];

  const ai = getAIClient();

  const activitiesContext = formatRecentActivities(
    activities,
    formatActivitySummaryLine,
  );

  const regionContext = region
    ? `\nUser's Region: ${getRegionLabel(region)} — factor this into your recommendations (e.g., grid mix, transit availability, local food systems).`
    : "";

  const prompt = buildRecommendPrompt(activitiesContext, regionContext);

  const text = await generateContentSafe(ai, prompt);
  if (!text) return [];

  try {
    const parsed = JSON.parse(text);
    const result = recommendationArraySchema.safeParse(parsed);
    if (result.success) {
      return result.data;
    }
    return [];
  } catch {
    return [];
  }
}
