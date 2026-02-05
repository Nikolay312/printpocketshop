"use client";

import Image from "next/image";
import { formatPrice } from "@/lib/formatPrice";
import { CartItem } from "@/components/cart/CartContext";

interface Props {
  items: CartItem[];
}

export default function OrderSummary({ items }: Props) {
  const total = items.reduce(
    (sum, item) =>
      sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="space-y-4 rounded-2xl border p-5">
      <h2 className="font-semibold">Order summary</h2>

      <ul className="space-y-3">
        {items.map(({ product, quantity }) => (
          <li
            key={product.id}
            className="flex items-center gap-3"
          >
            <div className="relative h-12 w-16 rounded-md overflow-hidden bg-gray-100">
              <Image
                src={product.previewImages[0]}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1">
              <p className="text-sm font-medium">
                {product.title}
              </p>
              <p className="text-xs text-gray-500">
                {product.format} · {product.license} · Qty {quantity}
              </p>
            </div>

            <span className="text-sm font-medium">
              {formatPrice(product.price * quantity)}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex justify-between border-t pt-4 font-semibold">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
  );
}
