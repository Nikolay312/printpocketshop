"use client";

import DownloadItem from "@/components/account/downloadItem";
import type { Product } from "@/types/product";
import Link from "next/link";

type Props = {
  products: Product[];
};

export default function DownloadsList({ products }: Props) {
  if (products.length === 0) {
    return (
      <div className="card-soft p-8 text-center space-y-3">
        <p className="text-sm text-muted">
          You don’t have any downloads yet.
        </p>
        <Link href="/shop" className="btn-primary inline-flex">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <DownloadItem key={product.id} product={product} />
      ))}
    </div>
  );
}
