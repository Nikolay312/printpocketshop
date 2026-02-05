"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

export default function ForgotPasswordPage() {
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      setSubmitted(true);
      showToast("If the email exists, a reset link has been sent");
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
            Enter your email address and we’ll send you a secure link
            to reset your password.
          </p>
        </header>

        {submitted ? (
          <div className="card space-y-3 p-6 text-center">
            <p className="text-sm text-muted">
              If an account with that email exists, we’ve sent a
              password reset link.
            </p>
            <p className="text-xs text-muted">
              Please check your inbox and spam folder.
            </p>
          </div>
        ) : (
          <div className="card p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
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

              <Button
                type="submit"
                loading={loading}
                className="w-full"
              >
                Send reset link
              </Button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}
