"use client";

import { useState } from "react";
import { motion } from "framer-motion";

type FormState = {
  email: string;
  subject: string;
  message: string;
};

type ApiResponse = {
  ok?: boolean;
  error?: string;
};

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function updateField<K extends keyof FormState>(
    key: K,
    value: FormState[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      let data: ApiResponse | null = null;

      try {
        data = (await res.json()) as ApiResponse;
      } catch {
        data = null;
      }

      if (!res.ok) {
        throw new Error(
          data?.error || `Request failed with status ${res.status}`
        );
      }

      setSuccess("Message sent successfully. We’ll reply within 24 hours.");
      setForm({ email: "", subject: "", message: "" });

      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <h1 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl lg:text-5xl">
            Contact us
          </h1>

          <p className="mt-4 max-w-xl text-base leading-7 text-neutral-500 sm:mt-5 sm:text-lg">
            Have a question about your order, downloads, or licensing? Our team
            is here to help.
          </p>

          <div className="mt-5 inline-flex max-w-full items-center rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-xs text-neutral-600 sm:mt-6 sm:text-sm">
            💬 Usually replies within 24 hours on business days
          </div>
        </motion.div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:gap-6 lg:mt-14 lg:grid-cols-12 lg:items-start lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ scale: 1.005 }}
            className="lg:col-span-7"
          >
            <div className="rounded-[1.5rem] border border-neutral-200 bg-white p-4 shadow-sm sm:rounded-[2rem] sm:p-6 lg:p-8">
              {success && (
                <div className="mb-5 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 sm:mb-6 sm:px-5 sm:py-4">
                  <span className="mt-0.5">✅</span>
                  <p className="leading-6">{success}</p>
                </div>
              )}

              {error && (
                <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 sm:mb-6 sm:px-5 sm:py-4">
                  <span className="mt-0.5">⚠️</span>
                  <p className="leading-6">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
                  <Input
                    label="Email address"
                    value={form.email}
                    onChange={(v) => updateField("email", v)}
                    placeholder="you@example.com"
                    type="email"
                    disabled={loading}
                  />

                  <Input
                    label="Subject"
                    value={form.subject}
                    onChange={(v) => updateField("subject", v)}
                    placeholder="Order issue, refund request..."
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-black">
                    Message
                  </label>
                  <textarea
                    required
                    rows={7}
                    value={form.message}
                    disabled={loading}
                    onChange={(e) => updateField("message", e.target.value)}
                    placeholder="Write your message..."
                    className="mt-3 min-h-[180px] w-full resize-none rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 text-sm text-black outline-none transition-all duration-200 focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5 disabled:cursor-not-allowed disabled:opacity-70 sm:px-5 sm:py-4"
                  />
                  <p className="mt-3 text-xs leading-5 text-neutral-500">
                    Include your order number or product name for faster help.
                  </p>
                </div>

                <div>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    whileHover={{ y: -2 }}
                    type="submit"
                    disabled={loading}
                    className="
                      inline-flex min-h-12 w-full items-center justify-center gap-2
                      rounded-2xl bg-black px-6 py-3.5
                      text-sm font-semibold text-white
                      shadow-[0_10px_30px_rgba(0,0,0,0.2)]
                      transition-all duration-300
                      hover:-translate-y-0.5
                      hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]
                      active:translate-y-0
                      disabled:cursor-not-allowed disabled:opacity-60
                      sm:w-auto sm:rounded-full sm:px-10 sm:py-4
                    "
                  >
                    {loading ? "Sending message..." : "Send message"}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-5"
          >
            <div className="rounded-[1.5rem] border border-neutral-200 bg-neutral-50 p-5 sm:rounded-[2rem] sm:p-7 lg:p-9">
              <h3 className="text-lg font-semibold text-black sm:text-xl">
                Support information
              </h3>

              <div className="my-5 h-px bg-neutral-200 sm:my-6" />

              <div className="space-y-5 text-sm text-neutral-600 sm:space-y-6">
                <div>
                  <p className="font-medium text-black">Response time</p>
                  <p className="mt-2 leading-6">
                    We typically respond within 24 hours on business days.
                  </p>
                </div>

                <div>
                  <p className="font-medium text-black">Order help</p>
                  <p className="mt-2 leading-6">
                    Include your order number for faster support and a more
                    accurate response.
                  </p>
                </div>

                <div>
                  <p className="font-medium text-black">Digital downloads</p>
                  <p className="mt-2 leading-6">
                    All purchases include instant access via your account after
                    checkout.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-black">{label}</label>
      <input
        required
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          mt-3 min-h-12 w-full rounded-2xl border border-neutral-200
          bg-neutral-50 px-4 py-3.5 text-sm text-black outline-none
          transition-all duration-200
          focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5
          disabled:cursor-not-allowed disabled:opacity-70
          sm:px-5 sm:py-4
        "
      />
    </div>
  );
}