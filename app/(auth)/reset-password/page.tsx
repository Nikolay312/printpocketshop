"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { showToast } = useToast();

  const token = params.get("token");

  const [password, setPassword] = useState("");
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
        err instanceof Error
          ? err.message
          : "Unable to reset password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="px-6 py-32">
      <div className="mx-auto max-w-md space-y-10">
        {/* Header */}
        <header className="space-y-3 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Reset your password
          </h1>
          <p className="text-muted leading-relaxed">
            Choose a new password for your account.
          </p>
        </header>

        {success ? (
          <div className="card space-y-3 p-6 text-center">
            <p className="text-sm text-muted">
              Your password has been updated successfully.
            </p>
            <p className="text-xs text-muted">
              You’ll be redirected to the login page shortly.
            </p>
          </div>
        ) : (
          <div className="card p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                >
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  New password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                loading={loading}
                className="w-full"
              >
                Update password
              </Button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
