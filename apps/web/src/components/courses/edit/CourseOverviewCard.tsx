import React from "react";
import { Pencil } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@blih/ui";
import type { Course } from "@/types/course";

interface CourseOverviewCardProps {
  course: Course;
  editingMeta: boolean;
  onEditClick: () => void;
}

export function CourseOverviewCard({
  course,
  editingMeta,
  onEditClick,
}: CourseOverviewCardProps) {
  return (
    <Card className="border border-[#EBE5F0] rounded-2xl shadow-sm bg-white overflow-hidden">
      <CardHeader className="px-5 py-4 bg-[#F9F8FC] border-b border-[#EBE5F0]">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold font-display text-[#17131F]">
            Course Info
          </CardTitle>
          <button
            onClick={onEditClick}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              editingMeta
                ? "text-[#1E5BFF] bg-[#EEF3FF]"
                : "text-[#9B8FA8] hover:text-[#1E5BFF] hover:bg-[#EEF3FF]"
            }`}
            title="Edit course details"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        </div>
      </CardHeader>
      <CardContent className="px-5 py-4 space-y-3">
        <div>
          <p className="text-[10px] font-mono text-[#9B8FA8] uppercase tracking-wider mb-1">
            Title
          </p>
          <p className="text-sm font-semibold text-[#17131F] font-display leading-snug">
            {course.title}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-mono text-[#9B8FA8] uppercase tracking-wider mb-1">
            Description
          </p>
          <p className="text-xs text-[#6E6678] leading-relaxed">
            {course.description || (
              <span className="italic">No description yet.</span>
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
