export default function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      {/* Image */}
      <div className="aspect-[4/3] bg-surface-muted animate-pulse" />

      {/* Content */}
      <div className="space-y-3 p-5">
        {/* Title + price */}
        <div className="flex items-start justify-between gap-3">
          <div className="h-4 w-2/3 rounded bg-surface-muted animate-pulse" />
          <div className="h-4 w-12 rounded bg-surface-muted animate-pulse" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-surface-muted animate-pulse" />
          <div className="h-3 w-5/6 rounded bg-surface-muted animate-pulse" />
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between pt-2">
          <div className="h-5 w-16 rounded-full bg-surface-muted animate-pulse" />
          <div className="h-4 w-20 rounded bg-surface-muted animate-pulse" />
        </div>
      </div>
    </div>
  );
}
