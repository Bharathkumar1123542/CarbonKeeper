"use client";
import { BarChart3, Target, TrendingDown, Zap } from "lucide-react";

/**
 * Props for the PillarCard component.
 * Displays a feature pillar with an icon, title, and description on the landing page.
 */
interface PillarCardProps {
  /** Display title for the pillar */
  title: string;
  /** Description text explaining the pillar */
  description: string;
  /** Icon node rendered inside the card */
  icon: React.ReactNode;
  /** Tailwind background color class for the icon container */
  iconBgColor: string;
  /** Tailwind text color class for the icon */
  iconColor: string;
}

function PillarCard({ title, description, icon, iconBgColor, iconColor }: PillarCardProps) {
  return (
    <div className="bg-canvas border border-hairline p-8 rounded-[24px] shadow-sm text-center">
      <div className={`w-16 h-16 ${iconBgColor} ${iconColor} flex items-center justify-center rounded-2xl mx-auto mb-6`}>
        {icon}
      </div>
      <h3 className="text-[20px] font-semibold text-ink mb-3">{title}</h3>
      <p className="text-muted font-medium text-[15px] leading-relaxed">{description}</p>
    </div>
  );
}

export function PillarsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      <PillarCard
        title="Understand"
        description="See exactly how much CO₂ each activity generates — with relatable equivalents and transparent methodology."
        icon={<BarChart3 className="w-8 h-8" />}
        iconBgColor="bg-brand-lavender"
        iconColor="text-ink"
      />
      <PillarCard
        title="Track"
        description="Type &ldquo;I drove 20km&rdquo; and we log it instantly. No forms, no dropdowns. All computation stays in your browser."
        icon={<Target className="w-8 h-8" />}
        iconBgColor="bg-brand-teal"
        iconColor="text-white"
      />
      <PillarCard
        title="Reduce"
        description="AI recommends specific, actionable swaps based on your actual habits. The AI narrates; it never fabricates figures."
        icon={<TrendingDown className="w-8 h-8" />}
        iconBgColor="bg-brand-peach"
        iconColor="text-ink"
      />
      <PillarCard
        title="Personalized Insights"
        description="Ask your AI Assistant anything about your data. Get answers grounded in your real logged activities."
        icon={<Zap className="w-8 h-8" />}
        iconBgColor="bg-brand-mint"
        iconColor="text-ink"
      />
    </div>
  );
}