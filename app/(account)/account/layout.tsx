import AuthGuard from "@/components/auth/AuthGuard";
import ManageBillingButton from "@/components/account/ManageBillingButton";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <section className="mx-auto max-w-6xl px-6 py-10 space-y-6">
        {/* Account actions */}
        <div className="flex justify-end">
          <ManageBillingButton />
        </div>

        {children}
      </section>
    </AuthGuard>
  );
}
