import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { beforeEach, afterAll } from "vitest";

/* =========================
   ENV SETUP
========================= */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

dotenv.config({
  path: path.join(projectRoot, ".env.test"),
  override: true,
});

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing in test environment");
}

/* =========================
   FORCE PG CREDENTIALS (Windows-safe)
========================= */

const dbUrl = new URL(process.env.DATABASE_URL);

process.env.PGHOST = dbUrl.hostname;
process.env.PGPORT = dbUrl.port || "5432";
process.env.PGDATABASE = dbUrl.pathname.slice(1);
process.env.PGUSER = dbUrl.username;
process.env.PGPASSWORD = dbUrl.password;

if (typeof process.env.PGPASSWORD !== "string") {
  throw new Error("PGPASSWORD is not a string in tests");
}

/* =========================
   Import Prisma AFTER env
========================= */

import { prisma } from "@/lib/prisma";

/* =========================
   DATABASE CLEANUP
========================= */

beforeEach(async () => {
  // order matters because of foreign keys
  await prisma.processedStripeEvent.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.licenseUpgrade.deleteMany();
  await prisma.order.deleteMany();
  await prisma.user.deleteMany();
});

/* =========================
   DISCONNECT
========================= */

afterAll(async () => {
  await prisma.$disconnect();
});
