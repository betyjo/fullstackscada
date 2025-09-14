"use client";

import { useState } from "react";

export default function AddUserPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("operator");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, role }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || `Error: ${res.status}`);
      }

      const data = await res.json();
      setMessage(`✅ ${data.status}`);
      setUsername("");
      setPassword("");
      setRole("operator");
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Add User</h1>
      <p className="mb-6">Create a new user for the system.</p>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-2xl shadow-lg max-w-md space-y-4"
      >
        <input
          type="text"
          placeholder="Username (email)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border border-gray-700 rounded-lg bg-gray-700 text-white"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-700 rounded-lg bg-gray-700 text-white"
          required
        />

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 border border-gray-700 rounded-lg bg-gray-700 text-white"
          required
        >
          <option value="admin">Admin</option>
          <option value="operator">Operator</option>
          <option value="customer">Customer</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Add User
        </button>
      </form>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
