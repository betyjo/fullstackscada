// src/app/api/billing/[id]/route.ts
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const StatusEnum = z.enum(["pending", "paid", "overdue"]);

const UpdateBillDTO = z.object({
  customerId: z.number().int().positive().optional(),
  deviceId: z.number().int().positive().optional(),
  periodStart: z.coerce.date().optional(),
  periodEnd: z.coerce.date().optional(),
  usage: z.number().positive().optional(),
  rate: z.number().positive().optional(),
  total: z.number().positive().optional(), // if omitted but usage/rate changed, will recompute
  status: StatusEnum.optional(),
});

function serialize(b: any) {
  return {
    ...b,
    id: b.id?.toString?.() ?? b.id,
    usage: b.usage?.toString?.() ?? b.usage,
    rate: b.rate?.toString?.() ?? b.rate,
    total: b.total?.toString?.() ?? b.total,
  };
}

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  const id = BigInt(params.id);
  const bill = await prisma.billing.findUnique({
    where: { id },
    include: {
      customer: { select: { id: true, fullName: true, email: true } },
      device: { select: { id: true, name: true, type: true, location: true } },
    },
  });
  if (!bill) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(serialize(bill));
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const id = BigInt(params.id);
    const json = await req.json();
    const data = UpdateBillDTO.parse(json);

    // if usage/rate updated and total not provided, recompute
    let finalData: any = { ...data };
    if ((data.usage !== undefined || data.rate !== undefined) && data.total === undefined) {
      const existing = await prisma.billing.findUnique({ where: { id }, select: { usage: true, rate: true } });
      if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
      const usage = data.usage ?? Number(existing.usage);
      const rate = data.rate ?? Number(existing.rate);
      finalData.total = Number((usage * rate).toFixed(2));
    }

    const updated = await prisma.billing.update({ where: { id }, data: finalData });
    return NextResponse.json(serialize(updated));
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Invalid payload" }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  const id = BigInt(params.id);
  await prisma.billing.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
