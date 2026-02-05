import { Product } from "@/types/product";

interface Props {
  product: Product;
}

export default function WhatsIncluded({ product }: Props) {
  return (
    <section className="card-soft space-y-5 p-6">
      <h2 className="text-lg font-semibold">
        What’s included
      </h2>

      <ul className="space-y-2 text-sm text-muted">
        <li>
          ✓ One high-quality digital file in <strong>{product.format}</strong>{" "}
          format
        </li>

        <li>
          ✓ PDF file with clear, step-by-step instructions for using the product
        </li>

        <li>
          ✓ Secure download link available immediately after purchase
        </li>

        <li>
          ✓{" "}
          {product.license === "COMMERCIAL"
            ? "Commercial license included — approved for client and business use"
            : "Personal use license — for individual, non-commercial projects"}
        </li>

        <li>
          ✓ Lifetime access from your account dashboard
        </li>
      </ul>

      <p className="text-xs text-muted">
        This is a digital product. No physical item will be shipped.
      </p>
    </section>
  );
}
