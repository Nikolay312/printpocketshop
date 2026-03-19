import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth.server";
import AccountSettingsClient from "./AccountSettingsClient";

export const runtime = "nodejs";

export default async function AccountSettingsPage() {
  const userId = await getCurrentUserId();

  if (!userId) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      productUpdatesEmail: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <AccountSettingsClient
      initialProductUpdates={user.productUpdatesEmail}
    />
  );
}