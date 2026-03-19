import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/formatPrice";
import { deleteAdminProduct } from "@/lib/admin.products.delete";
import { revalidatePath } from "next/cache";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

type AdminProduct = {
  id: string;
  title: string;
  format: string;
  price: number;
  currency: string;
  category: {
    name: string;
  };
};

export default async function AdminProductsPage() {
  const products: AdminProduct[] = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
    },
  });

  async function handleDelete(productId: string) {
    "use server";

    await deleteAdminProduct(productId);
    revalidatePath("/admin/products");
  }

  return (
    <div className="space-y-24">
      <section className="flex items-center justify-end">
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center rounded-2xl bg-foreground px-6 py-3 text-sm font-semibold text-background shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
        >
          + New product
        </Link>
      </section>

      <section className="rounded-3xl border border-border bg-background shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div className="px-16 py-16">
          {products.length > 0 ? (
            <div className="divide-y divide-border">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between py-8"
                >
                  <div className="space-y-2">
                    <div className="text-base font-medium text-foreground">
                      {product.title}
                    </div>

                    <div className="text-sm text-muted">
                      {product.category.name} · {product.format}
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className="text-base font-semibold text-foreground">
                      {formatPrice(product.price, product.currency)}
                    </span>

                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-sm font-medium text-muted hover:text-foreground transition"
                    >
                      Edit
                    </Link>

                    <DeleteProductButton
                      productId={product.id}
                      onDelete={handleDelete}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-muted">
              No products yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}