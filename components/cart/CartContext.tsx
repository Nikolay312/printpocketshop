"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
  ReactNode,
  useCallback,
} from "react";
import { usePathname } from "next/navigation";
import { AUTH_CHANGED_EVENT, getCurrentUser } from "@/lib/auth";

type CartLicense = "PERSONAL" | "COMMERCIAL";

type CartItem = {
  id: string;
  productId: string;
  title: string;
  slug: string;
  price: number;
  currency: string;
  quantity: number;
  license: CartLicense;
};

type AddToCartInput = {
  productId: string;
  quantity?: number;
  license?: CartLicense;
  title?: string;
  slug?: string;
  price?: number;
  currency?: string;
};

type CartContextValue = {
  cartItems: CartItem[];
  totalPrice: number;
  currency: string | null;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (input: AddToCartInput) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateCartItemQuantity: (
    cartItemId: string,
    nextQuantity: number
  ) => Promise<void>;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "printpocketshop-cart";

/* =========================
   GUEST STORAGE
========================= */

function getStoredGuestCart(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getInitialGuestCurrency(items: CartItem[]): string | null {
  return items[0]?.currency || null;
}

/* =========================
   PROVIDER
========================= */

export function CartProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);
  const lastMergedUserIdRef = useRef<string | null>(null);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currency, setCurrency] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [authResolved, setAuthResolved] = useState(false);

  const isAuthenticated = Boolean(currentUserId);

  /* =========================
     AUTH SYNC
  ========================= */

  const syncAuth = useCallback(async () => {
    try {
      const user = await getCurrentUser();
      const nextUserId = user?.id ?? null;

      setCurrentUserId((prevUserId) => {
        if (prevUserId !== nextUserId) {
          if (nextUserId) {
            setCartItems([]);
            setCurrency(null);
          } else {
            const guestItems = getStoredGuestCart();
            setCartItems(guestItems);
            setCurrency(getInitialGuestCurrency(guestItems));
          }
        }

        return nextUserId;
      });
    } catch {
      setCurrentUserId((prevUserId) => {
        if (prevUserId !== null) {
          const guestItems = getStoredGuestCart();
          setCartItems(guestItems);
          setCurrency(getInitialGuestCurrency(guestItems));
        }

        return null;
      });
    } finally {
      setAuthResolved(true);
    }
  }, []);

  useEffect(() => {
    void syncAuth();
  }, [syncAuth]);

  useEffect(() => {
    const handleFocus = () => {
      void syncAuth();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void syncAuth();
      }
    };

    const handleAuthChange = () => {
      void syncAuth();
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener(AUTH_CHANGED_EVENT, handleAuthChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener(AUTH_CHANGED_EVENT, handleAuthChange);
    };
  }, [syncAuth]);

  /* =========================
     LOAD GUEST CART AFTER MOUNT
  ========================= */

  useEffect(() => {
    if (!authResolved) return;
    if (isAuthenticated) return;

    const guestItems = getStoredGuestCart();
    setCartItems(guestItems);
    setCurrency(getInitialGuestCurrency(guestItems));
  }, [authResolved, isAuthenticated]);

  /* =========================
     LOAD SERVER CART
  ========================= */

  const refreshCart = useCallback(async () => {
    if (!currentUserId) return;

    try {
      const res = await fetch("/api/cart", {
        credentials: "include",
        cache: "no-store",
      });

      const text = await res.text();

      let data: unknown;

      try {
        data = JSON.parse(text);
      } catch {
        console.error("Cart GET returned non-JSON:", text);
        return;
      }

      if (!res.ok) {
        console.error("Cart GET failed:", {
          status: res.status,
          body: data,
        });
        return;
      }

      const parsed = data as {
        items?: CartItem[];
        currency?: string | null;
      };

      setCartItems(parsed.items ?? []);
      setCurrency(parsed.currency ?? null);
    } catch (error) {
      console.error("Cart refresh failed:", error);
    }
  }, [currentUserId]);

  useEffect(() => {
    if (!authResolved || !currentUserId) return;

    const timer = window.setTimeout(() => {
      void refreshCart();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [authResolved, currentUserId, refreshCart]);

  /* =========================
     MERGE ON LOGIN
  ========================= */

  useEffect(() => {
    if (!authResolved || !currentUserId) {
      lastMergedUserIdRef.current = null;
      return;
    }

    if (lastMergedUserIdRef.current === currentUserId) return;

    let cancelled = false;

    const mergeGuestCart = async () => {
      const guest = getStoredGuestCart();

      if (!guest.length) {
        lastMergedUserIdRef.current = currentUserId;
        await refreshCart();
        return;
      }

      try {
        const res = await fetch("/api/cart/merge", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: guest.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              license: item.license,
            })),
          }),
        });

        const text = await res.text();

        let data: unknown;
        try {
          data = JSON.parse(text);
        } catch {
          data = { raw: text };
        }

        if (!res.ok) {
          console.error("Cart merge failed:", data);
          return;
        }

        if (cancelled) return;

        localStorage.removeItem(STORAGE_KEY);
        lastMergedUserIdRef.current = currentUserId;
        await refreshCart();
      } catch (error) {
        console.error("Cart merge error:", error);
      }
    };

    void mergeGuestCart();

    return () => {
      cancelled = true;
    };
  }, [authResolved, currentUserId, refreshCart]);

  /* =========================
     PERSIST GUEST CART
  ========================= */

  useEffect(() => {
    if (!authResolved) return;
    if (isAuthenticated) return;
    if (typeof window === "undefined") return;

    if (cartItems.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
  }, [authResolved, cartItems, isAuthenticated]);

  /* Close cart on route change */

  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;

      const timer = window.setTimeout(() => {
        setIsOpen(false);
      }, 0);

      return () => {
        window.clearTimeout(timer);
      };
    }
  }, [pathname]);

  /* =========================
     ACTIONS
  ========================= */

  const addToCart = async ({
    productId,
    quantity = 1,
    license = "PERSONAL",
    title,
    slug,
    price,
    currency: itemCurrency,
  }: AddToCartInput) => {
    if (!isAuthenticated) {
      setCartItems((prev) => {
        const existing = prev.find(
          (item) => item.productId === productId && item.license === license
        );

        if (existing) {
          return prev.map((item) =>
            item.productId === productId && item.license === license
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }

        return [
          ...prev,
          {
            id: `${productId}:${license}`,
            productId,
            title: title ?? "Untitled product",
            slug: slug ?? "",
            price: typeof price === "number" ? price : 0,
            currency: itemCurrency ?? "EUR",
            quantity,
            license,
          },
        ];
      });

      setIsOpen(true);
      return;
    }

    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity, license }),
      });

      const text = await res.text();

      let data: unknown;

      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text };
      }

      if (!res.ok) {
        console.error("Add to cart failed:", data);

        if (typeof data === "object" && data !== null && "error" in data) {
          throw new Error(String((data as { error: string }).error));
        }

        throw new Error("Add to cart failed");
      }

      await refreshCart();
      setIsOpen(true);
    } catch (error) {
      console.error("Add to cart error:", error);
      throw error;
    }
  };

  const removeFromCart = useCallback(
    async (cartItemId: string) => {
      if (!isAuthenticated) {
        setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
        return;
      }

      try {
        const res = await fetch("/api/cart/remove", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cartItemId }),
        });

        const text = await res.text();

        let data: unknown;

        try {
          data = JSON.parse(text);
        } catch {
          data = { raw: text };
        }

        if (!res.ok) {
          console.error("Remove cart API error:", {
            status: res.status,
            body: data,
          });

          if (typeof data === "object" && data !== null && "error" in data) {
            throw new Error(String((data as { error: string }).error));
          }

          throw new Error("Server returned an error removing item");
        }

        await refreshCart();
      } catch (error) {
        console.error("removeFromCart failed:", error);
        throw error;
      }
    },
    [isAuthenticated, refreshCart]
  );

  const updateCartItemQuantity = useCallback(
    async (cartItemId: string, nextQuantity: number) => {
      const safeQuantity = Math.max(0, Math.floor(nextQuantity));
      const currentItem = cartItems.find((item) => item.id === cartItemId);

      if (!currentItem) {
        throw new Error("Cart item not found");
      }

      if (!isAuthenticated) {
        setCartItems((prev) => {
          if (safeQuantity === 0) {
            return prev.filter((item) => item.id !== cartItemId);
          }

          return prev.map((item) =>
            item.id === cartItemId ? { ...item, quantity: safeQuantity } : item
          );
        });

        return;
      }

      try {
        if (safeQuantity === 0) {
          await removeFromCart(cartItemId);
          return;
        }

        if (safeQuantity === currentItem.quantity) {
          return;
        }

        const removeRes = await fetch("/api/cart/remove", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cartItemId }),
        });

        const removeText = await removeRes.text();

        let removeData: unknown;

        try {
          removeData = JSON.parse(removeText);
        } catch {
          removeData = { raw: removeText };
        }

        if (!removeRes.ok) {
          console.error("Remove before quantity reset failed:", {
            status: removeRes.status,
            body: removeData,
          });

          if (
            typeof removeData === "object" &&
            removeData !== null &&
            "error" in removeData
          ) {
            throw new Error(String((removeData as { error: string }).error));
          }

          throw new Error("Failed to reset cart item quantity");
        }

        const addRes = await fetch("/api/cart/add", {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: currentItem.productId,
            quantity: safeQuantity,
            license: currentItem.license,
          }),
        });

        const addText = await addRes.text();

        let addData: unknown;

        try {
          addData = JSON.parse(addText);
        } catch {
          addData = { raw: addText };
        }

        if (!addRes.ok) {
          console.error("Add after quantity reset failed:", {
            status: addRes.status,
            body: addData,
          });

          if (
            typeof addData === "object" &&
            addData !== null &&
            "error" in addData
          ) {
            throw new Error(String((addData as { error: string }).error));
          }

          throw new Error("Failed to update cart item quantity");
        }

        await refreshCart();
      } catch (error) {
        console.error("updateCartItemQuantity failed:", error);
        throw error;
      }
    },
    [cartItems, isAuthenticated, refreshCart, removeFromCart]
  );

  const clearCart = () => {
    setCartItems([]);
    setCurrency(null);

    if (!isAuthenticated && typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  /* =========================
     DERIVED
  ========================= */

  const totalPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalPrice,
        currency,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return ctx;
}