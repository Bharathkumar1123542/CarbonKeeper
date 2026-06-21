/**
 * Props for the InsightBox component.
 * Displays a contextual insight message inside the footprint card.
 */
interface InsightBoxProps {
  /** Insight text to display, or null to show a default message */
  insight: string | null;
}

export function InsightBox({ insight }: InsightBoxProps) {
  return (
    <div className="bg-black/20 rounded-xl p-4 mt-6" aria-live="polite">
      <p className="text-[15px] font-medium text-white/90">
        {insight || "Every small step counts towards a greener future."}
      </p>
    </div>
  );
}
