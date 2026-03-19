"use client";

import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/cart/CartContext";
import CartDrawer from "./CartDrawer";
import clsx from "clsx";

export default function CartToggleButton() {
  const { cartItems, openCart } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);

  /* =========================
     SCROLL STATE
  ========================= */

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* =========================
     ITEM COUNT
  ========================= */

  const itemCount = useMemo(() => {
    if (!cartItems || cartItems.length === 0) return 0;

    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems]);

  return (
    <>
      <button
        onClick={openCart}
        aria-label="Open cart"
        className={clsx(
          "fixed right-6 z-40 inline-flex items-center justify-center",
          "h-12 w-12 rounded-full bg-background border border-border shadow-md",
          "transition-all duration-300 hover:shadow-lg active:scale-[0.95]",
          "focus-visible:outline-none focus-visible:shadow-[var(--ring)]",
          isScrolled ? "top-[32px]" : "top-[38px]"
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 text-foreground"
          aria-hidden
        >
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>

        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--accent)] px-1.5 text-[11px] font-semibold text-white shadow-sm">
            {itemCount}
          </span>
        )}
      </button>

      <CartDrawer />
    </>
  );
}