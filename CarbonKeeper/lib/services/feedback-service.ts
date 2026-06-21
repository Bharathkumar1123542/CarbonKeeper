import type { Activity, Recommendation } from "@/lib/types";

/**
 * Result of fetching AI feedback (recommendations and insights).
 */
export interface AIFeedbackResult {
  /** Whether recommendations were successfully updated. */
  recommendationsUpdated: boolean;
  /** Whether the insight was successfully updated. */
  insightUpdated: boolean;
  /** Error message if the request failed. */
  error?: string;
}

/**
 * Fetches personalized AI recommendations and insights in parallel.
 *
 * @param history - Array of user's logged activities.
 * @param region - User's geographic region.
 * @param budget - User's daily carbon budget in kg CO₂e.
 * @param onRecommendations - Callback to update recommendations state.
 * @param onInsight - Callback to update insight state.
 * @returns Result indicating which updates succeeded.
 *
 * @example
 * ```ts
 * const result = await fetchAIFeedback(
 *   activities,
 *   "us-east",
 *   10,
 *   setRecommendations,
 *   setInsight
 * );
 * if (result.error) console.error(result.error);
 * ```
 */
export async function fetchAIFeedback(
  history: Activity[],
  region: string,
  budget: number,
  onRecommendations: (recommendations: Recommendation[]) => void,
  onInsight: (insight: string) => void,
): Promise<AIFeedbackResult> {
  try {
    const [recRes, insRes] = await Promise.all([
      fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history, region }),
      }),
      fetch("/api/insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history, budget, region }),
      }),
    ]);

    let recommendationsUpdated = false;
    let insightUpdated = false;

    if (recRes.ok) {
      const data = await recRes.json();
      if (data.recommendations?.length) {
        onRecommendations(data.recommendations);
        recommendationsUpdated = true;
      }
    }
    if (insRes.ok) {
      const data = await insRes.json();
      if (data.insight) {
        onInsight(data.insight);
        insightUpdated = true;
      }
    }

    return { recommendationsUpdated, insightUpdated };
  } catch (error) {
    return {
      recommendationsUpdated: false,
      insightUpdated: false,
      error: error instanceof Error ? error.message : "AI feedback request failed",
    };
  }
}
