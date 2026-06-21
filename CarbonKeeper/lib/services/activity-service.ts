import type { Activity, Recommendation } from "@/lib/types";
import { parseActivity } from "./parse-service";
import { buildActivity } from "./activity-builder";
import { fetchAIFeedback } from "./feedback-service";

/**
 * Dependencies required for logging an activity.
 */
export interface LogActivityDeps {
  /** User's geographic region. */
  region: string;
  /** Daily carbon budget in kg CO₂e. */
  dailyBudget: number;
  /** Array of previously logged activities. */
  activities: Activity[];
  /** Callback to add a new activity to state. */
  addActivity: (activity: Activity) => void;
  /** Callback to update recommendations. */
  setRecommendations: (recommendations: Recommendation[]) => void;
  /** Callback to update the current insight. */
  setInsight: (insight: string) => void;
}

/**
 * Orchestrates logging a new carbon activity.
 *
 * Parses user input, calculates emissions, stores the activity,
 * and asynchronously fetches AI recommendations and insights.
 *
 * @param input - Raw natural language input (e.g., "I drove 20 miles").
 * @param deps - Injected dependencies for state management.
 * @returns Promise that resolves when the activity is logged.
 *
 * @example
 * ```ts
 * await logActivityWithDeps("I drove 12km", {
 *   region: "us-east",
 *   dailyBudget: 10,
 *   activities: [],
 *   addActivity: setState,
 *   setRecommendations: setRecs,
 *   setInsight: setInsight,
 * });
 * ```
 */
export async function logActivityWithDeps(
  input: string,
  deps: LogActivityDeps,
): Promise<void> {
  const parsed = await parseActivity(input, deps.region);
  const activity = buildActivity(input, parsed, deps.region);

  deps.addActivity(activity);

  const updatedHistory = [...deps.activities, activity];
  void fetchAIFeedback(
    updatedHistory,
    deps.region,
    deps.dailyBudget,
    deps.setRecommendations,
    deps.setInsight,
  );
}
