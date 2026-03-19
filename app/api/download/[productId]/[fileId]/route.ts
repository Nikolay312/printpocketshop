export const runtime = "nodejs";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/auth.server";
import { checkRateLimit } from "@/lib/rateLimit";
import { getSignedDownloadUrl, fileExistsInStorage } from "@/lib/storage";

export async function GET(
  _req: NextRequest,
  context: {
    params: Promise<{ productId: string; fileId: string }>;
  }
) {
  const { productId, fileId } = await context.params;

  let userId: string;
  try {
    userId = await requireUserId();
  } catch {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const rl = await checkRateLimit({
    key: `download:${userId}:${productId}:${fileId}`,
    limit: 10,
    windowSec: 60 * 5,
  });

  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many download attempts." },
      { status: 429 }
    );
  }

  const hasAccess = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: {
        userId,
        status: "PAID",
      },
    },
    select: { id: true },
  });

  if (!hasAccess) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  const file = await prisma.productFile.findFirst({
    where: {
      id: fileId,
      productId,
    },
    select: {
      id: true,
      fileKey: true,
    },
  });

  if (!file) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const exists = await fileExistsInStorage(file.fileKey);

  if (!exists) {
    return NextResponse.json(
      { error: "Download file missing from storage" },
      { status: 404 }
    );
  }

  const signedUrl = await getSignedDownloadUrl(file.fileKey, 300);

  return NextResponse.redirect(signedUrl, { status: 307 });
}