"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function VerifyEmailPage() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");

  const [status, setStatus] = useState<
    "loading" | "success" | "error"
  >("loading");

  useEffect(() => {
    if (!token) {
      Promise.resolve().then(() => setStatus("error"));
      return;
    }

    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        setStatus("success");
        setTimeout(() => router.push("/account/orders"), 1500);
      })
      .catch(() => setStatus("error"));
  }, [token, router]);

  return (
    <main className="px-6 py-32">
      <div className="mx-auto max-w-md space-y-8 text-center">
        {status === "loading" && (
          <div className="card p-6 space-y-3">
            <p className="text-sm text-muted">
              Verifying your email address…
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="card p-8 space-y-4">
            <h1 className="text-2xl font-semibold text-foreground">
              Email verified
            </h1>
            <p className="text-sm text-muted">
              Your account is now fully activated. You’ll be redirected
              shortly.
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="card p-8 space-y-4">
            <h1 className="text-2xl font-semibold text-foreground">
              Verification failed
            </h1>
            <p className="text-sm text-muted">
              This verification link is invalid or has expired.
            </p>
            <Button
              variant="secondary"
              onClick={() => router.push("/login")}
            >
              Go to login
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
