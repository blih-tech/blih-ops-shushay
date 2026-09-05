import React from "react";
import { Skeleton } from "@blih/ui";
import { User } from "@blih/types";

interface EditCourseSkeletonProps {
  user?: User | null;
  onSignOut?: () => void;
}

export function EditCourseSkeleton({
}: EditCourseSkeletonProps) {
  return (
    <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 flex-1 animate-pulse">
      <div className="flex items-center justify-between">
        <Skeleton variant="rectangular" className="h-6 w-32 rounded-lg" />
        <Skeleton variant="rectangular" className="h-10 w-24 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white border border-[#D9CEDF] rounded-3xl p-6 space-y-4">
            <Skeleton variant="rectangular" className="h-8 w-48 rounded-xl" />
            <Skeleton
              variant="rectangular"
              className="h-12 w-full rounded-xl"
            />
            <Skeleton
              variant="rectangular"
              className="h-32 w-full rounded-2xl"
            />
          </div>
        </div>
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white border border-[#D9CEDF] rounded-3xl p-6 space-y-4">
            <Skeleton variant="rectangular" className="h-8 w-48 rounded-xl" />
            <div className="space-y-3">
              <Skeleton
                variant="rectangular"
                className="h-12 w-full rounded-xl"
              />
              <Skeleton
                variant="rectangular"
                className="h-12 w-full rounded-xl"
              />
              <Skeleton
                variant="rectangular"
                className="h-12 w-full rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
