import "server-only";

import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

/* =========================
   CLIENT
========================= */

if (!process.env.R2_ENDPOINT) throw new Error("R2_ENDPOINT is missing");
if (!process.env.R2_BUCKET_NAME) throw new Error("R2_BUCKET_NAME is missing");
if (!process.env.R2_ACCESS_KEY_ID || !process.env.R2_SECRET_ACCESS_KEY) {
  throw new Error("R2 credentials are missing");
}
if (!process.env.NEXT_PUBLIC_R2_PUBLIC_URL) {
  throw new Error("NEXT_PUBLIC_R2_PUBLIC_URL is missing");
}

const client = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  forcePathStyle: true,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

/* =========================
   HELPERS
========================= */

function normalizeFileKey(value: string) {
  const publicBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL!;

  if (!value.startsWith("http://") && !value.startsWith("https://")) {
    return value;
  }

  if (value.startsWith(publicBase)) {
    return value.replace(`${publicBase}/`, "");
  }

  try {
    const url = new URL(value);
    return url.pathname.replace(/^\/+/, "");
  } catch {
    return value;
  }
}

/* =========================
   STORAGE CHECK
========================= */

export async function fileExistsInStorage(fileKey: string) {
  const key = normalizeFileKey(fileKey);

  try {
    await client.send(
      new HeadObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
      })
    );
    return true;
  } catch {
    return false;
  }
}

/* =========================
   DOWNLOAD (PRIVATE)
========================= */

export async function getSignedDownloadUrl(
  fileKey: string,
  expiresInSec = 300
) {
  const key = normalizeFileKey(fileKey);

  const command = new GetObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME!,
    Key: key,
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

  return key;
}

export async function uploadPublicImage(file: File) {
  const key = `previews/${randomUUID()}-${sanitizeFilename(file.name)}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: file.type || "image/png",
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  return `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;
}
