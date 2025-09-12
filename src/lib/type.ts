export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'operator' | 'customer';
  created_at: string;
}

export interface Device {
  id: string;
  name: string;
  type: 'valve' | 'pump' | 'sensor';
  owner: string;
  created_at: string;
}

export interface Reading {
  id: number;
  device_id: string;
  value: number;
  unit: string;
  status: 'open' | 'closed' | 'on' | 'off' | null;
  usage_liters: number;
  timestamp: string;
}

export interface Billing {
  id: number;
  customer_id: string;
  device_id: string;
  period_start: string;
  period_end: string;
  usage: number;
  rate: number;
  total: number;
  status: 'pending' | 'paid' | 'overdue';
  created_at: string;
}

export interface Command {
  id: number;
  device_id: string;
  user_id: string;
  command: 'ON' | 'OFF';
  timestamp: string;
  status: 'sent' | 'acknowledged' | 'failed' | 'pending';
}
