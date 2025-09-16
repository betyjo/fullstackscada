"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const r = useRouter();
  const [form, setForm] = useState({ email: "", password: "", fullName: "" });
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error || "Registration failed");
      return;
    }
    r.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 bg-white p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-semibold">Create account</h1>
        <input className="w-full border rounded px-3 py-2" placeholder="Full name"
          value={form.fullName} onChange={e=>setForm({...form, fullName:e.target.value})}/>
        <input className="w-full border rounded px-3 py-2" placeholder="Email" type="email"
          value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required/>
        <input className="w-full border rounded px-3 py-2" placeholder="Password" type="password"
          value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required/>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="w-full rounded-2xl px-4 py-2 border shadow">Sign up</button>
      </form>
    </div>
  );
}
