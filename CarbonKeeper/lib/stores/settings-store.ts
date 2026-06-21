import { create } from "zustand";
import { getRegion, setRegion, getBudget, setBudget } from "@/lib/storage";

/**
 * State interface for the settings store.
 * @property dailyBudget - Daily carbon budget in kg CO₂
 * @property region - User's geographic region for carbon intensity calculations
 * @property setDailyBudget - Updates the daily budget in state and storage
 * @property setRegion - Updates the region in state and storage
 */
interface SettingsState {
  dailyBudget: number;
  region: string;
  setDailyBudget: (budget: number) => void;
  setRegion: (region: string) => void;
}

/**
 * Zustand store for managing user settings.
 * Persists daily budget and region preferences to storage.
 * @returns A Zustand store hook for accessing and modifying settings state
 */
export const useSettingsStore = create<SettingsState>((set) => ({
  dailyBudget: getBudget(),
  region: getRegion(),

  setDailyBudget: (budget: number) =>
    set(() => {
      setBudget(budget);
      return { dailyBudget: budget };
    }),

  setRegion: (region: string) =>
    set(() => {
      setRegion(region);
      return { region };
    }),
}));