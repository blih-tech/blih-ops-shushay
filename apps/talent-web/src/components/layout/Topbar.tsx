"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

interface TopbarProps {
  onMenuClick: () => void;
  actions?: React.ReactNode;
}

const PAGE_META: Record<string, { title: string; description: string }> = {
  "/profile": {
    title: "My Profile",
    description: "Your talent workspace overview",
  },
  "/profile/edit": {
    title: "Edit Profile",
    description: "Update your credentials and professional history",
  },
  "/profile/preview": {
    title: "Recruiter Preview",
    description: "See your profile as companies will see it",
  },
};

export function Topbar({ onMenuClick, actions }: TopbarProps) {
  const pathname = usePathname();
  const meta = PAGE_META[pathname] || { title: "Profile", description: "" };

  return (
    <header className="sticky top-0 z-30 bg-background border-b border-border h-14 flex items-center gap-4 px-4 sm:px-6 shrink-0">
      {/* Mobile hamburger */}
      <button
        onClick={onMenuClick}
        className="lg:hidden h-8 w-8 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0"
        aria-label="Open navigation"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* Page title area */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2.5">
          <h1 className="text-sm sm:text-base font-semibold text-foreground truncate">
            {meta.title}
          </h1>
          {meta.description && (
            <>
              <span className="text-border hidden sm:inline">/</span>
              <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline truncate">
                {meta.description}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Contextual actions slot */}
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </header>
  );
}
