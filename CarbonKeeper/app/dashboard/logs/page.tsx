"use client";
import { useActivityStore } from "@/lib/stores/activity-store";
import { format } from "date-fns";
import { Trash2, FileText } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";

export default function LogsPage() {
  const activities = useActivityStore((s) => s.activities);
  const clearActivities = useActivityStore((s) => s.clearActivities);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <PageHeader
        title="Track: Activity Logs & Carbon History"
        description="Understand your footprint by reviewing the history of all logged activities."
        trailing={
          activities.length > 0 ? (
            <button
              onClick={() => {
                if (window.confirm("Clear all activity logs? This cannot be undone."))
                  clearActivities();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-strong text-ink font-semibold hover:bg-brand-pink hover:text-white transition-colors"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
              Clear Data
            </button>
          ) : undefined
        }
      />

      {activities.length > 0 ? (
        <div className="bg-canvas border border-hairline rounded-[24px] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-soft border-b border-hairline text-muted font-semibold text-[14px]">
                  <th scope="col" className="p-4 pl-6 whitespace-nowrap">Date</th>
                  <th scope="col" className="p-4">Category</th>
                  <th scope="col" className="p-4">Raw Input</th>
                  <th scope="col" className="p-4 text-right">Amount</th>
                  <th scope="col" className="p-4 text-right">CO₂e (kg)</th>
                  <th scope="col" className="p-4 pr-6">Global Equivalent</th>
                </tr>
              </thead>
              <tbody>
                {activities
                  .slice()
                  .reverse()
                  .map((act) => (
                    <tr
                      key={act.id}
                      className="border-b border-hairline last:border-0 hover:bg-surface-soft/50 transition-colors"
                    >
                      <td className="p-4 pl-6 whitespace-nowrap text-muted text-[14px] font-medium">
                        {format(new Date(act.timestamp), "MMM d, yyyy HH:mm")}
                      </td>
                      <td className="p-4 font-semibold text-ink text-[15px] capitalize">
                        {act.category} &rsaquo; {act.subCategory}
                      </td>
                      <td
                        className="p-4 text-muted text-[14px] font-medium max-w-[200px] truncate"
                        title={act.rawInput || "Manual entry"}
                      >
                        {act.rawInput || "Manual entry"}
                      </td>
                      <td className="p-4 text-right font-semibold text-ink text-[15px]">
                        {act.amount} {act.unit}
                      </td>
                      <td className="p-4 text-right font-bold text-brand-teal text-[16px]">
                        {act.co2e.toFixed(2)}
                      </td>
                      <td
                        className="p-4 pr-6 text-muted text-[13px] font-medium max-w-[200px] truncate"
                        title={act.equivalent}
                      >
                        {act.equivalent}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="py-24 text-center bg-canvas border border-dashed border-hairline rounded-[24px]">
          <FileText className="w-16 h-16 text-muted mx-auto mb-4 opacity-50" aria-hidden="true" />
          <h2 className="text-[20px] font-semibold text-ink mb-2">
            No logs found
          </h2>
          <p className="text-muted font-medium text-[16px]">
            Head over to the Overview page to start logging activities.
          </p>
        </div>
      )}
    </div>
  );
}
