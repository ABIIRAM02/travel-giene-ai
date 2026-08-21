import { NotFoundError } from "@/lib/errors/not-found-error";
import { prisma } from "@/lib/prisma";
import { tripSelect } from "@/lib/prisma-selects";
import { TripInput, TripUpdateInput } from "@/validators/trip.schema";

export async function createTrip(tripData: TripInput, userId:string) {
  const trip = await prisma.trip.create({
    data: {
      ...tripData,
      userId
    },
    select: tripSelect,
  });

  return trip;
}

export async function getTrips(userId: string) {
  const trip = await prisma.trip.findMany({
    where: {
      userId: userId,
    },
    select: tripSelect,
  });

  return trip;
}

export async function getTripById(tripId: string, userId: string) {
  const trip = await prisma.trip.findFirst({
    where: {
      id: tripId,
      userId,
    },
    select: tripSelect,
  });

  if (!trip) {
    throw new NotFoundError("Trip not found");
  }

  return trip;
}

export async function updateTrip(
  tripId: string,
  userId: string,
  tripData: TripUpdateInput,
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

  const updatedTrip = await prisma.trip.update({
    where: {
      id: tripId,
    },
    data:{
        ...tripData,
    },
    select: tripSelect,
  });

  return updatedTrip;
}

export async function deleteTrip(tripId: string, userId: string) {
  const trip = await prisma.trip.findFirst({
    where: {
      id: tripId,
      userId,
    },
  });

  if (!trip) {
    throw new NotFoundError("Trip not found");
  }

  await prisma.trip.delete({
    where: {
      id: tripId,
    },
  });

  return {
    message: "Trip deleted successfully",
  };
}
