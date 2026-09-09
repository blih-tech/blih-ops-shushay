import React from "react";
import { Card, Skeleton } from "@blih/ui";

export function AdminCourseSkeletonList({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton
          key={i}
          variant="rectangular"
          themeIndex={i}
          className="h-20 rounded-2xl"
        />
      ))}
    </div>
  );
}

export function AdminTalentSkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-4">
            <Skeleton variant="circular" width={48} height={48} themeIndex={i} />
            <div className="space-y-2 flex-1">
              <Skeleton variant="rectangular" themeIndex={i} className="h-6 w-3/4 rounded-lg" />
              <Skeleton variant="rectangular" themeIndex={i} className="h-4 w-1/2 rounded-lg" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function AdminCompanySkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="p-6 space-y-4 shadow-xs">
          <div className="flex items-center gap-4">
            <Skeleton variant="circular" width={48} height={48} themeIndex={i} />
            <div className="space-y-2 flex-1">
              <Skeleton
                variant="rectangular"
                themeIndex={i}
                className="h-6 w-3/4 rounded-lg"
              />
              <Skeleton
                variant="rectangular"
                themeIndex={i}
                className="h-4 w-1/2 rounded-lg"
              />
            </div>
          </div>
          <div className="pt-4 border-t border-[#D9CEDF] space-y-2">
            <Skeleton
              variant="rectangular"
              themeIndex={i}
              className="h-4 w-full rounded"
            />
            <Skeleton
              variant="rectangular"
              themeIndex={i}
              className="h-4 w-5/6 rounded"
            />
          </div>
        </Card>
      ))}
    </div>
  );
}
