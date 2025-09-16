// src/app/dashboard/billing/page.tsx
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";

const PAYMENT_MULTIPLIER = 100; // 👈 multiply displayed totals by 100

function moneyETB(n: number) {
  return new Intl.NumberFormat("en-ET", { style: "currency", currency: "ETB" }).format(n);
}
function d(date: Date) {
  return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "2-digit" }).format(date);
}

export default async function BillingPage() {
  const bills = await prisma.billing.findMany({
    orderBy: [{ periodStart: "desc" }],
    include: {
      customer: { select: { id: true, fullName: true, email: true } },
    },
  });

  // totals (apply multiplier only to the payment amounts)
  const totals = bills.reduce(
    (acc, b) => {
      const t = Number(b.total) * PAYMENT_MULTIPLIER;
      acc.all += t;
      acc[b.status] += t;
      return acc;
    },
    { all: 0, paid: 0, pending: 0, overdue: 0 } as Record<"all" | "paid" | "pending" | "overdue", number>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Billing</h1>
          <p className="text-sm text-gray-500">Monthly usage and invoices per customer.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="Total" value={moneyETB(totals.all)} />
          <Stat label="Paid" value={moneyETB(totals.paid)} tone="success" />
          <Stat label="Pending" value={moneyETB(totals.pending)} tone="warn" />
          <Stat label="Overdue" value={moneyETB(totals.overdue)} tone="danger" />
        </div>
      </div>

      <div className="overflow-auto rounded-2xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <Th>Customer</Th>
              <Th>Period</Th>
              <Th className="text-right">Usage (m³)</Th>
              <Th className="text-right">Rate (Birr/m³)</Th>
              <Th className="text-right">Total (Birr)</Th>
              <Th>Status</Th>
              <Th>Created</Th>
            </tr>
          </thead>
          <tbody>
            {bills.map((b) => {
              const usage = Number(b.usage);
              const rate = Number(b.rate);
              const totalScaled = Number(b.total) * PAYMENT_MULTIPLIER; // 👈 scaled payment
              return (
                <tr key={String(b.id)} className="border-t">
                  <Td>
                    <div className="font-medium">{b.customer?.fullName ?? "—"}</div>
                    <div className="text-gray-500">{b.customer?.email}</div>
                  </Td>
                  <Td>{d(b.periodStart)} – {d(b.periodEnd)}</Td>
                  <Td className="text-right">{usage.toFixed(2)}</Td>
                  <Td className="text-right">{moneyETB(rate)}</Td>
                  <Td className="text-right font-semibold">{moneyETB(totalScaled)}</Td>
                  <Td><StatusBadge status={b.status} /></Td>
                  <Td>{d(b.createdAt)}</Td>
                </tr>
              );
            })}
            {bills.length === 0 && (
              <tr>
                <td className="p-6 text-center text-gray-500" colSpan={7}>
                  No billing records yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- tiny UI helpers ---------- */
function Th(props: React.PropsWithChildren<{ className?: string }>) {
  return <th className={`text-left p-3 font-medium ${props.className || ""}`}>{props.children}</th>;
}
function Td(props: React.PropsWithChildren<{ className?: string }>) {
  return <td className={`p-3 align-top ${props.className || ""}`}>{props.children}</td>;
}
function Stat({ label, value, tone }: { label: string; value: string; tone?: "success" | "warn" | "danger" }) {
  const color =
    tone === "success" ? "text-green-600" : tone === "warn" ? "text-amber-600" : tone === "danger" ? "text-red-600" : "text-gray-900";
  return (
    <div className="rounded-2xl border bg-white p-3 min-w-40">
      <div className="text-xs text-gray-500">{label}</div>
      <div className={`text-lg font-semibold ${color}`}>{value}</div>
    </div>
  );
}
function StatusBadge({ status }: { status: "paid" | "pending" | "overdue" | string }) {
  const cls =
    status === "paid"
      ? "bg-green-100 text-green-700"
      : status === "overdue"
      ? "bg-red-100 text-red-700"
      : "bg-amber-100 text-amber-700";
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${cls}`}>{status}</span>;
}
