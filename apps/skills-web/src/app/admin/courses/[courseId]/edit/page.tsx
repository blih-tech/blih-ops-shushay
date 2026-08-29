"use client";

import React from "react";
import { useParams } from "next/navigation";
import AuthGuard from "@/components/auth/AuthGuard";
import { EditCourseContent } from "@/components/courses/edit/EditCourseContent";

export default function EditCoursePage() {
  const params = useParams();
  const courseId = params.courseId as string;

  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <EditCourseContent courseId={courseId} />
    </AuthGuard>
  );
}
