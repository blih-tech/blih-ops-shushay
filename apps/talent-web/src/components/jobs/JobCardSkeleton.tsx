import React from "react";
import { Card, Skeleton } from "@blih/ui";

export function JobCardSkeleton({ themeIndex = 0 }: { themeIndex?: number }) {
  return (
    <Card className="border border-[#D9CEDF] rounded-3xl bg-white p-5 sm:p-7 space-y-4 h-[180px] flex flex-col justify-between shadow-xs">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <Skeleton variant="rectangular" width={80} height={12} themeIndex={themeIndex} className="rounded-md" />
            <Skeleton variant="rectangular" width={200} height={20} themeIndex={themeIndex} className="rounded-md" />
          </div>
          <Skeleton variant="rectangular" width={75} height={22} themeIndex={themeIndex} className="rounded-lg" />
        </div>
        <Skeleton variant="text" themeIndex={themeIndex} className="w-full" />
      </div>
      <div className="pt-3 border-t border-[#D9CEDF]/50 flex justify-between items-center">
        <div className="flex gap-4">
          <Skeleton variant="rectangular" width={80} height={12} themeIndex={themeIndex} className="rounded-md" />
          <Skeleton variant="rectangular" width={60} height={12} themeIndex={themeIndex} className="rounded-md" />
        </div>
        <Skeleton variant="rectangular" width={50} height={10} themeIndex={themeIndex} className="rounded-md" />
      </div>
    </Card>
  );
}
