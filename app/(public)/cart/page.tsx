// app/(public)/cart/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";
import CartItemRow from "@/components/cart/CartItemRow";
import CartSummary from "@/components/cart/CartSummary";
import Button from "@/components/ui/Button";

export default function CartPage() {
  const { cartItems, totalPrice } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    Promise.resolve().then(() => setMounted(true));
  }, []);

  if (!mounted) {
    return <main className="mx-auto max-w-5xl px-6 py-12" />;
  }

  /* Empty state */
  if (cartItems.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-32 text-center space-y-10">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold text-foreground">
            Your cart is empty
          </h1>
          <p className="text-muted max-w-md mx-auto">
            Browse our premium digital templates and add products to your cart.
            You’ll get instant access after checkout.
          </p>
        </div>

        <Link href="/shop" className="btn-primary">
          Browse products
        </Link>
      </main>
    );
  }

  /* Cart with items */
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 grid grid-cols-1 gap-12 md:grid-cols-3">
      {/* Items */}
      <section className="md:col-span-2 space-y-6">
        <h1 className="text-2xl font-semibold text-foreground">
          Your cart
        </h1>

        <div className="space-y-4">
          {cartItems.map((item) => (
            <CartItemRow
              key={item.product.id}
              item={item}
            />
          ))}
        </div>
      </section>

      {/* Summary */}
      <CartSummary
        items={cartItems}
        total={totalPrice}
      />
    </main>
  );
}
