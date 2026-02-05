"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isAuthenticated } from "@/lib/auth";

export default function Footer() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    Promise.resolve(isAuthenticated()).then(setLoggedIn);
  }, []);

  return (
    <footer className="border-t border-border bg-background">
      <div className="container-app py-16">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <div className="text-base font-semibold tracking-tight text-foreground">
              PrintPocket<span className="text-muted">Shop</span>
            </div>

            <p className="text-sm leading-relaxed text-muted">
              Premium digital templates and printables.
              <br />
              Instant downloads. Lifetime access.
            </p>
          </div>

          {/* Shop */}
          <div className="space-y-3">
            <div className="text-sm font-semibold text-foreground">
              Shop
            </div>

            <nav className="flex flex-col gap-2 text-sm text-muted">
              <Link
                href="/shop"
                className="transition hover:text-foreground focus-visible:outline-none focus-visible:shadow-[var(--ring)]"
              >
                All products
              </Link>

              <Link
                href="/cart"
                className="transition hover:text-foreground focus-visible:outline-none focus-visible:shadow-[var(--ring)]"
              >
                Cart
              </Link>
            </nav>
          </div>

          {/* Account */}
          <div className="space-y-3">
            <div className="text-sm font-semibold text-foreground">
              Account
            </div>

            <nav className="flex flex-col gap-2 text-sm text-muted">
              <Link
                href="/account/orders"
                className="transition hover:text-foreground focus-visible:outline-none focus-visible:shadow-[var(--ring)]"
              >
                Orders
              </Link>

              <Link
                href="/account/downloads"
                className="transition hover:text-foreground focus-visible:outline-none focus-visible:shadow-[var(--ring)]"
              >
                Downloads
              </Link>

              {!loggedIn && (
                <Link
                  href="/login"
                  className="transition hover:text-foreground focus-visible:outline-none focus-visible:shadow-[var(--ring)]"
                >
                  Login
                </Link>
              )}
            </nav>
          </div>

          {/* Support */}
          <div className="space-y-3">
            <div className="text-sm font-semibold text-foreground">
              Support
            </div>

            <nav className="flex flex-col gap-2 text-sm text-muted">
              <Link
                href="/contact"
                className="transition hover:text-foreground focus-visible:outline-none focus-visible:shadow-[var(--ring)]"
              >
                Contact
              </Link>

              <Link
                href="/faq"
                className="transition hover:text-foreground focus-visible:outline-none focus-visible:shadow-[var(--ring)]"
              >
                FAQ
              </Link>

              <Link
                href="/policies/terms"
                className="transition hover:text-foreground focus-visible:outline-none focus-visible:shadow-[var(--ring)]"
              >
                Terms
              </Link>

              <Link
                href="/policies/privacy"
                className="transition hover:text-foreground focus-visible:outline-none focus-visible:shadow-[var(--ring)]"
              >
                Privacy
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} PrintPocketShop
          </span>

          <span>
            Secure checkout · Instant digital delivery
          </span>
        </div>
      </div>
    </footer>
  );
}
