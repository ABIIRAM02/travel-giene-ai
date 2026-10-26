import { AppError } from "@/lib/errors/app-error";
import { formatZodErrors } from "@/lib/validation";
import { createTrip, getTrips, updateTrip } from "@/services/server/trip.service";
import { getDestinationPhotos } from "@/services/server/unsplash.service";
import { getAuthenticatedUserId } from "@/utils/auth-check";
import { tripSchema } from "@/validators/trip.schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validationResult = tripSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: formatZodErrors(validationResult.error.issues),
        },
        {
          status: 400,
        },
      );
    }

    const userId = await getAuthenticatedUserId();

    const trip = await createTrip(validationResult.data, userId);

    let updatedTrip = trip;

    try {
      const imageData = await getDestinationPhotos(trip.destination);

      if (imageData) {
        updatedTrip = await updateTrip(trip.id, userId, imageData);
      }
    } catch (error) {
      console.error("Failed to fetch or save destination image:", error);
    }

    return NextResponse.json(
      {
        message: "Trip created successfully",
        trip: updatedTrip,
      },
      {
        status: 201,
      },
    );

  } catch (error) {
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

export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();

    const trips = await getTrips(userId);

    return NextResponse.json(
      {
        message: "Sucessfull fetch",
        trips,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
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
