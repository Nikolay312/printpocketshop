import { describe, it, expect } from "vitest";
import { requireAdminUser } from "@/lib/adminGuard";

describe("Admin permissions", () => {
  it("throws when user is not admin", async () => {
    await expect(requireAdminUser()).rejects.toThrow();
  });
});
