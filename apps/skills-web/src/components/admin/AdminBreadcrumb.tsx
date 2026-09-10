"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, LayoutDashboard } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AdminBreadcrumbProps {
  items: BreadcrumbItem[];
}

export function AdminBreadcrumb({ items }: AdminBreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1.5 text-xs font-mono text-[#6E6678]">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-[#1E5BFF] hover:underline"
      >
        <LayoutDashboard className="h-3 w-3" />
        Admin
      </Link>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="h-3 w-3 text-[#D9CEDF]" />
          {item.href ? (
            <Link href={item.href} className="text-[#1E5BFF] hover:underline">
              {item.label}
            </Link>
          ) : (
            <span className="text-[#17131F] font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
