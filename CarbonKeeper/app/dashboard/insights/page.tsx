"use client";
import { PieChart } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { BudgetMeter } from "@/components/charts/BudgetMeter";
import { RecommendationItem } from "@/components/RecommendationItem";
import { useActivityStore } from "@/lib/stores/activity-store";
import { useSettingsStore } from "@/lib/stores/settings-store";
import { useAIStore } from "@/lib/stores/ai-store";

export default function InsightsPage() {
  const recommendations = useAIStore((s) => s.recommendations);
  const insight = useAIStore((s) => s.insight);
  const dailyFootprint = useActivityStore((s) => s.dailyFootprint);
  const budgetUsed = useActivityStore((s) => s.budgetUsed);
  const isProcessing = useAIStore((s) => s.isProcessing);
  const dailyBudget = useSettingsStore((s) => s.dailyBudget);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <PageHeader
        title="Personalized Insights"
        description="Understand your carbon footprint and discover ways to reduce it, powered by CarbonKeeper and Gemini AI."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-canvas border border-hairline rounded-[24px] p-8 shadow-sm">
            <h2 className="text-[18px] font-semibold mb-6 flex items-center gap-2">
              <PieChart
                className="w-5 h-5 text-brand-pink"
                aria-hidden="true"
              />
              Understand: Budget Analysis
            </h2>
            <BudgetMeter
              budgetUsed={budgetUsed}
              dailyFootprint={dailyFootprint}
              dailyBudget={dailyBudget}
              insight={insight}
            />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-surface-soft border border-hairline rounded-[24px] p-8 shadow-sm h-full">
            <h3 className="text-[20px] font-semibold text-ink mb-6 flex items-center gap-2 tracking-tight">
              Reduce: High-Leverage AI Swaps
            </h3>

            {isProcessing ? (
              <div
                className="animate-pulse space-y-4"
                aria-busy="true"
                aria-label="Loading AI recommendations"
              >
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-24 bg-surface-strong rounded-xl w-full"
                  ></div>
                ))}
              </div>
            ) : recommendations.length > 0 ? (
              <div className="grid gap-4">
                {recommendations.map((recommendation, i) => (
                  <RecommendationItem
                    key={recommendation.id}
                    recommendation={recommendation}
                    index={i}
                    variant="detailed"
                  />
                ))}
              </div>
            ) : (
              <div className="text-muted text-[15px] font-medium p-8 text-center border-2 border-dashed border-hairline rounded-xl bg-canvas">
                Log more activities on the Overview page to let Gemini generate
                personalized lifestyle swaps.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
