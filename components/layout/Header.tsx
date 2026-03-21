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
  const colors: [string, string][] = [
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const [userInitial, setUserInitial] = useState("U");
  const [gradient, setGradient] = useState<[string, string]>([
    "from-indigo-500",
    "to-violet-500",
  ]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

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
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (!res.ok) {
        setUserInitial("U");
        setGradient(["from-indigo-500", "to-violet-500"]);
        return;
      }

      const data = (await res.json()) as MeResponse;

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

      const initial =
        (name?.trim()?.[0] ?? email?.trim()?.[0] ?? "U").toUpperCase();
      setUserInitial(initial);

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
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname, hydrateUserBadge]);

  useEffect(() => {
    const onFocus = () => hydrateUserBadge();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [hydrateUserBadge]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      setLogoutLoading(true);

      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      setLoggedIn(false);
      setDropdownOpen(false);
      setMobileMenuOpen(false);
      setUserInitial("U");
      setGradient(["from-indigo-500", "to-violet-500"]);

      router.refresh();
      router.push("/");
    } finally {
      setLogoutLoading(false);
    }
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const navLink = (
    href: string,
    label: string,
    mobile = false,
    onNavigate?: () => void
  ) => {
    const active = isActive(href);

    return (
      <Link
        href={href}
        onClick={onNavigate}
        className={clsx(
          mobile
            ? "rounded-xl px-4 py-3 text-sm font-medium"
            : "relative text-sm font-medium tracking-tight group transition-all duration-300",
          "transition-all duration-300 active:scale-[0.98]",
          active
            ? "text-[var(--fg)]"
            : "text-[var(--muted)] hover:text-[var(--fg)]",
          mobile && active && "bg-[var(--border)]/35"
        )}
      >
        {label}

        {!mobile && (
          <span
            className={clsx(
              "absolute left-0 -bottom-2 h-px w-full origin-left scale-x-0 bg-[var(--fg)] transition-transform duration-300",
              "group-hover:scale-x-100",
              active && "scale-x-100"
            )}
          />
        )}
      </Link>
    );
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDropdownOpen(false);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 backdrop-blur-xl transition-all duration-300",
        isScrolled
          ? "bg-[var(--surface)]/95 shadow-sm"
          : "bg-[var(--surface)]/90"
      )}
    >
      <div
        className={clsx(
          "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",
          isScrolled ? "h-[64px]" : "h-[72px] sm:h-[76px]"
        )}
      >
        <div className="grid h-full grid-cols-[1fr_auto] items-center gap-3 md:grid-cols-3">
          {/* LEFT */}
          <div className="min-w-0">
            <Link
              href="/"
              className="group inline-block text-[18px] font-semibold tracking-tight text-[var(--fg)] transition sm:text-[20px] md:text-[23px]"
            >
              <span className="tracking-tight">
                Print<span className="font-bold">Pocket</span>
              </span>
              <span className="ml-1 font-medium tracking-wide text-[var(--muted)]">
                Shop
              </span>
              <span className="block h-[2px] w-0 bg-[var(--fg)] transition-all duration-300 group-hover:w-full" />
            </Link>
          </div>

          {/* CENTER */}
          <nav className="hidden items-center justify-center gap-6 md:flex">
            {navLink("/", "Home")}
            <span className="text-[var(--muted)]">|</span>
            {navLink("/shop", "Shop")}
            <span className="text-[var(--muted)]">|</span>
            {navLink("/contact", "Contact")}
          </nav>

          {/* RIGHT */}
          <div className="flex items-center justify-end gap-2 sm:gap-3">
            {loggedIn !== null && (
              <>
                {loggedIn ? (
                  <div ref={dropdownRef} className="relative hidden sm:block">
                    <button
                      onClick={() => setDropdownOpen((prev) => !prev)}
                      className="flex h-10 items-center gap-2 rounded-full px-3 transition hover:bg-[var(--border)]/30 active:scale-[0.96] sm:h-11 sm:gap-3 sm:px-4"
                    >
                      <div
                        className={clsx(
                          "flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br text-sm font-semibold text-white shadow-md sm:h-9 sm:w-9",
                          gradient[0],
                          gradient[1]
                        )}
                        aria-label="Account avatar"
                        title="Account"
                      >
                        {userInitial}
                      </div>

                      <span className="hidden text-sm font-medium text-[var(--fg)] sm:inline">
                        Account
                      </span>

                      <svg
                        className={clsx(
                          "h-4 w-4 transition-transform duration-200",
                          dropdownOpen && "rotate-180"
                        )}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M5.23 7.21 10 11.168l4.77-3.958" />
                      </svg>
                    </button>

                    <div
                      className={clsx(
                        "absolute right-0 top-full mt-2 origin-top-right rounded-xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl transition-all duration-200",
                        "w-56",
                        dropdownOpen
                          ? "pointer-events-auto scale-100 opacity-100"
                          : "pointer-events-none scale-95 opacity-0"
                      )}
                    >
                      <div className="flex flex-col gap-1 p-3 text-sm">
                        <Link
                          href="/account/profile"
                          className="rounded-md px-3 py-2 transition hover:bg-[var(--border)]/30"
                        >
                          Profile
                        </Link>
                        <Link
                          href="/account/orders"
                          className="rounded-md px-3 py-2 transition hover:bg-[var(--border)]/30"
                        >
                          Orders
                        </Link>
                        <Link
                          href="/account/settings"
                          className="rounded-md px-3 py-2 transition hover:bg-[var(--border)]/30"
                        >
                          Settings
                        </Link>

                        <div className="my-2 h-px bg-[var(--border)]" />

                        <button
                          onClick={handleLogout}
                          disabled={logoutLoading}
                          className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {logoutLoading && (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          )}
                          Logout
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="hidden h-10 items-center justify-center rounded-full border border-[var(--border)] px-4 text-sm font-semibold text-[var(--fg)] transition hover:bg-[var(--border)]/40 active:scale-[0.96] sm:flex sm:h-11 sm:px-6"
                  >
                    Sign in
                  </Link>
                )}
              </>
            )}

            <div ref={mobileMenuRef} className="relative md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--fg)] transition hover:bg-[var(--border)]/30 active:scale-[0.96]"
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {mobileMenuOpen ? (
                    <>
                      <path d="M6 6l12 12" />
                      <path d="M18 6L6 18" />
                    </>
                  ) : (
                    <>
                      <path d="M4 7h16" />
                      <path d="M4 12h16" />
                      <path d="M4 17h16" />
                    </>
                  )}
                </svg>
              </button>

              <div
                className={clsx(
                  "absolute right-0 top-full mt-3 w-[min(92vw,320px)] origin-top-right rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 shadow-2xl transition-all duration-200",
                  mobileMenuOpen
                    ? "pointer-events-auto scale-100 opacity-100"
                    : "pointer-events-none scale-95 opacity-0"
                )}
              >
                <div className="flex flex-col gap-1">
                  {navLink("/", "Home", true, () => setMobileMenuOpen(false))}
                  {navLink("/shop", "Shop", true, () => setMobileMenuOpen(false))}
                  {navLink(
                    "/contact",
                    "Contact",
                    true,
                    () => setMobileMenuOpen(false)
                  )}

                  <div className="my-2 h-px bg-[var(--border)]" />

                  {loggedIn ? (
                    <>
                      <div className="flex items-center gap-3 rounded-xl px-4 py-3">
                        <div
                          className={clsx(
                            "flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br text-sm font-semibold text-white shadow-md",
                            gradient[0],
                            gradient[1]
                          )}
                        >
                          {userInitial}
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[var(--fg)]">
                            Account
                          </p>
                          <p className="text-xs text-[var(--muted)]">
                            Signed in
                          </p>
                        </div>
                      </div>

                      <Link
                        href="/account/profile"
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-xl px-4 py-3 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--border)]/30 hover:text-[var(--fg)]"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/account/orders"
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-xl px-4 py-3 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--border)]/30 hover:text-[var(--fg)]"
                      >
                        Orders
                      </Link>
                      <Link
                        href="/account/settings"
                        onClick={() => setMobileMenuOpen(false)}
                        className="rounded-xl px-4 py-3 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--border)]/30 hover:text-[var(--fg)]"
                      >
                        Settings
                      </Link>

                      <div className="pt-2">
                        <button
                          onClick={handleLogout}
                          disabled={logoutLoading}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {logoutLoading && (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          )}
                          Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center rounded-xl border border-[var(--border)] px-4 py-3 text-sm font-semibold text-[var(--fg)] transition hover:bg-[var(--border)]/30 active:scale-[0.98]"
                    >
                      Sign in
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[var(--border)]/60 to-transparent" />

      <CartToggleButton />
    </header>
  );
}