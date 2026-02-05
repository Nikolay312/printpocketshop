"use client";

import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-28 text-center space-y-10">
      {/* ICON */}
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
        <span className="text-4xl text-green-700">✓</span>
      </div>

      {/* HEADER */}
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold">
          Payment successful
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto">
          Thank you for your purchase. Your digital products are now
          available and ready to download.
        </p>
      </div>

      {/* PRIMARY ACTION */}
      <div className="space-y-3">
        <Link
          href="/account/downloads"
          className="inline-block rounded-xl bg-black px-8 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          Go to my downloads
        </Link>

        <Link
          href="/shop"
          className="block text-sm text-gray-500 hover:underline"
        >
          Continue shopping
        </Link>
      </div>

      {/* TRUST / INFO */}
      <div className="pt-6 space-y-2 text-sm text-gray-400">
        <p>✔ Instant access to all purchased files</p>
        <p>✔ Lifetime access from your account</p>
        <p>✔ No physical shipping required</p>
      </div>

      {/* EMAIL NOTE */}
      <p className="pt-4 text-xs text-gray-400">
        A confirmation email has been sent to your email address.
      </p>
    </main>
  );
}
