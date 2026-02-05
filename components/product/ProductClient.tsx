"use client";

import { Product } from "@/types/product";

import ProductGallery from "@/components/product/ProductGallery";
import ProductBuyPanel from "@/components/product/ProductBuyPanel";
import ProductDescription from "@/components/product/ProductDescription";
import WhatsIncluded from "@/components/product/WhatsIncluded";
import RelatedProducts from "@/components/product/RelatedProducts";
import ProductTrustBadges from "@/components/product/ProductTrustBadges";

interface Props {
  product: Product;
}

export default function ProductClient({ product }: Props) {
  return (
    <>
      {/* MAIN PRODUCT SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12">
        {/* LEFT */}
        <div className="space-y-12">
          <ProductGallery
            images={product.previewImages}
            title={product.title}
          />

          <ProductDescription product={product} />

          <WhatsIncluded product={product} />
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          <ProductBuyPanel product={product} />
          <ProductTrustBadges />
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      <RelatedProducts product={product} />
    </>
  );
}
