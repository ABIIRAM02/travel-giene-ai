import { AppError } from "@/lib/errors/app-error";
import { generateToken } from "@/lib/jwt";
import { formatZodErrors } from "@/lib/validation";
import { loginUser } from "@/services/auth.service";
import { setAuthCookie } from "@/utils/auth-cookie";
import { loginSchema } from "@/validators/auth.schema";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json();
  const validationResult = loginSchema.safeParse(data);

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
    const user = await loginUser(validationResult.data);
    const token = await generateToken(user.id);

    const response = NextResponse.json(
      {
        message: "Login successful",
        user,
      },
      {
        status: 200,
      },
    );

    setAuthCookie(response, token);

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
