"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, BookOpen, Pencil, Eye, EyeOff, GraduationCap, ArrowLeft } from "lucide-react";
import {
  Button, Badge, Alert, Skeleton, EmptyState, ConfirmDialog, Card, CardContent
} from "@/components/ui";
import AuthGuard from "@/components/auth/AuthGuard";
import { fetchAdminCourses, publishCourse, unpublishCourse } from "@/lib/courses";
import type { Course } from "@/types/course";

function CoursesContent() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmCourse, setConfirmCourse] = useState<Course | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchAdminCourses()
      .then(setCourses)
      .catch((err) => setError(err.message ?? "Failed to load courses"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handlePublishToggle(course: Course) {
    if (course.status === "PUBLISHED") {
      setConfirmCourse(course);
      return;
    }
    await doPublish(course);
  }

  async function doPublish(course: Course) {
    setActionLoading(course.id);
    setActionError(null);
    try {
      const updated = course.status === "PUBLISHED"
        ? await unpublishCourse(course.id)
        : await publishCourse(course.id);
      setCourses((prev) => prev.map((c) => c.id === course.id ? { ...c, status: updated.status } : c));
    } catch (err: any) {
      setActionError(err.message ?? "Action failed");
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <Link href="/admin">
        <Button variant="ghost" leftIcon={<ArrowLeft className="h-4 w-4" />} size="sm">Back to Admin Portal</Button>
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
            Manage Courses
          </h1>
          <p className="text-sm text-muted-foreground font-sans mt-1">
            Create, edit, and publish courses for Blih Skills.
          </p>
        </div>
        <Link href="/admin/courses/new">
          <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>
            New Course
          </Button>
        </Link>
      </div>

      {/* Errors */}
      {error && <Alert variant="error" onClose={() => setError(null)}>{error}</Alert>}
      {actionError && <Alert variant="error" onClose={() => setActionError(null)}>{actionError}</Alert>}

      {/* Loading */}
      {loading && (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => <Skeleton key={i} variant="rectangular" height={72} />)}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && courses.length === 0 && (
        <EmptyState
          icon={<GraduationCap className="w-8 h-8" />}
          title="No courses yet"
          description="Create your first course to get started."
          action={
            <Link href="/admin/courses/new">
              <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />}>Create Course</Button>
            </Link>
          }
        />
      )}

      {/* Course list */}
      {!loading && courses.length > 0 && (
        <div className="space-y-3">
          {courses.map((course) => {
            const isPublished = course.status === "PUBLISHED";
            const isActing = actionLoading === course.id;
            const lessonCount = course._count?.lessons ?? 0;
            return (
              <Card key={course.id} className="hover:border-primary/30 transition-colors p-5">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  {/* Icon + Info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-sans font-medium text-sm text-foreground truncate">{course.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant={isPublished ? "success" : "default"} size="sm">
                          {isPublished ? "Published" : "Draft"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Link href={`/admin/courses/${course.id}/edit`}>
                      <Button variant="outline" size="sm" leftIcon={<Pencil className="h-3.5 w-3.5" />}>
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant={isPublished ? "ghost" : "secondary"}
                      size="sm"
                      isLoading={isActing}
                      leftIcon={isPublished ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                      onClick={() => handlePublishToggle(course)}
                    >
                      {isPublished ? "Unpublish" : "Publish"}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Unpublish confirm dialog */}
      <ConfirmDialog
        isOpen={!!confirmCourse}
        onClose={() => setConfirmCourse(null)}
        onConfirm={async () => {
          if (confirmCourse) {
            setConfirmCourse(null);
            await doPublish(confirmCourse);
          }
        }}
        title="Unpublish Course"
        message={`"${confirmCourse?.title}" will be removed from the public catalog. Existing data is preserved. Continue?`}
        confirmText="Unpublish"
        variant="destructive"
      />
    </div>
  );
}

export default function AdminCoursesPage() {
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <CoursesContent />
    </AuthGuard>
  );
}
