export default function DashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-12">
        <div className="h-10 w-64 bg-surface-strong rounded-lg animate-pulse mb-2" />
        <div className="h-5 w-96 bg-surface-strong rounded-lg animate-pulse" />
      </div>
      <div className="mb-12">
        <div className="h-16 bg-surface-strong rounded-2xl animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="h-96 bg-surface-strong rounded-[24px] animate-pulse" />
        <div className="col-span-2 h-64 bg-surface-strong rounded-[24px] animate-pulse" />
      </div>
    </div>
  );
}
