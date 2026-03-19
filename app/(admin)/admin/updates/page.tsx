import { prisma } from "@/lib/prisma";
import { toggleAdminProductFeatured } from "@/lib/admin.products.actions";
import { revalidatePath } from "next/cache";

export default async function AdminUpdatesPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
    },
  });

  async function toggle(productId: string) {
    "use server";

    await toggleAdminProductFeatured(productId);

    revalidatePath("/admin/updates");
    revalidatePath("/");
  }

  return (
    <div className="space-y-24">
      <section className="rounded-3xl border border-border bg-background shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div className="px-16 py-16">
          {products.length > 0 ? (
            <div className="divide-y divide-border">
              {products.map((product) => {
                const action = toggle.bind(null, product.id);

                return (
                  <form
                    key={product.id}
                    action={action}
                    className="flex items-center justify-between py-8"
                  >
                    <div className="space-y-2">
                      <div className="text-base font-medium text-foreground">
                        {product.title}
                      </div>

                      <div className="text-sm text-muted">
                        {product.category.name}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className={`rounded-xl px-5 py-2.5 text-sm font-medium transition ${
                        product.isFeatured
                          ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                          : "bg-muted text-foreground hover:bg-muted/80"
                      }`}
                    >
                      {product.isFeatured
                        ? "Remove Featured"
                        : "Make Featured"}
                    </button>
                  </form>
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center text-muted">
              No products found.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
