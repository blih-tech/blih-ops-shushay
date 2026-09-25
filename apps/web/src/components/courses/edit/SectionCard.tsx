import React from "react";

interface SectionCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function SectionCard({ title, icon, children }: SectionCardProps) {
  return (
    <div className="border border-[#D9CEDF] rounded-2xl overflow-hidden bg-white shadow-xs">
      <div className="px-5 py-3 bg-white border-b border-[#D9CEDF] flex items-center gap-2">
        {icon && <span className="text-[#17131F]">{icon}</span>}
        <p className="text-xs font-mono font-bold text-[#17131F] uppercase tracking-wider">
          {title}
        </p>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}
