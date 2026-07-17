import { NextResponse } from "next/server";

import { registerSchema } from "@/validators/auth.schema";
import { formatZodErrors } from "@/lib/validation";
import { registerUser } from "@/services/auth.service";
import { AppError } from "@/lib/errors/app-error";

export async function POST(request: Request) {

  const userData = await request.json();
  const validationResult = registerSchema.safeParse(userData);

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

  try {
    const user = await registerUser(validationResult.data);

    return NextResponse.json(
      {
        message: "User registered successfully",
        user,
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
          status: 400,
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
