"use client";

export default function DashboardError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-24 text-center">
      <div className="bg-canvas border border-hairline rounded-[24px] p-12 max-w-lg mx-auto shadow-sm">
        <h2 className="text-[24px] font-semibold text-ink mb-3">Something went wrong</h2>
        <p className="text-muted font-medium text-[16px] mb-8">
          We couldn&apos;t load this page. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 rounded-xl bg-ink text-canvas font-bold text-[15px] hover:opacity-90 transition-opacity"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
