export default function InsightsLoading() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="h-10 w-48 bg-surface-strong rounded-lg animate-pulse mb-2" />
      <div className="h-5 w-72 bg-surface-strong rounded-lg animate-pulse mb-12" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="h-48 bg-surface-strong rounded-[24px] animate-pulse" />
        <div className="lg:col-span-2 h-64 bg-surface-strong rounded-[24px] animate-pulse" />
      </div>
    </div>
  );
}
