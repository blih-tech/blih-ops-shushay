import React from "react";
import { Card, Skeleton } from "@blih/ui";

export function TalentCardSkeleton({ themeIndex = 0 }: { themeIndex?: number }) {
  return (
    <Card className="border border-[#D9CEDF] rounded-3xl p-6 bg-white space-y-4 shadow-xs">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={48} height={48} themeIndex={themeIndex} />
        <div className="space-y-2 flex-1">
          <Skeleton variant="rectangular" width={140} height={18} themeIndex={themeIndex} className="rounded-md" />
          <Skeleton variant="rectangular" width={100} height={14} themeIndex={themeIndex} className="rounded-md" />
        </div>
      </div>
      <Skeleton variant="text" themeIndex={themeIndex} className="w-full" />
      <div className="flex gap-2 pt-2">
        <Skeleton variant="rectangular" width={70} height={22} themeIndex={themeIndex} className="rounded-md" />
        <Skeleton variant="rectangular" width={70} height={22} themeIndex={themeIndex} className="rounded-md" />
      </div>
    </Card>
  );
}
