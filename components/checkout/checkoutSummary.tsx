"use client";

import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/formatPrice";
import { useCart } from "@/components/cart/CartContext";
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
  const { clearCart } = useCart();

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
    router.push(url); // redirect to Stripe
  };

  return (
    <div className="border rounded-lg p-6 space-y-4">
      <h2 className="text-xl font-semibold">Order Summary</h2>

      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.product.id}
            className="flex justify-between"
          >
            <span>
              {item.product.title} × {item.quantity}
            </span>
            <span>
              {formatPrice(item.product.price * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <div className="border-t pt-4 flex justify-between font-bold">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>

      <button
        onClick={handlePlaceOrder}
        className="w-full bg-black text-white py-3 rounded-lg hover:opacity-90"
      >
        Proceed to payment
      </button>
    </div>
  );
}
