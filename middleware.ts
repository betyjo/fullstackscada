import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const PROTECTED_PREFIXES = ["/dashboard"]; // add more if needed
const TOKEN_NAME = "scada_token";

export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const needsAuth = PROTECTED_PREFIXES.some((p) => path.startsWith(p));
  if (!needsAuth) return NextResponse.next();

  const token = req.cookies.get(TOKEN_NAME)?.value;
  if (!token) return NextResponse.redirect(new URL("/login", req.url));

  try {
    jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
