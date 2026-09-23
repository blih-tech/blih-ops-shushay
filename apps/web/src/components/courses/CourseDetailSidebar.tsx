"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Play, CheckCircle2, RotateCcw, Lock } from "lucide-react";
import { Button, Badge, Alert } from "@blih/ui";

interface CourseDetailSidebarProps {
  courseId: string;
  courseTitle: string;
  hasAccess: boolean;
  isAuthenticated?: boolean;
  isCompleted?: boolean;
  progressPercentage?: number;
  initiatingPayment: boolean;
  paymentError: string | null;
  onUnlockClick: () => void;
}

export function CourseDetailSidebar({
  courseId,
  courseTitle,
  hasAccess,
  isAuthenticated = false,
  isCompleted = false,
  progressPercentage = 0,
  initiatingPayment,
  paymentError,
  onUnlockClick,
}: CourseDetailSidebarProps) {
  const isInProgress = progressPercentage > 0 && !isCompleted;

  return (
    <div className="lg:col-span-4 space-y-6 sticky top-24">
      <div className="bg-white border border-[#D9CEDF] rounded-3xl p-6 sm:p-8 shadow-[0_12px_40px_rgba(30,91,255,0.06)] space-y-6">
        {hasAccess ? (
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-wider text-[#6E6678]">
              Your Access Status
            </span>
            <div className="flex items-center gap-2 pt-1">
              <Badge
                variant={
                  isCompleted
                    ? "verified"
                    : isInProgress
                      ? "primary"
                      : "secondary"
                }
                size="md"
                className="text-sm font-semibold"
              >
                {isCompleted
                  ? "Track Completed (100%)"
                  : isInProgress
                    ? `In Progress (${progressPercentage}%)`
                    : "Enrolled — Full Access"}
              </Badge>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-wider text-[#6E6678]">
              Course Access
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-[#17131F]">
                1,000 ETB
              </span>
              <span className="font-mono text-xs text-[#6E6678]">
                · This course only
              </span>
            </div>
            <p className="text-xs text-[#6E6678] pt-1">
              One-time payment for full access to{" "}
              <strong className="text-[#17131F]">{courseTitle}</strong>.
            </p>
          </div>
        )}

        {paymentError && (
          <Alert variant="error" className="text-xs text-left">
            {paymentError}
          </Alert>
        )}

        <div className="space-y-3 pt-2">
          {hasAccess ? (
            <Link href={`/courses/${courseId}/learn`} className="block">
              <Button
                size="lg"
                fullWidth
                variant={isCompleted ? "secondary" : "primary"}
                leftIcon={
                  isCompleted ? (
                    <RotateCcw className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 fill-current" />
                  )
                }
              >
                {isCompleted
                  ? "Review Course"
                  : isInProgress
                    ? `Continue Learning (${progressPercentage}%)`
                    : "Start Learning Now"}
              </Button>
            </Link>
          ) : (
            <Button
              size="lg"
              fullWidth
              variant="primary"
              onClick={onUnlockClick}
              isLoading={initiatingPayment}
              leftIcon={
                isAuthenticated ? (
                  <ShieldCheck className="w-5 h-5" />
                ) : (
                  <Lock className="w-5 h-5" />
                )
              }
            >
              {isAuthenticated
                ? "Unlock This Course (1,000 ETB)"
                : "Sign In to Unlock (1,000 ETB)"}
            </Button>
          )}

          <p className="text-[11px] font-mono text-center text-[#6E6678]">
            {isAuthenticated
              ? "Instant server-side verification via Chapa payment gateway"
              : "Sign in or register to unlock course content and track progress"}
          </p>
        </div>

        <div className="pt-4 border-t border-[#D9CEDF] space-y-3">
          <span className="font-mono text-xs font-bold text-[#17131F] block uppercase tracking-wider">
            What is Included:
          </span>
          <ul className="space-y-2.5 text-xs text-[#4E4656]">
            {[
              "Full access to this course",
              "Interactive quizzes and test suites",
              "Digital verified credential on completion",
              "Self-paced with progress tracking",
            ].map((item, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2E8F79] shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
