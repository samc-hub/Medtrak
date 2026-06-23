import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { hashPassword, verifyPassword } from "@/lib/password";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { db, ensureSchema } from "@/lib/db";
import { users } from "@/lib/schema";

const COOKIE = "medtrack_session";
const DAY = 60 * 60 * 24;

function secret(): Uint8Array {
  const s = process.env.AUTH_SECRET;
  if (!s) throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(s);
}

// Re-exported so existing imports from "@/lib/auth" keep working.
export { hashPassword, verifyPassword };

export async function createSession(userId: string): Promise<void> {
  const token = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());

  cookies().set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * DAY,
  });
}

export function destroySession(): void {
  cookies().set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export async function getUserId(): Promise<string | null> {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return typeof payload.sub === "string" ? payload.sub : null;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const id = await getUserId();
  if (!id) return null;
  await ensureSchema();
  const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return rows[0] ?? null;
}
