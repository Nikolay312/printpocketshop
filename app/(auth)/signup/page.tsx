"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { isValidEmail, isRequired } from "@/lib/validators";
import { loginUser } from "@/lib/auth";
import { useToast } from "@/components/ui/Toast";

export default function SignupPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError(null);

    if (!isRequired(fullName)) {
      setError("Please enter your full name.");
      return;
    }

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

    const res = await fetch("/api/auth/registar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        name: fullName,
      }),
    });


      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Signup failed");
      }

      // Signup succeeded → now log in
      await loginUser(email, password);

      showToast("Account created successfully");
      router.push("/account/orders");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Signup failed. Please try again."
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
            Create your account
          </h1>
          <p className="text-muted leading-relaxed">
            Access your purchases, downloads, and account settings anytime.
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
                Full name
              </label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
                disabled={loading}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Country
              </label>
              <Input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="United Kingdom"
                disabled={loading}
              />
            </div>

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

            <Button type="submit" loading={loading} className="w-full">
              Create account
            </Button>
          </form>

          <p className="text-center text-xs text-muted">
            Secure signup · Your information is protected
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-muted">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
