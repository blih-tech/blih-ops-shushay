"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Sidebar } from "./Sidebar";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      const otherDialogs = Array.from(
        document.querySelectorAll('[role="dialog"][aria-modal="true"]'),
      ).filter((el) => el !== sidebarRef.current);

      if (otherDialogs.length === 0) {
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
      }
    }
    return () => {
      const otherDialogs = Array.from(
        document.querySelectorAll('[role="dialog"][aria-modal="true"]'),
      ).filter((el) => el !== sidebarRef.current);

      if (otherDialogs.length === 0) {
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={sidebarRef}
      className="fixed inset-0 z-50 lg:hidden"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 left-0 w-72 flex flex-col shadow-2xl animate-in slide-in-from-left duration-300">
        {/* Close button */}
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <Sidebar onNavClick={onClose} />
      </div>
    </div>
  );
}
