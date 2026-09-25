import React from "react";
import { Skeleton } from "@blih/ui";

interface SkeletonProps {
  user?: any;
  logout?: () => void;
}

export function ProfileSkeleton({ user, logout }: SkeletonProps) {
  return (
    <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-pulse">
      <div className="bg-white border border-[#D9CEDF] rounded-xl p-5 sm:p-8 md:p-12 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#D9CEDF]/70">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <Skeleton variant="circular" className="h-20 w-20 shrink-0" />
            <div className="space-y-2">
              <Skeleton variant="rectangular" className="h-8 w-48 rounded-xl" />
              <Skeleton variant="rectangular" className="h-4 w-32 rounded-lg" />
              <Skeleton variant="rectangular" className="h-4 w-64 rounded-lg" />
            </div>
          </div>
          <Skeleton variant="rectangular" className="h-10 w-28 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton variant="rectangular" className="h-24 rounded-2xl" />
          <Skeleton variant="rectangular" className="h-24 rounded-2xl" />
          <Skeleton variant="rectangular" className="h-24 rounded-2xl" />
        </div>
      </div>
    </main>
  );
}

export function ProfilePreviewSkeleton({ user, logout }: SkeletonProps) {
  return (
    <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
      <div className="flex items-center justify-between">
        <Skeleton variant="rectangular" className="h-6 w-32 rounded-lg" />
        <Skeleton variant="rectangular" className="h-10 w-24 rounded-xl" />
      </div>
      <div className="bg-white border border-[#D9CEDF] rounded-xl p-6 sm:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Skeleton variant="circular" className="h-20 w-20 shrink-0" />
          <div className="space-y-2 flex-1 text-center sm:text-left">
            <Skeleton
              variant="rectangular"
              className="h-8 w-48 mx-auto sm:mx-0 rounded-xl"
            />
            <Skeleton
              variant="rectangular"
              className="h-4 w-32 mx-auto sm:mx-0 rounded-lg"
            />
          </div>
        </div>
        <div className="border-t border-[#D9CEDF] pt-6 space-y-4">
          <Skeleton variant="rectangular" className="h-4 w-full rounded" />
          <Skeleton variant="rectangular" className="h-4 w-5/6 rounded" />
        </div>
      </div>
    </main>
  );
}

export function ProfileSetupSkeleton({ user, logout }: SkeletonProps) {
  return (
    <main className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-pulse">
      <div className="text-center space-y-2">
        <Skeleton
          variant="rectangular"
          className="h-10 w-64 mx-auto rounded-xl"
        />
        <Skeleton
          variant="rectangular"
          className="h-4 w-48 mx-auto rounded-lg"
        />
      </div>
      <div className="bg-white border border-[#D9CEDF] rounded-xl p-6 sm:p-10 space-y-6">
        <div className="flex justify-between items-center gap-4 border-b border-[#D9CEDF] pb-6">
          <Skeleton variant="rectangular" className="h-6 w-24 rounded-lg" />
          <Skeleton variant="rectangular" className="h-6 w-24 rounded-lg" />
          <Skeleton variant="rectangular" className="h-6 w-24 rounded-lg" />
        </div>
        <div className="space-y-4">
          <Skeleton variant="rectangular" className="h-12 w-full rounded-xl" />
          <Skeleton variant="rectangular" className="h-12 w-full rounded-xl" />
          <Skeleton variant="rectangular" className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </main>
  );
}
