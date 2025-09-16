"use client";
import KpiCard from "@/components/KpiCard";
import SectionCard from "@/components/SectionCard";
import { Activity, Gauge, AlertTriangle, Clock } from "lucide-react";
import dynamic from "next/dynamic";

const ResponsiveContainer = dynamic(
  () => import("recharts").then((m) => m.ResponsiveContainer),
  { ssr: false }
);
const LineChart = dynamic(() => import("recharts").then((m) => m.LineChart), {
  ssr: false,
});
const Line = dynamic(() => import("recharts").then((m) => m.Line), {
  ssr: false,
});
const XAxis = dynamic(() => import("recharts").then((m) => m.XAxis), {
  ssr: false,
});
const YAxis = dynamic(() => import("recharts").then((m) => m.YAxis), {
  ssr: false,
});
const Tooltip = dynamic(() => import("recharts").then((m) => m.Tooltip), {
  ssr: false,
});
const CartesianGrid = dynamic(
  () => import("recharts").then((m) => m.CartesianGrid),
  { ssr: false }
);

const data = [
  { t: "00:00", flow: 32, pressure: 1.8 },
  { t: "03:00", flow: 28, pressure: 1.7 },
  { t: "06:00", flow: 36, pressure: 1.9 },
  { t: "09:00", flow: 44, pressure: 2.2 },
  { t: "12:00", flow: 40, pressure: 2.0 },
  { t: "15:00", flow: 38, pressure: 2.1 },
  { t: "18:00", flow: 42, pressure: 2.3 },
  { t: "21:00", flow: 35, pressure: 1.9 },
];

//logout button
export function LogoutButton() {
  return (
    <button
      className="rounded-xl border px-3 py-1"
      onClick={async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        location.href = "/login";
      }}
    >
      Log out
    </button>
  );
}
export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Live overview of your SCADA environment
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          icon={<Activity className="size-5" />}
          label="Flow Rate"
          value="42 m³/h"
          sub="+6% vs. yesterday"
        />
        <KpiCard
          icon={<Gauge className="size-5" />}
          label="Pressure"
          value="2.1 bar"
          sub="within threshold"
        />
        <KpiCard
          icon={<Clock className="size-5" />}
          label="Uptime"
          value="99.96%"
          sub="last 24h"
        />
        <KpiCard
          icon={<AlertTriangle className="size-5" />}
          label="Active Alerts"
          value="3"
          sub="1 critical, 2 warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard title="Flow vs. Pressure (today)">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="t" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="flow"
                  yAxisId="left"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="pressure"
                  yAxisId="right"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Connected Devices">
          <ul className="divide-y divide-gray-200">
            {[
              { name: "Pump A1", status: "online", lastSeen: "1m ago" },
              { name: "Pump B3", status: "online", lastSeen: "4m ago" },
              { name: "Sensor T-09", status: "warning", lastSeen: "2m ago" },
              { name: "Valve V6", status: "offline", lastSeen: "12m ago" },
            ].map((d, i) => (
              <li key={i} className="flex items-center justify-between py-3">
                <div className="font-medium">{d.name}</div>
                <div className="flex items-center gap-3">
                  <span
                    className={
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold " +
                      (d.status === "online"
                        ? "bg-green-100 text-green-700"
                        : d.status === "warning"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700")
                    }
                  >
                    {d.status}
                  </span>
                  <span className="text-xs text-gray-500">{d.lastSeen}</span>
                </div>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Recent Events">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="py-2 pr-4">Time</th>
                  <th className="py-2 pr-4">Source</th>
                  <th className="py-2 pr-4">Event</th>
                  <th className="py-2 pr-4">Severity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  {
                    time: "09:22",
                    src: "Pump A1",
                    evt: "Pressure spike",
                    sev: "warning",
                  },
                  {
                    time: "11:07",
                    src: "Valve V6",
                    evt: "Disconnected",
                    sev: "critical",
                  },
                  {
                    time: "14:35",
                    src: "Sensor T-09",
                    evt: "Calibration drift",
                    sev: "info",
                  },
                ].map((r, i) => (
                  <tr key={i}>
                    <td className="py-2 pr-4">{r.time}</td>
                    <td className="py-2 pr-4">{r.src}</td>
                    <td className="py-2 pr-4">{r.evt}</td>
                    <td className="py-2 pr-4">
                      <span
                        className={
                          "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold " +
                          (r.sev === "critical"
                            ? "bg-red-100 text-red-700"
                            : r.sev === "warning"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700")
                        }
                      >
                        {r.sev}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
