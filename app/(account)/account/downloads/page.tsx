import { redirect } from "next/navigation";
import Link from "next/link";

import { getCurrentUserId } from "@/lib/auth.server";
import { getPurchasedProductsForUser } from "@/lib/orders.server";
import DownloadItem from "@/components/account/downloadItem";

export default async function DownloadsPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const items = await getPurchasedProductsForUser(userId);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 sm:space-y-8">

      <section className="rounded-3xl bg-card p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] sm:p-6 lg:p-8">
        {items.length === 0 ? (
          <div className="mx-auto flex max-w-xl flex-col items-start justify-center py-6 sm:py-10">

            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Your purchased files will appear here
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-[15px]">
              Once you complete a purchase, your downloadable files will become
              available here and stay accessible from your account.
            </p>

            <div className="mt-6">
              <Link
                href="/shop"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-foreground px-5 py-3 text-sm font-semibold text-background transition-transform duration-200 hover:-translate-y-0.5 sm:px-6"
              >
                Browse templates
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-5 sm:space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Purchased files
                </div>
                <h2 className="mt-3 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  {items.length} {items.length === 1 ? "download" : "downloads"}
                </h2>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Re-download your purchased files anytime from your account.
                </p>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {items.map((item, index) => {
                const safeKey = `${item.orderId}-${item.product?.id ?? "deleted"}-${index}`;

                return <DownloadItem key={safeKey} item={item} />;
              })}
            </div>

            <div className="rounded-2xl bg-muted/40 px-4 py-4 sm:px-5">
              <p className="text-sm leading-6 text-muted-foreground">
                All purchased files remain available here in your account after
                checkout for quick and easy access across devices.
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}