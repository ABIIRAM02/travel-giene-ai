import { jwtVerify, SignJWT } from "jose";

interface JwtPayload {
    userId: string;
}

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined");
}

// jose lib dont accept string 
const secret = new TextEncoder().encode(jwtSecret);

export async function generateToken(userId: string): Promise<string> {

    // Create a JWT → set algorithm → set issue time → expire in 7 days → sign it.
    const jwt = await new SignJWT({
        userId,
    })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

    return jwt;

}

export async function verifyToken(
  token: string
): Promise<JwtPayload> {

    const { payload } = await jwtVerify(token, secret);

    return payload as unknown as JwtPayload;
}