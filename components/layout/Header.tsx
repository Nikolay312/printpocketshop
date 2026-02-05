"use client";

import Link from "next/link";
import { useMemo, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/components/cart/CartContext";
import CartToggleButton from "@/components/cart/CartToggleButton";
import { isAuthenticated, logoutUser } from "@/lib/auth";
import clsx from "clsx";

export default function Header() {
  const { cartItems } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    Promise.resolve().then(() => setMounted(true));
  }, []);

  const loggedIn = mounted ? isAuthenticated() : false;

  const itemCount = useMemo(() => {
    if (!mounted) return 0;
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [cartItems, mounted]);

  const handleLogout = () => {
    logoutUser();
    router.push("/");
  };

  const navLink = (href: string, label: string) => {
    const active = pathname === href;

    return (
      <Link
        href={href}
        className={clsx(
          "rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:shadow-[var(--ring)]",
          active
            ? "bg-surface text-foreground shadow-sm"
            : "text-muted hover:bg-surface/70 hover:text-foreground"
        )}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container-app flex h-16 items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold tracking-tight transition hover:opacity-90 focus-visible:outline-none focus-visible:shadow-[var(--ring)]"
        >
          <span className="text-lg">
            PrintPocket<span className="text-muted">Shop</span>
          </span>

          <span className="hidden sm:inline-flex rounded-full border border-border bg-surface px-2 py-0.5 text-[11px] font-medium text-muted">
            Digital templates
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLink("/", "Home")}
          {navLink("/shop", "Shop")}
          {navLink("/about", "About")}
          {navLink("/contact", "Contact")}

          <div className="mx-2 h-6 w-px bg-border" />

          {mounted && loggedIn ? (
            <>
              {navLink("/account/orders", "Account")}

              <button
                onClick={handleLogout}
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:shadow-[var(--ring)]"
              >
                Logout
              </button>
            </>
          ) : (
            mounted && (
              <Link href="/login" className="btn-primary">
                Login
              </Link>
            )
          )}

          {/* Cart */}
          <Link
            href="/cart"
            className="relative ml-2 rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:bg-surface hover:text-foreground focus-visible:outline-none focus-visible:shadow-[var(--ring)]"
          >
            Cart
            {mounted && itemCount > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--accent)] px-1.5 text-[11px] font-semibold text-white shadow-sm">
                {itemCount}
              </span>
            )}
          </Link>
        </nav>

        {/* Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          <Link href="/cart" className="btn-ghost text-xs">
            Cart
            {mounted && itemCount > 0 && (
              <span className="ml-1 rounded-full bg-[var(--accent)] px-1.5 text-[11px] text-white">
                {itemCount}
              </span>
            )}
          </Link>

          {mounted && !loggedIn ? (
            <Link href="/login" className="btn-primary text-xs">
              Login
            </Link>
          ) : (
            mounted && (
              <button onClick={handleLogout} className="btn-ghost text-xs">
                Logout
              </button>
            )
          )}
        </div>
      </div>

      {/* Cart drawer toggle */}
      <CartToggleButton />
    </header>
  );
}
