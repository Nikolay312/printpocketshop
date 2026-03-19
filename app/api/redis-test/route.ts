import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Write test value (expires in 60 seconds)
    await redis.set("redis:test", "OK_WORKING", { ex: 60 });

    // Read it back
    const value = await redis.get("redis:test");

    return NextResponse.json({
      success: true,
      value,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Redis test error:", error);
    return NextResponse.json(
      { success: false, error: "Redis connection failed" },
      { status: 500 }
    );
  }
}
