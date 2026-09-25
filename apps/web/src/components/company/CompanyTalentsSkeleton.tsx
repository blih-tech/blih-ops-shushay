import React from "react";
import { Card, Skeleton } from "@blih/ui";

export function TalentCardSkeleton() {
  return (
    <Card className="border border-[#D9CEDF] rounded-xl bg-white overflow-hidden p-6 flex flex-col justify-between h-[230px]">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <Skeleton
              variant="rectangular"
              width={48}
              height={48}
              className="rounded-full"
            />
            <div className="space-y-2">
              <Skeleton
                variant="rectangular"
                width={120}
                height={18}
                className="rounded-md"
              />
              <Skeleton
                variant="rectangular"
                width={80}
                height={12}
                className="rounded-md"
              />
            </div>
          </div>
          <Skeleton
            variant="rectangular"
            width={70}
            height={22}
            className="rounded-lg"
          />
        </div>
        <Skeleton variant="text" className="w-full" />
        <div className="flex gap-2">
          <Skeleton
            variant="rectangular"
            width={50}
            height={16}
            className="rounded-md"
          />
          <Skeleton
            variant="rectangular"
            width={60}
            height={16}
            className="rounded-md"
          />
          <Skeleton
            variant="rectangular"
            width={55}
            height={16}
            className="rounded-md"
          />
        </div>
      </div>
      <div className="pt-4 border-t border-[#D9CEDF]/50 flex justify-between items-center">
        <Skeleton
          variant="rectangular"
          width={40}
          height={12}
          className="rounded-md"
        />
        <Skeleton
          variant="rectangular"
          width={90}
          height={28}
          className="rounded-md"
        />
      </div>
    </Card>
  );
}
