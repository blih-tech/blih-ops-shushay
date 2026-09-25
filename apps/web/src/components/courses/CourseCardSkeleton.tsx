import React from "react";
import { Card } from "@blih/ui";

const COVER_THEMES = [
  { id: "neutral-1", bg: "bg-[#F4F1F8]" },
  { id: "neutral-2", bg: "bg-[#F0EDF5]" },
  { id: "neutral-3", bg: "bg-[#F8F6FA]" },
  { id: "neutral-4", bg: "bg-[#EBE5F0]/70" },
];

export function CourseVisualCover({ themeIndex = 0 }: { themeIndex?: number }) {
  const theme = COVER_THEMES[themeIndex % COVER_THEMES.length];

  return (
    <div
      className={`w-full h-[140px] rounded-2xl ${theme.bg} border border-[#D9CEDF]/50 overflow-hidden p-4 flex flex-col justify-between animate-pulse`}
    >
      <div className="bg-white/80 rounded-xl p-3 space-y-2 max-w-[75%]">
        <div className="h-2.5 rounded-full bg-[#17131F]/15 w-full" />
        <div className="h-2 rounded-full bg-[#6E6678]/15 w-2/3" />
      </div>
      <div className="flex justify-between items-center">
        <div className="h-3 w-16 bg-[#17131F]/15 rounded-full" />
        <div className="h-3 w-8 bg-[#6E6678]/20 rounded-full" />
      </div>
    </div>
  );
}

export function CourseCardSkeleton({
  themeIndex = 0,
}: {
  themeIndex?: number;
}) {
  return (
    <Card className="flex flex-col bg-white border border-[#D9CEDF] rounded-xl p-5 space-y-4 shadow-xs">
      <CourseVisualCover themeIndex={themeIndex} />
      <div className="space-y-2">
        <div className="h-5 bg-[#F4F1F8] border border-[#D9CEDF]/50 animate-pulse w-3/4 rounded-xl" />
        <div className="h-4 bg-[#F4F1F8] border border-[#D9CEDF]/50 animate-pulse w-full rounded" />
        <div className="h-4 bg-[#F4F1F8] border border-[#D9CEDF]/50 animate-pulse w-2/3 rounded" />
      </div>
      <div className="pt-4 border-t border-[#D9CEDF]/50 mt-auto">
        <div className="h-10 min-h-[40px] bg-[#F4F1F8] border border-[#D9CEDF]/50 animate-pulse w-full rounded-xl" />
      </div>
    </Card>
  );
}
