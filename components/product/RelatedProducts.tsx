import type { Product } from "@/types/product";
import { products as mockProducts } from "@/mock/products";
import { mapMockProductToProduct } from "@/lib/mappers/mockProductMapper";
import ProductCard from "@/components/product/ProductCard";

interface Props {
  product: Product;
}

export default function RelatedProducts({ product }: Props) {
  const products = mockProducts.map(mapMockProductToProduct);

  const related = products
    .filter(
      (p) =>
        p.id !== product.id &&
        p.category.id === product.category.id
    )
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="mt-20 space-y-6">
      <h2 className="text-xl font-semibold">
        You may also like
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {related.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </section>
  );
}
