"use client";

import Link from "next/link";
import DownloadItem, {
  type PurchasedDownloadItem,
} from "@/components/account/downloadItem";

type Props = {
  products: PurchasedDownloadItem[];
};

export default function DownloadsList({ products }: Props) {
  if (products.length === 0) {
    return (
      <div className="border border-border bg-background p-10 text-center shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div className="mx-auto max-w-md space-y-4">
          <p className="text-base font-medium text-foreground">
            No downloads available
          </p>

          <p className="text-sm text-muted">
            Once you complete a purchase, your digital products will appear
            here and remain accessible for lifetime re-download.
          </p>

          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-accent px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-hover"
            >
              Browse templates
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {products.map((product: PurchasedDownloadItem) => (
        <DownloadItem
          key={`${product.orderId}-${product.product?.id ?? "missing"}`}
          item={product}
        />
      ))}
    </div>
  );
}