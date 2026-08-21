import { AppError } from "@/lib/errors/app-error";
import { formatZodErrors } from "@/lib/validation";
import { createTrip, getTrips } from "@/services/server/trip.service";
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

    const response = NextResponse.json(
      {
        message: "Trip created sucessfully",
        trip,
      },
      {
        status: 201,
      },
    );

    return response;
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
