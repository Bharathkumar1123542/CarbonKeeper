"use client";
import { EmissionFactorsTable } from "./EmissionFactorsTable";
import { RegionalGridTable } from "./RegionalGridTable";
import { SourcesList } from "./SourcesList";

export function MethodologyContent() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-24">
      <h1 className="text-[56px] font-medium text-ink tracking-[-2px] leading-none mb-4">
        Methodology
      </h1>
      <p className="text-[18px] text-muted max-w-2xl font-medium mb-16 leading-relaxed">
        CarbonKeeper uses peer-reviewed emission factors from the UK
        Department for Environment, Food &amp; Rural Affairs (DEFRA) and the
        Poore &amp; Nemecek 2018 food systems meta-analysis. All calculations
        happen client-side — your data never leaves your browser.
      </p>

      <EmissionFactorsTable />
      <RegionalGridTable />

      <section className="mb-20">
        <h2 className="text-[28px] font-medium text-ink tracking-[-1px] mb-8">
          Calculation Formula
        </h2>
        <div className="bg-ink rounded-[16px] p-8 font-mono text-[15px] text-white leading-relaxed shadow-sm">
          <p className="mb-2">
            <span className="text-brand-mint">emissions</span> ={" "}
            <span className="text-brand-teal">amount</span> &times;{" "}
            <span className="text-brand-peach">factor</span>
          </p>
          <p className="mb-2">
            <span className="text-brand-mint">emissions</span> = kg CO₂e
          </p>
          <p className="text-white/70">
            For electricity: adjusted = factor &times; amount &times;{" "}
            <span className="text-brand-peach">region_multiplier</span>
          </p>
        </div>
      </section>

      <section className="mb-20">
        <h2 className="text-[28px] font-medium text-ink tracking-[-1px] mb-8">
          Privacy
        </h2>
        <div className="bg-surface-soft border border-hairline rounded-[16px] p-8 shadow-sm">
          <p className="text-muted font-medium leading-relaxed mb-4">
            All emission calculations run in your browser. Your activity data
            is stored in your browser&apos;s localStorage and is never sent to
            any server unless you explicitly use the AI insight or
            recommendation features — in which case only your recent activity
            summaries are sent to Google&apos;s Gemini API.
          </p>
          <p className="text-muted font-medium leading-relaxed">
            No account. No tracking. No data uploads. CarbonKeeper is designed
            to be trustworthy by default.
          </p>
        </div>
      </section>

      <SourcesList />
    </section>
  );
}