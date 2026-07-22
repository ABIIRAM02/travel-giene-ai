import { NotFoundError } from "@/lib/errors/not-found-error";
import { prisma } from "@/lib/prisma";
import { userSelect } from "@/lib/prisma-selects";

export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: userSelect
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
}
