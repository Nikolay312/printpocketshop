export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/adminGuard";
import { uploadPrivateFile } from "@/lib/storage";
import { checkRateLimit } from "@/lib/rateLimit";

const MAX_SIZE = 100 * 1024 * 1024; // 100MB

// Primary validation (extension-based)
const allowedExtensions = [
  ".pdf",
  ".zip",
  ".doc",
  ".docx",
  ".png",
  ".jpg",
  ".jpeg",
];

// Secondary validation (MIME)
const allowedMimeTypes = [
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
  "application/octet-stream",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
];

function hasAllowedExtension(fileName: string) {
  const lower = fileName.toLowerCase();
  return allowedExtensions.some((ext) => lower.endsWith(ext));
}

export async function POST(req: Request) {
  try {
    const adminId = await requireAdminUser();

    const rl = await checkRateLimit({
      key: `admin-upload:${adminId}`,
      limit: 50,
      windowSec: 60,
    });

    if (!rl.ok) {
      return NextResponse.json(
        { error: "Too many uploads" },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // 🔍 DEBUG LOG (important)
    console.log("UPLOAD FILE:", {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // Size validation
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large (max 100MB)" },
        { status: 400 }
      );
    }

    // Extension validation
    if (!hasAllowedExtension(file.name)) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.name}` },
        { status: 400 }
      );
    }

    // MIME warning (non-blocking)
    if (file.type && !allowedMimeTypes.includes(file.type)) {
      console.warn(
        "Unexpected MIME type:",
        file.type,
        "for file:",
        file.name
      );
    }

    const fileKey = await uploadPrivateFile(file);

    // 🔍 DEBUG LOG (important)
    console.log("UPLOADED KEY:", fileKey);

    return NextResponse.json({ fileKey });
  } catch (err: unknown) {
    console.error("Product file upload failed:", err);

    let message = "Upload failed";

    if (err instanceof Error) {
      message = err.message;
    }

    return NextResponse.json(
      {
        error:
          process.env.NODE_ENV === "development"
            ? message
            : "Upload failed",
      },
      { status: 500 }
    );
  }
}