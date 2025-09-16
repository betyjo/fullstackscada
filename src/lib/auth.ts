// src/lib/auth.ts
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const TOKEN_NAME = "scada_token";
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return secret;
}

export async function hashPassword(plain: string) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plain, salt);
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export function signToken(payload: object) {
  return jwt.sign(payload, getSecret(), { expiresIn: TOKEN_TTL_SECONDS });
}

export function verifyToken<T = any>(token: string): T | null {
  try {
    return jwt.verify(token, getSecret()) as T;
  } catch {
    return null;
  }
}

// ✅ mutate the response (Route Handler safe)
export function setAuthCookie(res: NextResponse, token: string) {
  res.cookies.set({
    name: TOKEN_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: TOKEN_TTL_SECONDS,
  });
}

export function clearAuthCookie(res: NextResponse) {
  res.cookies.set({
    name: TOKEN_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

// reading is fine via cookies()
export async function getUserFromCookie() {
  const token = (await cookies()).get(TOKEN_NAME)?.value;
  if (!token) return null;
  const payload = verifyToken<{ sub: number }>(token);
  if (!payload) return null;
  return prisma.profile.findUnique({
    where: { id: payload.sub },
    select: { id: true, email: true, fullName: true, role: true, createdAt: true },
  });
}
