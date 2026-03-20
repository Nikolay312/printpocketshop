import { getAdminCategories } from "@/lib/admin.products.server";
import { createAdminProduct } from "@/lib/admin.products.actions";
import ProductForm, {
  type AdminProductFormData,
} from "@/components/admin/ProductForm";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await getAdminCategories();

  async function handleCreateProduct(data: AdminProductFormData) {
    "use server";

    await createAdminProduct({
      title: data.title,
      description: data.description,
      price: data.price,
      format: data.format,
      categoryId: data.categoryId,
      status: data.status,
      files: data.files,
      previewImages: data.previewImages ?? [],
    });

    redirect("/admin/products");
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-6 py-10">
      <h1 className="text-2xl font-bold">Create Product</h1>

      <ProductForm
        categories={categories}
        onSubmit={handleCreateProduct}
      />
    </main>
  );
}