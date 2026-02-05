"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

interface Props {
  total: string;
  onPay: () => Promise<void> | void;
}

export default function PaymentBox({ total, onPay }: Props) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await onPay();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card space-y-6 p-6">
      {/* Header */}
      <header className="space-y-1">
        <h2 className="text-lg font-semibold text-foreground">
          Secure payment
        </h2>
        <p className="text-sm text-muted">
          Your payment is processed securely via Stripe
        </p>
      </header>

      {/* Total */}
      <div className="flex items-center justify-between rounded-lg bg-surface px-4 py-3">
        <span className="text-sm font-medium text-muted">
          Total amount
        </span>
        <span className="text-2xl font-semibold text-foreground">
          {total}
        </span>
      </div>

      {/* CTA */}
      <Button
        onClick={handlePay}
        loading={loading}
        className="w-full py-3 text-base"
      >
        {loading ? "Redirecting to secure checkout…" : "Proceed to payment"}
      </Button>

      {/* Trust */}
      <div className="space-y-1 text-xs text-muted">
        <p>✔ Secure, encrypted payment</p>
        <p>✔ Instant digital delivery after checkout</p>
        <p>✔ No physical shipping required</p>
      </div>
    </div>
  );
}
