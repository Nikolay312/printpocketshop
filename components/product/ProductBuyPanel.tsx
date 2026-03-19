"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/formatPrice";
import { useCart } from "@/components/cart/CartContext";
import Button from "@/components/ui/Button";

interface Props {
  product: Product;
}

export default function ProductBuyPanel({ product }: Props) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = async () => {
    try {
      await addToCart({
        productId: product.id,
        license: product.license,
        quantity: 1,
        title: product.title,
        slug: product.slug,
        price: product.price,
        currency: product.currency,
      });

      setAdded(true);
      window.setTimeout(() => setAdded(false), 1800);
    } catch (error) {
      console.error("Add to cart failed:", error);
    }
  };

  return (
    <aside className="space-y-16">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-sm tracking-wide text-neutral-500"
      >
        Instant download · Lifetime access
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.6 }}
        className="space-y-3"
      >
        <p className="tabular-nums text-[3.75rem] font-semibold tracking-tight text-neutral-900">
          {formatPrice(product.price, product.currency)}
        </p>

        <p className="text-sm text-neutral-500">
          One-time payment. Lifetime updates included.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="space-y-8"
      >
        <motion.div
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          transition={{ type: "spring", stiffness: 280, damping: 20 }}
        >
          <Button
            onClick={handleAdd}
            className={`
              h-16
              w-full
              rounded-2xl
              text-base
              font-semibold
              transition-all
              duration-300
              ${
                added
                  ? "bg-neutral-800 text-white"
                  : "bg-neutral-900 text-white hover:bg-neutral-800"
              }
            `}
          >
            {added ? "Added ✓" : "Add to Cart"}
          </Button>
        </motion.div>

        <div className="space-y-2 text-sm text-neutral-500">
          <p>Secure encrypted checkout</p>
          <p>Unlimited re-downloads</p>
        </div>

        <p className="text-xs text-neutral-400">
          {product.license === "PERSONAL"
            ? "Personal license"
            : "Commercial license"}
        </p>
      </motion.div>
    </aside>
  );
}