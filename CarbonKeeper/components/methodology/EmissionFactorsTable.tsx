"use client";
import { EMISSION_FACTORS, EMISSION_FACTOR_SOURCE } from "@/lib/emissions";

export function EmissionFactorsTable() {
  return (
    <section className="mb-20">
      <h2 className="text-[28px] font-medium text-ink tracking-[-1px] mb-8">
        Emission Factors
      </h2>
      {Object.entries(EMISSION_FACTORS).map(([category, items]) => (
        <div key={category} className="mb-10">
          <h3 className="text-[20px] font-semibold text-ink mb-4 capitalize">
            {category}
          </h3>
          <div className="bg-surface-soft border border-hairline rounded-[16px] overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-hairline bg-surface-card">
                  <th className="px-6 py-3 text-[13px] font-bold text-muted uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-3 text-[13px] font-bold text-muted uppercase tracking-wider">
                    Factor
                  </th>
                  <th className="px-6 py-3 text-[13px] font-bold text-muted uppercase tracking-wider">
                    Per Unit
                  </th>
                  <th className="px-6 py-3 text-[13px] font-bold text-muted uppercase tracking-wider">
                    Source
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(items).map(([key, factor]) => (
                  <tr
                    key={key}
                    className="border-b border-hairline last:border-0 hover:bg-canvas/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-ink capitalize">
                      {key.replace(/_/g, " ")}
                    </td>
                    <td className="px-6 py-4 text-ink font-mono">
                      {factor.value}
                    </td>
                    <td className="px-6 py-4 text-muted capitalize">
                      {factor.unit}
                    </td>
                    <td className="px-6 py-4 text-muted text-[14px]">
                      {EMISSION_FACTOR_SOURCE[category.toUpperCase() as keyof typeof EMISSION_FACTOR_SOURCE] || "UK DEFRA 2024"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </section>
  );
}