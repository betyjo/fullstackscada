"use client";
import SidebarItem from "./SidebarItem";
import Link from "next/link";
import Image from "next/image";
import {
  Activity,
  Plug,
  UserPlus,
  Users,
  CreditCard,
  Info,
  LogOut,
  LayoutDashboard,
} from "lucide-react";

export default function Sidebar({ className = "" }: { className?: string }) {
  return (
    <aside
      className={
        "flex flex-col bg-gray-950 text-white border-r border-white/10 " + className
      }
    >
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
        <Image src="/logo.jpg" width={28} height={28} alt="Logo" className="rounded" />
        <Link href="/dashboard" className="flex items-center gap-2">
          <LayoutDashboard className="size-5" />
          <span className="text-lg font-semibold tracking-tight">SCADA Console</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-2">
        <div className="px-2 pb-1 text-xs uppercase tracking-wider text-gray-400">Overview</div>
        <SidebarItem icon={<Activity />} label="Dashboard" href="/dashboard" />
        <SidebarItem icon={<Plug />} label="Connect" href="/dashboard/connect" />
        <SidebarItem icon={<Users />} label="Users" href="/dashboard/list-users" />
        <SidebarItem icon={<UserPlus />} label="Add User" href="/dashboard/add-user" />

        <div className="px-2 pt-4 pb-1 text-xs uppercase tracking-wider text-gray-400">Account</div>
        <SidebarItem icon={<CreditCard />} label="Billing" href="/dashboard/billing" />
        <SidebarItem icon={<Info />} label="About" href="/dashboard/about" />
        <SidebarItem icon={<LogOut />} label="Logout" href="/login" />
      </nav>

      <div className="px-5 py-4 border-t border-white/10 text-sm text-gray-400">
        <div>v1.0 • Online</div>
        <div className="text-gray-500">© {new Date().getFullYear()} SCADA</div>
      </div>
    </aside>
  );
}
