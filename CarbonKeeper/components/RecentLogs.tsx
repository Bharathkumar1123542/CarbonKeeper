"use client";

import { Map } from "lucide-react";
import { motion } from "framer-motion";

import { useActivityStore } from "@/lib/stores/activity-store";

export function RecentLogs() {
  const activities = useActivityStore((s) => s.activities);
  if (activities.length === 0) return null;

  return (
    <div className="col-span-3 bg-surface-card rounded-[24px] p-8 border border-hairline shadow-sm">
      <h3 className="text-[20px] font-semibold text-ink mb-6 flex items-center gap-2 tracking-tight">
        <Map className="w-6 h-6 text-brand-pink" aria-hidden="true" />
        Track: Recent Activity Logs
      </h3>
      <div className="flex flex-col">
        {activities
          .slice()
          .reverse()
          .map((act) => (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={act.id}
              className="flex justify-between items-center py-4 border-b border-hairline last:border-0 hover:bg-surface-strong rounded-xl px-4 -mx-4 transition-colors"
            >
              <div>
                <div className="text-ink font-semibold text-[16px] capitalize">
                  {act.amount}
                  {act.unit} {act.subCategory}
                </div>
                <div className="text-muted text-[14px] font-medium mt-1">
                  {act.rawInput || "Quick Log"}
                </div>
              </div>
              <div className="text-right">
                <div className="text-ink font-semibold text-[16px]">
                  {act.co2e.toFixed(2)} kg
                </div>
                <div className="text-muted text-[13px] font-medium">
                  {act.equivalent}
                </div>
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  );
}
