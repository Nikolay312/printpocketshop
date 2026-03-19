import Link from "next/link";
import { DiscountCode } from "@prisma/client";
import {
  getAllDiscountCodesForAdmin,
  deleteDiscountCode,
} from "@/lib/admin.server";
import { formatPrice } from "@/lib/formatPrice";

type AdminDiscountCode = DiscountCode & {
  usedCount: number;
};

export default async function AdminCodesPage() {
  const codes: AdminDiscountCode[] = await getAllDiscountCodesForAdmin();

  return (
    <div className="space-y-24">
      <section className="rounded-3xl border border-border bg-background shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        {/* Header */}
        <div className="flex items-center justify-between px-16 pt-16">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Codes</h1>
            <p className="mt-2 text-sm text-muted">
              Manage discount codes for checkout.
            </p>
          </div>

          <Link
            href="/admin/codes/new"
            className="inline-flex items-center rounded-full border border-border px-5 py-2 text-sm font-medium text-foreground transition hover:bg-muted/20"
          >
            Create code
          </Link>
        </div>

        <div className="px-16 py-16">
          {codes.length === 0 ? (
            <div className="py-20 text-center text-muted">
              No discount codes found.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {codes.map((code) => {
                const value =
                  code.discountType === "PERCENT"
                    ? `${code.percentOff ?? 0}%`
                    : formatPrice(code.amountOff ?? 0, code.currency ?? "EUR");

                const usageText =
                  typeof code.maxUses === "number"
                    ? `${code.usedCount}/${code.maxUses}`
                    : `${code.usedCount}`;

                async function deleteAction() {
                  "use server";
                  await deleteDiscountCode(code.id);
                }

                return (
                  <div
                    key={code.id}
                    className="flex items-center justify-between gap-8 py-8"
                  >
                    {/* Left */}
                    <div className="space-y-2">
                      <div className="text-base font-medium uppercase tracking-wide text-foreground">
                        {code.code}
                      </div>

                      <div className="text-sm text-muted">
                        {code.discountType} · {value}
                      </div>

                      <div className="text-xs text-muted">
                        Used: {usageText}
                        {code.perUserLimit
                          ? ` · Per user: ${code.perUserLimit}`
                          : ""}
                      </div>

                      <div className="text-xs text-muted">
                        {code.expiresAt
                          ? `Expires ${new Date(
                              code.expiresAt
                            ).toLocaleDateString()}`
                          : "No expiration"}
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-6">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                          code.isActive
                            ? "bg-emerald-500/10 text-emerald-600"
                            : "bg-neutral-500/10 text-neutral-600"
                        }`}
                      >
                        {code.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>

                      <Link
                        href={`/admin/codes/${code.id}`}
                        className="rounded-full border border-border px-4 py-1 text-xs font-medium text-foreground hover:bg-muted/30"
                      >
                        Edit
                      </Link>

                      <form action={deleteAction}>
                        <button
                          type="submit"
                          className="rounded-full border border-red-500/30 px-4 py-1 text-xs font-medium text-red-600 hover:bg-red-500/10"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}