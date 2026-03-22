export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Image from "next/image";
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
      <section className="relative min-h-[100svh] overflow-hidden">
        <div className="absolute inset-0">
          <div className="relative h-full w-full">
            <Image
              src="/images/home/hero-desktop.jpg"
              alt="PrintPocketShop digital templates workspace"
              fill
              priority
              className="hidden object-cover md:block"
              sizes="100vw"
            />
            <Image
              src="/images/home/hero-mobile.jpg"
              alt="PrintPocketShop digital templates workspace"
              fill
              priority
              className="object-cover md:hidden"
              sizes="100vw"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/55 to-black/25 md:hidden" />
          <div className="absolute inset-0 hidden bg-gradient-to-r from-black/82 via-black/56 to-black/18 md:block" />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <FadeIn>
          <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-7xl items-center px-6 py-24 sm:px-8 lg:px-12">
            <div className="max-w-[680px] text-white">
              <div className="flex flex-col gap-6 sm:gap-7 lg:gap-8">
                <h1 className="max-w-[12ch] text-4xl font-semibold leading-[1.08] tracking-[-0.035em] text-white sm:text-5xl lg:text-6xl lg:leading-[1.04] xl:text-7xl">
                  Digital Templates for Modern Work
                </h1>

                <p className="max-w-[60ch] text-base leading-7 text-white/82 sm:text-lg sm:leading-8">
                  Discover premium CV templates, business planners, ebooks, and
                  creative digital resources designed to save time and elevate
                  your brand.
                </p>

                <div className="pt-2 sm:pt-3">
                  <Link
                    href="/shop"
                    className="inline-flex min-h-[56px] items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-7 text-base font-semibold text-white shadow-[0_18px_50px_rgba(0,0,0,0.28)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/15 hover:shadow-[0_24px_70px_rgba(0,0,0,0.34)]"
                  >
                    Shop Templates
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      <section className="relative px-6 py-24 sm:py-32 lg:py-40">
        <div className="absolute inset-0 -z-20 bg-gradient-to-b from-white via-[#f8fafc] to-white" />
        <div className="absolute left-1/2 top-0 -z-10 h-[240px] w-[700px] -translate-x-1/2 bg-accent/5 blur-[120px]" />

        <FadeIn>
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 flex flex-col gap-6 sm:mb-16 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                  Featured products
                </h2>
              </div>

              <Link
                href="/shop"
                className="inline-flex items-center text-sm font-medium text-gray-700 transition-colors hover:text-gray-900"
              >
                View all products →
              </Link>
            </div>

            <div className="relative rounded-3xl border border-gray-200/80 bg-white p-6 shadow-[0_30px_100px_rgba(0,0,0,0.06)] sm:p-8 lg:p-12">
              <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/60 to-transparent" />
              <div className="relative grid gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
                {featured.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      <section className="relative bg-gradient-to-b from-white to-gray-50 px-6 py-24 sm:py-32 lg:py-40">
        <FadeIn>
          <div className="mx-auto max-w-5xl">
            <div className="rounded-3xl border border-border bg-white p-8 shadow-[0_24px_80px_rgba(0,0,0,0.08)] sm:p-10 lg:p-14">
              <HowItWorks />
            </div>
          </div>
        </FadeIn>
      </section>
    </main>
  );
}