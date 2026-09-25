"use client";

import React from "react";
import { useAuth } from "@/providers/AuthProvider";
import { AdminSidebar } from "./AdminSidebar";
import { NotificationMenu } from "./NotificationMenu";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#F9F8FC] flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* Desktop top bar */}
        <header className="hidden lg:flex h-14 shrink-0 bg-white border-b border-[#D9CEDF] items-center justify-between px-6 sticky top-0 z-30">
          <div />
          <div className="flex items-center gap-3">
            <NotificationMenu />
            <div className="flex items-center gap-2 pl-3 border-l border-[#D9CEDF]">
              <div className="w-7 h-7 rounded-lg bg-white border border-[#D9CEDF] text-[#17131F] flex items-center justify-center text-xs font-bold font-sans shadow-2xs">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-medium text-[#17131F]">
                {user?.email?.split("@")[0]}
              </span>
            </div>
          </div>
        </header>

        {/* Page content — offset by mobile top bar height */}
        <main className="flex-1 pt-14 lg:pt-0 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
