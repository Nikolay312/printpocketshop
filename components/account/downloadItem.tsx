"use client";

import Image from "next/image";
import { Product } from "@/types/product";
import { formatDate } from "@/lib/formatDate";

type Props = {
  product: Product;
};

export default function DownloadItem({ product }: Props) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-4 transition hover:shadow-sm sm:flex-row sm:items-center">
      {/* Preview */}
      <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl bg-surface sm:h-20 sm:w-28">
        <Image
          src={product.previewImages[0]}
          alt={product.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 space-y-1">
        <h3 className="font-semibold leading-snug text-foreground">
          {product.title}
        </h3>

        <p className="text-sm text-muted">
          {product.format} · {product.license} license
        </p>

        <p className="text-xs text-muted">
          Purchased on {formatDate(product.createdAt)}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col items-start gap-2 sm:items-end">
        {product.fileUrl && (
          <a
            href={product.fileUrl}
            download
            className="btn-primary px-5 py-2.5 text-sm"
          >
            Download file
          </a>
        )}

        <span className="text-xs text-muted">
          Unlimited access · Re-download anytime
        </span>
      </div>
    </div>
  );
}
