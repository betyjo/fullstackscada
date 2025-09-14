"use client";

import { useEffect, useState } from "react";

type Bill = {
  customer_id: number;
  device_id: number;
  usage_m3: number;
  rate_birr_per_m3: number;
  total_birr: number;
  status: string;
};

export default function BillingPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBills() {
      try {
        const res = await fetch("http://127.0.0.1:8000/billing");
        if (!res.ok) {
          const err = await res.json().catch(() => null);
          throw new Error(err?.detail || `Error: ${res.status}`);
        }
        const data = await res.json();
        setBills(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBills();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Billing</h1>
      <p className="mb-6">Manage billing and subscriptions here.</p>

      {loading && <p>Loading bills...</p>}
      {error && <p className="text-red-500">❌ {error}</p>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-4 py-2 text-left">Customer ID</th>
                <th className="px-4 py-2 text-left">Device ID</th>
                <th className="px-4 py-2 text-left">Usage (m³)</th>
                <th className="px-4 py-2 text-left">Rate (Birr/m³)</th>
                <th className="px-4 py-2 text-left">Total (Birr)</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill, i) => (
                <tr key={i} className="border-t border-gray-700">
                  <td className="px-4 py-2">{bill.customer_id}</td>
                  <td className="px-4 py-2">{bill.device_id}</td>
                  <td className="px-4 py-2">{bill.usage_m3}</td>
                  <td className="px-4 py-2">{bill.rate_birr_per_m3}</td>
                  <td className="px-4 py-2 font-semibold">
                    {bill.total_birr.toFixed(2)}
                  </td>
                  <td className="px-4 py-2">{bill.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
