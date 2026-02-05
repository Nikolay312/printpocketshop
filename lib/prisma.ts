import "server-only";

import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

declare global {
  // eslint-disable-next-line no-var
  var __printpocket_prisma: PrismaClient | undefined;
  // eslint-disable-next-line no-var
  var __printpocket_pg_pool: Pool | undefined;
}

const pool =
  global.__printpocket_pg_pool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") {
  global.__printpocket_pg_pool = pool;
}

const adapter = new PrismaPg(pool);

export const prisma =
  global.__printpocket_prisma ??
  new PrismaClient({
    adapter,
    errorFormat: "minimal", // ✅ CRITICAL FIX (prevents circular JSON crash)
  });

if (process.env.NODE_ENV !== "production") {
  global.__printpocket_prisma = prisma;
}
