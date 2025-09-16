// src/app/api/profiles/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getUserFromCookie, hashPassword } from "@/lib/auth";

const RoleEnum = z.enum(["admin", "operator", "customer"]);
const CreateUserDTO = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().optional(),
  role: RoleEnum.default("customer"),
});

export async function GET() {
  const rows = await prisma.profile.findMany({
    select: { id: true, fullName: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  // admin-only guard
  const me = await getUserFromCookie();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (me.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const body = CreateUserDTO.parse(await req.json());

    const exists = await prisma.profile.findUnique({ where: { email: body.email } });
    if (exists) return NextResponse.json({ error: "Email already in use" }, { status: 409 });

    const created = await prisma.profile.create({
      data: {
        email: body.email,
        fullName: body.fullName,
        role: body.role,
        passwordHash: await hashPassword(body.password),
      },
      select: { id: true, fullName: true, email: true, role: true, createdAt: true },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Invalid payload" }, { status: 400 });
  }
}

// (Optional) helps some clients preflight cleanly
export async function OPTIONS() {
  return NextResponse.json({}, { status: 204 });
}
