// "use client";
// import { useState } from "react";
// import Sidebar from "@/components/Sidebar";
// import Topbar from "@/components/Topbar";

// export default function DashboardLayout({ children }: { children: React.ReactNode }) {
//   const [open, setOpen] = useState(false);

//   return (
//     <div className="min-h-screen bg-gray-50 text-gray-900">
//       <Topbar onMenuClick={() => setOpen(true)} />

//       <div className="flex">
//         {/* Desktop sidebar */}
//         <Sidebar className="hidden md:flex md:w-72 h-[calc(100vh-57px)] sticky top-[57px]" />

//         <main className="flex-1 p-4 md:p-6">{children}</main>
//       </div>

//       {/* Mobile drawer */}
//       {open && (
//         <div className="fixed inset-0 z-50 md:hidden">
//           <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
//           <div className="absolute inset-y-0 left-0 w-72 h-full shadow-xl">
//             <Sidebar className="flex md:hidden w-72 h-full" />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// src/app/dashboard/layout.tsx
// src/app/dashboard/layout.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { redirect } from "next/navigation";
import { getUserFromCookie } from "@/lib/auth";
import ClientShell from "./ClientShell";

export default async function DashboardLayout({
  children,
}: { children: React.ReactNode }) {
  const me = await getUserFromCookie();
  if (!me) redirect("/login"); // server-side guard
  return <ClientShell>{children}</ClientShell>;
}
