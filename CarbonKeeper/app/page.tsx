import Link from "next/link";
import { Shield, BookOpen, TrendingDown } from "lucide-react";
import { PillarsSection } from "@/components/landing/PillarCard";

export default function Home() {
  return (
    <main className="min-h-screen bg-canvas text-body font-sans selection:bg-brand-pink selection:text-white flex flex-col">
      <section className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-24 w-full mt-16">
        <header className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-7/12 text-center md:text-left">
            <h1 className="text-[56px] md:text-[80px] font-medium text-ink tracking-[-2.5px] leading-none mb-6">
              Understand your footprint.
              <br />
              Then actually shrink it.
            </h1>
            <p className="text-[18px] md:text-[20px] text-muted max-w-xl leading-relaxed mb-6 font-medium mx-auto md:mx-0">
              CarbonKeeper turns your everyday choices into a clear, measured
              picture — and gives you specific, data-grounded ways to do better.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-soft text-[13px] font-semibold text-muted border border-hairline">
                <Shield className="w-3.5 h-3.5" aria-hidden="true" />
                Computed locally, in your browser
              </span>
              <Link
                href="/methodology"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-soft text-[13px] font-semibold text-muted border border-hairline hover:bg-hairline transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
                View methodology
              </Link>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-primary text-on-primary font-bold text-[18px] hover:opacity-90 transition-opacity"
              >
                Start Reducing Now &rarr;
              </Link>
            </div>
          </div>
          <div className="md:w-5/12 flex justify-center md:flex relative">
            <div className="w-[400px] h-[400px] bg-brand-teal rounded-[48px] transform rotate-3 flex items-center justify-center shadow-xl border border-ink/5">
              <TrendingDown
                className="w-40 h-40 text-brand-mint opacity-90"
                aria-hidden="true"
              />
            </div>
          </div>
        </header>
      </section>

      <section className="w-full bg-brand-pink/20 py-32 px-6 border-y border-hairline">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-[40px] md:text-[56px] font-medium text-ink tracking-[-1.5px] leading-tight mb-4">
              Four pillars. One goal.
            </h2>
            <p className="text-[18px] text-muted max-w-2xl mx-auto font-medium">
              Understand your impact. Track your habits. Reduce your footprint.
              Get insights that actually help.
            </p>
          </div>

          <PillarsSection />
        </div>
      </section>

      <section className="w-full bg-canvas py-32 px-6">
        <div className="max-w-4xl mx-auto bg-ink rounded-[32px] p-12 md:p-20 text-center relative overflow-hidden shadow-xl">
          <div className="relative z-10">
            <h2 className="text-[40px] md:text-[56px] font-medium text-white tracking-[-1.5px] leading-tight mb-6">
              Ready to reduce your footprint?
            </h2>
            <p className="text-[18px] text-white/80 max-w-xl mx-auto font-medium mb-6">
              No sign-up required. No data uploaded. Everything runs locally in
              your browser.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-10 py-5 rounded-2xl bg-brand-teal text-white font-bold text-[18px] hover:opacity-90 transition-opacity shadow-sm"
            >
              Go to Dashboard
            </Link>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-mint/10 rounded-full blur-[100px] pointer-events-none"></div>
        </div>
      </section>

      <footer className="w-full border-t border-hairline py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted font-medium">
            &copy; {new Date().getFullYear()} CarbonKeeper. Built for
            individuals, not corporations.
          </p>
          <Link
            href="/methodology"
            className="text-sm font-semibold text-muted hover:text-ink transition-colors"
          >
            Methodology &amp; Sources
          </Link>
        </div>
      </footer>
    </main>
  );
}
