import { NextRequest, NextResponse } from "next/server";
import { sendCommand } from "../../../lib/api";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { device_id, command } = await req.json();

  if (!["ON", "OFF"].includes(command)) {
    return NextResponse.json({ error: "Invalid command" }, { status: 400 });
  }

  try {
    const data = await sendCommand(device_id, command, token);
    return NextResponse.json({ status: "sent", data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
