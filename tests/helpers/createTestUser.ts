import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { randomUUID } from "crypto";

type CreateTestUserInput = {
  email?: string;
  password?: string;
  role?: Role;
};

export async function createTestUser(
  input: CreateTestUserInput = {}
) {
  const unique = randomUUID();

  const email =
    input.email
      ? `${unique}_${input.email}` // 🔒 always unique even if provided
      : `user-${unique}@test.com`;

  const user = await prisma.user.create({
    data: {
      email,
      password: input.password ?? "test-password",
      role: input.role ?? Role.USER,
      emailVerified: true,
    },
  });

  if (!user.id) {
    throw new Error("createTestUser: failed to persist user");
  }

  return user;
}
