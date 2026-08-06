import { NextRequest, NextResponse } from "next/server";
import { authRoute } from "./utils/constants";
import { verifyToken } from "./lib/jwt";
import { clearAuthCookie } from "./utils/auth-cookie";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const authCookie = request.cookies.get("token");

  const isAuthPage = authRoute.includes(pathname);
  const isProtectedRoute = pathname.startsWith("/dashboard");

  if (!authCookie && isProtectedRoute) {
    const loginURL = new URL("/login", request.url);

    loginURL.searchParams.set("redirect", pathname + request.nextUrl.search);

    return NextResponse.redirect(loginURL);
  }

  if (authCookie) {
    try {
      await verifyToken(authCookie.value);
      if (isAuthPage) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch {
      const loginURL = new URL("/login", request.url);

      loginURL.searchParams.set("redirect", pathname + request.nextUrl.search);

      const response = NextResponse.redirect(loginURL);

      clearAuthCookie(response);

      return response;
    }
  }

  // allows for - not auth but in auth pages - public pages(about,priceing)
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
  ],
};