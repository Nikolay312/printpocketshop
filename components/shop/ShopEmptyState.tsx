import Button from "@/components/ui/Button";

interface Props {
  onReset: () => void;
}

export default function ShopEmptyState({ onReset }: Props) {
  return (
    <div className="py-32">
      <div
        className="
          mx-auto max-w-2xl
          text-center
          space-y-8
          bg-[var(--surface)]
          border border-[var(--border)]
          rounded-[var(--radius-md)]
          shadow-[var(--shadow-sm)]
          px-8 py-16
        "
      >
        {/* ================= Message ================= */}
        <div className="space-y-4">
          <p className="text-xs font-medium tracking-[0.16em] text-[var(--muted)] uppercase">
            No results
          </p>

          <h3 className="text-2xl font-semibold tracking-tight text-[var(--fg)]">
            Nothing matched your selection
          </h3>

          <p className="text-sm text-[var(--muted)] leading-relaxed max-w-md mx-auto">
            Refine your criteria or return to the full collection to continue browsing.
          </p>
        </div>

        {/* ================= Action ================= */}
        <div className="flex justify-center">
          <Button
            variant="secondary"
            onClick={onReset}
          >
            Reset selection
          </Button>
        </div>
      </div>
    </div>
  );
}
