"use client";

import { useCart } from "@/components/cart/CartContext";
import { formatPrice } from "@/lib/formatPrice";

type CartItem = {
  id: string;
  productId: string;
  title: string;
  slug: string;
  price: number;
  currency: string;
  quantity: number;
  license: "PERSONAL" | "COMMERCIAL";
};

export default function CartItemRow({ item }: { item: CartItem }) {
  const { removeFromCart } = useCart();

  return (
    <div className="flex items-start justify-between gap-6 border-b border-border py-4">
      <div className="space-y-1">
        <p className="font-medium leading-snug text-foreground">
          {item.title || "Untitled product"}
        </p>

        <p className="text-sm text-muted">
          Quantity · {item.quantity}
        </p>
      </div>

      <div className="flex items-center gap-5">
        <span className="whitespace-nowrap font-semibold text-foreground">
          {formatPrice(item.price * item.quantity, item.currency || "EUR")}
        </span>

        <button
          type="button"
          onClick={() => removeFromCart(item.id)}
          className="text-xs font-medium text-muted underline-offset-4 transition hover:text-red-600 hover:underline"
        >
          Remove
        </button>
      </div>
    </div>
  );
}