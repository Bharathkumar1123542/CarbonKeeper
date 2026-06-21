import { ProgressBar } from "@/components/ui/ProgressBar";

/**
 * Props for the Meter component.
 * A simple progress bar showing daily budget usage percentage.
 */
interface MeterProps {
  /** Percentage of daily budget consumed (0–100) */
  budgetUsed: number;
}

export function Meter({ budgetUsed }: MeterProps) {
  return (
    <div className="mt-6">
      <ProgressBar
        value={budgetUsed}
        trackClassName="bg-black/20"
        fillClassName="bg-brand-mint transition-all duration-500"
      />
    </div>
  );
}
