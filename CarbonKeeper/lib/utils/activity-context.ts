import type { Activity } from "@/lib/types";

/**
 * Formats an activity into a one-line summary string with amount, sub-category, and CO₂e.
 * @param activity - The activity to format.
 * @returns A short summary line such as "50km of car (8.5kg CO2)".
 */
export function formatActivitySummaryLine(activity: Activity): string {
  return `${activity.amount}${activity.unit} of ${activity.subCategory} (${activity.co2e}kg CO2)`;
}

/**
 * Formats an activity into a detailed one-line string including the real-world equivalent.
 * @param activity - The activity to format.
 * @returns A detailed line such as "50km of car (8.5kg CO₂ — equivalent)".
 */
export function formatActivityDetailLine(activity: Activity): string {
  return `${activity.amount}${activity.unit} of ${activity.subCategory} (${activity.co2e}kg CO₂ — ${activity.equivalent})`;
}

/**
 * Formats a list of activities using a provided formatter function.
 * @param activities - Array of activities to format.
 * @param formatter - Function that converts each activity into a string.
 * @param limit - Maximum number of recent activities to include (default 30).
 * @returns A newline-separated string of formatted activities, or "No activities logged yet." if empty.
 */
export function formatRecentActivities(
  activities: Activity[],
  formatter: (activity: Activity) => string,
  limit = 30,
): string {
  const recent = activities.slice(-limit);
  if (recent.length === 0) return "No activities logged yet.";
  return recent.map(formatter).join("\n");
}
