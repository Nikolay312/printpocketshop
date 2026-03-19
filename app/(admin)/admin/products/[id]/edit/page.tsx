import { notFound, redirect } from "next/navigation";
import ProductForm, {
  type AdminProductFormData,
} from "@/components/admin/ProductForm";
import {
  getAdminProductById,
  getAdminCategories,
} from "@/lib/admin.products.server";
import { updateAdminProduct } from "@/lib/admin.products.actions";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  if (!id) notFound();

  const product = await getAdminProductById(id);
  const categories = await getAdminCategories();

  if (!product) {
    notFound();
  }

  const safeProduct = product; // ✅ Now guaranteed non-null

  async function handleUpdateProduct(data: AdminProductFormData) {
    "use server";

    await updateAdminProduct({
      id: safeProduct.id,
      title: data.title,
      description: data.description,
      price: data.price,
      format: data.format,
      categoryId: data.categoryId,
      status: data.status,
      files: data.files,
      previewImages: data.previewImages,
    });

    redirect("/admin/products");
  }

  return (
    <main className="space-y-10">
      <header className="space-y-3">
        <p className="text-xs font-medium tracking-[0.2em] text-muted uppercase">
          Catalog Management
        </p>

        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Edit Product
          </h1>
          <p className="text-muted text-base">
            Update product details, pricing, file assets, and visibility.
          </p>
        </div>
      </header>

      <section className="border border-border bg-background p-6 sm:p-8 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <ProductForm
          categories={categories}
          initial={{
            title: product.title,
            description: product.description ?? "",
            price: product.price,
            format: product.format,
            status: product.status,
            files: product.files ?? [],              // ✅ already string[]
            previewImages: product.previewImages ?? [], // ✅ already string[]
            category: {
              id: product.category.id,
              name: product.category.name,
              slug: product.category.slug,
            },
          }}
          onSubmit={handleUpdateProduct}
        />
      </section>
    </main>
  );
}