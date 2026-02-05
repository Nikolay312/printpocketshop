"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartContext";
import { formatPrice } from "@/lib/formatPrice";

import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import OrderSummary from "@/components/checkout/OrderSummary";
import PaymentBox from "@/components/checkout/PaymentBox";

export default function CheckoutPage() {
  const { cartItems, totalPrice } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (cartItems.length === 0) {
      router.replace("/cart");
    }
  }, [cartItems.length, router]);

  const handlePay = async () => {
    try {
      const res = await fetch("/api/checkout/stripe", {
        method: "POST",
        credentials: "include", // ✅ REQUIRED
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Checkout failed");
      }

      window.location.href = data.url;
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Failed to start checkout.");
    }
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <main>
      <div className="mx-auto max-w-7xl px-6 py-24 space-y-20">
        <CheckoutHeader step={2} />

        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.45fr_1fr]">
          {/* LEFT — Order summary */}
          <section className="space-y-6">
            <header className="space-y-1">
              <h2 className="text-xl font-semibold text-foreground">
                Order summary
              </h2>
              <p className="text-sm text-muted">
                Review your items before completing payment
              </p>
            </header>

            <div className="card p-6">
              <OrderSummary items={cartItems} />
            </div>
          </section>

          {/* RIGHT — Payment */}
          <aside className="lg:sticky lg:top-28 h-fit space-y-6">
            <header className="space-y-1">
              <h2 className="text-xl font-semibold text-foreground">
                Payment
              </h2>
              <p className="text-sm text-muted">
                Secure checkout powered by Stripe
              </p>
            </header>

            <div className="card p-6 space-y-5">
              <PaymentBox
                total={formatPrice(totalPrice)}
                onPay={handlePay}
              />

              <div className="pt-2 space-y-1 text-xs text-muted">
                <p>✔ Encrypted & secure payment</p>
                <p>✔ Instant digital delivery</p>
                <p>✔ No physical shipping</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
