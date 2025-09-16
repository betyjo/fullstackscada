import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const devices = await prisma.device.findMany({ orderBy: { id: "asc" } });
  return NextResponse.json(devices);
}

export async function POST(req: Request) {
  const data = await req.json();
  const created = await prisma.device.create({ data });
  return NextResponse.json(created, { status: 201 });
}
