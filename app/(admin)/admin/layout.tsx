import { requireAdminUser } from "@/lib/adminGuard";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireAdminUser();
  } catch (err) {
    if ((err as Error).message === "UNAUTHORIZED") {
      redirect("/login");
    }
    redirect("/");
  }

  return (
    <main className="relative min-h-screen bg-background">
      {/* Subtle ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-muted/10 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <section className="flex flex-col gap-12 lg:flex-row lg:gap-20">
          
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <AdminSidebar />
          </aside>

          {/* Content Area */}
          <div className="flex-1 animate-fade-in">
            {children}
          </div>

        </section>
      </div>
    </main>
  );
}
