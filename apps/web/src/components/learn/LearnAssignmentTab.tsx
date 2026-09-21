"use client";

import React from "react";
import { CheckCircle2, AlertCircle, Loader2, Code, UploadCloud, FileCheck } from "lucide-react";
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
      <div className="flex items-center justify-between border-b border-[#D9CEDF] pb-4 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200 shrink-0">
            <Code className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-[#17131F]">
              {activeLesson.assignment?.title ?? "Practical Assessment Task"}
            </h3>
            <p className="font-mono text-xs text-[#6E6678]">
              Hands-on exercise & capability verification
            </p>
          </div>
        </div>

        <Badge variant="secondary" size="sm">
          Practical Task
        </Badge>
      </div>

      {!hasAssignment ? (
        <p className="text-sm text-[#6E6678]">No assignment configured for this step.</p>
      ) : assignmentSubmitted ? (
        <div className="bg-gradient-to-br from-[#E6F5F0] to-white border border-[#B0E8CA] rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xs">
          <div className="w-16 h-16 rounded-full bg-[#00A859] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#00A859]/20">
            <FileCheck className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="font-display text-2xl font-extrabold text-[#00A859]">
              Assignment Successfully Submitted!
            </h4>
            <p className="font-sans text-sm text-[#6E6678] max-w-md mx-auto">
              Your submission has been verified and recorded. This practical step requirement is marked complete.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {(activeLesson.assignment as any)?.instructions && (
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 space-y-2">
              <h4 className="font-mono text-xs font-bold text-[#1E5BFF] uppercase tracking-wider">
                Task Instructions
              </h4>
              <p className="text-sm text-[#17131F] leading-relaxed whitespace-pre-wrap font-sans">
                {(activeLesson.assignment as any).instructions}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Textarea
              label="Your Solution Description / Notes"
              value={assignmentContent}
              onChange={(e) => setAssignmentContent(e.target.value)}
              placeholder="Explain your approach, paste links, or write notes..."
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#17131F]">
              Upload Solution File (PDF, ZIP, CODE, DOCX)
            </label>
            <div className="relative border-2 border-dashed border-[#D9CEDF] hover:border-[#1E5BFF] rounded-2xl p-6 text-center transition-colors bg-[#F8FAFC]">
              <UploadCloud className="w-8 h-8 text-[#1E5BFF] mx-auto mb-2" />
              <input
                type="file"
                accept=".pdf,.doc,.docx,.zip,.txt,.md,.js,.ts,.py"
                onChange={(e) => setAssignmentFile(e.target.files?.[0] ?? null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <p className="text-sm font-medium text-[#17131F]">
                {assignmentFile ? (
                  <span className="text-[#1E5BFF] font-semibold">
                    Selected: {assignmentFile.name}
                  </span>
                ) : (
                  "Click or drag file to attach solution"
                )}
              </p>
              <p className="text-xs text-[#6E6678] mt-1 font-mono">
                Supported: .zip, .pdf, .docx, .ts, .py (Max 25MB)
              </p>
            </div>
          </div>

          {assignmentError && (
            <div className="flex items-center gap-2 text-[#EF4444] text-xs font-medium bg-[#FFF0F0] p-3 rounded-xl border border-[#FFC5C5]">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{assignmentError}</span>
            </div>
          )}

          <Button
            variant="primary"
            size="lg"
            className="w-full sm:w-auto px-8"
            onClick={onSubmitAssignment}
            disabled={
              isSubmittingAssignment || (!assignmentContent && !assignmentFile)
            }
            leftIcon={
              isSubmittingAssignment ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : undefined
            }
          >
            {isSubmittingAssignment ? "Submitting Task..." : "Submit Assignment Solution"}
          </Button>
        </div>
      )}
    </div>
  );
}
