"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartContext";
import { formatPrice } from "@/lib/formatPrice";

export default function CartDrawer() {
  const router = useRouter();

  const {
    cartItems,
    totalPrice,
    currency,
    isOpen,
    closeCart,
    updateCartItemQuantity,
  } = useCart();

  const [checkingOut, setCheckingOut] = useState(false);
  const [pendingItemId, setPendingItemId] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const hasItems = useMemo(() => cartItems.length > 0, [cartItems]);
  const itemCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const handleCheckout = async () => {
    try {
      setCheckingOut(true);
      closeCart();
      router.push("/checkout");
    } finally {
      setCheckingOut(false);
    }
  };

  const handleQuantityChange = async (
    cartItemId: string,
    nextQuantity: number
  ) => {
    try {
      setPendingItemId(cartItemId);
      await updateCartItemQuantity(cartItemId, nextQuantity);
    } catch (error) {
      console.error("Update cart quantity failed:", error);
    } finally {
      setPendingItemId(null);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[999]">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
        aria-hidden
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="
          absolute right-0 top-0 flex h-full w-full max-w-md flex-col
          bg-white shadow-[0_20px_60px_rgba(0,0,0,0.25)]
        "
      >
        <header className="border-b border-neutral-200 px-6 py-5 sm:px-8">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold tracking-tight text-black">
                Your cart
              </h2>
              {hasItems ? (
                <p className="text-sm text-neutral-500">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </p>
              ) : (
                <p className="text-sm text-neutral-500">
                  Review your selected products
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={closeCart}
              aria-label="Close cart"
              className="
                inline-flex h-10 w-10 items-center justify-center rounded-full
                border border-neutral-200 text-lg text-neutral-500
                transition hover:border-neutral-300 hover:text-black
              "
            >
              ×
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          {!hasItems ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="max-w-xs space-y-3">
                <p className="text-base font-semibold text-black">
                  Your cart is empty
                </p>
                <p className="text-sm leading-6 text-neutral-500">
                  Add a template to continue to checkout.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {cartItems.map((item) => {
                const isPending = pendingItemId === item.id;
                const unitPrice = formatPrice(
                  item.price,
                  item.currency || currency || "EUR"
                );
                const linePrice = formatPrice(
                  item.price * item.quantity,
                  item.currency || currency || "EUR"
                );

                return (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-neutral-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1 space-y-2">
                        {item.slug ? (
                          <Link
                            href={`/product/${item.slug}`}
                            onClick={closeCart}
                            className="block text-sm font-semibold leading-6 text-black hover:underline"
                          >
                            {item.title || "Untitled product"}
                          </Link>
                        ) : (
                          <p className="text-sm font-semibold leading-6 text-black">
                            {item.title || "Untitled product"}
                          </p>
                        )}

                        <p className="text-xs text-neutral-500">
                          {unitPrice} each
                        </p>
                      </div>

                      <p className="shrink-0 whitespace-nowrap text-sm font-semibold text-black">
                        {linePrice}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div
                        className="
                          inline-flex items-center rounded-full border
                          border-neutral-200 bg-white
                        "
                      >
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${item.title}`}
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          disabled={isPending}
                          className="
                            inline-flex h-10 w-10 items-center justify-center
                            rounded-l-full text-base text-neutral-700 transition
                            hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50
                          "
                        >
                          −
                        </button>

                        <span className="min-w-[2.5rem] text-center text-sm font-medium text-black">
                          {isPending ? "…" : item.quantity}
                        </span>

                        <button
                          type="button"
                          aria-label={`Increase quantity of ${item.title}`}
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                          disabled={isPending}
                          className="
                            inline-flex h-10 w-10 items-center justify-center
                            rounded-r-full text-base text-neutral-700 transition
                            hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50
                          "
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleQuantityChange(item.id, 0)}
                        disabled={isPending}
                        className="
                          inline-flex items-center justify-center rounded-full
                          border border-neutral-200 px-4 py-2
                          text-xs font-medium text-neutral-700 transition
                          hover:border-neutral-300 hover:bg-neutral-50 hover:text-black
                          disabled:cursor-not-allowed disabled:opacity-50
                        "
                      >
                        {isPending ? "Updating..." : "Remove item"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {hasItems && (
          <footer className="border-t border-neutral-200 px-6 py-6 sm:px-8">
            <div className="mb-5 space-y-3">
              <div className="flex items-center justify-between text-base font-semibold text-black">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice, currency ?? "EUR")}</span>
              </div>

              <p className="text-xs leading-5 text-neutral-500">
                Taxes and final payment details are shown at checkout.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={checkingOut}
              className="
                inline-flex w-full items-center justify-center rounded-full
                bg-black px-8 py-4 text-sm font-semibold text-white transition
                hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60
              "
            >
              {checkingOut ? "Checking..." : "Secure checkout"}
            </button>

            <p className="mt-4 text-center text-xs text-neutral-500">
              Secure payment · Instant digital delivery
            </p>
          </footer>
        )}
      </aside>
    </div>,
    document.body
  );
}