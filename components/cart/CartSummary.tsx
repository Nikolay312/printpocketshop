"use client";

import Link from "next/link";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/formatPrice";

type CartItem = {
  product: Product;
  quantity: number;
};

type Props = {
  items: CartItem[];
  total: number;
};

export default function CartSummary({ items, total }: Props) {
  return (
    <div className="card space-y-4 p-6">
      <h2 className="text-lg font-semibold">Order summary</h2>

      <ul className="space-y-2 text-sm">
        {items.map((item) => (
          <li
            key={item.product.id}
            className="flex items-start justify-between gap-4"
          >
            <span className="text-muted">
              {item.product.title} × {item.quantity}
            </span>
            <span className="font-medium">
              {formatPrice(item.product.price * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex justify-between border-t border-border pt-4 text-sm font-semibold">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>

      <div className="space-y-2 pt-2">
        <Link href="/checkout" className="btn-primary w-full">
          Secure checkout
        </Link>
        <p className="text-center text-xs text-muted">
          Instant digital delivery after checkout
        </p>
      </div>
    </div>
  );
}
