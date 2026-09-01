import React from "react";
import { Card } from "@blih/ui";
import type { Lesson } from "@/types/course";

interface CurriculumMetricsCardProps {
  lessons: Lesson[];
}

export function CurriculumMetricsCard({ lessons }: CurriculumMetricsCardProps) {
  return (
    <Card className="border border-[#D9CEDF] rounded-3xl shadow-sm bg-white p-6 space-y-4">
      <h3 className="font-display font-bold text-lg text-[#17131F]">
        Curriculum Metrics
      </h3>
      <div className="grid grid-cols-2 gap-3 font-sans">
        <div className="p-3.5 bg-[#EEF3FF]/50 border border-[#D9CEDF]/70 rounded-2xl">
          <p className="text-xs font-mono text-[#6E6678] uppercase">
            Lessons
          </p>
          <p className="text-2xl font-bold font-display text-[#1E5BFF] mt-1">
            {lessons.length}
          </p>
        </div>
        <div className="p-3.5 bg-[#EEF3FF]/50 border border-[#D9CEDF]/70 rounded-2xl">
          <p className="text-xs font-mono text-[#6E6678] uppercase">
            Videos
          </p>
          <p className="text-2xl font-bold font-display text-[#2E8F79] mt-1">
            {lessons.filter((l) => l.videoUrl).length}
          </p>
        </div>
        <div className="p-3.5 bg-[#EEF3FF]/50 border border-[#D9CEDF]/70 rounded-2xl">
          <p className="text-xs font-mono text-[#6E6678] uppercase">
            Quizzes
          </p>
          <p className="text-2xl font-bold font-display text-[#FF8A5B] mt-1">
            {lessons.filter((l) => l.quiz).length}
          </p>
        </div>
        <div className="p-3.5 bg-[#EEF3FF]/50 border border-[#D9CEDF]/70 rounded-2xl">
          <p className="text-xs font-mono text-[#6E6678] uppercase">
            Assignments
          </p>
          <p className="text-2xl font-bold font-display text-[#17131F] mt-1">
            {lessons.filter((l) => l.assignment).length}
          </p>
        </div>
      </div>
    </Card>
  );
}
