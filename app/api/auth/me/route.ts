import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { verifyToken } from "@/lib/jwt";
import { getUserById } from "@/services/user.service";
import { AppError } from "@/lib/errors/app-error";

export async function GET() {
  const cookieStore = await cookies();
  const authCookie  = cookieStore.get("token");

  if (!authCookie) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }

  try {
    const { userId } = await verifyToken(authCookie.value);

    const user = await getUserById(userId);

    return NextResponse.json(
      {
        user,
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
