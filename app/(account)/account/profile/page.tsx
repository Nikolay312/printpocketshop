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

  const initial = (user.name?.[0] ?? user.email[0] ?? "U").toUpperCase();
  const [fromColor, toColor] = getGradientFromString(user.email);

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="overflow-hidden rounded-2xl border border-border/60 bg-background shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <div className="flex flex-col gap-5 sm:gap-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div
                className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${fromColor} ${toColor} text-xl font-semibold text-white shadow-md sm:h-20 sm:w-20 sm:rounded-full sm:text-2xl`}
              >
                {initial}
              </div>

              <div className="min-w-0 space-y-1">
                <div className="inline-flex w-fit items-center rounded-full border border-border/60 bg-muted/40 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Profile
                </div>

                <h1 className="break-words text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  {user.name ?? "User"}
                </h1>

                <p className="break-all text-sm text-muted-foreground sm:text-base">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:gap-4 lg:grid-cols-3">
              <InfoCard
                label="Role"
                value={formatRole(user.role)}
              />
              <InfoCard
                label="Member since"
                value={new Date(user.createdAt).toLocaleDateString()}
              />
              <InfoCard
                label="Stripe customer"
                value={user.stripeCustomerId ? "Linked" : "Not linked"}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-background to-muted/40 shadow-sm">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_35%)]" />

        <div className="relative px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
            <div className="max-w-2xl space-y-4">
              <div className="space-y-2">
                <div className="inline-flex w-fit items-center rounded-full border border-border/60 bg-background/70 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground backdrop-blur">
                  Billing
                </div>

                <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  Billing & subscriptions
                </h2>

                <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                  Manage your payments, invoices, and subscription details in one place.
                </p>
              </div>

              <div className="inline-flex min-h-12 w-full max-w-md items-center gap-3 rounded-2xl border border-border/60 bg-background/80 px-4 py-3 shadow-sm backdrop-blur sm:w-auto">
                <div
                  className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${
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

            <div className="w-full lg:w-auto">
              {user.stripeCustomerId ? (
                <form action="/api/stripe/portal" method="POST" className="w-full lg:w-auto">
                  <button
                    type="submit"
                    className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-foreground px-5 py-3 text-sm font-semibold text-background shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl lg:w-auto lg:px-8"
                  >
                    Open billing portal
                  </button>
                </form>
              ) : (
                <div className="flex min-h-12 items-center justify-center rounded-2xl border border-dashed border-border/70 px-4 py-3 text-center text-sm text-muted-foreground lg:px-6">
                  Billing portal available after first purchase
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-border/60 bg-background shadow-sm">
        <div className="px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                Account details
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                A quick overview of your account information.
              </p>
            </div>

            <div className="divide-y divide-border/60 rounded-2xl border border-border/60 bg-muted/20">
              <Detail label="Display name" value={user.name ?? "Not set"} />
              <Detail label="Email address" value={user.email} />
              <Detail label="Role" value={formatRole(user.role)} />
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
        </div>
      </section>
    </div>
  );
}

function formatRole(role: string) {
  if (!role) return "User";

  return role
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border/60 bg-muted/20 p-4 sm:p-5">
      <div className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-2 text-sm font-semibold text-foreground sm:text-base">
        {value}
      </div>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6 sm:px-5">
      <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <span className="break-words text-sm font-medium text-foreground sm:max-w-[60%] sm:text-right">
        {value}
      </span>
    </div>
  );
}