"use client";

import { useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/formatPrice";
import Button from "@/components/ui/Button";
import { Lock, Tag, X } from "lucide-react";

type CartItem = {
  id: string;
  productId: string;
  title: string;
  slug: string;
  price: number; // cents
  currency: string;
  quantity: number;
  license: "PERSONAL" | "COMMERCIAL";
};

type DiscountSummary = {
  code: string;
  discountAmount: number;
};

interface Props {
  items: CartItem[];
  total: string;
  onPay: () => Promise<void> | void;
  loading?: boolean;

  appliedDiscount?: DiscountSummary | null;
  onApplyDiscount?: (code: string) => Promise<{
    success: boolean;
    error?: string;
    code?: string;
    discountAmount?: number;
    total?: string;
  }>;
  onRemoveDiscount?: () => Promise<{
    success: boolean;
    error?: string;
  }>;
}

export default function PaymentBox({
  items,
  total,
  onPay,
  loading = false,
  appliedDiscount = null,
  onApplyDiscount,
  onRemoveDiscount,
}: Props) {
  const currency = items[0]?.currency ?? "USD";

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const [code, setCode] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  const legalLinkStyle =
    "relative font-medium text-neutral-800 transition-colors duration-200 hover:text-black after:absolute after:left-0 after:-bottom-0.5 after:h-[1px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full";

  const handleApplyDiscount = async () => {
    if (!onApplyDiscount) return;

    const trimmed = code.trim();
    if (!trimmed) {
      setPromoError("Please enter a discount code.");
      setPromoSuccess("");
      return;
    }

    try {
      setPromoLoading(true);
      setPromoError("");
      setPromoSuccess("");

      const result = await onApplyDiscount(trimmed);

      if (!result.success) {
        setPromoError(result.error || "Unable to apply discount code.");
        setPromoSuccess("");
        return;
      }

      setPromoSuccess(
        result.code
          ? `Discount code ${result.code} applied.`
          : "Discount code applied."
      );
      setPromoError("");
      setCode("");
    } catch {
      setPromoError("Unable to apply discount code.");
      setPromoSuccess("");
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemoveDiscount = async () => {
    if (!onRemoveDiscount) return;

    try {
      setPromoLoading(true);
      setPromoError("");
      setPromoSuccess("");

      const result = await onRemoveDiscount();

      if (!result.success) {
        setPromoError(result.error || "Unable to remove discount code.");
        return;
      }

      setPromoSuccess("Discount code removed.");
      setPromoError("");
      setCode("");
    } catch {
      setPromoError("Unable to remove discount code.");
      setPromoSuccess("");
    } finally {
      setPromoLoading(false);
    }
  };

  return (
    <div className="space-y-18 animate-[fadeIn_.25s_ease-out]">
      {/* ORDER */}
      <section className="space-y-10">
        <ul className="space-y-10">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-start gap-8"
            >
              <div className="min-w-0 space-y-2">
                <p className="text-lg font-medium text-black leading-snug line-clamp-2">
                  {item.title}
                </p>
                <p className="text-sm text-neutral-500">
                  Quantity: {item.quantity}
                </p>
              </div>

              <p className="text-lg font-semibold text-black tabular-nums shrink-0 tracking-tight">
                {formatPrice(item.price * item.quantity, currency)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <div className="h-px bg-neutral-200" />

      {/* DISCOUNT CODE */}
      <section className="space-y-5">
        <div className="space-y-3">
          <label
            htmlFor="discount-code"
            className="text-sm font-medium text-black"
          >
            Discount code
          </label>

          {!appliedDiscount ? (
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Tag
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  id="discount-code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="Enter code"
                  disabled={promoLoading || loading}
                  className="
                    h-13 w-full rounded-2xl border border-neutral-300 bg-white
                    pl-11 pr-4 text-sm text-black outline-none
                    transition-colors duration-200
                    placeholder:text-neutral-400
                    focus:border-black
                    disabled:cursor-not-allowed disabled:opacity-60
                  "
                />
              </div>

              <Button
                type="button"
                onClick={handleApplyDiscount}
                disabled={promoLoading || loading || !code.trim()}
                className="
                  h-13 min-w-[120px]
                  rounded-2xl bg-neutral-100 text-black
                  hover:bg-neutral-200
                  disabled:opacity-60
                "
              >
                {promoLoading ? "Applying..." : "Apply"}
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-black">
                  Code applied:{" "}
                  <span className="tracking-wide">{appliedDiscount.code}</span>
                </p>
                <p className="text-sm text-neutral-600">
                  Savings:{" "}
                  {formatPrice(appliedDiscount.discountAmount, currency)}
                </p>
              </div>

              <button
                type="button"
                onClick={handleRemoveDiscount}
                disabled={promoLoading || loading}
                className="
                  inline-flex h-9 w-9 items-center justify-center rounded-full
                  text-neutral-500 transition-colors duration-200
                  hover:bg-neutral-200 hover:text-black
                  disabled:opacity-60
                "
                aria-label="Remove discount code"
              >
                <X size={16} />
              </button>
            </div>
          )}

          {promoError ? (
            <p className="text-sm text-red-600">{promoError}</p>
          ) : null}

          {promoSuccess ? (
            <p className="text-sm text-green-700">{promoSuccess}</p>
          ) : null}
        </div>
      </section>

      <div className="h-px bg-neutral-200" />

      {/* PRICING */}
      <section className="space-y-8">
        <div className="space-y-5 text-sm text-neutral-700">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="tabular-nums">
              {formatPrice(subtotal, currency)}
            </span>
          </div>

          {appliedDiscount ? (
            <div className="flex justify-between text-green-700">
              <span>Discount ({appliedDiscount.code})</span>
              <span className="tabular-nums">
                -{formatPrice(appliedDiscount.discountAmount, currency)}
              </span>
            </div>
          ) : null}

          <div className="flex justify-between">
            <span>Delivery</span>
            <span>Free</span>
          </div>

          <div className="flex justify-between">
            <span>Tax</span>
            <span>Calculated at next step</span>
          </div>
        </div>

        <div className="flex justify-between items-end pt-4">
          <span className="text-xl font-semibold text-black">Total</span>
          <span className="text-2xl font-semibold text-black tabular-nums tracking-tight">
            {total}
          </span>
        </div>
      </section>

      {/* CTA */}
      <section className="space-y-8">
        <Button
          onClick={onPay}
          disabled={loading || promoLoading}
          loading={loading}
          className="
            w-full
            h-[68px]
            text-base
            font-semibold
            bg-black
            text-white
            hover:bg-neutral-900
            active:scale-[0.995]
            disabled:opacity-60
            transition-all duration-200
          "
        >
          <div className="flex items-center justify-center gap-2">
            {!loading && <Lock size={18} />}
            {loading ? "Processing..." : "Pay securely"}
          </div>
        </Button>

        <div className="text-sm text-neutral-500 text-center leading-relaxed">
          <p>
            By proceeding, you acknowledge and agree to our{" "}
            <Link href="/terms" className={legalLinkStyle}>
              Terms of Service
            </Link>
            ,{" "}
            <Link href="/policies/privacy" className={legalLinkStyle}>
              Privacy Policy
            </Link>
            , and{" "}
            <Link href="/policies/refund" className={legalLinkStyle}>
              Refund Policy
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}