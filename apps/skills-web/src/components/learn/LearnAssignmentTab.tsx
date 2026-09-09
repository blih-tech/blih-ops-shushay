"use client";

import React from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button, Badge, Textarea } from "@blih/ui";
import type { PublicLesson } from "@/types/course";

interface LearnAssignmentTabProps {
  activeLesson: PublicLesson;
  assignmentContent: string;
  setAssignmentContent: (content: string) => void;
  assignmentFile: File | null;
  setAssignmentFile: (file: File | null) => void;
  assignmentSubmitted: boolean;
  assignmentError: string | null;
  onSubmitAssignment: () => void;
  isSubmittingAssignment: boolean;
}

export function LearnAssignmentTab({
  activeLesson,
  assignmentContent,
  setAssignmentContent,
  assignmentFile,
  setAssignmentFile,
  assignmentSubmitted,
  assignmentError,
  onSubmitAssignment,
  isSubmittingAssignment,
}: LearnAssignmentTabProps) {
  const hasAssignment = !!activeLesson.assignment;

  return (
    <div className="bg-white border border-[#D9CEDF] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#D9CEDF] pb-4">
        <h3 className="font-display text-xl font-bold text-[#17131F]">
          {activeLesson.assignment?.title ?? "Assignment Submission"}
        </h3>
        <Badge variant="secondary" size="sm">
          Practical Task
        </Badge>
      </div>

      {!hasAssignment ? (
        <p className="text-sm text-[#6E6678]">No assignment for this lesson.</p>
      ) : assignmentSubmitted ? (
        <div className="bg-[#E6F5F0] border border-[#B0E8CA] rounded-2xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-[#2E8F79]">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-display font-bold text-sm">
              Assignment Submitted!
            </span>
          </div>
          <p className="font-sans text-xs text-[#2E8F79]">
            Your submission has been recorded. This lesson is now marked as complete.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {(activeLesson.assignment as any)?.instructions && (
            <div className="bg-[#F8F6FA] border border-[#E8E1EE] rounded-2xl p-4">
              <p className="text-sm text-[#17131F] leading-relaxed whitespace-pre-wrap">
                {(activeLesson.assignment as any).instructions}
              </p>
            </div>
          )}

          <Textarea
            label="Your Response"
            value={assignmentContent}
            onChange={(e) => setAssignmentContent(e.target.value)}
            placeholder="Write your response here..."
            rows={5}
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#17131F]">
              Or upload a file (PDF, DOCX, ZIP, etc.)
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.zip,.txt,.md"
              onChange={(e) => setAssignmentFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-[#6E6678] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#EEF3FF] file:text-[#1E5BFF] hover:file:bg-[#DDE7FF] cursor-pointer"
            />
            {assignmentFile && (
              <p className="text-xs text-[#6E6678]">
                Selected: {assignmentFile.name}
              </p>
            )}
          </div>

          {assignmentError && (
            <div className="flex items-center gap-2 text-[#EF4444] text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{assignmentError}</span>
            </div>
          )}

          <Button
            variant="primary"
            size="md"
            onClick={onSubmitAssignment}
            disabled={isSubmittingAssignment || (!assignmentContent && !assignmentFile)}
            leftIcon={isSubmittingAssignment ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
          >
            {isSubmittingAssignment ? "Submitting..." : "Submit Assignment"}
          </Button>
        </div>
      )}
    </div>
  );
}
