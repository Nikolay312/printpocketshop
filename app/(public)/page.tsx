export const runtime = "nodejs";

import type { Metadata } from "next";
import Link from "next/link";
import { getAllProducts } from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";
import HowItWorks from "@/components/home/HowItWorks";
import FadeIn from "@/components/ui/FadeIn";

export const metadata: Metadata = {
  title: "Modern Digital Templates | PrintPocketShop",
  description:
    "Modern, ready-to-use digital templates. Instant downloads for resumes, planners, and creative tools — built to save you time and make you shine.",
};

export default async function HomePage() {
  const products = await getAllProducts();
  const featured = products.filter((p) => p.isFeatured);

  return (
    <main className="relative flex flex-col bg-background overflow-hidden">

{/* ================= HERO ================= */}
<section className="relative overflow-hidden px-6 pt-36 pb-32 text-center sm:pt-44 sm:pb-40 lg:pt-52 lg:pb-48">
  {/* Background gradient */}
  <div className="absolute inset-0 -z-40 bg-gradient-to-b from-[#f8fafc] via-[#f4f7fb] to-[#eaf0f7]" />

  {/* Ambient blur shapes */}
  <div className="absolute -top-24 left-[16%] h-[380px] w-[380px] rounded-full bg-accent/15 blur-[120px] animate-float-slow" />
  <div className="absolute bottom-[-90px] right-[12%] h-[320px] w-[320px] rounded-full bg-blue-400/10 blur-[120px] animate-float-slower" />

  {/* Cleaner center glow (main improvement) */}
  <div className="absolute top-[-10%] left-1/2 -z-20 h-[700px] w-[1000px] -translate-x-1/2 rounded-full bg-white/60 blur-[120px]" />
  <div className="absolute top-[-6%] left-1/2 -z-20 h-[620px] w-[920px] -translate-x-1/2 rounded-full bg-accent/10 blur-[160px]" />

  {/* Soft vignette */}
  <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,0.03)_100%)]" />

  <FadeIn>
    <div className="mx-auto flex max-w-5xl flex-col items-center">
      <h1 className="max-w-4xl text-5xl font-bold tracking-[-0.035em] leading-[1.08] text-transparent bg-clip-text bg-gradient-to-br from-gray-950 via-gray-800 to-gray-600 sm:text-6xl sm:leading-[1.1] lg:text-7xl lg:leading-[1.04]">
        Modern, Ready-to-Use
        <span className="mt-2 block bg-gradient-to-r from-gray-950 via-gray-700 to-gray-500 bg-clip-text text-transparent">
          Digital Templates
        </span>
      </h1>

      {/* Improved paragraph width + spacing */}
      <p className="mt-8 max-w-2xl text-lg leading-[1.9] text-gray-600 sm:mt-10 sm:text-xl">
        Instant downloads for resumes, planners, and creative tools — designed
        to save you time, elevate your work, and help you stand out.
      </p>

      <div className="mt-10 sm:mt-12">
        <Link
          href="/shop"
          className="group relative inline-flex items-center justify-center overflow-hidden rounded-2xl bg-accent px-10 py-4 text-base font-semibold text-white shadow-[0_16px_40px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_60px_rgba(0,0,0,0.18)]"
        >
          <span className="relative z-10">Browse Products</span>

          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
        </Link>
      </div>
    </div>
  </FadeIn>
</section>

    {/* ================= FEATURED ================= */}
    <section className="relative px-6 py-40 sm:py-48">

      {/* Soft section background layer */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-b from-white via-[#f9fafc] to-white" />

      {/* Subtle top divider glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[300px] w-[800px] bg-accent/5 blur-[120px] -z-10" />

      <FadeIn>
        <div className="mx-auto max-w-7xl">

          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10 mb-20">

            <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight text-gray-900">
              Featured products
            </h2>

            <Link
              href="/shop"
              className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
            >
              View all products →
            </Link>

          </div>

          {/* Premium Card Container */}
          <div className="relative rounded-3xl border border-gray-200 bg-white/70 backdrop-blur-xl p-12 shadow-[0_40px_120px_rgba(0,0,0,0.06)]">

            {/* Soft internal glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />

            <div className="relative grid gap-14 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

          </div>

        </div>
      </FadeIn>
    </section>


      {/* ================= HOW IT WORKS ================= */}
      <section className="relative px-6 py-40 sm:py-48 bg-gradient-to-b from-white to-gray-50">
        <FadeIn>
          <div className="mx-auto max-w-5xl">

            <div className="rounded-3xl border border-border bg-white p-14 shadow-[0_30px_90px_rgba(0,0,0,0.08)]">
              <HowItWorks />
            </div>

          </div>
        </FadeIn>
      </section>

    </main>
  );
}
