import { ConflictError } from "@/lib/errors/conflict-error";
import { NotFoundError } from "@/lib/errors/not-found-error";
import { prisma } from "@/lib/prisma";
import { Itinerary } from "@/validators/itinerary.schema";

export async function updateItineraryStatusAsGenerating(
  tripId: string,
  userId: string,
) {
  const trip = await prisma.trip.findFirst({
    where: {
      id: tripId,
      userId,
    },
  });

  if (!trip) {
    throw new NotFoundError("Trip not found");
  }

  const result = await prisma.trip.updateMany({
    where: {
      id: tripId,
      userId,
      itineraryStatus: {
        in: ["PENDING", "FAILED"],
      },
    },
    data: {
      itineraryStatus: "GENERATING",
    },
  });

  if (result.count === 0) {
    // Already generating or already completed
    throw new ConflictError(
      "Itinerary generation already in progress or completed",
    );
  }

  return {
    ...trip,
    itineraryStatus: "GENERATING",
  };
}

export async function updateItinerary(
  tripId: string,
  userId: string,
  itinerary: Itinerary,
) {
  const trip = await prisma.trip.findFirst({
    where: {
      id: tripId,
      userId,
    },
  });

  if (!trip) {
    throw new NotFoundError("Trip not found");
  }

  await prisma.trip.update({
    where: {
      id: tripId,
    },
    data: {
      itinerary,
      itineraryStatus: "COMPLETED",
    },
  });

  return true;
}

export async function updateItineraryStatusAsFailed(
  tripId: string,
  userId: string,
) {
  const result = await prisma.trip.updateMany({
    where: {
      id: tripId,
      userId,
      itineraryStatus: "GENERATING",
    },
    data: {
      itineraryStatus: "FAILED",
    },
  });

  return result.count > 0;
}
