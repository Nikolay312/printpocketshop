export const runtime = "nodejs";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireVerifiedUser } from "@/lib/auth.server";
import { checkRateLimit } from "@/lib/rateLimit";
import { getSignedDownloadUrl } from "@/lib/storage";

export async function GET(
  _req: NextRequest,
  { params }: { params: { productId: string } }
) {
  let userId: string;

  try {
    userId = await requireVerifiedUser();
  } catch (err) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rl = await checkRateLimit({
    key: `download:${userId}:${params.productId}`,
    limit: 10,
    windowSec: 60 * 5,
  });

  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many download attempts." },
      { status: 429 }
    );
  }

  const orderItem = await prisma.orderItem.findFirst({
    where: {
      productId: params.productId,
      order: { userId, status: "PAID" },
    },
    include: { product: true },
  });

  const fileKey = orderItem?.product?.fileKey;
  if (!fileKey) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  const signedUrl = await getSignedDownloadUrl(fileKey, 300);
  return NextResponse.redirect(signedUrl);
}
