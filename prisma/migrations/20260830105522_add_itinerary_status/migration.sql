-- CreateEnum
CREATE TYPE "ItineraryStatus" AS ENUM ('PENDING', 'GENERATING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "itineraryStatus" "ItineraryStatus" NOT NULL DEFAULT 'PENDING';
