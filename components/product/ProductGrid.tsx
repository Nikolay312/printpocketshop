import { Product } from "@/types/product";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({
  products,
}: ProductGridProps) {
  return (
    <section
      aria-label="Product results"
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        2xl:grid-cols-4
        gap-y-20
        gap-x-10
        lg:gap-x-14
      "
    >
      {products.map((product) => (
        <div
          key={product.id}
          className="
            transition-transform duration-300
            will-change-transform
          "
        >
          <ProductCard product={product} />
        </div>
      ))}
    </section>
  );
}
