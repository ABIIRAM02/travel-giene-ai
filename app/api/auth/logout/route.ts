import { clearAuthCookie } from "@/utils/auth-cookie";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json(
      {
        message: "Logged out successfully",
      },
      {
        status: 200,
      },
    );

    clearAuthCookie(response);

    return response;
  } catch {
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