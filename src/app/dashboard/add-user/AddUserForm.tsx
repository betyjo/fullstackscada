"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Role = "admin" | "operator" | "customer";

export default function AddUserForm() {
  const r = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "customer" as Role,
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ ok?: string; err?: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const res = await fetch("/api/profiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || `Request failed: ${res.status}`);

      setMsg({ ok: "User created" });
      setForm({ fullName: "", email: "", password: "", role: "customer" });
      // Go back to your list page; change this if your route is different
      r.push("/dashboard/list-users");
    } catch (err: any) {
      setMsg({ err: err?.message || "Failed to create user" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4 max-w-2xl">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="grid gap-1">
          <label className="text-sm text-gray-600">Full name</label>
          <input
            className="border rounded px-3 py-2"
            placeholder="e.g., Sara Bekele"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />
        </div>

        <div className="grid gap-1">
          <label className="text-sm text-gray-600">Email</label>
          <input
            className="border rounded px-3 py-2"
            type="email"
            placeholder="name@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="grid gap-1">
          <label className="text-sm text-gray-600">Role</label>
          <select
            className="border rounded px-3 py-2"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value as Role })}
          >
            <option value="customer">Customer</option>
            <option value="operator">Operator</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="grid gap-1">
          <label className="text-sm text-gray-600">Temporary password</label>
          <input
            className="border rounded px-3 py-2"
            type="password"
            placeholder="min 6 characters"
            minLength={6}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl border bg-gray-900 text-white px-4 py-2 text-sm font-medium hover:bg-black disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create user"}
        </button>
        {msg?.ok && <span className="text-green-700 text-sm">{msg.ok}</span>}
        {msg?.err && <span className="text-red-600 text-sm">❌ {msg.err}</span>}
      </div>
    </form>
  );
}
