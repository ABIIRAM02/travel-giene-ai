import { UnauthorisedError } from "@/lib/errors/unauthorised-error";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

export async function getAuthenticatedUserId() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("token");

  if (!authCookie) {
    throw new UnauthorisedError("Unauthorized");
  }

  try {
    const { userId } = await verifyToken(authCookie.value);
    return userId;
  } catch (error) {
    throw new UnauthorisedError("Unauthorized");
  }

}
