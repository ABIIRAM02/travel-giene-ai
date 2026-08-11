import { AppError } from "@/lib/errors/app-error";
import { formatZodErrors } from "@/lib/validation";
import { deleteTrip, getTripById, updateTrip } from "@/services/trip.service";
import { getAuthenticatedUserId } from "@/utils/auth-check";
import { tripUpdateSchema } from "@/validators/trip.schema";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const userId = await getAuthenticatedUserId();

    const trip = await getTripById(id, userId);

    return NextResponse.json(
      {
        trip,
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const body = await request.json();

    const { id } = await params;

    const validationResult = tripUpdateSchema.safeParse(body);

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

    if (Object.keys(validationResult.data).length === 0) {
      return NextResponse.json(
        {
          message: "At least one field is required to update",
        },
        { status: 400 },
      );
    }

    const userId = await getAuthenticatedUserId();

    const updatedTrip = await updateTrip(id, userId, validationResult.data);

    return NextResponse.json(
      {
        updatedTrip,
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
};

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const userId = await getAuthenticatedUserId();

    const deletedTrip = await deleteTrip(id, userId);

    return NextResponse.json(
      {
        message: deletedTrip.message,
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
