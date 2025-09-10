import SidebarItem from "./SidebarItem";
import {
  Activity,
  Plug,
  UserPlus,
  Users,
  CreditCard,
  Info,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-60 bg-gray-800 h-screen p-4 space-y-4 text-white">
      <h2 className="text-xl font-bold mb-6">SCADA Menu</h2>
      <SidebarItem icon={<Activity />} label="Status" href="/dashboard/status" />
      <SidebarItem icon={<Plug />} label="Connect (Modbus)" href="/dashboard/connect" />
      <SidebarItem icon={<UserPlus />} label="Add User" href="/dashboard/add-user" />
      <SidebarItem icon={<Users />} label="List Users" href="/dashboard/list-users" />
      <SidebarItem icon={<CreditCard />} label="Billing" href="/dashboard/billing" />
      <SidebarItem icon={<Info />} label="About" href="/dashboard/about" />
      <SidebarItem icon={<LogOut />} label="Logout" href="/login" />
    </aside>
  );
}
