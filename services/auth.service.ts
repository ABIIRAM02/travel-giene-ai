import { prisma } from "@/lib/prisma";
import { comparePassword, hashPassword } from "@/lib/password";
import type { LoginInput, RegisterInput } from "@/validators/auth.schema";
import { ConflictError } from "@/lib/errors/conflict-error";
import { UnauthorisedError } from "@/lib/errors/unauthorised-error";

export async function registerUser(data: RegisterInput) {
  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existingUser) {
    throw new ConflictError("Email already exists");
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

export async function LoginUser(data: LoginInput) {
  // Check if email already exists
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new UnauthorisedError("Email or password is not correct");
  }

  // compare password
  const isPasswordValid = await comparePassword(
    data.password,
    user.password,
  );

  if (!isPasswordValid) {
    throw new UnauthorisedError("Email or password is not correct");
  }

  // Return created user
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    credits: user.credits,
    plan: user.plan,
  };
}
