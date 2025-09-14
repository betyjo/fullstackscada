// src/lib/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function apiGet(path: string) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.statusText}`);
  return res.json();
}

export async function apiPost(path: string, data: any) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => null);
    throw new Error(errData?.detail || `POST ${path} failed: ${res.statusText}`);
  }
  return res.json();
}
