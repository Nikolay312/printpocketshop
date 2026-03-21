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
      <section className="relative overflow-hidden px-4 pb-20 pt-24 text-center sm:px-6 sm:pb-28 sm:pt-32 lg:px-8 lg:pb-40 lg:pt-40">
        <div className="absolute inset-0 -z-40 bg-gradient-to-b from-[#f8fafc] via-[#f4f7fb] to-[#eaf0f7]" />

        <div className="animate-float-slow absolute left-[10%] top-[-5rem] h-[220px] w-[220px] rounded-full bg-accent/15 blur-[90px] sm:left-[16%] sm:h-[300px] sm:w-[300px] lg:h-[380px] lg:w-[380px] lg:blur-[120px]" />
        <div className="animate-float-slower absolute bottom-[-60px] right-[8%] h-[200px] w-[200px] rounded-full bg-blue-400/10 blur-[90px] sm:right-[12%] sm:h-[260px] sm:w-[260px] lg:bottom-[-90px] lg:h-[320px] lg:w-[320px] lg:blur-[120px]" />

        <div className="absolute left-1/2 top-[-8%] -z-20 h-[360px] w-[95vw] max-w-[720px] -translate-x-1/2 rounded-full bg-white/60 blur-[80px] sm:h-[520px] sm:max-w-[860px] sm:blur-[100px] lg:h-[700px] lg:w-[1000px] lg:blur-[120px]" />
        <div className="absolute left-1/2 top-[-5%] -z-20 h-[320px] w-[90vw] max-w-[640px] -translate-x-1/2 rounded-full bg-accent/10 blur-[100px] sm:h-[460px] sm:max-w-[780px] sm:blur-[120px] lg:h-[620px] lg:w-[920px] lg:blur-[160px]" />

        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,0.03)_100%)]" />

        <FadeIn>
          <div className="mx-auto flex max-w-5xl flex-col items-center">
            <h1 className="max-w-4xl bg-gradient-to-br from-gray-950 via-gray-800 to-gray-600 bg-clip-text text-4xl font-bold leading-tight tracking-[-0.035em] text-transparent sm:text-5xl sm:leading-[1.08] lg:text-7xl lg:leading-[1.04]">
              Modern, Ready-to-Use
              <span className="mt-2 block bg-gradient-to-r from-gray-950 via-gray-700 to-gray-500 bg-clip-text text-transparent">
                Digital Templates
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-gray-600 sm:mt-8 sm:text-lg sm:leading-8 lg:mt-10 lg:text-xl lg:leading-[1.9]">
              Instant downloads for resumes, planners, and creative tools —
              designed to save you time, elevate your work, and help you stand
              out.
            </p>

            <div className="mt-8 w-full sm:mt-10 sm:w-auto lg:mt-12">
              <Link
                href="/shop"
                className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-accent px-8 py-3.5 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_60px_rgba(0,0,0,0.18)] sm:w-auto sm:px-10 sm:py-4 sm:text-base"
              >
                <span className="relative z-10">Browse Products</span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
              </Link>
            </div>
          </div>
        </FadeIn>
      </section>

      <section className="relative px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-40">
        <div className="absolute inset-0 -z-20 bg-gradient-to-b from-white via-[#f9fafc] to-white" />
        <div className="absolute left-1/2 top-0 -z-10 h-[220px] w-[90vw] max-w-[620px] -translate-x-1/2 bg-accent/5 blur-[90px] sm:h-[260px] sm:max-w-[720px] lg:h-[300px] lg:w-[800px] lg:blur-[120px]" />

        <FadeIn>
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col gap-4 sm:mb-14 sm:flex-row sm:items-end sm:justify-between lg:mb-20">
              <h2 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                Featured products
              </h2>

              <Link
                href="/shop"
                className="inline-flex items-center text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
              >
                View all products →
              </Link>
            </div>

            <div className="relative rounded-2xl border border-gray-200 bg-white/70 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur-xl sm:rounded-3xl sm:p-6 lg:p-12 lg:shadow-[0_40px_120px_rgba(0,0,0,0.06)]">
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 to-transparent sm:rounded-3xl" />

              {featured.length > 0 ? (
                <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10 xl:gap-14">
                  {featured.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="relative py-8 text-center text-sm text-gray-500 sm:py-10">
                  No featured products yet.
                </div>
              )}
            </div>
          </div>
        </FadeIn>
      </section>

      <section className="relative bg-gradient-to-b from-white to-gray-50 px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-40">
        <FadeIn>
          <div className="mx-auto max-w-5xl">
            <div className="rounded-2xl border border-border bg-white p-5 shadow-[0_18px_50px_rgba(0,0,0,0.06)] sm:rounded-3xl sm:p-8 lg:p-14 lg:shadow-[0_30px_90px_rgba(0,0,0,0.08)]">
              <HowItWorks />
            </div>
          </div>
        </FadeIn>
      </section>
    </main>
  );
}