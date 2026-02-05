"use client";

export default function ProductTrustBadges() {
  return (
    <div className="card-soft space-y-4 p-5 text-sm text-muted">
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex h-6 w-6 items-center justify-center rounded-full bg-surface text-foreground text-xs font-bold"
        >
          ✓
        </span>
        <span>Instant digital download after purchase</span>
      </div>

      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex h-6 w-6 items-center justify-center rounded-full bg-surface text-foreground text-xs font-bold"
        >
          ✓
        </span>
        <span>Secure checkout and payment processing</span>
      </div>

      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex h-6 w-6 items-center justify-center rounded-full bg-surface text-foreground text-xs font-bold"
        >
          ✓
        </span>
        <span>Lifetime access from your account</span>
      </div>

      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="flex h-6 w-6 items-center justify-center rounded-full bg-surface text-foreground text-xs font-bold"
        >
          ✓
        </span>
        <span>Personal and commercial licenses available</span>
      </div>
    </div>
  );
}
