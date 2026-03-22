import AuthGuard from "@/components/auth/AuthGuard";
import AccountSidebar from "@/components/account/AccountSidebar";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <main className="relative min-h-screen bg-background">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-muted/10 via-transparent to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12">
          <section className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10 xl:gap-14">
            <aside className="w-full lg:sticky lg:top-24 lg:w-[280px] lg:flex-shrink-0">
              <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/70">
                <div className="border-b border-border/60 px-4 py-3 sm:px-5 lg:hidden">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    Account
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Manage your downloads, orders, profile, and settings.
                  </p>
                </div>

                <div className="p-2 sm:p-3">
                  <AccountSidebar />
                </div>
              </div>
            </aside>

            <div className="min-w-0 flex-1">
              <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/80 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-card/70">
                <div className="px-4 py-4 sm:px-6 sm:py-5 lg:px-8 lg:py-7">
                  {children}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </AuthGuard>
  );
}