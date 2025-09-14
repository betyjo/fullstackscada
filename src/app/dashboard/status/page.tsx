"use client";

import { useEffect, useState } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Pump {
  id: number;
  name: string;
  value: number | null;
  unit: string | null;
  usage_liters: number | null;
  timestamp: string | null;
}

export default function StatusPage() {
  const [pumps, setPumps] = useState<Pump[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch(`${BASE_URL}/status`);
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
        const data = await res.json();
        setPumps(data.pumps || []);
      } catch (err: any) {
        setError(err.message || "Failed to load status");
      } finally {
        setLoading(false);
      }
    }

    fetchStatus();

    // 🔄 Auto refresh every 30s
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <p className="p-4 text-gray-400">Loading status...</p>;
  if (error) return <p className="p-4 text-red-400">❌ {error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-white mb-4">System Status</h1>
      <p className="mb-6 text-gray-300">Live pump readings from backend.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pumps.map((pump) => (
          <div
            key={pump.id}
            className="bg-gray-800 p-4 rounded-xl shadow-md border border-gray-700"
          >
            <h2 className="text-xl font-semibold text-blue-400 mb-2">
              {pump.name || `Pump ${pump.id}`}
            </h2>
            <p>
              <strong>Value:</strong>{" "}
              {pump.value !== null ? `${pump.value} ${pump.unit}` : "N/A"}
            </p>
            <p>
              <strong>Usage:</strong>{" "}
              {pump.usage_liters !== null
                ? `${pump.usage_liters.toFixed(2)} L`
                : "N/A"}
            </p>
            <p className="text-sm text-gray-400">
              Last update:{" "}
              {pump.timestamp
                ? new Date(pump.timestamp).toLocaleString()
                : "Never"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
