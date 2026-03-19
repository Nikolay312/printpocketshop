export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { expireOldPendingOrders } from "@/lib/orders.cleanup.server";

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Missing CRON_SECRET" },
      { status: 500 }
    );
  }

  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const minutesParam = url.searchParams.get("minutes");
  const minutes = minutesParam ? Number(minutesParam) : 60;

  if (!Number.isFinite(minutes) || minutes < 5 || minutes > 24 * 60) {
    return NextResponse.json(
      { error: "Invalid minutes" },
      { status: 400 }
    );
  }

  const result = await expireOldPendingOrders(minutes);

  return NextResponse.json({
    ok: true,
    ...result,
  });
}
