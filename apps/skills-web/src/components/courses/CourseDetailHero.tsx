import React from "react";
import { Badge } from "@blih/ui";
import { Play } from "lucide-react";
import type { PublicCourse, PublicLesson } from "@/types/course";

interface CourseDetailHeroProps {
  course: PublicCourse;
}

export function CourseDetailHero({ course }: CourseDetailHeroProps) {
  const lessonCount = course.lessons?.length || 0;

  return (
    <div className="lg:col-span-8 space-y-8">
      <div className="bg-white border border-[#D9CEDF] rounded-3xl p-8 sm:p-10 shadow-[0_12px_40px_rgba(23,19,31,0.04)] space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="primary" size="md">
            {lessonCount} {lessonCount === 1 ? "Lesson" : "Lessons"}
          </Badge>
          <Badge variant="verified" size="md">
            Verified Assessment Included
          </Badge>
          <Badge variant="secondary" size="md">
            Remote-Ready Track
          </Badge>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#17131F] leading-tight">
          {course.title}
        </h1>

        <p className="font-sans text-base sm:text-lg text-[#6E6678] leading-relaxed">
          {course.description}
        </p>
      </div>

      {/* Curriculum Outline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-[#17131F]">
            Course Curriculum
          </h2>
          <span className="font-mono text-xs text-[#6E6678]">
            {lessonCount} {lessonCount === 1 ? "Module" : "Modules"}
          </span>
        </div>

        <div className="space-y-3">
          {course.lessons && course.lessons.length > 0 ? (
            course.lessons.map((lesson: PublicLesson, idx: number) => (
              <div
                key={lesson.id || idx}
                className="bg-white border border-[#D9CEDF] rounded-2xl p-5 flex items-center justify-between gap-4 hover:border-[#1E5BFF]/30 transition-all shadow-sm"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#EEF3FF] flex items-center justify-center font-mono font-bold text-[#1E5BFF] shrink-0 text-sm">
                    {idx + 1}
                  </div>
                  <div className="truncate">
                    <h3 className="font-display font-bold text-base text-[#17131F] truncate">
                      {lesson.title}
                    </h3>
                    <p className="font-mono text-xs text-[#6E6678] mt-0.5">
                      Preview Available · Verified Assessment Included
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-1 text-xs font-mono text-[#6E6678] bg-[#F8F6FA] px-2.5 py-1 rounded-full border border-[#E8E1EE]">
                    <Play className="w-3 h-3 text-[#1E5BFF]" />
                    <span>Module Video</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 bg-white rounded-2xl border border-[#D9CEDF] text-center text-sm font-mono text-[#6E6678]">
              No lessons published yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
