import { useState } from "react";
import { toast } from "sonner";
import { useSettingsStore } from "@/lib/stores/settings-store";
import { useActivityStore } from "@/lib/stores/activity-store";

/**
 * Custom hook to manage the state and submission of the Settings form.
 * Ensures strict separation of presentation and business logic.
 */
export function useSettingsForm() {
  const dailyBudget = useSettingsStore((s) => s.dailyBudget);
  const region = useSettingsStore((s) => s.region);
  const setDailyBudget = useSettingsStore((s) => s.setDailyBudget);
  const setRegion = useSettingsStore((s) => s.setRegion);
  const recalculate = useActivityStore((s) => s.recalculate);

  const [budget, setBudget] = useState(dailyBudget.toString());
  const [regionLocal, setRegionLocal] = useState(region);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const budgetNum = parseFloat(budget);
    if (!isNaN(budgetNum) && budgetNum > 0) {
      setDailyBudget(budgetNum);
      recalculate(budgetNum);
    }
    setRegion(regionLocal);
    toast.success("Settings saved successfully!");
  };

  return {
    budget,
    setBudget,
    regionLocal,
    setRegionLocal,
    handleSave,
  };
}
