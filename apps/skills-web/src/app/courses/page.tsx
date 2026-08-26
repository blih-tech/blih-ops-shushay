"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronRight, GraduationCap, ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Badge, Skeleton, Alert, EmptyState } from "@/components/ui";
import { fetchPublicCourses } from "@/lib/courses";
import type { PublicCourseListItem } from "@/types/course";
import { useAuth } from "@/providers/AuthProvider";

function CourseCardSkeleton() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="p-6">
        <Skeleton variant="rectangular" height={20} className="w-3/4 mb-2" />
        <Skeleton variant="text" className="w-full" />
        <Skeleton variant="text" className="w-5/6" />
      </CardHeader>
      <CardContent className="p-6 pt-0 flex-1" />
      <div className="p-6 pt-0">
        <Skeleton variant="rectangular" height={40} className="w-full" />
      </div>
    </Card>
  );
}

function CourseCard({ course }: { course: PublicCourseListItem }) {
  const lessonCount = course._count.lessons;
  return (
    <Card className="flex flex-col hover:border-primary/50 hover:shadow-md transition-all duration-300 group">
      <CardHeader className="p-6">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary/15 transition-colors">
            <BookOpen className="h-5 w-5" />
          </div>
          <Badge variant="secondary" size="sm">
            {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
          </Badge>
        </div>
        <CardTitle className="text-lg leading-snug">{course.title}</CardTitle>
        <CardDescription className="line-clamp-3">{course.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-6 pt-0 flex-1" />
      <CardFooter className="p-6 pt-0">
        <Link href={`/courses/${course.id}`} className="w-full">
          <Button variant="outline" fullWidth rightIcon={<ChevronRight className="h-4 w-4" />}>
            View Course
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function CourseCatalogPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<PublicCourseListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPublicCourses()
      .then(setCourses)
      .catch((err) => setError(err.message ?? "Failed to load courses"))
      .finally(() => setLoading(false));
  }, []);

  const homePath = user
    ? user.role === "ADMIN"
      ? "/admin"
      : "/dashboard"
    : "/";
  const homeLabel = user
    ? user.role === "ADMIN"
      ? "Back to Admin Portal"
      : "Back to Dashboard"
    : "Back to Home";

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link href={homePath}>
        <Button variant="ghost" leftIcon={<ArrowLeft className="h-4 w-4" />} size="sm">
          {homeLabel}
        </Button>
      </Link>

      {/* Page Header */}
      <div className="pb-6 border-b border-border">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground mb-1">
          Course Catalog
        </h1>
        <p className="text-sm text-muted-foreground font-sans">
          Expert-led courses to prepare you for remote work.
        </p>
      </div>

      {/* Error */}
      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => <CourseCardSkeleton key={i} />)}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && courses.length === 0 && (
        <EmptyState
          icon={<GraduationCap className="w-8 h-8" />}
          title="No courses yet"
          description="Check back soon — new courses are on their way."
        />
      )}

      {/* Course grid */}
      {!loading && courses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
