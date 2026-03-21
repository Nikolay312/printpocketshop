export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
    <main className="relative flex flex-col overflow-hidden bg-background">
      <section className="relative overflow-hidden px-6 pb-32 pt-36 text-center sm:pb-40 sm:pt-44 lg:pb-48 lg:pt-52">
        <div className="absolute inset-0 -z-40 bg-gradient-to-b from-[#f8fafc] via-[#f4f7fb] to-[#eaf0f7]" />

        <div className="animate-float-slow absolute left-[16%] top-[-6rem] h-[380px] w-[380px] rounded-full bg-accent/15 blur-[120px]" />
        <div className="animate-float-slower absolute bottom-[-90px] right-[12%] h-[320px] w-[320px] rounded-full bg-blue-400/10 blur-[120px]" />

        <div className="absolute left-1/2 top-[-10%] -z-20 h-[700px] w-[1000px] -translate-x-1/2 rounded-full bg-white/60 blur-[120px]" />
        <div className="absolute left-1/2 top-[-6%] -z-20 h-[620px] w-[920px] -translate-x-1/2 rounded-full bg-accent/10 blur-[160px]" />

        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,0.03)_100%)]" />

        <FadeIn>
          <div className="mx-auto flex max-w-5xl flex-col items-center">
            <h1 className="max-w-4xl bg-gradient-to-br from-gray-950 via-gray-800 to-gray-600 bg-clip-text text-5xl font-bold leading-[1.08] tracking-[-0.035em] text-transparent sm:text-6xl sm:leading-[1.1] lg:text-7xl lg:leading-[1.04]">
              Modern, Ready-to-Use
              <span className="mt-2 block bg-gradient-to-r from-gray-950 via-gray-700 to-gray-500 bg-clip-text text-transparent">
                Digital Templates
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-[1.9] text-gray-600 sm:mt-10 sm:text-xl">
              Instant downloads for resumes, planners, and creative tools —
              designed to save you time, elevate your work, and help you stand
              out.
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

      <section className="relative px-6 py-40 sm:py-48">
        <div className="absolute inset-0 -z-20 bg-gradient-to-b from-white via-[#f9fafc] to-white" />

        <div className="absolute left-1/2 top-0 -z-10 h-[300px] w-[800px] -translate-x-1/2 bg-accent/5 blur-[120px]" />

        <FadeIn>
          <div className="mx-auto max-w-7xl">
            <div className="mb-20 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
              <h2 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                Featured products
              </h2>

              <Link
                href="/shop"
                className="inline-flex items-center text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
              >
                View all products →
              </Link>
            </div>

            <div className="relative rounded-3xl border border-gray-200 bg-white/70 p-12 shadow-[0_40px_120px_rgba(0,0,0,0.06)] backdrop-blur-xl">
              <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/40 to-transparent" />

              <div className="relative grid gap-14 sm:grid-cols-2 lg:grid-cols-3">
                {featured.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      <section className="relative bg-gradient-to-b from-white to-gray-50 px-6 py-40 sm:py-48">
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