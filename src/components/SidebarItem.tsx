import { ReactNode } from "react";
import Link from "next/link";

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  href: string;
}

export default function SidebarItem({ icon, label, href }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-3 p-3 hover:bg-gray-200 rounded-lg"
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
