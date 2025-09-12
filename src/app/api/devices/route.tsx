import { NextRequest, NextResponse } from "next/server";
import { fetchData } from "../../../lib/api";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  try {
    const devices = await fetchData("/devices", token);
    return NextResponse.json(devices);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
