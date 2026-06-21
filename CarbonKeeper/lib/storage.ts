import { Activity } from "@/lib/types";
import { activitiesArraySchema } from "@/lib/schemas/activity";
import { DEFAULT_REGION } from "@/lib/emissions";
import { STORAGE_KEYS, DEFAULTS } from "@/lib/constants/storage";

/**
 * Retrieves the user's selected region from localStorage.
 *
 * @returns The stored region key, or the default region if none is set.
 * @example
 * ```ts
 * const region = getRegion();
 * // "US"
 * ```
 */
export function getRegion(): string {
  if (typeof window === "undefined") return DEFAULT_REGION;
  return localStorage.getItem(STORAGE_KEYS.REGION) || DEFAULT_REGION;
}

/**
 * Persists the user's selected region to localStorage.
 *
 * @param region - The region key to store (e.g. "US", "DE").
 * @example
 * ```ts
 * setRegion("DE");
 * ```
 */
export function setRegion(region: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.REGION, region);
}

/**
 * Reads the stored activities array from localStorage, validated against the activity schema.
 *
 * @returns A validated array of Activity objects, or an empty array if none exist or parsing fails.
 * @example
 * ```ts
 * const activities = getActivities();
 * // [{ id: "abc", category: "energy", co2e: 1.2, ... }]
 * ```
 */
export function getActivities(): Activity[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const result = activitiesArraySchema.safeParse(parsed);
    return result.success ? result.data : [];
  } catch {
    return [];
  }
}

/**
 * Persists an array of activities to localStorage as JSON.
 *
 * @param activities - The activity array to store.
 * @example
 * ```ts
 * setActivities([{ id: "abc", category: "energy", co2e: 1.2 }]);
 * ```
 */
export function setActivities(activities: Activity[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
}

/**
 * Removes all stored activities from localStorage.
 *
 * @example
 * ```ts
 * clearStoredActivities();
 * ```
 */
export function clearStoredActivities(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
}

/**
 * Retrieves the user's daily CO2e budget from localStorage.
 *
 * @returns The stored budget in kg CO2e, or the default budget if none is set or the value is invalid.
 * @example
 * ```ts
 * const budget = getBudget();
 * // 20
 * ```
 */
export function getBudget(): number {
  if (typeof window === "undefined") return DEFAULTS.DAILY_BUDGET;
  const raw = localStorage.getItem(STORAGE_KEYS.BUDGET);
  if (!raw) return DEFAULTS.DAILY_BUDGET;
  const val = parseFloat(raw);
  return isNaN(val) || val <= 0 ? DEFAULTS.DAILY_BUDGET : val;
}

/**
 * Persists the user's daily CO2e budget to localStorage.
 *
 * @param budget - The budget value in kg CO2e.
 * @example
 * ```ts
 * setBudget(15);
 * ```
 */
export function setBudget(budget: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.BUDGET, String(budget));
}
