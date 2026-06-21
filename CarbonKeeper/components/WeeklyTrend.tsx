"use client";

import { Target } from "lucide-react";
import dynamic from "next/dynamic";

const BarChart = dynamic(() => import("recharts").then((m) => m.BarChart), { ssr: false });
const Bar = dynamic(() => import("recharts").then((m) => m.Bar), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((m) => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((m) => m.YAxis), { ssr: false });
const ResponsiveContainer = dynamic(() => import("recharts").then((m) => m.ResponsiveContainer), { ssr: false });

import { useActivityStore } from "@/lib/stores/activity-store";

export function WeeklyTrend() {
  const weeklyTrend = useActivityStore((s) => s.weeklyTrend);
  if (weeklyTrend.length === 0) return null;

  return (
    <div className="col-span-3 md:col-span-1 bg-surface-card rounded-[24px] p-8 border border-hairline shadow-sm">
      <h3 className="text-[18px] font-semibold text-ink mb-6 flex items-center gap-2 tracking-tight">
        <Target className="w-5 h-5 text-brand-pink" aria-hidden="true" />
        Understand: Weekly Footprint Trends
      </h3>
      <div className="h-[200px]" role="img" aria-label="7-day carbon emission trend">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <BarChart data={weeklyTrend}>
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#6a6a6a" }} />
            <YAxis hide />
            <Bar dataKey="value" fill="#14b8a6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
