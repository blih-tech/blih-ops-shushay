"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import {
  LayoutDashboard,
  Edit3,
  Eye,
  LogOut,
  ChevronRight,
  Zap,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/profile", icon: LayoutDashboard, exact: true },
  { label: "Edit Profile", href: "/profile/edit", icon: Edit3 },
  { label: "Preview", href: "/profile/preview", icon: Eye },
];

interface SidebarProps {
  onNavClick?: () => void;
}

export function Sidebar({ onNavClick }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (item: NavItem) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href);

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-border shrink-0">
        <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center shrink-0">
          <Zap className="h-4 w-4 text-primary-foreground fill-primary-foreground/20" />
        </div>
        <div className="min-w-0">
          <span className="font-serif font-semibold text-foreground text-base leading-none block">
            Blih
          </span>
          <span className="font-mono text-[0.625rem] text-muted-foreground uppercase tracking-widest leading-none block mt-1">
            Talent Portal
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <p className="text-[0.625rem] font-mono font-semibold text-muted-foreground uppercase tracking-widest px-2 mb-2">
          Profile
        </p>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={`
                flex items-center gap-3.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-interactive group
                ${
                  active
                    ? "bg-primary/8 text-primary font-semibold"
                    : "text-body hover:bg-muted hover:text-foreground"
                }
              `}
            >
              <Icon
                className={`h-4 w-4 shrink-0 transition-colors ${
                  active
                    ? "text-primary"
                    : "text-muted-foreground group-hover:text-foreground"
                }`}
              />
              <span className="flex-1">{item.label}</span>
              {active && (
                <ChevronRight className="h-3.5 w-3.5 text-primary/60" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      <div className="border-t border-border px-3 py-3 shrink-0 space-y-1.5">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-muted">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-primary uppercase">
              {user?.email?.charAt(0) || "T"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">
              {user?.email || "Talent User"}
            </p>
            <p className="text-[0.625rem] font-mono text-muted-foreground uppercase tracking-wider">
              Talent
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/8 hover:text-destructive transition-colors duration-interactive group"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
