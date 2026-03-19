"use client";

import { Product } from "@/types/product";
import ProductGallery from "@/components/product/ProductGallery";
import ProductBuyPanel from "@/components/product/ProductBuyPanel";
import ProductDescription from "@/components/product/ProductDescription";
import { motion } from "framer-motion";

type Props = {
  product: Product;
};

export default function ProductClient({ product }: Props) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-[1240px] px-6 pt-32 pb-40"
    >
      {/* ===== HERO TITLE (Integrated, No Borders) ===== */}
      <div className="max-w-4xl mb-24">
        <h1
          className="
            text-[3rem]
            md:text-[4.25rem]
            font-semibold
            tracking-[-0.025em]
            leading-[1.02]
            text-neutral-900
          "
        >
          {product.title}
        </h1>
      </div>

      {/* ===== MAIN GRID ===== */}
      <div className="grid grid-cols-1 gap-24 lg:grid-cols-[minmax(0,1.3fr)_minmax(420px,0.7fr)]">
        
        {/* LEFT COLUMN */}
        <section className="space-y-32">
          <ProductGallery
            images={product.previewImages}
            title={product.title}
          />

          <div className="max-w-2xl">
            <ProductDescription product={product} />
          </div>
        </section>

        {/* RIGHT COLUMN */}
        <aside className="lg:sticky lg:top-36 h-fit">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ProductBuyPanel product={product} />
          </motion.div>
        </aside>
      </div>
    </motion.main>
  );
}