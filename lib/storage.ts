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
   ENV
========================= */

function getRequiredStorageEnv() {
  const endpoint = process.env.R2_ENDPOINT;
  const bucketName = process.env.R2_BUCKET_NAME;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const publicUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

  if (!endpoint) throw new Error("R2_ENDPOINT is missing");
  if (!bucketName) throw new Error("R2_BUCKET_NAME is missing");
  if (!accessKeyId || !secretAccessKey) {
    throw new Error("R2 credentials are missing");
  }
  if (!publicUrl) {
    throw new Error("NEXT_PUBLIC_R2_PUBLIC_URL is missing");
  }

  return {
    endpoint,
    bucketName,
    accessKeyId,
    secretAccessKey,
    publicUrl,
  };
}

/* =========================
   CLIENT
========================= */

let cachedClient: S3Client | null = null;

function getStorageClient() {
  if (cachedClient) return cachedClient;

  const { endpoint, accessKeyId, secretAccessKey } = getRequiredStorageEnv();

  cachedClient = new S3Client({
    region: "auto",
    endpoint,
    forcePathStyle: true,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return cachedClient;
}

/* =========================
   HELPERS
========================= */

function normalizeFileKey(value: string) {
  const { publicUrl } = getRequiredStorageEnv();

  if (!value.startsWith("http://") && !value.startsWith("https://")) {
    return value;
  }

  if (value.startsWith(publicUrl)) {
    return value.replace(`${publicUrl}/`, "");
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
  const client = getStorageClient();
  const { bucketName } = getRequiredStorageEnv();

  try {
    await client.send(
      new HeadObjectCommand({
        Bucket: bucketName,
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
  const client = getStorageClient();
  const { bucketName } = getRequiredStorageEnv();

  const command = new GetObjectCommand({
    Bucket: bucketName,
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
  const client = getStorageClient();
  const { bucketName } = getRequiredStorageEnv();
  const key = `products/${randomUUID()}-${sanitizeFilename(file.name)}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: file.type || "application/octet-stream",
    })
  );

  return key;
}

export async function uploadPublicImage(file: File) {
  const client = getStorageClient();
  const { bucketName, publicUrl } = getRequiredStorageEnv();
  const key = `previews/${randomUUID()}-${sanitizeFilename(file.name)}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: file.type || "image/png",
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  return `${publicUrl}/${key}`;
}