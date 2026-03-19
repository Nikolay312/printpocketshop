import { prisma } from "@/lib/prisma";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/admin.categories.actions";
import { revalidatePath } from "next/cache";

type CategoryWithProductCount = {
  id: string;
  name: string;
  slug: string;
  _count: {
    products: number;
  };
};

export default async function AdminCategoriesPage() {
  const categories: CategoryWithProductCount[] = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });

  async function handleCreate(formData: FormData) {
    "use server";
    const name = formData.get("name") as string;
    if (!name) return;
    await createCategory(name);
    revalidatePath("/admin/categories");
  }

  async function handleUpdate(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    if (!id || !name) return;
    await updateCategory(id, name);
    revalidatePath("/admin/categories");
  }

  async function handleDelete(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    if (!id) return;
    await deleteCategory(id);
    revalidatePath("/admin/categories");
  }

  return (
    <div className="space-y-24">
      {/* CREATE */}
      <section className="rounded-3xl border border-border bg-background shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div className="px-16 py-12">
          <form action={handleCreate} className="flex flex-wrap gap-4">
            <input
              name="name"
              placeholder="New category name"
              required
              className="h-11 rounded-xl border border-border bg-background px-4 text-sm outline-none transition focus:ring-2 focus:ring-accent/20"
            />

            <button
              type="submit"
              className="rounded-xl bg-foreground px-6 py-2.5 text-sm font-semibold text-background shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
            >
              Add Category
            </button>
          </form>
        </div>
      </section>

      {/* LIST */}
      <section className="rounded-3xl border border-border bg-background shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div className="px-16 py-16">
          {categories.length > 0 ? (
            <div className="divide-y divide-border">
              {categories.map((cat) => {
                const canDelete = cat._count.products === 0;

                return (
                  <div
                    key={cat.id}
                    className="flex items-center justify-between py-8"
                  >
                    {/* EDIT */}
                    <form
                      action={handleUpdate}
                      className="flex items-center gap-6"
                    >
                      <input type="hidden" name="id" value={cat.id} />

                      <div className="space-y-2">
                        <input
                          name="name"
                          defaultValue={cat.name}
                          className="h-10 rounded-lg border border-border bg-background px-3 text-sm font-medium outline-none transition focus:ring-2 focus:ring-accent/20"
                        />

                        <div className="text-xs text-muted">/{cat.slug}</div>
                      </div>

                      <button
                        type="submit"
                        className="text-sm font-medium text-muted transition-all duration-200 hover:text-foreground hover:-translate-y-0.5 active:scale-[0.97]"
                      >
                        Save
                      </button>
                    </form>

                    {/* DELETE */}
                    <form action={handleDelete}>
                      <input type="hidden" name="id" value={cat.id} />

                      <button
                        type="submit"
                        disabled={!canDelete}
                        title={
                          !canDelete
                            ? "Cannot delete category with products"
                            : "Delete category"
                        }
                        className={`text-sm font-medium transition-all duration-200 ${
                          canDelete
                            ? "text-red-600 hover:text-red-700 hover:-translate-y-0.5 active:scale-[0.97]"
                            : "text-red-400 opacity-40 cursor-not-allowed"
                        }`}
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-20 text-center text-muted">
              No categories yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}