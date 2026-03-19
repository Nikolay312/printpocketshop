import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://printpocketshop.com"),

  title: {
    default: "PrintPocketShop",
    template: "%s — PrintPocketShop",
  },

  description:
    "A refined digital template studio offering structured, professionally designed templates for modern creators.",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    url: "https://printpocketshop.com",
    title: "PrintPocketShop",
    description:
      "A refined digital template studio offering structured, professionally designed templates for modern creators.",
    siteName: "PrintPocketShop",
  },

  twitter: {
    card: "summary_large_image",
    title: "PrintPocketShop",
    description:
      "A refined digital template studio offering structured, professionally designed templates.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className="
          min-h-screen
          bg-[var(--bg)]
          text-[var(--fg)]
          antialiased
        "
      >
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Header />

            <main className="relative flex-1 w-full">
              {children}
            </main>

            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
