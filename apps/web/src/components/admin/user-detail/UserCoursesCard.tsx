"use client";

import React from "react";
import { GraduationCap, Plus, BookOpen, Calendar } from "lucide-react";
import { Badge, Button, Select } from "@blih/ui";
import type { Course } from "@/types/course";

interface UserCoursesCardProps {
  enrollments: any[];
  availableCourses: Course[];
  selectedCourseId: string;
  onSelectCourse: (courseId: string) => void;
  onGrantAccess: () => void;
  onRevokeAccess: (courseId: string) => void;
  actionLoading: boolean;
  revokingCourseId: string | null;
}

export function UserCoursesCard({
  enrollments,
  availableCourses,
  selectedCourseId,
  onSelectCourse,
  onGrantAccess,
  onRevokeAccess,
  actionLoading,
  revokingCourseId,
}: UserCoursesCardProps) {
  const courseOptions = availableCourses.map((c) => ({
    value: c.id,
    label: c.title,
  }));

  return (
    <div className="bg-white rounded-2xl border border-[#EBE5F0] shadow-xs overflow-hidden">
      <div className="px-6 py-4.5 border-b border-[#EBE5F0] bg-[#FDFCFD] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[#7B2CBF]/10 text-[#7B2CBF]">
            <GraduationCap className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-display font-bold text-sm text-[#17131F]">
              Curriculum & Skills Access
            </h2>
            <p className="text-xs text-[#6E6678]">
              Direct course access permissions for this user
            </p>
          </div>
        </div>
        <Badge variant="outline">{enrollments.length} Granted</Badge>
      </div>

      <div className="p-6 space-y-5">
        {availableCourses.length > 0 && (
          <div className="p-4 rounded-xl bg-[#F9F8FC] border border-[#EBE5F0] flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex-1">
              <Select
                options={courseOptions}
                value={selectedCourseId}
                onChange={(e) => onSelectCourse(e.target.value)}
                placeholder="Choose a course to grant..."
                size="md"
              />
            </div>
            <div className="sm:self-stretch flex items-center">
              <Button
                size="md"
                variant="primary"
                onClick={onGrantAccess}
                isLoading={actionLoading}
                leftIcon={<Plus className="h-3.5 w-3.5" />}
                className="w-full sm:w-auto"
              >
                Grant Access
              </Button>
            </div>
          </div>
        )}

        {enrollments.length > 0 ? (
          <div className="space-y-2.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#9E95A8]">
              Active Course Entitlements
            </div>
            <div className="divide-y divide-[#F4EFF7] border border-[#EBE5F0] rounded-xl overflow-hidden">
              {enrollments.map((enr) => (
                <div
                  key={enr.courseId}
                  className="px-4 py-3.5 bg-white flex items-center justify-between gap-4 hover:bg-[#FDFCFD] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-[#2E8F79]/10 text-[#2E8F79] flex items-center justify-center shrink-0">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-[#17131F] truncate">
                        {enr.course?.title || `Course ID: ${enr.courseId}`}
                      </div>
                      <div className="text-xs text-[#6E6678] flex items-center gap-1.5 mt-0.5">
                        <Calendar className="h-3 w-3 shrink-0" />
                        Granted on{" "}
                        {new Date(enr.grantedAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onRevokeAccess(enr.courseId)}
                    isLoading={revokingCourseId === enr.courseId}
                    className="shrink-0 text-xs text-[#D32F2F] hover:bg-red-50 border-red-200"
                  >
                    Revoke
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 px-4 rounded-xl border border-dashed border-[#D9CEDF] bg-[#FCFBFE]">
            <BookOpen className="h-8 w-8 text-[#9E95A8] mx-auto mb-2 opacity-60" />
            <p className="text-sm font-medium text-[#17131F]">
              No course entitlements granted
            </p>
            <p className="text-xs text-[#6E6678] mt-1 max-w-sm mx-auto">
              This user currently does not have any manual or direct course enrollments.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
