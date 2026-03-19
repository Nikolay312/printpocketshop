"use client";

import { useState } from "react";

type Props = {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: {
    code?: string;
    discountType?: "PERCENT" | "FIXED";
    percentOff?: number | null;
    amountOff?: number | null;
    maxUses?: number | null;
    perUserLimit?: number | null;
    expiresAt?: Date | null;
    isActive?: boolean;
  };
};

export default function DiscountCodeForm({ action, defaultValues }: Props) {
  const [discountType, setDiscountType] = useState(
    defaultValues?.discountType ?? "PERCENT"
  );

  return (
    <form action={action} className="space-y-12">
      {/* Code */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Discount Code
        </label>

        <input
          name="code"
          defaultValue={defaultValues?.code ?? ""}
          required
          className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-muted"
        />
      </div>

      {/* Discount Type */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Discount Type
        </label>

        <select
          name="discountType"
          value={discountType}
          onChange={(e) =>
            setDiscountType(e.target.value as "PERCENT" | "FIXED")
          }
          className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
        >
          <option value="PERCENT">Percent</option>
          <option value="FIXED">Fixed Amount</option>
        </select>
      </div>

      {/* Percent Off */}
      {discountType === "PERCENT" && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Percent Off
          </label>

          <input
            name="percentOff"
            type="number"
            min="1"
            max="100"
            defaultValue={defaultValues?.percentOff ?? ""}
            className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
          />
        </div>
      )}

      {/* Fixed Amount */}
      {discountType === "FIXED" && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Amount Off (USD)
          </label>

          <input
            name="amountOff"
            type="number"
            min="1"
            defaultValue={defaultValues?.amountOff ?? ""}
            className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
          />
        </div>
      )}

      {/* Usage Limits */}
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Max Uses
          </label>

          <input
            name="maxUses"
            type="number"
            min="1"
            defaultValue={defaultValues?.maxUses ?? ""}
            className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Per User Limit
          </label>

          <input
            name="perUserLimit"
            type="number"
            min="1"
            defaultValue={defaultValues?.perUserLimit ?? ""}
            className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
          />
        </div>
      </div>

      {/* Expiration */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">
          Expiration Date
        </label>

        <input
          name="expiresAt"
          type="date"
          defaultValue={
            defaultValues?.expiresAt
              ? new Date(defaultValues.expiresAt)
                  .toISOString()
                  .split("T")[0]
              : ""
          }
          className="w-full rounded-xl border border-border bg-background px-4 py-2 text-sm"
        />
      </div>

      {/* Active Toggle */}
      <div className="flex items-center gap-3">
        <input
          name="isActive"
          type="checkbox"
          defaultChecked={defaultValues?.isActive ?? true}
          className="h-4 w-4"
        />

        <label className="text-sm text-foreground">Active</label>
      </div>

      {/* Submit */}
      <div className="pt-8">
        <button
          type="submit"
          className="rounded-full bg-foreground px-6 py-2 text-sm font-medium text-background transition hover:opacity-90"
        >
          Save Code
        </button>
      </div>
    </form>
  );
}