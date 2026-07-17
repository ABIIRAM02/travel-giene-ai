import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import type { RegisterInput } from "@/validators/auth.schema";
import { ConflictError } from "@/lib/errors/conflict-error";

export async function registerUser(data: RegisterInput) {

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new ConflictError('Email already exists')
  }

  // Hash password
  const hashedPassword = await hashPassword(data.password);

  // Create user
  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      plan: true,
      credits: true,
      createdAt: true,
    },
  });

  // Return created user
  return user;
}
