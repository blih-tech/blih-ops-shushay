"use client";

import React, { useState } from "react";
import { Button, Modal, FormField, Textarea, Alert } from "@blih/ui";
import { applyToJob } from "@/lib/jobApi";
import { getErrorMessage } from "@blih/api-client";

interface JobApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
  onSuccess?: () => void;
}

export function JobApplyModal({
  isOpen,
  onClose,
  jobId,
  jobTitle,
  onSuccess,
}: JobApplyModalProps) {
  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);

  const handleApply = async () => {
    setApplying(true);
    setApplyError(null);
    try {
      await applyToJob(jobId, coverLetter || undefined);
      setApplySuccess(true);
      onSuccess?.();
      setTimeout(() => {
        onClose();
        setApplySuccess(false);
        setCoverLetter("");
      }, 2000);
    } catch (err: unknown) {
      console.error("Error applying to job:", err);
      setApplyError(getErrorMessage(err) || "Failed to submit application");
    } finally {
      setApplying(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="space-y-5">
        <div>
          <h3 className="font-display text-xl font-bold text-[#17131F]">
            Apply for {jobTitle}
          </h3>
          <p className="text-xs text-[#6E6678] mt-1 font-sans">
            Your verified skills, completed courses, and portfolio credentials
            will be attached automatically.
          </p>
        </div>

        {applySuccess ? (
          <Alert variant="success" title="Application Submitted">
            Your application has been submitted successfully!
          </Alert>
        ) : (
          <>
            {applyError && (
              <Alert variant="error" title="Submission Error">
                {applyError}
              </Alert>
            )}

            <FormField label="Note / Cover Letter (Optional)">
              <Textarea
                rows={4}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Introduce yourself and highlight why your background is an ideal fit..."
                maxLength={1500}
                showCharCount
              />
            </FormField>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                disabled={applying}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleApply}
                disabled={applying}
              >
                {applying ? "Submitting..." : "Confirm & Submit Application"}
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
