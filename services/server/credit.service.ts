import { Prisma } from "@/lib/generated/prisma/client";
import { CreditTransactionType } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { ITINERARY_GENERATION_COST } from "@/utils/constants";


type AddCreditsInput = {
  userId: string;
  amount: number;
  type:
    | 'FREE_ALLOCATION'
    | 'SUBSCRIPTION_ALLOCATION'
    | 'PURCHASE';
  description: string;
  referenceId: string;
};

async function executeTransaction<T>(
  callback: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await prisma.$transaction(callback, {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
      });
    } catch (error) {
      const shouldRetry =
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2034";

      if (!shouldRetry || attempt === 2) {
        throw error;
      }
    }
  }

  throw new Error("Transaction failed");
}

export async function getCreditBalance(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      subscriptionCredits: true,
      purchasedCredits: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return {
    subscriptionCredits: user.subscriptionCredits,
    purchasedCredits: user.purchasedCredits,

    totalCredits:
      user.subscriptionCredits + user.purchasedCredits,
  };
}

export async function deductCredits(
  userId: string,
  amount: number = ITINERARY_GENERATION_COST,
  referenceId: string
) {

  if (!referenceId) {
    throw new Error("Reference ID is required");
  }

  return executeTransaction(async (tx) => {
    // Check whether this transaction already exists
    const existing = await tx.creditTransaction.findUnique({
      where: { referenceId },
    });

    if (existing) {
      if (
        existing.userId !== userId ||
        existing.type !== CreditTransactionType.GENERATION ||
        existing.amount !== -amount
      ) {
        throw new Error("Transaction reference conflict");
      }

      return existing;
    }

    const user = await tx.user.findUnique({
      where: { id: userId },
      select: {
        subscriptionCredits: true,
        purchasedCredits: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const totalCredits =
      user.subscriptionCredits + user.purchasedCredits;

    if (totalCredits < amount) {
      throw new Error("Insufficient credits");
    }

    // Deduct subscription credits first
    const subscriptionDeduction = Math.min(
      user.subscriptionCredits,
      amount
    );

    // Remaining amount comes from purchased credits
    const purchasedDeduction =
      amount - subscriptionDeduction;

    await tx.user.update({
      where: { id: userId },
      data: {
        subscriptionCredits: {
          decrement: subscriptionDeduction,
        },

        purchasedCredits: {
          decrement: purchasedDeduction,
        },
      },
    });

    return tx.creditTransaction.create({
      data: {
        userId,
        amount: -amount,

        subscriptionDelta: -subscriptionDeduction,
        purchasedDelta: -purchasedDeduction,

        type: CreditTransactionType.GENERATION,
        description: "AI itinerary generation",

        referenceId,
      },
    });
  });
}

export async function addCredits({
  userId,
  amount,
  type,
  description,
  referenceId,
}: AddCreditsInput) {

  if (!referenceId) {
    throw new Error("Reference ID is required");
  }

  const isPurchase = type === CreditTransactionType.PURCHASE;

  return executeTransaction(async (tx) => {
    const existing = await tx.creditTransaction.findUnique({
      where: { referenceId },
    });

    if (existing) {
      if (
        existing.userId !== userId ||
        existing.type !== type ||
        existing.amount !== amount
      ) {
        throw new Error("Transaction reference conflict");
      }

      return existing;
    }

    const user = await tx.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    await tx.user.update({
      where: { id: userId },
      data: isPurchase
        ? {
            purchasedCredits: {
              increment: amount,
            },
          }
        : {
            subscriptionCredits: {
              increment: amount,
            },
          },
    });

    return tx.creditTransaction.create({
      data: {
        userId,
        amount,

        subscriptionDelta: isPurchase ? 0 : amount,
        purchasedDelta: isPurchase ? amount : 0,

        type,
        description,
        referenceId,
      },
    });
  });
}

export async function refundCredits(
  userId: string,
  generationTransactionId: string
) {
  return executeTransaction(async (tx) => {
    const generation = await tx.creditTransaction.findUnique({
      where: {
        id: generationTransactionId,
      },
    });

    if (
      !generation ||
      generation.userId !== userId ||
      generation.type !== CreditTransactionType.GENERATION
    ) {
      throw new Error("Generation transaction not found");
    }

    const refundReferenceId = `refund:${generation.id}`;

    const existingRefund = await tx.creditTransaction.findUnique({
      where: {
        referenceId: refundReferenceId,
      },
    });

    if (existingRefund) {
      return existingRefund;
    }

    const subscriptionRefund = -generation.subscriptionDelta;
    const purchasedRefund = -generation.purchasedDelta;

    const refundAmount = -generation.amount;

    await tx.user.update({
      where: { id: userId },
      data: {
        subscriptionCredits: {
          increment: subscriptionRefund,
        },

        purchasedCredits: {
          increment: purchasedRefund,
        },
      },
    });

    return tx.creditTransaction.create({
      data: {
        userId,

        amount: refundAmount,

        subscriptionDelta: subscriptionRefund,
        purchasedDelta: purchasedRefund,

        type: CreditTransactionType.REFUND,
        description: "Refund for failed itinerary generation",

        referenceId: refundReferenceId,
      },
    });
  });
}