import { requireAdminUser } from "@/lib/auth.server";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/formatPrice";

export default async function AdminInvoicesPage() {
  await requireAdminUser();

  const invoices = await prisma.invoice.findMany({
    orderBy: { issuedAt: "desc" },
    include: {
      user: {
        select: {
          email: true,
        },
      },
      order: {
        select: {
          id: true,
        },
      },
      licenseUpgrade: {
        select: {
          id: true,
        },
      },
    },
  });

  return (
    <div className="space-y-24">
      {/* ================= TABLE SURFACE ================= */}
      <section className="rounded-3xl border border-border bg-background shadow-[0_1px_0_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="px-16 py-16">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-muted uppercase text-xs tracking-wide">
                <tr className="text-left">
                  <th className="pb-6">Invoice #</th>
                  <th className="pb-6">Issued</th>
                  <th className="pb-6">Buyer</th>
                  <th className="pb-6">Type</th>
                  <th className="pb-6">Net</th>
                  <th className="pb-6">VAT</th>
                  <th className="pb-6">Total</th>
                  <th className="pb-6">Currency</th>
                  <th className="pb-6">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-border">
                {invoices.map((invoice) => {
                  const type = invoice.order
                    ? "Order"
                    : invoice.licenseUpgrade
                    ? "License upgrade"
                    : "—";

                  return (
                    <tr key={invoice.id} className="hover:bg-muted/20 transition">
                      <td className="py-6 font-mono text-foreground">
                        {invoice.invoiceNumber}
                      </td>

                      <td className="py-6 text-muted">
                        {invoice.issuedAt.toISOString().slice(0, 10)}
                      </td>

                      <td className="py-6 text-foreground">
                        {invoice.user.email}
                      </td>

                      <td className="py-6 text-muted">{type}</td>

                      <td className="py-6 text-muted">
                        {formatPrice(invoice.netAmount)}
                      </td>

                      <td className="py-6 text-muted">
                        {formatPrice(invoice.vatAmount)}
                      </td>

                      <td className="py-6 font-semibold text-foreground">
                        {formatPrice(invoice.grossAmount)}
                      </td>

                      <td className="py-6 text-muted">{invoice.currency}</td>

                      <td className="py-6">
                        {invoice.refundedAt ? (
                          <span className="inline-flex items-center rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-600">
                            Refunded
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-600">
                            Paid
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {!invoices.length && (
                  <tr>
                    <td colSpan={9} className="py-20 text-center text-muted">
                      No invoices issued yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
