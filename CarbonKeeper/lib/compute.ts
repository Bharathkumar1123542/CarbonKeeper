import { startOfDay, subDays, format } from "date-fns";
import type { Activity } from "@/lib/types";

/**
 * A single entry in a category breakdown, mapping a category name to its total CO2e value.
 */
export interface CategoryBreakdownEntry {
  name: string;
  value: number;
}

/**
 * Computes the CO2e trend for each day of the past week.
 *
 * @param activities - Array of activity records to aggregate.
 * @returns An array of `{ date, value }` objects representing daily CO2e totals for the last 7 days.
 * @example
 * ```ts
 * const trend = computeWeeklyTrend(activities);
 * // [{ date: "Mon", value: 1.2 }, { date: "Tue", value: 0.8 }, ...]
 * ```
 */
export function computeWeeklyTrend(activities: Activity[]) {
  const today = startOfDay(new Date());
  const buckets: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const day = subDays(today, i);
    const key = format(day, "EEE");
    buckets[key] = 0;
  }
  for (const activity of activities) {
    const day = startOfDay(new Date(activity.timestamp));
    const key = format(day, "EEE");
    if (key in buckets) {
      buckets[key] += activity.co2e;
    }
  }
  return Object.entries(buckets).map(([date, value]) => ({ date, value }));
}

/**
 * Sums the CO2e of all activities recorded today.
 *
 * @param activities - Array of activity records to filter and sum.
 * @returns The total CO2e (kg) for today's activities.
 * @example
 * ```ts
 * const todayTotal = computeDailyFootprint(activities);
 * // 3.45
 * ```
 */
export function computeDailyFootprint(activities: Activity[]) {
  const today = startOfDay(new Date());
  return activities
    .filter(
      (a) => startOfDay(new Date(a.timestamp)).getTime() === today.getTime(),
    )
    .reduce((sum, a) => sum + a.co2e, 0);
}

/**
 * Groups activities by category and sums their CO2e values.
 *
 * @param activities - Array of activity records to group.
 * @returns An array of `{ name, value }` entries, one per unique category.
 * @example
 * ```ts
 * const breakdown = computeCategoryBreakdown(activities);
 * // [{ name: "energy", value: 12.5 }, { name: "travel", value: 8.3 }]
 * ```
 */
export function computeCategoryBreakdown(
  activities: Activity[],
): CategoryBreakdownEntry[] {
  return activities.reduce<CategoryBreakdownEntry[]>((acc, curr) => {
    const existing = acc.find((item) => item.name === curr.category);
    if (existing) {
      existing.value += curr.co2e;
    } else {
      acc.push({ name: curr.category, value: curr.co2e });
    }
    return acc;
  }, []);
}
