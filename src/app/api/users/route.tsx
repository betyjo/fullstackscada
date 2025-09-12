import { NextRequest, NextResponse } from "next/server";
import { fetchData, addUser } from "../../../lib/api";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  try {
    const users = await fetchData("/users", token);
    return NextResponse.json(users);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const user = await addUser(body);
    return NextResponse.json({ status: "created", user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
