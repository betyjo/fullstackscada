import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { LoginDTO } from "@/lib/dto";
import { verifyPassword, signToken, setAuthCookie } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { email, password } = LoginDTO.parse(json);

    const user = await prisma.profile.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const token = signToken({ sub: user.id });
    const res = NextResponse.json({
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role, createdAt: user.createdAt },
    });
    setAuthCookie(res, token);      // 👈 set cookie on the response
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Invalid payload" }, { status: 400 });
  }
}
