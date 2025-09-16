// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import jwt from "jsonwebtoken";

// const PROTECTED_PREFIXES = ["/dashboard"]; // add more if needed
// const TOKEN_NAME = "scada_token";

// export function middleware(req: NextRequest) {
//   const path = req.nextUrl.pathname;
//   const needsAuth = PROTECTED_PREFIXES.some((p) => path.startsWith(p));
//   if (!needsAuth) return NextResponse.next();

//   const token = req.cookies.get(TOKEN_NAME)?.value;
//   if (!token) return NextResponse.redirect(new URL("/login", req.url));

//   try {
//     jwt.verify(token, process.env.JWT_SECRET!);
//     return NextResponse.next();
//   } catch {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }
// }

// export const config = {
//   matcher: ["/dashboard/:path*"],
// };
// middleware.ts — Edge-safe auth check
import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

const TOKEN_NAME = "scada_token";
const JWT_SECRET = process.env.JWT_SECRET!;
const secret = new TextEncoder().encode(JWT_SECRET);

async function verify(token?: string) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    return payload; // { sub, role, ... } if you included them when signing
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Never touch API or Next internals
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static")
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get(TOKEN_NAME)?.value;
  const authed = await verify(token);

  // Protect dashboard
  if (pathname.startsWith("/dashboard") && !authed) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Optional: if logged-in, keep them out of auth screens
  if ((pathname === "/login" || pathname === "/register") && authed) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"], // note: no '/api'
};
