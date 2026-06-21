import { motion } from "framer-motion";
import type { Recommendation } from "@/lib/types";

/**
 * Props for the RecommendationItem component.
 * Renders a single recommendation card with animation, available in compact or detailed layout.
 */
interface RecommendationItemProps {
  /** The recommendation data to display */
  recommendation: Recommendation;
  /** Index used to stagger the entrance animation */
  index: number;
  /** Layout variant: "compact" for inline cards, "detailed" for expanded cards (defaults to "compact") */
  variant?: "compact" | "detailed";
}

export function RecommendationItem({
  recommendation,
  index,
  variant = "compact",
}: RecommendationItemProps) {
  if (variant === "detailed") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-canvas rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center border border-hairline gap-4 shadow-sm"
      >
        <div className="flex-1">
          <h4 className="font-semibold text-ink text-[18px] mb-2">{recommendation.title}</h4>
          <p className="text-muted font-medium text-[15px] leading-relaxed">
            {recommendation.description}
          </p>
        </div>
        <div className="text-left md:text-right shrink-0 bg-brand-teal/5 px-4 py-3 rounded-lg border border-brand-teal/10">
          <span className="block text-brand-teal font-bold text-[24px] leading-none tracking-tight">
            -{recommendation.potentialSavings}kg
          </span>
          <span className="text-[12px] text-brand-teal/70 uppercase tracking-wider font-bold mt-1 block">
            {recommendation.difficulty} Effort
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-canvas/60 rounded-xl p-5 flex justify-between items-center border border-ink/5 shadow-sm"
    >
      <div>
        <h4 className="font-semibold text-[16px] mb-1">{recommendation.title}</h4>
        <p className="text-ink/80 text-[14px]">{recommendation.description}</p>
      </div>
      <div className="text-right ml-4 shrink-0">
        <span className="block text-brand-teal font-bold text-[18px]">
          -{recommendation.potentialSavings}kg
        </span>
        <span className="text-[12px] text-ink/70 uppercase tracking-wider font-semibold">
          {recommendation.difficulty}
        </span>
      </div>
    </motion.div>
  );
}
