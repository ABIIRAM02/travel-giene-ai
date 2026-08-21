/*
  Warnings:

  - You are about to drop the column `intrest` on the `Trip` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Trip" DROP COLUMN "intrest",
ADD COLUMN     "interests" TEXT[] DEFAULT ARRAY[]::TEXT[];
