"use client";

import React from "react";
import { Card, Skeleton } from "@/components/ui";

export function DashboardCoursesSkeleton() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} className="flex flex-col justify-between p-6 space-y-4 animate-pulse">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton variant="circular" className="w-10 h-10" />
              <Skeleton variant="rectangular" className="h-6 w-20 rounded-full" />
            </div>
            <Skeleton variant="rectangular" className="h-6 w-3/4 rounded-lg" />
            <Skeleton variant="rectangular" className="h-12 w-full rounded-xl" />
          </div>
          <div className="pt-4 border-t border-[#D9CEDF]/50 mt-4 space-y-3">
            <Skeleton variant="rectangular" className="h-4 w-full rounded" />
            <Skeleton variant="rectangular" className="h-8 w-full rounded-xl" />
          </div>
        </Card>
      ))}
    </>
  );
}
