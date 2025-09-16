// src/app/api/billing/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const StatusEnum = z.enum(["pending", "paid", "overdue"]);

const CreateBillDTO = z.object({
  customerId: z.number().int().positive(),
  deviceId: z.number().int().positive(),
  periodStart: z.coerce.date(),
  periodEnd: z.coerce.date(),
  usage: z.number().positive(),
  rate: z.number().positive(),
  total: z.number().positive().optional(), // if omitted we'll compute usage * rate
  status: StatusEnum.default("pending"),
});

function serialize(b: any) {
  // Prisma BigInt & Decimal -> JSON-safe strings
  return {
    ...b,
    id: b.id?.toString?.() ?? b.id,
    usage: b.usage?.toString?.() ?? b.usage,
    rate: b.rate?.toString?.() ?? b.rate,
    total: b.total?.toString?.() ?? b.total,
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const customerId = searchParams.get("customerId");
  const deviceId = searchParams.get("deviceId");
  const status = searchParams.get("status") as "pending" | "paid" | "overdue" | null;
  const from = searchParams.get("from"); // ISO date
  const to = searchParams.get("to");     // ISO date
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "50");

  const where: any = {};
  if (customerId) where.customerId = Number(customerId);
  if (deviceId) where.deviceId = Number(deviceId);
  if (status) where.status = status;
  if (from || to) {
    where.periodStart = {};
    if (from) where.periodStart.gte = new Date(from);
    if (to)   where.periodStart.lte = new Date(to);
  }

  const [rows] = await Promise.all([
    prisma.billing.findMany({
      where,
      orderBy: [{ periodStart: "desc" }],
      include: {
        customer: { select: { id: true, fullName: true, email: true } },
        device: { select: { id: true, name: true, type: true, location: true } },
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return NextResponse.json(rows.map(serialize));
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = CreateBillDTO.parse(json);

    // Optional sanity: ensure customer & device exist
    const [customer, device] = await Promise.all([
      prisma.profile.findUnique({ where: { id: data.customerId }, select: { id: true } }),
      prisma.device.findUnique({ where: { id: data.deviceId }, select: { id: true, type: true } }),
    ]);
    if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    if (!device) return NextResponse.json({ error: "Device not found" }, { status: 404 });

    const total = data.total ?? Number((data.usage * data.rate).toFixed(2));

    const created = await prisma.billing.create({
      data: {
        customerId: data.customerId,
        deviceId: data.deviceId,
        periodStart: data.periodStart,
        periodEnd: data.periodEnd,
        usage: data.usage,
        rate: data.rate,
        total,
        status: data.status,
      },
    });

    return NextResponse.json(serialize(created), { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Invalid payload" }, { status: 400 });
  }
}
