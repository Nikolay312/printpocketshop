export default function ProductLoading() {
  return (
    <main className="container-app py-12">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr]">
        {/* Left */}
        <div className="space-y-8">
          <div className="aspect-[4/3] rounded-2xl bg-surface-muted animate-pulse" />
          <div className="space-y-3">
            <div className="h-6 w-2/3 rounded bg-surface-muted animate-pulse" />
            <div className="h-4 w-full rounded bg-surface-muted animate-pulse" />
            <div className="h-4 w-5/6 rounded bg-surface-muted animate-pulse" />
          </div>
        </div>

        {/* Right */}
        <div className="card space-y-6 p-6 animate-pulse">
          <div className="h-6 w-3/4 rounded bg-surface-muted" />
          <div className="h-10 w-1/2 rounded bg-surface-muted" />
          <div className="h-12 w-full rounded-full bg-surface-muted" />
        </div>
      </div>
    </main>
  );
}
