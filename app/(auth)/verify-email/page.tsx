"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";

type Status = "loading" | "success" | "error" | "pending";

function MailIcon() {
  return (
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
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m8.5 12.25 2.35 2.35L15.75 9.7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path
        d="M12 3.75 21 19.25a1 1 0 0 1-.87 1.5H3.87A1 1 0 0 1 3 19.25l9-15.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M12 9v4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16.75" r=".9" fill="currentColor" />
    </svg>
  );
}

function Spinner() {
  return (
    <div
      className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900"
      aria-hidden="true"
    />
  );
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

export default function VerifyEmailPage() {
  const router = useRouter();
  const params = useSearchParams();

  const token = params.get("token");
  const email = params.get("email");

  const initialStatus = useMemo<Status>(() => {
    if (token) return "loading";
    if (email) return "pending";
    return "error";
  }, [token, email]);

  const [status, setStatus] = useState<Status>(initialStatus);

  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Verification failed");
        if (cancelled) return;
        setStatus("success");
        setTimeout(() => {
          if (!cancelled) {
            router.push("/account/orders");
          }
        }, 1800);
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token, router]);

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
          className="w-full max-w-lg"
        >
          <div className="rounded-[30px] border border-slate-200/80 bg-white/92 p-8 text-center shadow-[0_22px_70px_rgba(15,23,42,0.07),0_8px_24px_rgba(15,23,42,0.04)] sm:p-10">

            {status === "loading" && (
              <div>
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900">
                  <Spinner />
                </div>

                <h1 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-[2rem]">
                  Verifying your email
                </h1>

                <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-600">
                  Please wait while we confirm your link and activate your
                  account.
                </p>
              </div>
            )}

            {status === "pending" && (
              <div>
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-900">
                  <MailIcon />
                </div>

                <h1 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-[2rem]">
                  Check your inbox
                </h1>

                <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-600">
                  We sent a verification link to your email address. Open the
                  email and click the link to activate your account.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Button
                    onClick={() => router.push("/login")}
                    className="h-11 rounded-2xl bg-slate-950 px-6 text-sm font-semibold text-white hover:bg-slate-900"
                  >
                    Back to login
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() => router.push("/signup")}
                    className="h-11 rounded-2xl px-6"
                  >
                    Use another email
                  </Button>
                </div>
              </div>
            )}

            {status === "success" && (
              <div>
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-600">
                  <CheckIcon />
                </div>

                <h1 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-[2rem]">
                  Email verified
                </h1>

                <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-600">
                  Your account is now active and ready to use. You’ll be
                  redirected in a moment.
                </p>

                <div className="mt-7">
                  <Button
                    onClick={() => router.push("/account/orders")}
                    className="h-11 rounded-2xl bg-slate-950 px-6 text-sm font-semibold text-white hover:bg-slate-900"
                  >
                    Go to my account
                  </Button>
                </div>
              </div>
            )}

            {status === "error" && (
              <div>
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-200 bg-red-50 text-red-500">
                  <AlertIcon />
                </div>

                <h1 className="text-3xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-[2rem]">
                  Verification failed
                </h1>

                <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-slate-600">
                  This verification link is invalid, expired, or has already
                  been used.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
                  <Button
                    onClick={() => router.push("/login")}
                    className="h-11 rounded-2xl bg-slate-950 px-6 text-sm font-semibold text-white hover:bg-slate-900"
                  >
                    Go to login
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() => router.push("/signup")}
                    className="h-11 rounded-2xl px-6"
                  >
                    Back to signup
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-8 border-t border-slate-200 pt-5 text-sm text-slate-600">
              Need help?{" "}
              <AnimatedTextLink
                href="mailto:support@printpocketshop.com"
                className="text-slate-900"
              >
                Contact support
              </AnimatedTextLink>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}