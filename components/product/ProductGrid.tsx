import { Product } from "@/types/product";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <section
      className="
        grid
        grid-cols-1
        gap-6
        sm:grid-cols-2 sm:gap-7
        lg:grid-cols-3 lg:gap-8
        xl:grid-cols-4 xl:gap-8
      "
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </section>
  );
}
