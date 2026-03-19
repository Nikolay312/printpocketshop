import { prisma } from "@/lib/prisma";

export default async function AdminHomePage() {
  const [
    totalProducts,
    publishedProducts,
    draftProducts,
    totalOrders,
    paidOrders,
    totalInvoices,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { status: "PUBLISHED" } }),
    prisma.product.count({ where: { status: "DRAFT" } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PAID" } }),
    prisma.invoice.count(),
  ]);

  return (
    <div className="space-y-24">
      {/* ================= STATS SURFACE ================= */}
      <section className="rounded-3xl border border-border bg-background shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div className="px-16 py-16 space-y-16">
          <div className="grid gap-10 md:grid-cols-3">
            <StatCard title="Total Products" value={totalProducts} />
            <StatCard title="Published Products" value={publishedProducts} />
            <StatCard title="Draft Products" value={draftProducts} />
            <StatCard title="Total Orders" value={totalOrders} />
            <StatCard title="Paid Orders" value={paidOrders} />
            <StatCard title="Invoices Generated" value={totalInvoices} />
          </div>
        </div>
      </section>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-border bg-muted/30 px-8 py-8 transition hover:bg-muted/50">
      <div className="text-xs uppercase tracking-wide text-muted">
        {title}
      </div>

      <div className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
        {value}
      </div>
    </div>
  );
}
