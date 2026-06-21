"use client";
import { Settings2, Database, Globe } from "lucide-react";
import { REGION_GRID_FACTORS } from "@/lib/emissions";
import { PageHeader } from "@/components/layout/PageHeader";
import type { JSX } from "react";
import { useSettingsForm } from "@/lib/hooks/useSettingsForm";

export default function SettingsPage(): JSX.Element {
  const { budget, setBudget, regionLocal, setRegionLocal, handleSave } =
    useSettingsForm();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <PageHeader
        title="Settings"
        description="Manage your app preferences and API configuration."
        icon={<Settings2 className="w-8 h-8 text-muted" aria-hidden="true" />}
      />

      <form onSubmit={handleSave} className="space-y-8">
        <section className="bg-canvas border border-hairline rounded-[24px] p-8 shadow-sm">
          <h2 className="text-[20px] font-semibold text-ink mb-6 flex items-center gap-2">
            <Database className="w-5 h-5 text-brand-teal" aria-hidden="true" />
            Preferences
          </h2>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="budget"
                className="block text-[15px] font-semibold text-ink mb-2"
              >
                Daily Carbon Budget (kg CO₂e)
              </label>
              <p className="text-[14px] text-muted font-medium mb-3">
                Set your target maximum emissions for a single day.
              </p>
              <input
                id="budget"
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full max-w-md bg-surface-soft border border-hairline rounded-xl px-4 py-3 text-ink font-medium focus:outline-none focus:border-brand-teal transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="region"
                className="block text-[15px] font-semibold text-ink mb-2"
              >
                <Globe
                  className="w-4 h-4 inline mr-1.5 -mt-0.5"
                  aria-hidden="true"
                />
                Region / Grid Context
              </label>
              <p className="text-[14px] text-muted font-medium mb-3">
                Your local electricity grid mix affects your carbon footprint.
                Select your region for personalized calculations.
              </p>
              <select
                id="region"
                value={regionLocal}
                onChange={(e) => setRegionLocal(e.target.value)}
                className="w-full max-w-md bg-surface-soft border border-hairline rounded-xl px-4 py-3 text-ink font-medium focus:outline-none focus:border-brand-teal transition-colors"
              >
                {Object.entries(REGION_GRID_FACTORS).map(([key, { label }]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-4 cursor-pointer bg-ink text-canvas rounded-xl font-bold text-[16px] hover:opacity-90 transition-opacity shadow-sm"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
