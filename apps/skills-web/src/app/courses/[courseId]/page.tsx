"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft, BookOpen, Video, FileText, HelpCircle, ClipboardList,
  ChevronDown, ChevronUp
} from "lucide-react";
import {
  Button, Badge, Alert, Skeleton, Card, CardHeader, CardTitle, CardDescription, CardContent
} from "@/components/ui";
import { fetchPublicCourse } from "@/lib/courses";
import type { PublicCourse, PublicLesson } from "@/types/course";

function LessonRow({ lesson, index }: { lesson: PublicLesson; index: number }) {
  const [open, setOpen] = useState(false);
  const hasVideo = !!lesson.videoUrl;
  const docCount = lesson.documents.length;
  const hasQuiz = !!lesson.quiz;
  const hasAssignment = !!lesson.assignment;

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors text-left"
      >
        <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-mono font-semibold flex items-center justify-center shrink-0">
          {index + 1}
        </span>
        <span className="flex-1 font-sans font-medium text-sm text-foreground">{lesson.title}</span>
        <div className="flex items-center gap-1.5 shrink-0">
          {hasVideo && <span title="Video"><Video className="h-3.5 w-3.5 text-muted-foreground" /></span>}
          {docCount > 0 && <span title="Documents"><FileText className="h-3.5 w-3.5 text-muted-foreground" /></span>}
          {hasQuiz && <span title="Quiz"><HelpCircle className="h-3.5 w-3.5 text-muted-foreground" /></span>}
          {hasAssignment && <span title="Assignment"><ClipboardList className="h-3.5 w-3.5 text-muted-foreground" /></span>}
          {open ? <ChevronUp className="h-4 w-4 text-muted-foreground ml-1" /> : <ChevronDown className="h-4 w-4 text-muted-foreground ml-1" />}
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-1 border-t border-border bg-muted/30 space-y-2">
          <div className="flex flex-wrap gap-2">
            {hasVideo && <Badge variant="primary" size="sm">Video</Badge>}
            {docCount > 0 && <Badge variant="secondary" size="sm">{docCount} Document{docCount > 1 ? "s" : ""}</Badge>}
            {hasQuiz && <Badge variant="success" size="sm">Quiz: {lesson.quiz!.title}</Badge>}
            {hasAssignment && <Badge variant="warning" size="sm">Assignment: {lesson.assignment!.title}</Badge>}
            {!hasVideo && docCount === 0 && !hasQuiz && !hasAssignment && (
              <span className="text-xs text-muted-foreground font-sans">Written content</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PublicCourseDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const [course, setCourse] = useState<PublicCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPublicCourse(courseId)
      .then(setCourse)
      .catch((err) => setError(err.message ?? "Course not found"))
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <Skeleton variant="rectangular" height={32} className="w-1/2" />
        <Skeleton variant="rectangular" height={120} />
        <div className="space-y-3">
          {[0, 1, 2].map((i) => <Skeleton key={i} variant="rectangular" height={56} />)}
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <Link href="/courses"><Button variant="ghost" leftIcon={<ArrowLeft className="h-4 w-4" />}>Back to Courses</Button></Link>
        <Alert variant="error">{error ?? "Course not found"}</Alert>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <Link href="/courses">
        <Button variant="ghost" leftIcon={<ArrowLeft className="h-4 w-4" />} size="sm">Back to Courses</Button>
      </Link>
      <Card>
        <CardHeader className="p-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <BookOpen className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-2xl leading-tight">{course.title}</CardTitle>
              <Badge variant="secondary" size="sm" className="mt-1">
                {course.lessons.length} {course.lessons.length === 1 ? "lesson" : "lessons"}
              </Badge>
            </div>
          </div>
          <CardDescription className="text-sm leading-relaxed">{course.description}</CardDescription>
        </CardHeader>
      </Card>
      {course.lessons.length > 0 ? (
        <div className="space-y-4">
          <h2 className="font-serif text-xl font-semibold text-foreground">Course Content</h2>
          <div className="space-y-2">
            {course.lessons.map((lesson, index) => (
              <LessonRow key={lesson.id} lesson={lesson} index={index} />
            ))}
          </div>
        </div>
      ) : (
        <Card variant="muted">
          <CardContent className="p-8 text-center">
            <p className="text-sm text-muted-foreground font-sans">No lessons available yet.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}