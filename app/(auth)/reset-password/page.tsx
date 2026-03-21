"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { motion } from "framer-motion";

function ResetPasswordPageContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { showToast } = useToast();

  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setError(null);

    if (!token) {
      setError("This password reset link is invalid or has expired.");
      return;
    }

    if (!password) {
      setError("Please enter a new password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Unable to reset password.");
      }

      setSuccess(true);
      showToast("Password updated successfully");

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to reset password."
      );
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
          <div className="rounded-[30px] border border-slate-200/80 bg-white/92 p-7 shadow-[0_22px_70px_rgba(15,23,42,0.07),0_8px_24px_rgba(15,23,42,0.04)] sm:p-8">
            <div className="mx-auto mb-6 max-w-xs space-y-3 text-center">
              <h1 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-[2rem]">
                Reset your password
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Enter a new password to secure your account and continue.
              </p>
            </div>

            {success ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-600">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-6 w-6"
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <path
                      d="m8.5 12.25 2.35 2.35L15.75 9.7"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <p className="text-base font-medium text-slate-950">
                  Password updated successfully
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  You’ll be redirected to the login page shortly.
                </p>
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
                    New password
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

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-800">
                    Confirm password
                  </label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
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
                    Update password
                  </Button>
                </motion.div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#fafaf8]" />}>
      <ResetPasswordPageContent />
    </Suspense>
  );
}