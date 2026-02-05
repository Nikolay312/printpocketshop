import { getCurrentUserId } from "@/lib/auth.server";
import { getPurchasedProductsForUser } from "@/lib/orders.server";
import DownloadItem from "@/components/account/downloadItem";
import Link from "next/link";

export default async function DownloadsPage() {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  const items = await getPurchasedProductsForUser(userId);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 space-y-8">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">
          My downloads
        </h1>
        <p className="text-sm text-muted">
          Access and download all your purchased digital products.
        </p>
      </header>

      {/* Content */}
      {items.length === 0 ? (
        <div className="card-soft space-y-4 p-6">
          <p className="text-sm text-muted">
            You don’t have any downloads yet.
          </p>

          <p className="text-sm text-muted">
            Once you complete a purchase, your digital files will appear here
            and remain доступни for lifetime access.
          </p>

          <Link href="/shop" className="btn-primary w-fit">
            Browse products
          </Link>
        </div>
      ) : (
        <section className="space-y-4">
          {items.map((item) => (
            <DownloadItem
              key={`${item.orderId}-${item.product.id}`}
              product={item.product}
            />
          ))}
        </section>
      )}
    </main>
  );
}
