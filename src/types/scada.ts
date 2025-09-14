export type Profile = {
  id: number;
  email: string;
  full_name: string | null;
  role: "admin" | "operator" | "customer";
  created_at: string; // ISO
};

export type Device = {
  id: number;
  name: string;
  type: "valve" | "pump" | "sensor";
  location: string | null;
  owner_id: number | null;
  created_at: string; // ISO
};

export type Reading = {
  id: number;
  device_id: number;
  value: number | null;
  unit: string | null;
  status: "open" | "closed" | "on" | "off" | null;
  usage_liters: number | null;
  timestamp: string; // ISO
};

export type Billing = {
  id: number;
  customer_id: number;
  device_id: number;
  period_start: string; // YYYY-MM-DD
  period_end: string;   // YYYY-MM-DD
  usage: number;
  rate: number;
  total: number;
  status: "pending" | "paid" | "overdue";
  created_at: string; // ISO
};

export type CommandHistory = {
  id: number;
  device_id: number;
  user_id: number;
  command: string;
  params: Record<string, any>;
  timestamp: string; // ISO
  status: "sent" | "acknowledged" | "failed";
};
