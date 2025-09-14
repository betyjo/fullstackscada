"use client";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Topbar onMenuClick={() => setOpen(true)} />

      <div className="flex">
        {/* Desktop sidebar */}
        <Sidebar className="hidden md:flex md:w-72 h-[calc(100vh-57px)] sticky top-[57px]" />

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 h-full shadow-xl">
            <Sidebar className="flex md:hidden w-72 h-full" />
          </div>
        </div>
      )}
    </div>
  );
}
