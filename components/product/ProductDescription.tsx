import { Product } from "@/types/product";

interface Props {
  product: Product;
}

export default function ProductDescription({ product }: Props) {
  return (
    <section className="space-y-5">
      <h2 className="text-lg font-semibold">
        Product description
      </h2>

      {/* Main description (author-provided) */}
      <p className="leading-relaxed text-foreground">
        {product.description}
      </p>

      {/* Professional supporting copy */}
      <div className="space-y-3 text-muted leading-relaxed">
        <p>
          This is a professionally designed digital product created to help you
          save time and achieve high-quality results with minimal effort.
        </p>

        <p>
          The file is delivered instantly after purchase and can be easily
          customized to fit your personal or business needs. No physical items
          are shipped — you receive immediate access to the downloadable files.
        </p>

        <p>
          Whether you’re using this for personal projects or client work (with
          the appropriate license), the product is built to be clear,
          practical, and ready to use right away.
        </p>
      </div>
    </section>
  );
}
