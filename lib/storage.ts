import "server-only";

import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

/* =========================
   CLIENT (R2 SAFE)
========================= */

if (!process.env.R2_ENDPOINT) {
  throw new Error("R2_ENDPOINT is missing");
}

if (!process.env.R2_BUCKET_NAME) {
  throw new Error("R2_BUCKET_NAME is missing");
}

if (!process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
  throw new Error("R2 credentials are missing");
}

const client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  forcePathStyle: true, // ✅ REQUIRED for Cloudflare R2
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

/* =========================
   DOWNLOAD (PRIVATE)
========================= */

export async function getSignedDownloadUrl(
  fileKey: string,
  expiresInSec = 300
) {
  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: fileKey,
  });

  return getSignedUrl(client, command, {
    expiresIn: expiresInSec,
  });
}

/* =========================
   UPLOAD HELPERS
========================= */

function sanitizeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

/**
 * Upload private product file (PDF / ZIP)
 */
export async function uploadPrivateFile(file: File) {
  const key = `products/${randomUUID()}-${sanitizeFilename(file.name)}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: file.type || "application/octet-stream",
    })
  );

  return key; // private key (never exposed)
}

/**
 * Upload public preview image
 */
export async function uploadPublicImage(file: File) {
  const key = `previews/${randomUUID()}-${sanitizeFilename(file.name)}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  return `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;
}
