import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Providers } from "./providers"; // ✅ ADD

export const metadata = {
  title: "PrintPocketShop",
  description: "Premium digital templates and printables marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers> {/* ✅ client boundary */}
          <div className="flex min-h-screen flex-col">
            <Header />

            <main className="flex-1">
              {children}
            </main>

            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
