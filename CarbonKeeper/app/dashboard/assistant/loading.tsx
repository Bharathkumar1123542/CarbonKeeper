export default function AssistantLoading() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto px-6 py-12">
        <div className="max-w-3xl mx-auto animate-pulse">
          <div className="h-10 w-64 bg-surface-strong rounded-lg mb-4" />
          <div className="h-5 w-96 bg-surface-strong rounded-lg mb-12" />
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-surface-strong shrink-0" />
              <div className="h-20 w-3/4 bg-surface-strong rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
