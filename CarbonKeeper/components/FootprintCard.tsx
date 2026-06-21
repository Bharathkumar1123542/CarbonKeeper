"use client";
import { useMemo } from "react";
import { Leaf, TrendingDown } from "lucide-react";
import { CategoryChart } from "@/components/charts/CategoryChart";
import { Meter } from "./FootprintCard/Meter";
import { InsightBox } from "./FootprintCard/InsightBox";
import { computeCategoryBreakdown } from "@/lib/compute";
import { useActivityStore } from "@/lib/stores/activity-store";
import { useSettingsStore } from "@/lib/stores/settings-store";
import { useAIStore } from "@/lib/stores/ai-store";

export function FootprintCard() {
  const activities = useActivityStore((s) => s.activities);
  const dailyFootprint = useActivityStore((s) => s.dailyFootprint);
  const budgetUsed = useActivityStore((s) => s.budgetUsed);
  const dailyBudget = useSettingsStore((s) => s.dailyBudget);
  const insight = useAIStore((s) => s.insight);
  const chartData = useMemo(
    () => computeCategoryBreakdown(activities),
    [activities],
  );

  const remaining = useMemo(() => Math.max(dailyBudget - dailyFootprint, 0), [dailyBudget, dailyFootprint]);

  return (
    <div className="col-span-1 bg-brand-teal text-white rounded-[24px] p-8 flex flex-col justify-between">
      <div>
        <h3 className="text-[18px] font-semibold mb-4 flex items-center gap-2">
          <Leaf className="w-6 h-6 text-brand-mint" aria-hidden="true" />
          Understand: Daily Footprint
        </h3>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-[64px] font-medium leading-none tracking-[-1.5px]">{dailyFootprint.toFixed(1)}</span>
          <span className="text-white/80 font-medium">kg CO₂e</span>
        </div>
        <p className="text-brand-mint text-[15px] font-semibold mb-6">
          {budgetUsed.toFixed(0)}% of {dailyBudget} kg daily budget
        </p>
        {remaining > 0 ? (
          <p className="text-white/70 text-[14px] font-medium">
            <TrendingDown className="w-4 h-4 inline mr-1" aria-hidden="true" />
            {remaining.toFixed(1)} kg remaining today
          </p>
        ) : (
          <p className="text-brand-pink text-[14px] font-medium">
            Over budget by {Math.abs(remaining).toFixed(1)} kg
          </p>
        )}
      </div>

      <Meter budgetUsed={budgetUsed} />

      <CategoryChart data={chartData} />

      <InsightBox insight={insight} />
    </div>
  );
}