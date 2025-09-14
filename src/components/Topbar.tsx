"use client";
import { Menu, Bell } from "lucide-react";
import Image from "next/image";

export default function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b border-gray-200">
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          onClick={onMenuClick}
          className="md:hidden -ml-1 p-2 rounded-lg hover:bg-gray-100"
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </button>
        <div className="ml-auto flex items-center gap-2">
          <button className="p-2 rounded-lg hover:bg-gray-100" aria-label="Notifications">
            <Bell className="size-5" />
          </button>
          <Image src="/logo.jpg" width={28} height={28} alt="User" className="rounded-full" />
        </div>
      </div>
    </header>
  );
}
