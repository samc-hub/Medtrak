import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Middleware runs on the Edge runtime, so it does its own lightweight JWT check
// (jose is edge-safe) rather than importing the Node-only auth module.
const COOKIE = "medtrack_session";

async function isValid(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.AUTH_SECRET));
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const ok = await isValid(req.cookies.get(COOKIE)?.value);
  if (!ok) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
