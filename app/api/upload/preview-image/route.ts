export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/adminGuard";
import { uploadPublicImage } from "@/lib/storage";

export async function POST(req: Request) {
  await requireAdminUser();

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "Invalid file" },
      { status: 400 }
    );
  }

  const imageUrl = await uploadPublicImage(file);

  return NextResponse.json({ url: imageUrl });
}
