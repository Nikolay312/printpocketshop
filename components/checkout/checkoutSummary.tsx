"use client";

import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/formatPrice";
import type { Product } from "@/types/product";

/* =========================
   TYPES
========================= */

type CartItem = {
  product: Product;
  quantity: number;
};

type Props = {
  items: CartItem[];
  total: number;
};

/* =========================
   COMPONENT
========================= */

export default function CheckoutSummary({ items, total }: Props) {
  const router = useRouter();

  const handlePlaceOrder = async () => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({
          productId: i.product.id,
          quantity: i.quantity,
        })),
      }),
    });

    if (!res.ok) {
      throw new Error("Failed to start checkout");
    }

    const { url } = await res.json();
    router.push(url);
  };

  return (
    <div className="border border-border bg-background p-6 space-y-6">
      {/* HEADER */}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">
          Order summary
        </h2>
        <p className="text-xs text-muted">
          Confirm your items before proceeding to secure payment.
        </p>
      </div>

      {/* LINE ITEMS */}
      <ul className="divide-y divide-border">
        {items.map((item) => (
          <li
            key={item.product.id}
            className="flex items-center justify-between py-3 text-sm"
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

      {/* TOTAL */}
      <div className="border-t border-border pt-4 space-y-2">
        <div className="flex justify-between text-sm text-muted">
          <span>Subtotal</span>
          <span>{formatPrice(total)}</span>
        </div>

        <div className="flex justify-between text-base font-semibold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={handlePlaceOrder}
        className="w-full bg-accent text-white py-3 text-sm font-semibold transition-colors hover:bg-accent-hover"
      >
        Proceed to secure payment
      </button>

      {/* TRUST NOTE */}
      <p className="text-xs text-muted text-center">
        Secure encrypted checkout · Instant digital delivery · No subscription
      </p>
    </div>
  );
}
