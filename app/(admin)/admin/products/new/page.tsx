import { getAdminCategories } from "@/lib/admin.products.server";
import { createAdminProduct } from "@/lib/admin.products.actions";
import ProductForm from "@/components/admin/ProductForm";
import { redirect } from "next/navigation";
import type { ProductFormat, ProductStatus } from "@prisma/client";

type FormData = {
  title: string;
  price: number;
  format?: ProductFormat;
  categoryId: string;
  status: ProductStatus;
  fileKey: string | null;
};

export default async function NewProductPage() {
  const categories = await getAdminCategories();

  async function handleCreateProduct(data: FormData) {
    "use server";

    await createAdminProduct({
      title: data.title,
      price: data.price,
      format: data.format,
      categoryId: data.categoryId,
      status: data.status,
      fileKey: data.fileKey,
    });

    redirect("/admin/products");
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Create Product</h1>

      <ProductForm
        categories={categories}
        onSubmit={handleCreateProduct}
      />
    </main>
  );
}
