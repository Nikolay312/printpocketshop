"use client";

import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import CartToggleButton from "@/components/cart/CartToggleButton";
import { isAuthenticated } from "@/lib/auth";
import clsx from "clsx";

/* =====================================================
   Deterministic gradient generator (stable per user)
   MUST match the one used on the profile page
===================================================== */
function getGradientFromString(input: string) {
  const colors = [
    ["from-indigo-500", "to-violet-500"],
    ["from-blue-500", "to-cyan-500"],
    ["from-emerald-500", "to-teal-500"],
    ["from-rose-500", "to-pink-500"],
    ["from-orange-500", "to-amber-500"],
    ["from-fuchsia-500", "to-purple-500"],
  ];

  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

type MeResponse =
  | {
      name?: string | null;
      email?: string | null;
      user?: { name?: string | null; email?: string | null } | null;
    }
  | null
  | undefined;

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Avatar state
  const [userInitial, setUserInitial] = useState("U");
  const [gradient, setGradient] = useState<[string, string]>([
    "from-indigo-500",
    "to-violet-500",
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ===============================
     AUTH + USER (initial + gradient)
  =============================== */
  const hydrateUserBadge = useCallback(async () => {
    const authed = await isAuthenticated();
    setLoggedIn(authed);

    if (!authed) {
      setUserInitial("U");
      setGradient(["from-indigo-500", "to-violet-500"]);
      return;
    }

    try {
      const res = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
        headers: { "Accept": "application/json" },
        cache: "no-store",
      });

      if (!res.ok) {
        // If /me fails but auth says true, keep safe defaults
        setUserInitial("U");
        setGradient(["from-indigo-500", "to-violet-500"]);
        return;
      }

      const data = (await res.json()) as MeResponse;

      // Support multiple common shapes:
      // { name, email } OR { user: { name, email } }
      let name: string | null = null;
      let email: string | null = null;

      if (data && typeof data === "object") {
        if ("user" in data && data.user) {
          name = data.user.name ?? null;
          email = data.user.email ?? null;
        } else {
          name = data.name ?? null;
          email = data.email ?? null;
        }
      }


      // Initial should be FIRST LETTER OF NAME, fallback to email
      const initial =
        (name?.trim()?.[0] ?? email?.trim()?.[0] ?? "U").toUpperCase();
      setUserInitial(initial);

      // Gradient MUST be based on email to match profile page
      const basis = (email ?? "unknown@email").toLowerCase();
      const [from, to] = getGradientFromString(basis);
      setGradient([from, to]);
    } catch {
      setUserInitial("U");
      setGradient(["from-indigo-500", "to-violet-500"]);
    }
  }, []);

  useEffect(() => {
    hydrateUserBadge();
  }, [hydrateUserBadge]);

  useEffect(() => {
    hydrateUserBadge();
  }, [pathname, hydrateUserBadge]);

  useEffect(() => {
    const onFocus = () => hydrateUserBadge();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [hydrateUserBadge]);

  /* ===============================
     SCROLL SHRINK
  =============================== */
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ===============================
     LOGOUT
  =============================== */
  const handleLogout = async () => {
    try {
      setLogoutLoading(true);

      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      setLoggedIn(false);
      setDropdownOpen(false);

      // reset badge immediately
      setUserInitial("U");
      setGradient(["from-indigo-500", "to-violet-500"]);

      router.refresh();
      router.push("/");
    } finally {
      setLogoutLoading(false);
    }
  };

  /* ===============================
     NAV HELPERS
  =============================== */
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const navLink = (href: string, label: string) => {
    const active = isActive(href);

    return (
      <Link
        href={href}
        className={clsx(
          "relative text-sm font-medium tracking-tight group transition-all duration-300",
          "active:scale-[0.96]",
          active
            ? "text-[var(--fg)]"
            : "text-[var(--muted)] hover:text-[var(--fg)]"
        )}
      >
        {label}
        <span
          className={clsx(
            "absolute left-0 -bottom-2 h-px w-full bg-[var(--fg)] origin-left scale-x-0 transition-transform duration-300",
            "group-hover:scale-x-100",
            active && "scale-x-100"
          )}
        />
      </Link>
    );
  };

  /* ===============================
     CLOSE DROPDOWN
  =============================== */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 backdrop-blur-xl transition-all duration-300",
        isScrolled ? "h-[64px] bg-[var(--surface)]/95 shadow-sm" : "h-[76px] bg-[var(--surface)]/90"
      )}
    >
      <div className="mx-auto grid h-full max-w-7xl grid-cols-3 items-center px-6 lg:px-8">
        {/* LEFT */}
        <div>
          <Link
            href="/"
            className="group inline-block text-[21px] md:text-[23px] font-semibold tracking-tight text-[var(--fg)] transition"
          >
            <span className="tracking-tight">
              Print<span className="font-bold">Pocket</span>
            </span>
            <span className="ml-1 text-[var(--muted)] font-medium tracking-wide">
              Shop
            </span>
            <span className="block h-[2px] w-0 bg-[var(--fg)] transition-all duration-300 group-hover:w-full" />
          </Link>
        </div>

        {/* CENTER */}
        <nav className="hidden md:flex items-center justify-center gap-6">
          {navLink("/", "Home")}
          <span>|</span>
          {navLink("/shop", "Shop")}
          <span>|</span>
          {navLink("/contact", "Contact")}
        </nav>

        {/* RIGHT */}
        <div className="flex items-center justify-end">
          {loggedIn !== null && (
            <>
              {loggedIn ? (
                <div ref={dropdownRef} className="relative">
                  <button
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-3 h-11 px-4 rounded-full hover:bg-[var(--border)]/30 transition active:scale-[0.96]"
                  >
                    <div
                      className={clsx(
                        "h-9 w-9 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-sm font-semibold shadow-md"
                      ,
                        gradient[0],
                        gradient[1]
                      )}
                      aria-label="Account avatar"
                      title="Account"
                    >
                      {userInitial}
                    </div>

                    <span className="text-sm font-medium text-[var(--fg)]">
                      Account
                    </span>

                    <svg
                      className={clsx(
                        "h-4 w-4 transition-transform duration-200",
                        dropdownOpen && "rotate-180"
                      )}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M5.23 7.21 10 11.168l4.77-3.958" />
                    </svg>
                  </button>

                  {/* Dropdown */}
                  <div
                    className={clsx(
                      "absolute right-0 top-full mt-2 w-56 rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl transition-all duration-200 origin-top-right",
                      dropdownOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
                    )}
                  >
                    <div className="flex flex-col p-3 text-sm gap-1">
                      <Link href="/account/profile" className="px-3 py-2 rounded-md hover:bg-[var(--border)]/30 transition">
                        Profile
                      </Link>
                      <Link href="/account/orders" className="px-3 py-2 rounded-md hover:bg-[var(--border)]/30 transition">
                        Orders
                      </Link>
                      <Link href="/account/settings" className="px-3 py-2 rounded-md hover:bg-[var(--border)]/30 transition">
                        Settings
                      </Link>

                      <div className="my-2 h-px bg-[var(--border)]" />

                      <button
                        onClick={handleLogout}
                        disabled={logoutLoading}
                        className="flex items-center justify-center gap-2 w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition active:scale-[0.96]"
                      >
                        {logoutLoading && (
                          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        )}
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center justify-center h-11 px-6 rounded-full border border-[var(--border)] text-sm font-semibold text-[var(--fg)] hover:bg-[var(--border)]/40 transition active:scale-[0.96]"
                >
                  Sign in
                </Link>
              )}
            </>
          )}
        </div>
      </div>

      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--border)]/60 to-transparent" />

      <CartToggleButton />
    </header>
  );
}
