import React from "react";
import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";
import { Card, CardTitle, CardDescription, Button, Badge } from "@blih/ui";
import type { PublicCourseListItem } from "@/types/course";

export function CourseCard({ course }: { course: PublicCourseListItem }) {
  const lessonCount = course._count?.lessons || 0;

  return (
    <Card
      variant="interactive"
      className="flex flex-col justify-between group h-full p-6 bg-white border border-[#D9CEDF] hover:border-[#1E5BFF]/40 rounded-3xl transition-all duration-300 shadow-xs hover:shadow-md"
    >
      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#EEF3FF] border border-[#1E5BFF]/15 flex items-center justify-center text-[#1E5BFF] group-hover:bg-[#1E5BFF] group-hover:text-white transition-all duration-300 shrink-0">
            <BookOpen className="h-6 w-6" />
          </div>
          <Badge variant="primary" size="sm">
            {lessonCount} {lessonCount === 1 ? "Lesson" : "Lessons"}
          </Badge>
        </div>

        <CardTitle className="text-xl font-bold mb-2 group-hover:text-[#1E5BFF] transition-colors leading-snug text-[#17131F]">
          {course.title}
        </CardTitle>

        <CardDescription className="line-clamp-3 text-sm text-[#6E6678] mb-4">
          {course.description}
        </CardDescription>

        <div className="flex flex-wrap gap-1.5 mb-6">
          <Badge variant="secondary" size="sm">
            Assessment Included
          </Badge>
          <Badge variant="verified" size="sm">
            Verified Credential
          </Badge>
        </div>
      </div>

      <div className="pt-4 border-t border-[#D9CEDF]/50 mt-auto">
        <Link href={`/courses/${course.id}`} className="w-full block">
          <Button
            variant="outline"
            fullWidth
            rightIcon={
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            }
          >
            Explore Curriculum
          </Button>
        </Link>
      </div>
    </Card>
  );
}
