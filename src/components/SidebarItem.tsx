"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type Props = {
  href: string;
  icon: ReactNode;
  label: string;
};

export default function SidebarItem({ href, icon, label }: Props) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname?.startsWith(href + "/");

  return (
    <Link
      href={href}
      aria-current={isActive ? "page" : undefined}
      className={[
        "flex items-center gap-3 rounded-xl px-3 py-2 transition",
        isActive
          ? "bg-white/10 text-white shadow-inner"
          : "text-gray-300 hover:text-white hover:bg-white/5"
      ].join(" ")}
    >
      <span className="size-5">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}
