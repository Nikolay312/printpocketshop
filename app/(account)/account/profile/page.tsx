import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/auth.server";
import { prisma } from "@/lib/prisma";

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

  return colors[Math.abs(hash) % colors.length];
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
    <div className="space-y-8 sm:space-y-10">
      {/* PROFILE */}
      <section className="rounded-2xl bg-background/80 p-5 shadow-sm sm:p-6 lg:p-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br ${fromColor} ${toColor} text-lg font-semibold text-white shadow-sm sm:h-20 sm:w-20 sm:rounded-full sm:text-2xl`}
            >
              {initial}
            </div>

            <div className="min-w-0">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {user.name ?? "User"}
              </h1>
              <p className="mt-1 break-all text-sm text-muted-foreground sm:text-base">
                {user.email}
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:gap-4 lg:grid-cols-3">
            <InfoCard label="Role" value={formatRole(user.role)} />
            <InfoCard
              label="Member since"
              value={new Date(user.createdAt).toLocaleDateString()}
            />
            <InfoCard
              label="Billing"
              value={user.stripeCustomerId ? "Connected" : "Not linked"}
            />
          </div>
        </div>
      </section>

      {/* BILLING */}
      <section className="rounded-2xl bg-muted/30 p-5 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl space-y-2">
            <h2 className="text-xl font-semibold sm:text-2xl">
              Billing & subscriptions
            </h2>
            <p className="text-sm text-muted-foreground">
              Manage payments, invoices, and subscriptions securely.
            </p>

            <div className="flex items-center gap-2 pt-2 text-sm font-medium">
              <span
                className={`h-2 w-2 rounded-full ${
                  user.stripeCustomerId
                    ? "bg-emerald-500"
                    : "bg-muted-foreground/40"
                }`}
              />
              {user.stripeCustomerId
                ? "Billing profile connected"
                : "No billing profile yet"}
            </div>
          </div>

          <div className="w-full lg:w-auto">
            {user.stripeCustomerId ? (
              <form action="/api/stripe/portal" method="POST">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background transition hover:opacity-90 lg:w-auto lg:px-7"
                >
                  Open billing portal
                </button>
              </form>
            ) : (
              <div className="text-center text-sm text-muted-foreground">
                Available after first purchase
              </div>
            )}
          </div>
        </div>
      </section>

      {/* DETAILS */}
      <section className="rounded-2xl bg-background/80 p-5 shadow-sm sm:p-6 lg:p-8">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Account details</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Basic account information
            </p>
          </div>

          <div className="space-y-3">
            <Detail label="Display name" value={user.name ?? "Not set"} />
            <Detail label="Email" value={user.email} />
            <Detail label="Role" value={formatRole(user.role)} />
            <Detail
              label="Member since"
              value={new Date(user.createdAt).toLocaleDateString()}
            />
            <Detail
              label="Billing"
              value={user.stripeCustomerId ? "Linked" : "Not linked"}
            />
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
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted/30 p-4 sm:p-5">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold sm:text-base">{value}</div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-medium sm:text-right">{value}</span>
    </div>
  );
}