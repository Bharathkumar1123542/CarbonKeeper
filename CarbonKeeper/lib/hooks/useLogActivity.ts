"use client";

import { useCallback } from "react";
import { logActivityWithDeps } from "@/lib/services/activity-service";
import { useActivityStore } from "@/lib/stores/activity-store";
import { useAIStore } from "@/lib/stores/ai-store";
import { useSettingsStore } from "@/lib/stores/settings-store";

/**
 * Custom React hook that wraps the logActivityWithDeps service call with store dependencies.
 * Provides a stable callback to log a new activity from user text input.
 * @returns A memoized function that accepts a string input and logs the activity via the activity service.
 */
export function useLogActivity() {
  const region = useSettingsStore((s) => s.region);
  const dailyBudget = useSettingsStore((s) => s.dailyBudget);
  const activities = useActivityStore((s) => s.activities);
  const addActivity = useActivityStore((s) => s.addActivity);
  const setRecommendations = useAIStore((s) => s.setRecommendations);
  const setInsight = useAIStore((s) => s.setInsight);

  return useCallback(
    (input: string) =>
      logActivityWithDeps(input, {
        region,
        dailyBudget,
        activities,
        addActivity,
        setRecommendations,
        setInsight,
      }),
    [
      region,
      dailyBudget,
      activities,
      addActivity,
      setRecommendations,
      setInsight,
    ],
  );
}
