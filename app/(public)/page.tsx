export const runtime = "nodejs";

import type { Metadata } from "next";
import Link from "next/link";
import { getAllProducts } from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";
import HowItWorks from "@/components/home/HowItWorks";
import TrustSection from "@/components/home/TrustSection";
import CategoryGrid from "@/components/home/CategoryGrid";

export const metadata: Metadata = {
  title: "PrintPocketShop — Premium Digital Templates",
  description:
    "Professionally designed digital templates. Instant download, lifetime access, and easy customization.",
};

export default async function HomePage() {
  const products = await getAllProducts();
  const featured = products.filter((p) => p.isFeatured);

  return (
    <main>
      {/* ================= HERO ================= */}
      <section className="px-6 py-32 text-center">
        <div className="mx-auto max-w-4xl space-y-8">
          <span className="inline-block rounded-full bg-surface px-4 py-1 text-xs font-medium text-muted">
            Premium digital templates
          </span>

          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
            Digital templates designed to
            <span className="block text-accent">
              save time and look professional
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-muted leading-relaxed">
            High-quality resumes, planners, and printable designs — ready to use,
            easy to customize, and available instantly after purchase.
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover"
            >
              Browse products
            </Link>

            <Link
              href="/about"
              className="text-sm font-medium text-muted hover:text-foreground transition"
            >
              Learn more →
            </Link>
          </div>

          <p className="text-xs text-muted">
            Instant download · Lifetime access · No subscription
          </p>
        </div>
      </section>

      {/* ================= TRUST ================= */}
      <section className="bg-surface py-20">
        <TrustSection />
      </section>

      {/* ================= FEATURED ================= */}
      <section className="px-6 py-32">
        <div className="mx-auto max-w-6xl space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-semibold">
              Featured products
            </h2>
            <p className="text-muted max-w-xl mx-auto">
              Best-selling and hand-picked templates trusted by professionals
              and creatives.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/shop"
              className="inline-block rounded-full border border-border px-8 py-3 text-sm font-medium hover:bg-surface transition"
            >
              View all products
            </Link>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section className="bg-surface py-32">
        <HowItWorks />
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="px-6 py-32">
        <div className="mx-auto max-w-6xl space-y-14">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-semibold">
              Browse by category
            </h2>
            <p className="text-muted">
              Find exactly what you need in seconds
            </p>
          </div>

          <CategoryGrid />
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="bg-surface px-6 py-32 text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          <h2 className="text-3xl font-semibold">
            Ready to get started?
          </h2>

          <p className="text-muted">
            Explore professionally designed templates that help you present
            your work with confidence.
          </p>

          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-3 text-sm font-semibold text-white transition hover:bg-accent-hover"
          >
            Browse all templates
          </Link>
        </div>
      </section>
    </main>
  );
}
