"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // ⬅️ import router

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function apiPost(path: string, data: any) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || `POST ${path} failed: ${res.statusText}`);
  }
  return res.json();
}

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter(); // ⬅️ init router

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = await apiPost("/login", { username, password });
      setMessage(`Logged in as ${data.username} (role: ${data.role})`);

      // 🔑 redirect after successful login
      router.push("/dashboard");
    } catch (err: any) {
      setMessage(` ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-2xl shadow-lg w-80 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center text-white">
          SCADA Login
        </h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border border-gray-700 rounded-lg bg-gray-700 text-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-700 rounded-lg bg-gray-700 text-white"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {message && (
          <p className="text-center text-sm text-gray-300">{message}</p>
        )}
      </form>
    </div>
  );
}
