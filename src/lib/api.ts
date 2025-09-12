import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
const BACKEND_URL = process.env.BACKEND_DDNS_URL!;
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY!;


export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY!);


export async function fetchData(endpoint: string, token?: string) {
  try {
    const res = await axios.get(`${BACKEND_URL}${endpoint}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  } catch (err) {
    console.warn('Backend unreachable, using Supabase fallback');

    switch (endpoint) {
      case '/devices':
        return supabase.from('devices').select('*');
      case '/readings':
        return supabase.from('readings').select('*');
      case '/billing':
        return supabase.from('billing').select('*');
      case '/users':
        return supabase.from('profiles').select('*');
      default:
        throw new Error('Endpoint not mapped for fallback');
    }
  }
}

export async function sendCommand(
  device_id: string,
  command: 'ON' | 'OFF',
  token?: string
) {
  const res = await axios.post(
    `${BACKEND_URL}/command`,
    { device_id, command },
    { headers: token ? { Authorization: `Bearer ${token}` } : {} }
  );
  return res.data;
}

export async function addUser(user: {
  email: string;
  full_name: string;
  password: string;
  role: 'admin' | 'operator' | 'customer';
}) {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: user.email,
    password: user.password,
    email_confirm: true,
  });

  if (error) throw new Error(error.message);

  await supabaseAdmin.from('profiles').insert([
    {
      id: data.user?.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
    },
  ]);

  return data;
}
