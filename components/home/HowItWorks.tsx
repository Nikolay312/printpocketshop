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
      <div className="absolute -top-16 left-1/2 -z-10 h-[220px] w-[90vw] max-w-[520px] -translate-x-1/2 rounded-full bg-accent/5 blur-[80px] sm:-top-20 sm:h-[300px] sm:max-w-[620px] sm:blur-[100px] lg:-top-24 lg:h-[400px] lg:w-[700px] lg:blur-[120px]" />

      {/* Header */}
      <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14 lg:mb-20">
        <h2 className="text-3xl font-semibold tracking-tight text-[var(--fg)] sm:text-4xl lg:text-5xl">
          How it works
        </h2>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)] sm:mt-4 sm:text-base lg:text-lg">
          A streamlined experience from selection to instant delivery.
        </p>
      </div>

      {/* Steps Wrapper */}
      <div className="relative mx-auto max-w-6xl">
        {/* Connecting line */}
        <div className="absolute left-0 right-0 top-16 hidden h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent lg:block" />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-10">
          {steps.map((item, idx) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className={`
                  group relative overflow-hidden rounded-3xl p-[1px]
                  transition-all duration-700 ease-out
                  ${visible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}
                `}
                style={{ transitionDelay: `${idx * 150}ms` }}
              >
                {/* Animated gradient border */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent/40 via-transparent to-accent/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* Card */}
                <div
                  className="
                    relative rounded-3xl border border-white/40 bg-white/80
                    p-6 shadow-[0_10px_40px_rgba(0,0,0,0.06)] backdrop-blur-md
                    transition-all duration-500
                    group-hover:-translate-y-1
                    group-hover:shadow-[0_30px_90px_rgba(0,0,0,0.12)]
                    sm:p-8 lg:p-10
                  "
                >
                  {/* Radial hover glow */}
                  <div className="pointer-events-none absolute -inset-20 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-radial-gradient from-accent/10 via-transparent to-transparent" />

                  {/* Icon */}
                  <div
                    className="
                      inline-flex h-12 w-12 items-center justify-center
                      rounded-2xl bg-accent/10 text-accent
                      transition-transform duration-500
                      group-hover:scale-110
                      sm:h-14 sm:w-14
                    "
                  >
                    <Icon size={22} />
                  </div>

                  {/* Content */}
                  <div className="mt-6 space-y-3 sm:mt-8">
                    <h3 className="text-lg font-semibold tracking-tight text-[var(--fg)] sm:text-xl">
                      {item.title}
                    </h3>

                    <p className="text-sm leading-6 text-[var(--muted)] sm:text-base sm:leading-relaxed">
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