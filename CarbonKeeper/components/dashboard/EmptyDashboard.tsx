import { Database, Leaf } from "lucide-react";

/**
 * Props for the EmptyDashboard component.
 * Shown when no activities have been logged, with an option to load demo data.
 */
interface EmptyDashboardProps {
  /** Callback to load sample/demo activity data */
  onLoadSampleData: () => void;
}

export function EmptyDashboard({ onLoadSampleData }: EmptyDashboardProps) {
  return (
    <div className="py-24 px-6 text-center bg-canvas border border-dashed border-hairline rounded-[24px] max-w-2xl mx-auto shadow-sm">
      <div className="w-20 h-20 bg-surface-soft rounded-full flex items-center justify-center mx-auto mb-6">
        <Leaf className="w-10 h-10 text-muted" aria-hidden="true" />
      </div>
      <h2 className="text-[24px] font-semibold text-ink mb-3">No activities logged yet</h2>
      <p className="text-muted font-medium text-[16px] mb-8 max-w-md mx-auto">
        Start by typing what you did today in the command palette above, like &quot;I drove 15km&quot;
        or &quot;I ate a burger&quot;. Our AI will handle the rest.
      </p>
      <button
        onClick={onLoadSampleData}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-strong text-ink font-semibold text-[15px] hover:bg-hairline transition-colors border border-hairline shadow-sm"
      >
        <Database className="w-4 h-4" aria-hidden="true" />
        Load Demo Data
      </button>
    </div>
  );
}
