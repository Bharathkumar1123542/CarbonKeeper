import { create } from "zustand";
import type { Activity } from "@/lib/types";
import { activitiesArraySchema } from "@/lib/schemas/activity";
import {
  getActivities,
  getBudget,
  setActivities,
  clearStoredActivities,
} from "@/lib/storage";
import { recalculateBudget } from "./budget-utils";

/**
 * State interface for the activity store.
 * @property activities - List of all recorded activities
 * @property dailyFootprint - Today's carbon footprint in kg CO₂
 * @property budgetUsed - Percentage of daily carbon budget used
 * @property weeklyTrend - Array of daily footprint values for the past week
 * @property dailyBudget - Daily carbon budget in kg CO₂
 * @property addActivity - Adds a new activity and recalculates metrics
 * @property clearActivities - Clears all activities and resets metrics
 * @property loadSampleData - Loads sample activities from JSON file
 * @property recalculate - Recalculates metrics with a new budget value
 */
interface ActivityState {
  activities: Activity[];
  dailyFootprint: number;
  budgetUsed: number;
  weeklyTrend: { date: string; value: number }[];
  dailyBudget: number;
  addActivity: (activity: Activity) => void;
  clearActivities: () => void;
  loadSampleData: () => Promise<void>;
  recalculate: (budget: number) => void;
}

const initialActivities = getActivities();
const initialBudget = getBudget();
const initialMetrics = recalculateBudget(initialActivities, initialBudget);

/**
 * Zustand store for managing user activity data and carbon footprint metrics.
 * Provides methods to add, clear, and load activities, as well as recalculate budget metrics.
 * @returns A Zustand store hook for accessing and modifying activity state
 */
export const useActivityStore = create<ActivityState>((set) => ({
  activities: initialActivities,
  dailyFootprint: initialMetrics.dailyFootprint,
  budgetUsed: initialMetrics.budgetUsed,
  weeklyTrend: initialMetrics.weeklyTrend,
  dailyBudget: initialBudget,

  addActivity: (activity) =>
    set((state) => {
      const newActivities = [...state.activities, activity];
      setActivities(newActivities);
      return {
        activities: newActivities,
        ...recalculateBudget(newActivities, state.dailyBudget),
      };
    }),

  clearActivities: () => {
    clearStoredActivities();
    set({
      activities: [],
      dailyFootprint: 0,
      budgetUsed: 0,
      weeklyTrend: [],
    });
  },

  loadSampleData: async () => {
    try {
      const res = await fetch("/data/sample-activities.json");
      const raw = await res.json();
      const parsed = activitiesArraySchema.safeParse(raw);
      if (!parsed.success) return;
      const data = parsed.data;
      setActivities(data);
      set((state) => ({
        activities: data,
        ...recalculateBudget(data, state.dailyBudget),
      }));
    } catch {
      // Error handling without toast (toast moved to component)
    }
  },

  recalculate: (budget: number) =>
    set((state) => ({
      ...recalculateBudget(state.activities, budget),
      dailyBudget: budget,
    })),
}));