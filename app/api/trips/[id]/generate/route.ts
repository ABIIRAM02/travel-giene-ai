import { generateItinerary } from "@/lib/ai/itinerary";
import { AppError } from "@/lib/errors/app-error";
import {
  updateItinerary,
  updateItineraryStatusAsFailed,
  updateItineraryStatusAsGenerating,
} from "@/services/server/itinerary.service";
import { getAuthenticatedUserId } from "@/utils/auth-check";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  let userId;

  try {
    userId = await getAuthenticatedUserId();

    const tripData = await updateItineraryStatusAsGenerating(id, userId);

    const itinerary = await generateItinerary(tripData);

    await updateItinerary(id, userId, itinerary);

    return NextResponse.json(
      {
        message: "Itinerary generated successfully",
        itinerary,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    if (userId) {
      try {
        await updateItineraryStatusAsFailed(id, userId);
      } catch (statusError) {
        console.error("Failed to update itinerary status:", statusError);
      }
    }

    if (error instanceof AppError) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: error.statusCode,
        },
      );
    }

    return NextResponse.json(
      {
        message: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
