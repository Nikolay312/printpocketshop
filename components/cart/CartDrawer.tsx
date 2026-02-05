"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";
import { formatPrice } from "@/lib/formatPrice";

export default function CartDrawer() {
  const {
    cartItems,
    totalPrice,
    isOpen,
    closeCart,
    removeFromCart,
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
        aria-hidden
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background shadow-2xl"
      >
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold text-foreground">
            Your cart
          </h2>
          <button
            onClick={closeCart}
            className="rounded-md px-2 py-1 text-sm text-muted transition hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:shadow-[var(--ring)]"
          >
            Close
          </button>
        </header>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {cartItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center space-y-4">
              <p className="rounded-full bg-surface px-4 py-2 text-sm font-medium text-muted">
                Your cart is empty
              </p>

              <Link
                href="/shop"
                onClick={closeCart}
                className="text-sm font-medium text-foreground underline underline-offset-4 hover:opacity-80"
              >
                Browse products
              </Link>
            </div>
          ) : (
            cartItems.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex items-start gap-4"
              >
                {/* Image */}
                <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-surface border border-border">
                  <Image
                    src={product.previewImages[0]}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 space-y-0.5">
                  <p className="text-sm font-medium leading-snug text-foreground">
                    {product.title}
                  </p>
                  <p className="text-xs text-muted">
                    Quantity {quantity}
                  </p>

                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="text-xs text-muted transition hover:text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>

                {/* Price */}
                <p className="text-sm font-semibold text-foreground">
                  {formatPrice(product.price * quantity)}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <footer className="border-t border-border bg-surface px-6 py-5 space-y-4">
            <div className="flex justify-between text-sm font-semibold text-foreground">
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>

            <Link
              href="/checkout"
              onClick={closeCart}
              className="btn-primary w-full"
            >
              Secure checkout
            </Link>

            <p className="text-center text-xs text-muted">
              Secure payment · Instant digital delivery
            </p>
          </footer>
        )}
      </aside>
    </div>
  );
}
