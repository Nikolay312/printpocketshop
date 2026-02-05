import { requireAdminUser } from "@/lib/adminGuard";
import { redirect } from "next/navigation";

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

    // FORBIDDEN (logged in, but not admin)
    redirect("/");
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      {children}
    </section>
  );
}
