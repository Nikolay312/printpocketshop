"use client";

import { useState } from "react";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { isValidEmail } from "@/lib/validators";
import { motion } from "framer-motion";

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

export default function ForgotPasswordPage() {
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setError(null);

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      setSubmitted(true);
      showToast("If the email exists, a reset link has been sent.");
    } catch {
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fafaf8] px-6 py-8 sm:px-8 lg:px-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.99),rgba(248,250,252,0.96)_44%,rgba(243,245,247,0.94)_100%)]" />
        <div className="absolute left-[-8rem] top-[-6rem] h-[22rem] w-[22rem] rounded-full bg-white blur-3xl" />
        <div className="absolute right-[-8rem] top-[8%] h-[22rem] w-[22rem] rounded-full bg-slate-100/90 blur-3xl" />
        <div className="absolute bottom-[-10rem] left-[10%] h-[20rem] w-[20rem] rounded-full bg-stone-100/80 blur-3xl" />
        <div className="absolute bottom-[-8rem] right-[12%] h-[18rem] w-[18rem] rounded-full bg-white blur-3xl" />
        <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] [background-size:92px_92px]" />
      </div>

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7">
            <div className="mb-6 text-center max-w-xs mx-auto space-y-3">
              <h1 className="text-2xl font-semibold tracking-[-0.02em] text-slate-950 sm:text-3xl">
                Reset your password
              </h1>

              <p className="text-sm text-slate-500">
                Enter your email and we’ll send you a link to create a new password.
              </p>
            </div>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-6 w-6"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 6.75h16A1.25 1.25 0 0 1 21.25 8v8A1.25 1.25 0 0 1 20 17.25H4A1.25 1.25 0 0 1 2.75 16V8A1.25 1.25 0 0 1 4 6.75Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="m3 8 7.86 5.24a2 2 0 0 0 2.22 0L21 8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <p className="text-base font-medium text-slate-950">
                  Check your inbox
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  If an account with that email exists, we’ve sent a password
                  reset link.
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Please check your inbox and spam folder.
                </p>

                <div className="mt-6">
                  <AnimatedTextLink href="/login" className="text-slate-900">
                    Back to login
                  </AnimatedTextLink>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
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

                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Button
                    type="submit"
                    loading={loading}
                    className="h-12 w-full rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(15,23,42,0.14)] transition-all hover:bg-slate-900"
                  >
                    Send reset link
                  </Button>
                </motion.div>

                <div className="text-center text-sm text-slate-600">
                  <AnimatedTextLink href="/login" className="text-slate-900">
                    Back to login
                  </AnimatedTextLink>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}