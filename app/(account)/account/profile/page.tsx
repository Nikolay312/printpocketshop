import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/auth.server";
import { prisma } from "@/lib/prisma";

/* =====================================================
   Deterministic gradient generator (stable per user)
===================================================== */

function getGradientFromString(input: string) {
  const colors = [
    ["from-indigo-500", "to-violet-500"],
    ["from-blue-500", "to-cyan-500"],
    ["from-emerald-500", "to-teal-500"],
    ["from-rose-500", "to-pink-500"],
    ["from-orange-500", "to-amber-500"],
    ["from-fuchsia-500", "to-purple-500"],
  ];

  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  }

  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

export default async function AccountProfilePage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      email: true,
      name: true,
      role: true,
      createdAt: true,
      stripeCustomerId: true,
    },
  });

  if (!user) redirect("/login");

  const initial = user.name?.[0] ?? user.email[0].toUpperCase();
  const [fromColor, toColor] = getGradientFromString(user.email);

  return (
    <div className="space-y-24">

      {/* ================= PROFILE SURFACE ================= */}
      <section className="rounded-3xl border border-border bg-background shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div className="px-24 py-24 space-y-20">

          <div className="flex items-center gap-12">
            <div
              className={`h-28 w-28 rounded-full bg-gradient-to-br ${fromColor} ${toColor} flex items-center justify-center text-3xl font-semibold text-white shadow-md`}
            >
              {initial}
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                {user.name ?? "User"}
              </h1>

              <p className="text-sm text-muted">
                {user.email}
              </p>
            </div>
          </div>

          <div className="border-t border-border" />

          <div className="max-w-3xl space-y-12">
            <Detail label="Role" value={user.role} />

            <Detail
              label="Member since"
              value={new Date(user.createdAt).toLocaleDateString()}
            />

            <Detail
              label="Stripe customer"
              value={user.stripeCustomerId ? "Linked" : "Not linked"}
            />
          </div>
        </div>
      </section>

      {/* =================  BILLING  ================= */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-background to-muted/40 shadow-xl">

        <div className="px-24 py-24">

          <div className="flex flex-col gap-16 lg:flex-row lg:items-center lg:justify-between">

            {/* Left Content */}
            <div className="space-y-8 max-w-2xl">

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  Billing & subscriptions
                </h2>

                <p className="text-sm text-muted leading-relaxed">
                  Manage your payments, invoices, and subscription securely.
                </p>
              </div>

              {/* Status Card */}
              <div className="inline-flex items-center gap-4 rounded-2xl border border-border bg-background px-6 py-4 shadow-sm">
                <div
                  className={`h-3 w-3 rounded-full ${
                    user.stripeCustomerId
                      ? "bg-emerald-500"
                      : "bg-muted-foreground/40"
                  }`}
                />

                <div className="text-sm font-medium text-foreground">
                  {user.stripeCustomerId
                    ? "Billing profile connected"
                    : "No billing profile yet"}
                </div>
              </div>

            </div>

            {/* Right CTA Area */}
            <div className="flex items-center">

              {user.stripeCustomerId ? (
                <form action="/api/stripe/portal" method="POST">
                  <button
                    type="submit"
                    className="group relative inline-flex items-center justify-center rounded-2xl bg-foreground px-10 py-4 text-sm font-semibold text-background shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                  >
                    Open billing portal
                  </button>
                </form>
              ) : (
                <div className="rounded-2xl border border-dashed border-border px-10 py-4 text-sm text-muted">
                  Billing portal available after first purchase
                </div>
              )}

            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

/* ================= COMPONENT ================= */

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-baseline justify-between border-b border-border pb-5">
      <span className="text-xs uppercase tracking-wide text-muted">
        {label}
      </span>
      <span className="text-base font-medium text-foreground">
        {value}
      </span>
    </div>
  );
}
