import React from "react";
import { Card } from "@blih/ui";

const COVER_THEMES = [
  {
    id: "blue-lavender",
    bg: "bg-[#DDE7FF]/80",
  },
  {
    id: "ice-blue",
    bg: "bg-[#EEF3FF]",
  },
  {
    id: "warm-orange",
    bg: "bg-[#FFF4EC]",
  },
  {
    id: "mint-green",
    bg: "bg-[#EAFBF6]",
  },
];

export function CourseVisualCover({ themeIndex = 0 }: { themeIndex?: number }) {
  const theme = COVER_THEMES[themeIndex % COVER_THEMES.length];

  return (
    <div
      className={`w-full h-[140px] rounded-2xl ${theme.bg} border border-[#D9CEDF]/40 overflow-hidden p-4 flex flex-col justify-between animate-pulse`}
    >
      <div className="bg-white/60 rounded-xl p-3 space-y-2 max-w-[75%]">
        <div className="h-2.5 rounded-full bg-[#1E5BFF]/20 w-full" />
        <div className="h-2 rounded-full bg-[#6E6678]/20 w-2/3" />
      </div>
      <div className="flex justify-between items-center">
        <div className="h-3 w-16 bg-[#1E5BFF]/20 rounded-full" />
        <div className="h-3 w-8 bg-[#FF8A5B]/30 rounded-full" />
      </div>
    </div>
  );
}

export function CourseCardSkeleton({ themeIndex = 0 }: { themeIndex?: number }) {
  return (
    <Card className="flex flex-col bg-white border border-[#D9CEDF] rounded-3xl p-5 space-y-4 shadow-xs">
      <CourseVisualCover themeIndex={themeIndex} />
      <div className="space-y-2">
        <div className="h-5 bg-[#EEF3FF] border border-[#D9CEDF]/40 animate-pulse w-3/4 rounded-xl" />
        <div className="h-4 bg-[#EEF3FF] border border-[#D9CEDF]/40 animate-pulse w-full rounded" />
        <div className="h-4 bg-[#EEF3FF] border border-[#D9CEDF]/40 animate-pulse w-2/3 rounded" />
      </div>
      <div className="pt-4 border-t border-[#D9CEDF]/50 mt-auto">
        <div className="h-10 bg-[#EEF3FF] border border-[#D9CEDF]/40 animate-pulse w-full rounded-xl" />
      </div>
    </Card>
  );
}
