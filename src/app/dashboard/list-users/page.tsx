// src/app/dashboard/users/page.tsx
export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";

function d(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}

export default async function UsersPage() {
  const users = await prisma.profile.findMany({
    select: { id: true, fullName: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  const counts = users.reduce(
    (acc, u) => {
      acc.total += 1;
      acc[u.role] += 1;
      return acc;
    },
    { total: 0, admin: 0, operator: 0, customer: 0 } as Record<
      "total" | "admin" | "operator" | "customer",
      number
    >
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Users</h1>
          <p className="text-sm text-gray-500">Registered accounts and roles.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label="Total" value={counts.total} />
          <Stat label="Admins" value={counts.admin} tone="dark" />
          <Stat label="Operators" value={counts.operator} tone="info" />
          <Stat label="Customers" value={counts.customer} tone="muted" />
        </div>
      </div>

      <div className="overflow-auto rounded-2xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Joined</Th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <Td>
                  <div className="font-medium">{u.fullName ?? "—"}</div>
                </Td>
                <Td className="text-gray-600">{u.email}</Td>
                <Td>
                  <RoleBadge role={u.role} />
                </Td>
                <Td>{d(u.createdAt)}</Td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td className="p-6 text-center text-gray-500" colSpan={4}>
                  No users yet.
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
  return (
    <th className={`text-left p-3 font-medium ${props.className || ""}`}>
      {props.children}
    </th>
  );
}
function Td(props: React.PropsWithChildren<{ className?: string }>) {
  return <td className={`p-3 align-top ${props.className || ""}`}>{props.children}</td>;
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: number | string;
  tone?: "dark" | "info" | "muted";
}) {
  const color =
    tone === "dark"
      ? "text-gray-900"
      : tone === "info"
      ? "text-indigo-700"
      : tone === "muted"
      ? "text-gray-700"
      : "text-gray-900";
  return (
    <div className="rounded-2xl border bg-white p-3 min-w-32">
      <div className="text-xs text-gray-500">{label}</div>
      <div className={`text-lg font-semibold ${color}`}>{value}</div>
    </div>
  );
}

function RoleBadge({ role }: { role: "admin" | "operator" | "customer" | string }) {
  const map: Record<string, string> = {
    admin: "bg-gray-900 text-white",
    operator: "bg-indigo-100 text-indigo-700",
    customer: "bg-gray-100 text-gray-800",
  };
  const cls = map[role] ?? "bg-gray-100 text-gray-800";
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${cls}`}>
      {role}
    </span>
  );
}
