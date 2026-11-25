-- AlterTable
ALTER TABLE "CreditTransaction" ADD COLUMN     "purchasedDelta" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "subscriptionDelta" INTEGER NOT NULL DEFAULT 0;
