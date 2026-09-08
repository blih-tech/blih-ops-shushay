"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { GlobalNavbar, GlobalFooter } from "@blih/ui";
import { useAuth } from "@/providers/AuthProvider";
import { NotificationMenu } from "./NotificationMenu";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-white text-[#17131F] flex flex-col antialiased relative selection:bg-[#DDE7FF] selection:text-[#1E5BFF]">
      {/* Ambient lighting */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#EEF3FF] via-white/50 to-transparent pointer-events-none -z-10" />

      {/* Global Navbar */}
      <GlobalNavbar
        user={user}
        loading={loading}
        onSignOut={logout}
        pathname={pathname}
        extraActions={user ? <NotificationMenu /> : null}
      />

      {/* Main Content */}
      <main className="flex-1 w-full">{children}</main>

      {/* Global Footer */}
      <GlobalFooter user={user} />
    </div>
  );
}

