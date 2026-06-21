/**
 * localStorage key constants used for persisting activities, budget, and region settings.
 */
export const STORAGE_KEYS = {
  ACTIVITIES: "CARBON_ACTIVITIES",
  BUDGET: "CARBON_BUDGET",
  REGION: "CARBON_REGION",
} as const;

/**
 * Default application values for carbon budget and region.
 */
export const DEFAULTS = {
  DAILY_BUDGET: 10,
  REGION: "global",
} as const;