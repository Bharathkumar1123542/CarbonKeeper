"use client";
import { REGION_GRID_FACTORS, GRID_AVERAGE_KG_PER_KWH } from "@/lib/emissions";

export function RegionalGridTable() {
  return (
    <section className="mb-20">
      <h2 className="text-[28px] font-medium text-ink tracking-[-1px] mb-8">
        Regional Grid Adjustments
      </h2>
      <p className="text-muted font-medium mb-8 leading-relaxed">
        Electricity emissions are adjusted based on the carbon intensity of
        the local grid. The global average is {GRID_AVERAGE_KG_PER_KWH} kg CO₂e per kWh. Regional
        factors scale this baseline.
      </p>
      <div className="bg-surface-soft border border-hairline rounded-[16px] overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-hairline bg-surface-card">
              <th className="px-6 py-3 text-[13px] font-bold text-muted uppercase tracking-wider">
                Region
              </th>
              <th className="px-6 py-3 text-[13px] font-bold text-muted uppercase tracking-wider">
                Adjustment Factor
              </th>
              <th className="px-6 py-3 text-[13px] font-bold text-muted uppercase tracking-wider">
                Effective kg/kWh
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(REGION_GRID_FACTORS).map(([key, region]) => (
              <tr
                key={key}
                className="border-b border-hairline last:border-0 hover:bg-canvas/50 transition-colors"
              >
                <td className="px-6 py-4 font-semibold text-ink">
                  {region.label}
                </td>
                <td className="px-6 py-4 text-ink font-mono">
                  {region.factor.toFixed(2)}x
                </td>
                <td className="px-6 py-4 text-muted font-mono">
                  {(GRID_AVERAGE_KG_PER_KWH * region.factor).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}