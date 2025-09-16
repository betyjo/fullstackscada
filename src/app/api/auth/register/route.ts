// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { RegisterDTO } from "@/lib/dto";
// import { hashPassword, signToken, setAuthCookie } from "@/lib/auth";

// export async function POST(req: Request) {
//   try {
//     const json = await req.json();
//     const data = RegisterDTO.parse(json);

//     const exists = await prisma.profile.findUnique({ where: { email: data.email } });
//     if (exists) return NextResponse.json({ error: "Email already in use" }, { status: 409 });

//     const passwordHash = await hashPassword(data.password);

//     const user = await prisma.profile.create({
//       data: {
//         email: data.email,
//         passwordHash,
//         fullName: data.fullName,
//         role: data.role ?? "customer",
//       },
//       select: { id: true, email: true, fullName: true, role: true, createdAt: true },
//     });

//     const token = signToken({ sub: user.id });
//     const res = NextResponse.json({ user }, { status: 201 });
//     setAuthCookie(res, token);      // 👈 set cookie on the response
//     return res;
//   } catch (e: any) {
//     return NextResponse.json({ error: e?.message ?? "Invalid payload" }, { status: 400 });
//   }
// }

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { RegisterDTO } from "@/lib/dto";
import { hashPassword, signToken, setAuthCookie } from "@/lib/auth";
import { Role } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const data = RegisterDTO.parse(json);

    const exists = await prisma.profile.findUnique({ where: { email: data.email } });
    if (exists) return NextResponse.json({ error: "Email already in use" }, { status: 409 });

    // Use a transaction so concurrent “first” signups can’t both become admin.
    const created = await prisma.$transaction(async (tx) => {
      const userCount = await tx.profile.count();
      const role: Role = userCount === 0 ? "admin" : "customer";

      const passwordHash = await hashPassword(data.password);

      return tx.profile.create({
        data: {
          email: data.email,
          passwordHash,
          fullName: data.fullName,
          role, // first = admin, else customer
        },
        select: { id: true, email: true, fullName: true, role: true, createdAt: true },
      });
    });

    const token = signToken({ sub: created.id });
    const res = NextResponse.json({ user: created }, { status: 201 });
    setAuthCookie(res, token);
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Invalid payload" }, { status: 400 });
  }
}
