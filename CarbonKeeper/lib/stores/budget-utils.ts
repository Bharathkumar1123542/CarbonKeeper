import { computeDailyFootprint, computeWeeklyTrend } from "@/lib/compute";
import type { Activity } from "@/lib/types";

/**
 * Recalculates carbon budget metrics based on activities and daily budget.
 * @param activities - Array of user activities to compute footprint from
 * @param budget - Daily carbon budget in kg CO₂
 * @returns Object containing dailyFootprint, budgetUsed percentage, and weeklyTrend data
 */
export function recalculateBudget(activities: Activity[], budget: number) {
  const daily = computeDailyFootprint(activities);
  return {
    dailyFootprint: daily,
    budgetUsed: Math.min((daily / budget) * 100, 100),
    weeklyTrend: computeWeeklyTrend(activities),
  };
}
