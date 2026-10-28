"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, FileSpreadsheet, Inbox, LayoutDashboard, LogOut, Package } from "lucide-react";
import { logout } from "@/app/admin/actions";
import Logo from "../Logo";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/import", label: "Import spreadsheet", icon: FileSpreadsheet },
];

export default function AdminNav({ newEnquiries }: { newEnquiries: number }) {
  const pathname = usePathname();
  const active = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));
  return (
    <aside className="sticky top-0 z-30 border-b border-white/10 bg-ink text-white lg:h-dvh lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between p-4 lg:p-6">
        <Link href="/admin"><Logo dark /></Link>
        <form action={logout} className="lg:hidden">
          <button className="grid size-10 place-items-center rounded-full hover:bg-white/10" aria-label="Log out">
            <LogOut className="size-4" />
          </button>
        </form>
      </div>
      <nav className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:px-4">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
              active(href) ? "bg-white text-ink" : "text-steel-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className="size-4" />
            {label}
            {href === "/admin/enquiries" && newEnquiries > 0 && (
              <span className="ml-auto grid h-5 min-w-5 place-items-center rounded-full bg-flame px-1.5 text-[11px] text-white">{newEnquiries}</span>
            )}
          </Link>
        ))}
      </nav>
      <div className="absolute inset-x-4 bottom-6 hidden space-y-1 lg:block">
        <Link href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-steel-400 hover:text-white">
          <ExternalLink className="size-4" /> View website
        </Link>
        <form action={logout}>
          <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-steel-400 hover:text-white">
            <LogOut className="size-4" /> Log out
          </button>
        </form>
      </div>
    </aside>
  );
}
