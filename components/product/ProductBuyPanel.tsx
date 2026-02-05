"use client";

import { Product } from "@/types/product";
import { formatPrice } from "@/lib/formatPrice";
import { useCart } from "@/components/cart/CartContext";
import Button from "@/components/ui/Button";

interface Props {
  product: Product;
}

export default function ProductBuyPanel({ product }: Props) {
  const { addToCart } = useCart();

  return (
    <aside className="card space-y-6 p-6">
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-xl font-semibold leading-snug">
          {product.title}
        </h1>
        <p className="text-sm text-muted">
          Digital product · Instant download
        </p>
      </div>

      {/* Price */}
      <div className="space-y-1">
        <p className="text-4xl font-bold tracking-tight">
          {formatPrice(product.price)}
        </p>
        <p className="text-sm text-muted">
          One-time purchase · No subscription
        </p>
      </div>

      {/* Details */}
      <div className="divide-y rounded-lg border border-border text-sm">
        <div className="flex justify-between px-4 py-3">
          <span className="text-muted">Format</span>
          <span className="font-medium">{product.format}</span>
        </div>
        <div className="flex justify-between px-4 py-3">
          <span className="text-muted">License</span>
          <span className="font-medium capitalize">
            {product.license}
          </span>
        </div>
      </div>

      {/* License explanation */}
      <div className="rounded-lg bg-surface-muted p-4 text-sm text-muted">
        {product.license === "PERSONAL" ? (
          <p>
            ✔ Personal license — for individual use only. Not permitted for resale
            or client projects.
          </p>
        ) : (
          <p>
            ✔ Commercial license — approved for client work and business use.
          </p>
        )}
      </div>

      {/* CTA */}
      <Button
        onClick={() => addToCart(product)}
        className="w-full py-3 text-base"
      >
        Add to cart
      </Button>

      {/* Trust */}
      <p className="text-center text-xs text-muted">
        Secure checkout · Instant digital delivery
      </p>

      <div className="space-y-1 text-xs text-muted">
        <p>✔ Instant digital delivery</p>
        <p>✔ Secure payment processing</p>
        <p>✔ Lifetime access from your account</p>
      </div>
    </aside>
  );
}
