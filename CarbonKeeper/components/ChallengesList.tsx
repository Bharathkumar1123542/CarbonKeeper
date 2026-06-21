"use client";
import { motion } from "framer-motion";

import { useAIStore } from "@/lib/stores/ai-store";

export function ChallengesList() {
  const challenges = useAIStore((s) => s.challenges);
  const onToggle = useAIStore((s) => s.toggleChallenge);
  return (
    <div className="grid gap-3">
      {challenges.map((c) => (
        <motion.button
          key={c.id}
          onClick={() => onToggle(c.id)}
          className={`w-full text-left rounded-xl p-4 flex items-center justify-between border transition-all ${
            c.active
              ? "bg-brand-teal text-white border-brand-teal"
              : "bg-canvas text-ink border-hairline hover:border-brand-teal/40"
          }`}
          aria-pressed={c.active}
        >
          <div>
            <div className="font-semibold text-[15px]">{c.title}</div>
            <div className={`text-[13px] mt-0.5 ${c.active ? "text-white/80" : "text-muted"}`}>{c.description}</div>
          </div>
          <div className="text-right shrink-0 ml-4">
            {c.active ? (
              <span className="text-brand-mint font-bold text-[14px]">{c.streak} day{c.streak !== 1 ? "s" : ""}</span>
            ) : (
              <span className="text-muted text-[13px] font-medium">Start</span>
            )}
          </div>
        </motion.button>
      ))}
    </div>
  );
}
