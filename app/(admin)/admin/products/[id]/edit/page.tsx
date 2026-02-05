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

  if (!product) notFound();

  const productId = product.id;

  async function handleUpdateProduct(data: AdminProductFormData) {
    "use server";

    await updateAdminProduct({
      id: productId,
      title: data.title,
      description: data.description,
      price: data.price,
      format: data.format,
      categoryId: data.categoryId,
      status: data.status,
      fileKey: data.fileKey,
      previewImages: data.previewImages, // ✅ persist previews
    });

    redirect("/admin/products");
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-10 space-y-6">
      <h1 className="text-2xl font-bold">Edit Product</h1>

      <ProductForm
        categories={categories}
        initial={{
          title: product.title,
          description: product.description ?? "",
          price: product.price,
          format: product.format,
          status: product.status,
          fileKey: product.fileKey,
          previewImages: product.previewImages,
          category: {
            id: product.category.id,
            name: product.category.name,
            slug: product.category.slug,
          },
        }}
        onSubmit={handleUpdateProduct}
      />
    </main>
  );
}
