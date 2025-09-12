import { NextRequest, NextResponse } from "next/server";
import { fetchData } from "../../../lib/api";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  try {
    const readings = await fetchData("/readings", token);
    return NextResponse.json(readings);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
