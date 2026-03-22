"use client";

import { Suspense, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { isValidEmail, isRequired } from "@/lib/validators";
import { loginUser } from "@/lib/auth";
import { useToast } from "@/components/ui/Toast";
import { motion } from "framer-motion";

const STORAGE_KEY = "printpocketshop-cart";

function sanitizeNext(next: string | null): string | null {
  if (!next) return null;
  if (next.startsWith("/") && !next.startsWith("//")) return next;
  return null;
}

function getGuestCart() {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function AnimatedTextLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.span whileHover={{ y: -1 }} className="inline-block">
      <Link
        href={href}
        className={`group relative inline-block font-medium text-slate-600 transition-colors duration-200 hover:text-slate-950 ${className}`}
      >
        <span>{children}</span>
        <span className="absolute bottom-0 left-0 h-px w-0 bg-current transition-all duration-300 group-hover:w-full" />
      </Link>
    </motion.span>
  );
}

function ArrowTextLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover="hover"
      initial="rest"
      animate="rest"
      className="inline-block"
    >
      <Link
        href={href}
        className={`group inline-flex items-center gap-2 font-medium text-slate-700 transition-colors duration-200 hover:text-slate-950 ${className}`}
      >
        <span>{children}</span>
        <motion.span
          variants={{
            rest: { x: 0, opacity: 0.7 },
            hover: { x: 4, opacity: 1 },
          }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="text-sm"
        >
          →
        </motion.span>
      </Link>
    </motion.div>
  );
}

function FeatureCard({
  eyebrow,
  title,
  description,
  icon,
  delay = 0,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover="hover"
      className="group relative min-w-0"
    >
      <motion.div
        variants={{
          hover: { y: -4, scale: 1.01 },
        }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-full overflow-hidden rounded-[22px] border border-slate-200/80 bg-white px-4 py-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
      >
        <motion.div
          variants={{
            hover: { opacity: 1 },
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="pointer-events-none absolute inset-0 opacity-0"
        >
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(248,250,252,0.9),rgba(255,255,255,0.98),rgba(244,244,245,0.92))]" />
          <div className="absolute -right-10 -top-10 h-20 w-20 rounded-full bg-slate-100 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-16 w-16 rounded-full bg-stone-100/80 blur-3xl" />
        </motion.div>

        <motion.div
          variants={{
            hover: { scaleX: 1, opacity: 1 },
          }}
          initial={{ scaleX: 0.45, opacity: 0.65 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-4 top-0 h-px origin-left bg-gradient-to-r from-transparent via-slate-400/80 to-transparent"
        />

        <div className="relative flex h-full flex-col">
          <div className="flex items-start justify-between gap-3">
            <motion.div
              variants={{
                hover: { y: -2, scale: 1.03 },
              }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[18px] border border-slate-200 bg-slate-50 text-slate-950 shadow-[0_6px_14px_rgba(15,23,42,0.035)]"
            >
              {icon}
            </motion.div>

            <motion.div
              variants={{
                hover: { x: 0, opacity: 1 },
              }}
              initial={{ x: -4, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="pt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400"
            >
              {eyebrow}
            </motion.div>
          </div>

          <div className="mt-4">
            <h3 className="text-[1.05rem] font-semibold leading-[1.2] tracking-[-0.03em] text-slate-950 sm:text-[1.12rem]">
              {title}
            </h3>
            <p className="mt-2 text-[14px] leading-6 text-slate-600">
              {description}
            </p>
          </div>

          <div className="mt-auto pt-4">
            <motion.div
              variants={{
                hover: { width: 56, opacity: 1 },
              }}
              initial={{ width: 28, opacity: 0.75 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="h-[2px] rounded-full bg-slate-200"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const nextPath = useMemo(
    () => sanitizeNext(searchParams.get("next")),
    [searchParams]
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError(null);

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!isRequired(password)) {
      setError("Password is required.");
      return;
    }

    try {
      setLoading(true);

      await loginUser(email, password, rememberMe);

      const guestCart = getGuestCart();

      if (guestCart.length > 0) {
        try {
          await fetch("/api/cart/merge", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: guestCart }),
          });

          localStorage.removeItem(STORAGE_KEY);
        } catch {}
      }

      showToast("Welcome back!");
      router.replace(nextPath ?? "/shop");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login failed. Please check your details and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fafaf8] px-4 py-4 sm:px-6 sm:py-6 lg:px-12 lg:py-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.99),rgba(248,250,252,0.96)_44%,rgba(243,245,247,0.94)_100%)]" />
        <div className="absolute left-[-8rem] top-[-6rem] h-[22rem] w-[22rem] rounded-full bg-white blur-3xl" />
        <div className="absolute right-[-8rem] top-[8%] h-[22rem] w-[22rem] rounded-full bg-slate-100/90 blur-3xl" />
        <div className="absolute bottom-[-10rem] left-[10%] h-[20rem] w-[20rem] rounded-full bg-stone-100/80 blur-3xl" />
        <div className="absolute bottom-[-8rem] right-[12%] h-[18rem] w-[18rem] rounded-full bg-white blur-3xl" />
        <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] [background-size:92px_92px]" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-2rem)] max-w-7xl items-center sm:min-h-[calc(100vh-3rem)]">
        <div className="grid w-full gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-10">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block"
          >
            <div className="mx-auto max-w-2xl lg:mx-0">
              <div className="mb-4 inline-flex items-center rounded-full border border-slate-200/80 bg-white/88 px-4 py-2 text-xs font-medium text-slate-600 shadow-[0_6px_18px_rgba(15,23,42,0.03)] sm:mb-6 sm:text-sm">
                PrintPocketShop
              </div>

              <h1 className="max-w-3xl text-3xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-4xl lg:text-5xl xl:text-6xl">
                Access your products and continue where you left off
              </h1>

              <div className="mt-4 max-w-xl space-y-3 sm:mt-5">
                <p className="text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                  Sign in to access your purchased products, continue checkout,
                  and manage everything from one clean account space.
                </p>

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.18 }}
                  className="text-sm leading-7 text-slate-600"
                >
                  New here?{" "}
                  <ArrowTextLink
                    href={
                      nextPath
                        ? `/signup?next=${encodeURIComponent(nextPath)}`
                        : "/signup"
                    }
                    className="text-slate-900"
                  >
                    Create your account
                  </ArrowTextLink>
                </motion.div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-4">
                <FeatureCard
                  eyebrow="Purchases"
                  icon={
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 8h12l-1 10H7L6 8Z" />
                      <path d="M9 8a3 3 0 1 1 6 0" />
                    </svg>
                  }
                  title="Access your products"
                  description="View your digital purchases anytime."
                  delay={0.08}
                />
                <FeatureCard
                  eyebrow="Checkout"
                  icon={
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="M13 6l6 6-6 6" />
                    </svg>
                  }
                  title="Continue checkout"
                  description="Your cart is saved and ready."
                  delay={0.16}
                />
                <FeatureCard
                  eyebrow="Account"
                  icon={
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
                      <path d="M5 20a7 7 0 0 1 14 0" />
                    </svg>
                  }
                  title="Manage your account"
                  description="Keep your orders and details in one place."
                  delay={0.24}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.55,
              delay: 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mx-auto w-full max-w-md"
          >
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.06)] sm:p-6 lg:p-7">
              <div className="mx-auto mb-5 max-w-xs space-y-2 text-center sm:mb-6 sm:space-y-3">
                <h2 className="text-2xl font-semibold tracking-[-0.02em] text-slate-950 sm:text-3xl">
                  Welcome Back
                </h2>

                <p className="text-sm leading-6 text-slate-500">
                  Sign in to your account
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                  >
                    {error}
                  </motion.div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-800">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    disabled={loading}
                    className="border-slate-200 bg-white text-slate-950 placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-800">
                    Password
                  </label>

                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={loading}
                      className="border-slate-200 bg-white pr-16 text-slate-950 placeholder:text-slate-400"
                      containerClassName="relative"
                    />

                    <motion.button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      whileHover={{ y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 transition hover:text-slate-900"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </motion.button>
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-1">
                  <label className="flex w-fit items-center gap-3 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={loading}
                      className="h-4 w-4 shrink-0 rounded border-slate-300 text-black focus:ring-2 focus:ring-slate-300"
                    />
                    <span className="leading-5">Remember me</span>
                  </label>

                  <motion.div
                    whileHover="hover"
                    initial="rest"
                    animate="rest"
                    className="inline-flex sm:self-end"
                  >
                    <Link
                      href="/forgot-password"
                      className="group inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 transition-colors duration-200 hover:text-slate-950"
                    >
                      <span>Forgot password?</span>
                      <motion.span
                        variants={{
                          rest: { x: 0, opacity: 0 },
                          hover: { x: 2, opacity: 1 },
                        }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="text-sm"
                      >
                        →
                      </motion.span>
                    </Link>
                  </motion.div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="pt-1"
                >
                  <Button
                    type="submit"
                    loading={loading}
                    className="h-12 w-full rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(15,23,42,0.14)] transition-all hover:bg-slate-900"
                  >
                    {loading ? "Signing in..." : "Log in"}
                  </Button>
                </motion.div>
              </form>

              <div className="mt-5 text-center text-sm leading-6 text-slate-600 sm:mt-6">
                Don’t have an account?{" "}
                <ArrowTextLink
                  href={
                    nextPath
                      ? `/signup?next=${encodeURIComponent(nextPath)}`
                      : "/signup"
                  }
                  className="text-slate-900"
                >
                  Create one
                </ArrowTextLink>
              </div>

              <div className="mt-5 border-t border-slate-200 pt-4 text-center text-xs leading-6 text-slate-500 sm:mt-6 sm:pt-5">
                By continuing, you agree to our{" "}
                <AnimatedTextLink href="/policies/terms">
                  Terms
                </AnimatedTextLink>
                ,{" "}
                <AnimatedTextLink href="/policies/privacy">
                  Privacy Policy
                </AnimatedTextLink>{" "}
                and{" "}
                <AnimatedTextLink href="/policies/refund">
                  Refund Policy
                </AnimatedTextLink>
                .
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#fafaf8]" />}>
      <LoginPageContent />
    </Suspense>
  );
}