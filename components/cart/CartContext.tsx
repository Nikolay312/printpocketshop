"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import type { Product } from "@/types/product";

/* =========================
   TYPES
========================= */

export type CartItem = {
  product: Product;
  quantity: number;
};

type CartContextValue = {
  cartItems: CartItem[];
  totalPrice: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
};

/* =========================
   CONTEXT
========================= */

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = "printpocketshop-cart";

/* =========================
   INITIAL STATE
========================= */

function getInitialCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/* =========================
   PROVIDER
========================= */

export function CartProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const [cartItems, setCartItems] = useState<CartItem[]>(getInitialCart);
  const [isOpen, setIsOpen] = useState(false);

  // Track previous route to safely close drawer on navigation
  const prevPathRef = useRef(pathname);

  /* Persist cart to localStorage */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  /* Close cart when route changes (deferred to avoid sync state updates) */
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;

      setTimeout(() => {
        setIsOpen(false);
      }, 0);
    }
  }, [pathname]);

  /* Add product to cart */
  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (item) => item.product.id === product.id
      );

      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [...prev, { product, quantity: 1 }];
    });

    setIsOpen(true);
  };

  /* Remove product entirely */
  const removeFromCart = (productId: string) => {
    setCartItems((prev) =>
      prev.filter((item) => item.product.id !== productId)
    );
  };

  /* Clear cart completely */
  const clearCart = () => {
    setCartItems([]);
    setIsOpen(false);
  };

  /* Derived total price */
  const totalPrice = useMemo(() => {
    return cartItems.reduce(
      (sum, item) =>
        sum + item.product.price * item.quantity,
      0
    );
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalPrice,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* =========================
   HOOK
========================= */

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return ctx;
}
