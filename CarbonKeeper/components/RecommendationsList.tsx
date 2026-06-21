"use client";
import { useAIStore } from "@/lib/stores/ai-store";
import { RecommendationItem } from "./RecommendationItem";

export function RecommendationsList() {
  const recommendations = useAIStore((s) => s.recommendations);
  return (
    <div className="grid gap-4" aria-live="polite">
      {recommendations.length > 0 ? (
        recommendations.map((recommendation, i) => (
          <RecommendationItem key={recommendation.id} recommendation={recommendation} index={i} />
        ))
      ) : (
        <div className="text-ink/60 text-[15px] font-medium p-6 text-center border-2 border-dashed border-ink/20 rounded-xl bg-canvas/40">
          Log more activities to get personalized recommendations.
        </div>
      )}
    </div>
  );
}
