"use client";
import { useEffect, useState } from "react";
import { useActivityStore } from "@/lib/stores/activity-store";
import { useAIStore } from "@/lib/stores/ai-store";
import { ActivityLog } from "@/components/ActivityLog";
import { FootprintCard } from "@/components/FootprintCard";
import { RecommendationsList } from "@/components/RecommendationsList";
import { ChallengesList } from "@/components/ChallengesList";
import { WeeklyTrend } from "@/components/WeeklyTrend";
import { RecentLogs } from "@/components/RecentLogs";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyDashboard } from "@/components/dashboard/EmptyDashboard";
import { SavingsBanner } from "@/components/dashboard/SavingsBanner";

export default function Dashboard() {
  const activities = useActivityStore((s) => s.activities);
  const loadSampleData = useActivityStore((s) => s.loadSampleData);
  const recommendations = useAIStore((s) => s.recommendations);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div aria-live="polite">
        <PageHeader
          title="Track, Understand, and Reduce Your Carbon Footprint"
          description="Your personal carbon coach. Log activities, track progress, and discover personalized ways to reduce your impact."
        />
      </div>

      <div className="mb-12">
        <ActivityLog />
      </div>

      {activities.length > 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FootprintCard />

          <div className="col-span-2 bg-brand-peach text-ink rounded-[24px] p-8">
            <h3 className="text-[20px] font-semibold mb-6 flex items-center gap-2 tracking-tight">
              <Zap className="w-6 h-6" aria-hidden="true" />
              Reduce: AI Personalized Carbon Swaps
            </h3>
            <RecommendationsList />
          </div>

          <WeeklyTrend />

          {recommendations.length > 0 && (
            <SavingsBanner recommendations={recommendations} />
          )}

          <div className="col-span-3 md:col-span-2 bg-surface-card rounded-[24px] p-8 border border-hairline shadow-sm">
            <h3 className="text-[18px] font-semibold text-ink mb-6 flex items-center gap-2 tracking-tight">
              <Zap className="w-5 h-5 text-brand-teal" aria-hidden="true" />
              Reduce: Habit Building Challenges
            </h3>
            <ChallengesList />
          </div>

          <RecentLogs />
        </motion.div>
      ) : (
        <EmptyDashboard onLoadSampleData={loadSampleData} />
      )}
    </div>
  );
}
