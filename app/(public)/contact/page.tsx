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
    <main className="min-h-screen bg-white px-6 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl font-semibold tracking-tight text-black sm:text-5xl">
            Contact us
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-500">
            Have a question about your order, downloads, or licensing? Our team
            is here to help.
          </p>

          <div className="mt-6 inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-sm text-neutral-600">
            💬 Usually replies within 24 hours on business days
          </div>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ scale: 1.005 }}
            className="lg:col-span-7"
          >
            <div className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-sm sm:p-10">
              {success && (
                <div className="mb-8 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-800">
                  <span className="mt-0.5">✅</span>
                  <p>{success}</p>
                </div>
              )}

              {error && (
                <div className="mb-8 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
                  <span className="mt-0.5">⚠️</span>
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid gap-8 sm:grid-cols-2">
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
                    className="mt-3 w-full resize-none rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-4 text-sm text-black outline-none transition-all duration-200 focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5 disabled:cursor-not-allowed disabled:opacity-70"
                  />
                  <p className="mt-3 text-xs text-neutral-500">
                    Include your order number or product name for faster help.
                  </p>
                </div>

                <div>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ y: -2 }}
                    type="submit"
                    disabled={loading}
                    className="
                      inline-flex items-center justify-center gap-2
                      rounded-full bg-black px-10 py-4
                      text-sm font-semibold text-white
                      shadow-[0_10px_30px_rgba(0,0,0,0.2)]
                      transition-all duration-300
                      hover:-translate-y-0.5
                      hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]
                      active:translate-y-0
                      disabled:cursor-not-allowed disabled:opacity-60
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
            <div className="rounded-[2rem] border border-neutral-200 bg-neutral-50 p-10 sm:p-12">
              <h3 className="text-xl font-semibold text-black">
                Support information
              </h3>

              <div className="my-8 h-px bg-neutral-200" />

              <div className="space-y-8 text-sm text-neutral-600">
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
          mt-3 w-full rounded-2xl border border-neutral-200
          bg-neutral-50 px-5 py-4 text-sm text-black outline-none
          transition-all duration-200
          focus:border-black focus:bg-white focus:ring-2 focus:ring-black/5
          disabled:cursor-not-allowed disabled:opacity-70
        "
      />
    </div>
  );
}