import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/adminGuard";
import { uploadPrivateFile } from "@/lib/storage";

export async function POST(req: Request) {
  await requireAdminUser();

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "No file provided" },
      { status: 400 }
    );
  }

  try {
    const fileKey = await uploadPrivateFile(file);
    return NextResponse.json({ fileKey });
  } catch (err) {
    console.error("Product file upload failed:", err);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
