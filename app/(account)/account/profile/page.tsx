import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/auth.server";
import { prisma } from "@/lib/prisma";

function getGradientFromString(input: string) {
  const colors = [
    ["from-violet-600", "to-indigo-500"],
    ["from-sky-600", "to-cyan-500"],
    ["from-emerald-600", "to-teal-500"],
    ["from-rose-600", "to-pink-500"],
    ["from-orange-500", "to-amber-500"],
    ["from-fuchsia-600", "to-purple-500"],
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

  const initial = (user.name?.[0] ?? user.email?.[0] ?? "U").toUpperCase();
  const [fromColor, toColor] = getGradientFromString(user.email);
  const joinedDate = new Date(user.createdAt).toLocaleDateString();

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 sm:space-y-8">
      <section className="overflow-hidden rounded-3xl bg-card shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
        <div className="relative overflow-hidden px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.10),transparent_32%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent)]" />

          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-4 sm:gap-5">
              <div
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${fromColor} ${toColor} text-2xl font-semibold text-white shadow-lg shadow-black/10 sm:h-20 sm:w-20 sm:text-3xl`}
              >
                {initial}
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  {user.name ?? "User"}
                </h1>

                <p className="mt-1 break-all text-sm text-muted-foreground sm:text-base">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${
                  user.stripeCustomerId
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    user.stripeCustomerId
                      ? "bg-emerald-500"
                      : "bg-muted-foreground/40"
                  }`}
                />
                {user.stripeCustomerId
                  ? "Billing connected"
                  : "No billing profile"}
              </span>
            </div>
          </div>
        </div>

        <div className="px-5 py-5 sm:px-8 sm:py-6 lg:px-10">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <MetricCard label="Role" value={user.role} />
            <MetricCard label="Member since" value={joinedDate} />
            <MetricCard
              label="Stripe customer"
              value={user.stripeCustomerId ? "Linked" : "Not linked"}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-3xl bg-card p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] sm:p-6 lg:p-8">
          <div className="space-y-3">
            <DetailRow label="Full name" value={user.name ?? "Not set"} />
            <DetailRow label="Email address" value={user.email} />
            <DetailRow label="Role" value={user.role} />
            <DetailRow
              label="Stripe customer"
              value={user.stripeCustomerId ? "Linked" : "Not linked"}
            />
          </div>
        </div>

        <div className="rounded-3xl bg-card p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] sm:p-6 lg:p-8">
          <div className="mb-5 sm:mb-6">
            <h3 className="text-xl font-semibold tracking-tight text-foreground">
              Billing
            </h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Manage invoices, payments, and subscriptions securely.
            </p>
          </div>

          <div className="rounded-2xl bg-muted/50 p-4">
            <div className="flex items-start gap-3">
              <div
                className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${
                  user.stripeCustomerId
                    ? "bg-emerald-500"
                    : "bg-muted-foreground/40"
                }`}
              />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {user.stripeCustomerId
                    ? "Billing profile connected"
                    : "Billing profile not set up"}
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {user.stripeCustomerId
                    ? "You can open the billing portal to manage payment methods and invoices."
                    : "The billing portal becomes available after the first successful purchase."}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5">
            {user.stripeCustomerId ? (
              <form
                action="/api/stripe/portal"
                method="POST"
                className="w-full"
              >
                <button
                  type="submit"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-foreground px-5 py-3 text-sm font-semibold text-background transition-transform duration-200 hover:-translate-y-0.5"
                >
                  Open billing portal
                </button>
              </form>
            ) : (
              <div className="rounded-2xl bg-background px-4 py-3 text-sm text-muted-foreground">
                Billing portal available after first purchase.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-muted/35 p-4 sm:p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-base font-semibold text-foreground sm:text-lg">
        {value}
      </p>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl bg-muted/30 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </span>
      <span className="break-words text-sm font-medium text-foreground sm:max-w-[62%] sm:text-right">
        {value}
      </span>
    </div>
  );
}