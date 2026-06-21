import { TrendingDown } from "lucide-react";
import type { Recommendation } from "@/lib/types";

/**
 * Props for the SavingsBanner component.
 * Summarizes total potential annual carbon savings from recommendations.
 */
interface SavingsBannerProps {
  /** List of recommendations to aggregate savings from */
  recommendations: Recommendation[];
}

export function SavingsBanner({ recommendations }: SavingsBannerProps) {
  const totalSavings = recommendations.reduce((sum, r) => sum + r.potentialSavings, 0);

  return (
    <div className="col-span-3 bg-brand-teal text-white rounded-[24px] p-8 shadow-sm">
      <h3 className="text-[18px] font-semibold mb-4 flex items-center gap-2">
        <TrendingDown className="w-5 h-5 text-brand-mint" aria-hidden="true" />
        Reduce: Potential Annual Carbon Savings
      </h3>
      <div className="flex items-baseline gap-3 mb-2">
        <span className="text-[48px] font-medium leading-none tracking-[-1.5px]">
          {totalSavings}
        </span>
        <span className="text-white/80 font-medium">kg CO₂e / year</span>
      </div>
      <p className="text-brand-mint text-[15px] font-semibold">
        {recommendations.length === 1
          ? "1 recommended swap can reduce your annual footprint"
          : `${recommendations.length} recommended swaps can reduce your annual footprint by this amount`}
      </p>
    </div>
  );
}
