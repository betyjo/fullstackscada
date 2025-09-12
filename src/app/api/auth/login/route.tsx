import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/api";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 401 });

  const res = NextResponse.json({ status: "ok", user: data.user });
  res.cookies.set("token", data.session?.access_token!, {
    httpOnly: true,
    path: "/",
    maxAge: 3600,
  });

  return res;
}
