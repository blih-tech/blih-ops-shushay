"use client";

import React from "react";
import { LayoutGrid, Table } from "lucide-react";

export type ViewMode = "cards" | "table";

interface ViewModeToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
  className?: string;
}

export function ViewModeToggle({
  mode,
  onChange,
  className = "",
}: ViewModeToggleProps) {
  return (
    <div
      role="group"
      aria-label="View mode toggle"
      className={`inline-flex items-center p-0.5 bg-[#F4F1F8] rounded-md border border-[#D9CEDF] shadow-xs ${className}`}
    >
      <button
        type="button"
        onClick={() => onChange("cards")}
        aria-pressed={mode === "cards"}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-sans transition-all cursor-pointer ${
          mode === "cards"
            ? "bg-white text-[#1E5BFF] font-semibold shadow-xs border border-[#D9CEDF]"
            : "text-[#6E6678] hover:text-[#17131F] font-medium"
        }`}
      >
        <LayoutGrid className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Cards</span>
      </button>

      <button
        type="button"
        onClick={() => onChange("table")}
        aria-pressed={mode === "table"}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-sans transition-all cursor-pointer ${
          mode === "table"
            ? "bg-white text-[#1E5BFF] font-semibold shadow-xs border border-[#D9CEDF]"
            : "text-[#6E6678] hover:text-[#17131F] font-medium"
        }`}
      >
        <Table className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Table</span>
      </button>
    </div>
  );
}
