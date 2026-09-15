"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, EyeOff, CheckCircle, Pencil, Trash2 } from "lucide-react";
import { Button, Badge } from "@blih/ui";
import type { Course } from "@/types/course";

interface AdminCourseCardProps {
  course: Course;
  isActing: boolean;
  onPublishToggle: (course: Course) => void;
  onDeleteClick: (course: Course) => void;
}

export function AdminCourseCard({
  course,
  isActing,
  onPublishToggle,
  onDeleteClick,
}: AdminCourseCardProps) {
  const isPublished = course.status === "PUBLISHED";
  const lessonCount = course._count?.lessons ?? 0;

  return (
    <div className="bg-white border border-[#D9CEDF] rounded-3xl p-6 hover:border-[#1E5BFF]/40 transition-all shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-12 h-12 rounded-2xl bg-[#EEF3FF] flex items-center justify-center text-[#1E5BFF] shrink-0">
          <BookOpen className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <h3 className="font-display font-bold text-base sm:text-lg text-[#17131F] truncate">
            {course.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={isPublished ? "verified" : "secondary"} size="sm">
              {isPublished ? "Published" : "Draft"}
            </Badge>
            <span className="text-xs font-mono text-[#6E6678]">
              {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap shrink-0">
        <Button
          size="sm"
          variant={isPublished ? "outline" : "secondary"}
          isLoading={isActing}
          onClick={() => onPublishToggle(course)}
          leftIcon={
            isPublished ? (
              <EyeOff className="h-3.5 w-3.5 text-[#D97706]" />
            ) : (
              <CheckCircle className="h-3.5 w-3.5 text-[#2E8F79]" />
            )
          }
        >
          {isPublished ? "Unpublish" : "Publish"}
        </Button>
        <Link href={`/admin/courses/${course.id}/edit`}>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<Pencil className="h-3.5 w-3.5" />}
          >
            Edit
          </Button>
        </Link>
        <Button
          size="sm"
          variant="destructive"
          leftIcon={<Trash2 className="h-3.5 w-3.5" />}
          onClick={() => onDeleteClick(course)}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
