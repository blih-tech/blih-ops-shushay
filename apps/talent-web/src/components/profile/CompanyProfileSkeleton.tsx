import React from "react";
import { GlobalNavbar, Skeleton } from "@blih/ui";

interface CompanyProfileSkeletonProps {
  user: any;
  logout: () => void;
}

export function CompanyProfileSkeleton({
  user,
  logout,
}: CompanyProfileSkeletonProps) {
  return (
    <div className="min-h-screen bg-white text-[#17131F] flex flex-col antialiased relative">
      <GlobalNavbar currentApp="explore" user={user} onSignOut={logout} />
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-pulse">
        <div className="flex items-center justify-between">
          <Skeleton variant="rectangular" className="h-6 w-32 rounded-lg" />
          <Skeleton variant="rectangular" className="h-10 w-24 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white border border-[#D9CEDF] rounded-3xl p-6 space-y-4">
              <Skeleton variant="rectangular" className="h-8 w-48 rounded-xl" />
              <Skeleton variant="rectangular" className="h-32 rounded-2xl" />
              <Skeleton variant="rectangular" className="h-12 rounded-xl" />
            </div>
          </div>
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white border border-[#D9CEDF] rounded-3xl p-6 space-y-4">
              <Skeleton variant="rectangular" className="h-8 w-32 rounded-xl" />
              <Skeleton variant="circular" className="h-24 w-24 mx-auto" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
