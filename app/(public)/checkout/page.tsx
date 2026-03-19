"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartContext";
import { formatPrice } from "@/lib/formatPrice";
import { isAuthenticated } from "@/lib/auth";
import PaymentBox from "@/components/checkout/PaymentBox";

type DiscountState = {
  code: string;
  discountAmount: number;
} | null;

type CheckoutSummaryState = {
  subtotal: number;
  discountAmount: number;
  total: number;
  currency: string;
};

export default function CheckoutPage() {
  const { cartItems, totalPrice, currency } = useCart();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [processing, setProcessing] = useState(false);

  const [discount, setDiscount] = useState<DiscountState>(null);
  const [summary, setSummary] = useState<CheckoutSummaryState | null>(null);

  useEffect(() => setMounted(true), []);

  const fallbackCurrency = currency ?? cartItems[0]?.currency ?? "USD";

  const subtotal = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  /* =========================
     AUTH GUARD
  ========================= */

  useEffect(() => {
    if (!mounted) return;

    let active = true;

    (async () => {
      const ok = await isAuthenticated();
      if (!active) return;

      setAuthed(ok);

      if (!ok) {
        router.replace("/login?next=/checkout");
      }
    })();

    return () => {
      active = false;
    };
  }, [mounted, router]);

  /* =========================
     EMPTY CART GUARD
  ========================= */

  useEffect(() => {
    if (!mounted) return;
    if (authed !== true) return;

    if (cartItems.length === 0) {
      router.replace("/shop");
    }
  }, [mounted, authed, cartItems.length, router]);

  /* =========================
     KEEP SUMMARY IN SYNC
  ========================= */

  useEffect(() => {
    const nextSubtotal = subtotal;
    const nextDiscountAmount = discount?.discountAmount ?? 0;
    const nextTotal = Math.max(0, nextSubtotal - nextDiscountAmount);

    setSummary({
      subtotal: nextSubtotal,
      discountAmount: nextDiscountAmount,
      total: nextTotal,
      currency: fallbackCurrency,
    });
  }, [subtotal, discount, fallbackCurrency]);

  /* =========================
     APPLY DISCOUNT
  ========================= */

  const handleApplyDiscount = async (code: string) => {
    try {
      const ok = await isAuthenticated();
      if (!ok) {
        router.replace("/login?next=/checkout");
        return {
          success: false,
          error: "Please log in to apply a discount code.",
        };
      }

      const res = await fetch("/api/checkout/apply-discount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({ code }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        return {
          success: false,
          error: data?.error || "Unable to apply discount code.",
        };
      }

      const appliedCode =
        typeof data?.discount?.code === "string" ? data.discount.code : code.toUpperCase();

      const discountAmount =
        typeof data?.summary?.discountAmount === "number"
          ? data.summary.discountAmount
          : 0;

      const nextCurrency =
        typeof data?.summary?.currency === "string"
          ? data.summary.currency
          : fallbackCurrency;

      const nextSubtotal =
        typeof data?.summary?.subtotal === "number"
          ? data.summary.subtotal
          : subtotal;

      const nextTotal =
        typeof data?.summary?.total === "number"
          ? data.summary.total
          : Math.max(0, nextSubtotal - discountAmount);

      setDiscount({
        code: appliedCode,
        discountAmount,
      });

      setSummary({
        subtotal: nextSubtotal,
        discountAmount,
        total: nextTotal,
        currency: nextCurrency,
      });

      return {
        success: true,
        code: appliedCode,
        discountAmount,
        total: formatPrice(nextTotal, nextCurrency),
      };
    } catch {
      return {
        success: false,
        error: "Unable to apply discount code.",
      };
    }
  };

  /* =========================
     REMOVE DISCOUNT
  ========================= */

  const handleRemoveDiscount = async () => {
    try {
      const ok = await isAuthenticated();
      if (!ok) {
        router.replace("/login?next=/checkout");
        return {
          success: false,
          error: "Please log in to update your checkout.",
        };
      }

      const res = await fetch("/api/checkout/remove-discount", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        return {
          success: false,
          error: data?.error || "Unable to remove discount code.",
        };
      }

      setDiscount(null);

      setSummary({
        subtotal,
        discountAmount: 0,
        total: subtotal,
        currency: fallbackCurrency,
      });

      return { success: true };
    } catch {
      return {
        success: false,
        error: "Unable to remove discount code.",
      };
    }
  };

  /* =========================
     CHECKOUT HANDLER
  ========================= */

const handlePay = async () => {
  if (processing) return;

  try {
    setProcessing(true);

    const ok = await isAuthenticated();
    if (!ok) {
      router.replace("/login?next=/checkout");
      return;
    }

    const res = await fetch("/api/checkout/stripe", {
      method: "POST",
      credentials: "include",
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.url || typeof data.url !== "string") {
      throw new Error(data?.error || "Stripe session failed");
    }

    window.location.assign(data.url);
  } catch {
    // replace with toast if available
    alert("Unable to initiate payment. Please try again.");
  } finally {
    setProcessing(false);
  }
};

  if (!mounted) return null;
  if (authed === null) return null;
  if (authed === false) return null;
  if (cartItems.length === 0) return null;

  return (
    <div className="mx-auto max-w-[680px] px-6 py-28">
      <PaymentBox
        items={cartItems}
        total={formatPrice(
          summary?.total ?? totalPrice,
          summary?.currency ?? fallbackCurrency
        )}
        appliedDiscount={discount}
        onApplyDiscount={handleApplyDiscount}
        onRemoveDiscount={handleRemoveDiscount}
        onPay={handlePay}
        loading={processing}
      />
    </div>
  );
}