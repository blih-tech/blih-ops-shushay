"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { NotificationMenu } from "./NotificationMenu";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Building2,
  BookOpen,
  Briefcase,
  FileText,
  CreditCard,
  TrendingUp,
  Award,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Talents", href: "/admin/talents", icon: UserCheck },
  { label: "Companies", href: "/admin/companies", icon: Building2 },
  { label: "Courses", href: "/admin/courses", icon: BookOpen },
  { label: "Jobs", href: "/admin/jobs", icon: Briefcase },
  { label: "Applications", href: "/admin/applications", icon: FileText },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Subscriptions", href: "/admin/subscriptions", icon: TrendingUp },
  { label: "Certificates", href: "/admin/certificates", icon: Award },
  { label: "Notifications", href: "/admin/notifications", icon: Bell },
];

function SidebarLink({
  item,
  onClick,
}: {
  item: (typeof NAV_ITEMS)[0];
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = item.exact
    ? pathname === item.href
    : pathname.startsWith(item.href);

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${isActive
        ? "bg-[#1E5BFF] text-white shadow-sm"
        : "text-[#6E6678] hover:text-[#17131F] hover:bg-[#F4F1F8]"
        }`}
    >
      <item.icon
        className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-[#9B8FA8] group-hover:text-[#17131F]"}`}
      />
      <span className="truncate">{item.label}</span>
      {isActive && <ChevronRight className="h-3 w-3 ml-auto shrink-0" />}
    </Link>
  );
}

function SidebarContent({ onNav }: { onNav?: () => void }) {
  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col h-full">
      {/* Logo / Brand */}
      <div className="px-4 py-5 border-b border-[#EBE5F0]">
        <Link href="/admin" onClick={onNav} className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#1E5BFF] flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm font-display">B</span>
          </div>
          <div>
            <p className="font-display font-bold text-[#17131F] text-sm leading-none">
              Blih Admin
            </p>
            <p className="text-[10px] font-mono text-[#6E6678] mt-0.5 uppercase tracking-wider">
              Control Panel
            </p>
          </div>
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-3">
        {NAV_ITEMS.map((item) => (
          <SidebarLink key={item.href} item={item} onClick={onNav} />
        ))}
      </nav>

      {/* User Footer */}
      <div className="px-3 py-4 border-t border-[#EBE5F0] space-y-1">
        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center text-xs font-bold shrink-0">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-[#17131F] truncate">
              {user?.email?.split("@")[0]}
            </p>
            <p className="text-[10px] font-mono text-[#6E6678] truncate">
              Administrator
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#6E6678] hover:text-[#D32F2F] hover:bg-[#FFEBEE] transition-all"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 shrink-0 h-screen sticky top-0 border-r border-[#EBE5F0] bg-white">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 h-14 bg-white border-b border-[#EBE5F0] flex items-center justify-between px-4">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#1E5BFF] flex items-center justify-center">
            <span className="text-white font-bold text-xs font-display">B</span>
          </div>
          <span className="font-display font-bold text-[#17131F] text-sm">
            Blih Admin
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <NotificationMenu />
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl text-[#6E6678] hover:bg-[#F4F1F8] transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-[#EBE5F0] transition-transform duration-200 ${mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between px-4 h-14 border-b border-[#EBE5F0]">
          <span className="font-display font-bold text-[#17131F] text-sm">
            Menu
          </span>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg text-[#6E6678] hover:bg-[#F4F1F8] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="h-[calc(100%-3.5rem)] overflow-y-auto">
          <SidebarContent onNav={() => setMobileOpen(false)} />
        </div>
      </div>
    </>
  );
}
