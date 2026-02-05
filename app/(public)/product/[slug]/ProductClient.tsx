"use client";

import { Product } from "@/types/product";
import ProductGallery from "@/components/product/ProductGallery";
import ProductBuyPanel from "@/components/product/ProductBuyPanel";
import ProductDescription from "@/components/product/ProductDescription";
import ProductTrustBadges from "@/components/product/ProductTrustBadges";
import WhatsIncluded from "@/components/product/WhatsIncluded";

type Props = {
  product: Product;
};

export default function ProductClient({ product }: Props) {
  return (
    <main className="container-app py-12">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.45fr_1fr]">
        {/* LEFT — Product content */}
        <section className="space-y-14">
          {/* Gallery */}
          <ProductGallery
            images={product.previewImages}
            title={product.title}
          />

          {/* Description */}
          <div className="space-y-6">
            <ProductDescription product={product} />
          </div>

          {/* What's included */}
          <div className="space-y-6">
            <WhatsIncluded product={product} />
          </div>

          {/* Trust */}
          <div className="pt-2">
            <ProductTrustBadges />
          </div>
        </section>

        {/* RIGHT — Buy panel */}
        <aside className="lg:sticky lg:top-24 h-fit">
          <div className="space-y-4">
            <ProductBuyPanel product={product} />

            {/* Secondary reassurance */}
            <p className="text-center text-xs text-muted">
              Secure checkout • Instant download • Lifetime access
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
