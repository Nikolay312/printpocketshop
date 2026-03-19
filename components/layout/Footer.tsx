"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isAuthenticated } from "@/lib/auth";

export default function Footer() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    Promise.resolve(isAuthenticated()).then(setLoggedIn);
  }, []);

  const linkClass =
    "text-[var(--muted)] transition-[color] duration-200 ease-[var(--ease-out)] hover:text-[var(--fg)]";

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg)]">
      <div className="container-app py-32">

        {/* ================= Top Grid ================= */}
        <div className="grid gap-20 md:grid-cols-4">

          {/* Brand */}
          <div className="space-y-6">
            <div className="text-lg font-semibold tracking-tight text-[var(--fg)]">
              PrintPocket<span className="text-[var(--muted)]">Shop</span>
            </div>

            <p className="max-w-xs text-sm leading-relaxed text-[var(--muted)]">
              A refined digital template studio focused on clarity,
              structure, and long-term usability.
            </p>
          </div>

          {/* Studio */}
          <div className="space-y-6">
            <div className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
              Studio
            </div>

            <nav className="flex flex-col gap-4 text-sm">
              <Link href="/about" className={linkClass}>
                About
              </Link>

              <Link href="/license" className={linkClass}>
                License
              </Link>

              <Link href="/faq" className={linkClass}>
                FAQ
              </Link>

              <Link href="/contact" className={linkClass}>
                Contact
              </Link>
            </nav>
          </div>

          {/* Shop */}
          <div className="space-y-6">
            <div className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
              Shop
            </div>

            <nav className="flex flex-col gap-4 text-sm">
              <Link href="/shop" className={linkClass}>
                All Templates
              </Link>

              {loggedIn && (
                <>
                  <Link href="/account/orders" className={linkClass}>
                    Orders
                  </Link>

                  <Link href="/account/downloads" className={linkClass}>
                    Downloads
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-6">
            <div className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
              Legal
            </div>

            <nav className="flex flex-col gap-4 text-sm">
              <Link href="/policies/terms" className={linkClass}>
                Terms
              </Link>

              <Link href="/policies/privacy" className={linkClass}>
                Privacy
              </Link>

              <Link href="/policies/refund" className={linkClass}>
                Refund Policy
              </Link>
            </nav>
          </div>

        </div>

        {/* ================= Bottom Bar ================= */}
        <div className="mt-24 border-t border-[var(--border)] pt-10">
          <div className="flex flex-col gap-6 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
            <span>
              © {new Date().getFullYear()} PrintPocketShop
            </span>

            <span>
              Structured digital templates for professional use.
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
