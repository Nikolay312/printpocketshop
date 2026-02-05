import Link from "next/link";
import Button from "@/components/ui/Button";

interface Props {
  onReset: () => void;
}

export default function ShopEmptyState({ onReset }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center space-y-8">
      {/* Message */}
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-foreground">
          No products match your filters
        </h3>
        <p className="mx-auto max-w-md text-sm text-muted">
          Try adjusting your search or clearing some filters to
          discover more products.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          variant="secondary"
          onClick={onReset}
        >
          Clear filters
        </Button>

        <Link href="/shop" className="btn-primary">
          View all products
        </Link>
      </div>
    </div>
  );
}
