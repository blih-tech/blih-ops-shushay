"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button, Skeleton, Alert } from "@blih/ui";
import { useAuth } from "@/providers/AuthProvider";
import { fetchPublicCourse } from "@/lib/courses";
import {
  getSkillsAccessStatus,
  initializeSkillsPayment,
  getCourseProgress,
} from "@blih/api-client";
import { CourseDetailHero } from "@/components/courses/CourseDetailHero";
import { CourseDetailSidebar } from "@/components/courses/CourseDetailSidebar";
import type { PublicCourse } from "@/types/course";

export default function PublicCourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const { user } = useAuth();
  const [course, setCourse] = useState<PublicCourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [progressPercentage, setProgressPercentage] = useState<number>(0);
  const [initiatingPayment, setInitiatingPayment] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const courseData = await fetchPublicCourse(courseId);
        if (isMounted) setCourse(courseData);

        if (user) {
          try {
            const accessRes = await getSkillsAccessStatus();
            if (isMounted) setHasAccess(accessRes.hasAccess);
            if (accessRes.hasAccess) {
              try {
                const prog = await getCourseProgress(courseId);
                if (isMounted && prog) {
                  setProgressPercentage(prog.progressPercentage ?? 0);
                  setIsCompleted(prog.isCompleted ?? false);
                }
              } catch {
                // Ignore progress fetch error on detail page
              }
            }
          } catch {
            if (isMounted) setHasAccess(false);
          }
        }
      } catch (err: any) {
        if (isMounted) setError(err.message ?? "Course not found");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [courseId, user]);

  const handleUnlockClick = async () => {
    if (!user) {
      router.push(
        `/login?returnTo=${encodeURIComponent(window.location.pathname)}`,
      );
      return;
    }

    try {
      setInitiatingPayment(true);
      setPaymentError(null);
      const res = await initializeSkillsPayment();
      if (res.alreadyHasAccess) {
        setHasAccess(true);
      } else if (res.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      }
    } catch (err: any) {
      setPaymentError(err.message || "Failed to initialize payment checkout");
    } finally {
      setInitiatingPayment(false);
    }
  };

  if (loading) {
    return (
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Skeleton
          variant="rectangular"
          height={32}
          className="w-48 rounded-xl"
        />
        <Skeleton variant="rectangular" height={260} className="rounded-3xl" />
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={64}
              className="rounded-2xl"
            />
          ))}
        </div>
      </main>
    );
  }

  if (error || !course) {
    return (
      <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-6">
        <Link href="/courses">
          <Button variant="ghost" leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back to Catalog
          </Button>
        </Link>
        <Alert variant="error">{error ?? "Course not found"}</Alert>
      </main>
    );
  }

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      <Link href="/courses" className="inline-block">
        <Button
          variant="ghost"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          size="sm"
        >
          Back to Course Catalog
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <CourseDetailHero course={course} />
        <CourseDetailSidebar
          courseId={courseId}
          hasAccess={hasAccess}
          isAuthenticated={!!user}
          isCompleted={isCompleted}
          progressPercentage={progressPercentage}
          initiatingPayment={initiatingPayment}
          paymentError={paymentError}
          onUnlockClick={handleUnlockClick}
        />
      </div>
    </main>
  );
}
