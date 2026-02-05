"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { isValidEmail, isRequired } from "@/lib/validators";
import { loginUser } from "@/lib/auth";
import { useToast } from "@/components/ui/Toast";

export default function LoginPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      await loginUser(email, password);
      showToast("Welcome back!");
      router.push("/account/orders");
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
    <main className="px-6 py-32">
      <div className="mx-auto max-w-md space-y-10">
        {/* Header */}
        <header className="space-y-3 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="text-muted leading-relaxed">
            Log in to access your orders, downloads, and account details.
          </p>
        </header>

        {/* Card */}
        <div className="card space-y-6 p-8">
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
                Email address
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Password
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
              Log in
            </Button>
          </form>

          <p className="text-center text-xs text-muted">
            Secure login · Your information is protected
          </p>
        </div>

        {/* Footer links */}
        <div className="space-y-2 text-center text-sm">
          <p className="text-muted">
            Don’t have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-foreground hover:underline"
            >
              Sign up
            </Link>
          </p>

          <Link
            href="/contact"
            className="text-xs text-muted hover:underline"
          >
            Need help accessing your account?
          </Link>
        </div>
      </div>
    </main>
  );
}
