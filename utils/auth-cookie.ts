import { NextResponse } from "next/server";

export function setAuthCookie(response: NextResponse, token: string) {
  const SEVEN_DAYS_IN_SECONDS = 60 * 60 * 24 * 7;

  response.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SEVEN_DAYS_IN_SECONDS,
  });
}
export function clearAuthCookie(response: NextResponse) {
  response.cookies.delete("token");
}
