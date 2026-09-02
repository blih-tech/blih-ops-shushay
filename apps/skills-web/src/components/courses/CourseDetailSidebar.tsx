"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Play, CheckCircle2 } from "lucide-react";
import { Button, Badge, Alert } from "@blih/ui";

interface CourseDetailSidebarProps {
  courseId: string;
  hasAccess: boolean;
  initiatingPayment: boolean;
  paymentError: string | null;
  onUnlockClick: () => void;
}

export function CourseDetailSidebar({
  courseId,
  hasAccess,
  initiatingPayment,
  paymentError,
  onUnlockClick,
}: CourseDetailSidebarProps) {
  return (
    <div className="lg:col-span-4 space-y-6 sticky top-24">
      <div className="bg-white border border-[#D9CEDF] rounded-3xl p-6 sm:p-8 shadow-[0_12px_40px_rgba(30,91,255,0.06)] space-y-6">
        {hasAccess ? (
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-wider text-[#6E6678]">
              Your Access Status
            </span>
            <div className="flex items-center gap-2 pt-1">
              <Badge variant="verified" size="md" className="text-sm font-semibold">
                Full Access Granted
              </Badge>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-wider text-[#6E6678]">
              Blih Skills Access
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl font-bold text-[#17131F]">
                1,000 ETB
              </span>
              <span className="font-mono text-xs text-[#6E6678]">
                One-time payment
              </span>
            </div>
            <p className="text-xs text-[#6E6678] pt-1">
              Unlocks permanent access to all current and future Blih Skills courses.
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
                leftIcon={<Play className="w-4 h-4 fill-current" />}
              >
                Start Learning Now
              </Button>
            </Link>
          ) : (
            <Button
              size="lg"
              fullWidth
              variant="primary"
              onClick={onUnlockClick}
              isLoading={initiatingPayment}
              leftIcon={<ShieldCheck className="w-5 h-5" />}
            >
              Unlock All Courses (1,000 ETB)
            </Button>
          )}

          <p className="text-[11px] font-mono text-center text-[#6E6678]">
            Instant server-side verification via Chapa payment gateway
          </p>
        </div>

        <div className="pt-4 border-t border-[#D9CEDF] space-y-3">
          <span className="font-mono text-xs font-bold text-[#17131F] block uppercase tracking-wider">
            What is Included:
          </span>
          <ul className="space-y-2.5 text-xs text-[#4E4656]">
            {[
              "Permanent access to all Blih Skills tracks",
              "Interactive quizzes and test suites",
              "Digital verified credential on completion",
              "Self-paced with progress tracking",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00A859] shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
