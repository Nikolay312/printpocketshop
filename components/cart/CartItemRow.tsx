"use client";

import { CartItem } from "@/types/cart";
import { useCart } from "@/components/cart/CartContext";
import { formatPrice } from "@/lib/formatPrice";

export default function CartItemRow({ item }: { item: CartItem }) {
  const { removeFromCart } = useCart();

  return (
    <div className="flex items-start justify-between gap-6 border-b border-border py-4">
      {/* Product info */}
      <div className="space-y-1">
        <p className="font-medium leading-snug text-foreground">
          {item.product.title}
        </p>

        <p className="text-sm text-muted">
          Quantity · {item.quantity}
        </p>
      </div>

      {/* Price + action */}
      <div className="flex items-center gap-5">
        <span className="font-semibold text-foreground whitespace-nowrap">
          {formatPrice(item.product.price * item.quantity)}
        </span>

        <button
          type="button"
          onClick={() => removeFromCart(item.product.id)}
          className="text-xs font-medium text-muted transition hover:text-red-600 hover:underline underline-offset-4"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
