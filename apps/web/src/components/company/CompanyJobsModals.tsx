"use client";

import React from "react";
import { ConfirmDialog } from "@blih/ui";

interface CompanyJobsModalsProps {
  jobToClose: string | null;
  isClosing: boolean;
  onCloseCancel: () => void;
  onCloseConfirm: () => void;
  jobToReopen: string | null;
  isReopening: boolean;
  onReopenCancel: () => void;
  onReopenConfirm: () => void;
}

export function CompanyJobsModals({
  jobToClose,
  isClosing,
  onCloseCancel,
  onCloseConfirm,
  jobToReopen,
  isReopening,
  onReopenCancel,
  onReopenConfirm,
}: CompanyJobsModalsProps) {
  return (
    <>
      <ConfirmDialog
        isOpen={Boolean(jobToClose)}
        onClose={onCloseCancel}
        onConfirm={onCloseConfirm}
        title="Close Job Post"
        message="Are you sure you want to close this job post? Once closed, this role will no longer accept new applications or allow edits."
        confirmText="Yes, Close Role"
        cancelText="Keep Active"
        variant="destructive"
        isLoading={isClosing}
      />

      <ConfirmDialog
        isOpen={Boolean(jobToReopen)}
        onClose={onReopenCancel}
        onConfirm={onReopenConfirm}
        title="Reopen Job Listing"
        message="Are you sure you want to reopen this job listing? It will become active again with a new 30-day application deadline."
        confirmText="Yes, Reopen Role"
        cancelText="Cancel"
        isLoading={isReopening}
      />
    </>
  );
}
