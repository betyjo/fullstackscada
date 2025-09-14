"use client";

import { useState, useEffect } from "react";

const API_BASE = "http://127.0.0.1:8000";

type ModbusStatus = {
  connected: boolean;
  data: Record<string, any>;
};

export default function ConnectPage() {
  const [comPort, setComPort] = useState("COM9");
  const [baudrate, setBaudrate] = useState(19200);
  const [status, setStatus] = useState<ModbusStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // fetch status every 5s
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch(`${API_BASE}/modbus/status`);
        if (res.ok) {
          const data = await res.json();
          setStatus(data);
        }
      } catch (e) {
        console.error("Status fetch failed:", e);
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${API_BASE}/modbus/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ com_port: comPort, baudrate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Connection failed");
      setMessage(`✅ Connected to ${data.port} at ${data.baudrate} baud`);
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Connect (Modbus)</h1>
      <p className="mb-6">Configure Modbus connections here.</p>

      <form
        onSubmit={handleConnect}
        className="bg-gray-800 p-4 rounded-lg shadow-md w-96 space-y-4"
      >
        <div>
          <label className="block text-sm mb-1">COM Port</label>
          <input
            type="text"
            value={comPort}
            onChange={(e) => setComPort(e.target.value)}
            className="w-full p-2 border border-gray-700 rounded bg-gray-700 text-white"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Baudrate</label>
          <input
            type="number"
            value={baudrate}
            onChange={(e) => setBaudrate(Number(e.target.value))}
            className="w-full p-2 border border-gray-700 rounded bg-gray-700 text-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Connecting..." : "Connect"}
        </button>

        {message && <p className="text-sm text-center mt-2">{message}</p>}
      </form>

      <div className="mt-6">
        <h2 className="text-xl font-semibold">Connection Status</h2>
        {status ? (
          <pre className="bg-gray-900 p-3 rounded mt-2 text-sm text-gray-300">
            {JSON.stringify(status, null, 2)}
          </pre>
        ) : (
          <p className="text-gray-400">Fetching status...</p>
        )}
      </div>
    </div>
  );
}
