import { redirect } from "next/navigation";
import Link from "next/link";

import { getCurrentUserId } from "@/lib/auth.server";
import { getPurchasedProductsForUser } from "@/lib/orders.server";
import DownloadItem from "@/components/account/downloadItem"; // ✅ fixed casing

export default async function DownloadsPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const items = await getPurchasedProductsForUser(userId);

  return (
    <div className="space-y-24">
      <section className="rounded-3xl border border-border bg-background shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div className="px-24 py-24">
          {items.length === 0 ? (
            <div className="max-w-xl space-y-6">
              <h3 className="text-xl font-semibold tracking-tight text-foreground">
                No downloads yet
              </h3>

              <p className="text-sm leading-relaxed text-muted">
                Once you complete a purchase, your downloadable files will
                appear here and remain available in your account.
              </p>

              <div className="pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center rounded-2xl bg-foreground px-10 py-4 text-sm font-semibold text-background shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Browse templates
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-14">
              <div className="space-y-5">
                {items.map((item, index) => {
                  // ✅ Safe key even if product is deleted
                  const safeKey = `${item.orderId}-${item.product?.id ?? "deleted"}-${index}`;

                  return (
                    <DownloadItem
                      key={safeKey}
                      item={item}
                    />
                  );
                })}
              </div>

              <div className="rounded-2xl border border-border bg-muted/30 px-8 py-6 text-sm text-muted">
                All purchased files remain accessible here from your account
                after checkout.
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}