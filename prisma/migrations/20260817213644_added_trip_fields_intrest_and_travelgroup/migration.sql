/*
  Warnings:

  - Added the required column `travelGroup` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "intrest" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "travelGroup" TEXT NOT NULL;
