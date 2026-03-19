"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, CreditCard, Download } from "lucide-react";

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const steps = [
    {
      title: "Choose your template",
      text: "Browse a curated collection of professionally designed digital products.",
      icon: CheckCircle2,
    },
    {
      title: "Complete checkout",
      text: "Secure payment with immediate confirmation and receipt.",
      icon: CreditCard,
    },
    {
      title: "Download instantly",
      text: "Access your files immediately and re-download anytime.",
      icon: Download,
    },
  ];

  return (
    <section ref={ref} className="relative">

      {/* Subtle background glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-[400px] w-[700px] rounded-full bg-accent/5 blur-[120px] -z-10" />

      {/* Header */}
      <div className="mx-auto max-w-3xl text-center mb-20">
        <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-[var(--fg)]">
          How it works
        </h2>
        <p className="mt-4 text-lg text-[var(--muted)]">
          A streamlined experience from selection to instant delivery.
        </p>
      </div>

      {/* Steps Wrapper */}
      <div className="relative mx-auto max-w-6xl">

        {/* Connecting line */}
        <div className="hidden lg:block absolute top-16 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">

          {steps.map((item, idx) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className={`
                  group relative overflow-hidden rounded-3xl p-[1px]
                  transition-all duration-700 ease-out
                  ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
                `}
                style={{ transitionDelay: `${idx * 150}ms` }}
              >
                {/* Animated gradient border */}
                <div className="
                  absolute inset-0 rounded-3xl
                  bg-gradient-to-br from-accent/40 via-transparent to-accent/40
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-500
                " />

                {/* Card */}
                <div className="
                  relative rounded-3xl bg-white/80 backdrop-blur-md
                  border border-white/40
                  p-10
                  shadow-[0_10px_40px_rgba(0,0,0,0.06)]
                  transition-all duration-500
                  group-hover:-translate-y-2
                  group-hover:shadow-[0_30px_90px_rgba(0,0,0,0.12)]
                ">

                  {/* Radial hover glow */}
                  <div className="
                    pointer-events-none absolute -inset-20 opacity-0
                    bg-radial-gradient from-accent/10 via-transparent to-transparent
                    group-hover:opacity-100
                    transition-opacity duration-500
                  " />

                  {/* Icon */}
                  <div className="
                    inline-flex h-14 w-14 items-center justify-center
                    rounded-2xl bg-accent/10 text-accent
                    transition-transform duration-500
                    group-hover:scale-110
                  ">
                    <Icon size={22} />
                  </div>

                  {/* Content */}
                  <div className="mt-8 space-y-3">
                    <h3 className="text-xl font-semibold tracking-tight text-[var(--fg)]">
                      {item.title}
                    </h3>

                    <p className="text-base leading-relaxed text-[var(--muted)]">
                      {item.text}
                    </p>
                  </div>

                </div>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}
