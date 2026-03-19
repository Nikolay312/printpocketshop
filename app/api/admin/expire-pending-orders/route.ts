export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { expireOldPendingOrders } from "@/lib/orders.cleanup.server";
import { requireAdminUser } from "@/lib/auth.server";

export async function POST() {
  await requireAdminUser();

  const result = await expireOldPendingOrders();

  return NextResponse.json({
    ok: true,
    ...result,
  });
}
