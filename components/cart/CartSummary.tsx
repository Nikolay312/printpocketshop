"use client";

import Link from "next/link";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/formatPrice";
import Button from "@/components/ui/Button";

type CartItem = {
  product: Product;
  quantity: number;
};

type Props = {
  items: CartItem[];
  total: number;
};

export default function CartSummary({
  items,
  total,
}: Props) {
  const currency =
    items.length > 0 ? items[0].product.currency : "EUR";

  return (
    <div
      className="
        bg-[var(--surface)]
        border border-[var(--border)]
        rounded-[var(--radius-md)]
        shadow-[var(--shadow-sm)]
        p-7
        space-y-7
      "
    >
      {/* Header */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold tracking-tight text-[var(--fg)]">
          Order summary
        </h2>
        <div className="h-px w-full bg-[var(--border)]" />
      </div>

      {/* Items */}
      <ul className="space-y-4 text-sm">
        {items.map((item) => (
          <li
            key={item.product.id}
            className="flex items-start justify-between gap-4"
          >
            <span className="text-[var(--muted)] leading-snug">
              {item.product.title} × {item.quantity}
            </span>

            <span className="font-medium tabular-nums text-[var(--fg)]">
              {formatPrice(
                item.product.price * item.quantity,
                item.product.currency
              )}
            </span>
          </li>
        ))}
      </ul>

      {/* Total */}
      <div className="space-y-4 pt-2">
        <div className="h-px w-full bg-[var(--border)]" />

        <div className="flex items-center justify-between text-base font-semibold text-[var(--fg)]">
          <span>Total</span>
          <span className="tabular-nums">
            {formatPrice(total, currency)}
          </span>
        </div>
      </div>

      {/* CTA */}
      <div className="space-y-4 pt-2">
        <Link href="/checkout" className="block">
          <Button className="w-full h-12 text-base">
            Secure checkout
          </Button>
        </Link>

        <p className="text-center text-xs text-[var(--muted)]">
          Secure payment · Instant digital delivery
        </p>
      </div>
    </div>
  );
}