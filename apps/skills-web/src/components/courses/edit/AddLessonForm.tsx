"use client";

import React from "react";
import { Button, Badge, Alert, Input } from "@blih/ui";

interface AddLessonFormProps {
  stepNumber: number;
  newLessonTitle: string;
  setNewLessonTitle: (title: string) => void;
  addingLessonLoading: boolean;
  addLessonError: string | null;
  setAddLessonError: (err: string | null) => void;
  onCancel: () => void;
  onAdd: () => void;
}

export function AddLessonForm({
  stepNumber,
  newLessonTitle,
  setNewLessonTitle,
  addingLessonLoading,
  addLessonError,
  setAddLessonError,
  onCancel,
  onAdd,
}: AddLessonFormProps) {
  return (
    <div className="border-2 border-[#1E5BFF] bg-[#EEF3FF]/40 rounded-3xl p-6 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h4 className="font-display font-bold text-lg text-[#17131F]">
          New Lesson Module
        </h4>
        <Badge variant="primary" size="sm">
          STEP {stepNumber}
        </Badge>
      </div>
      {addLessonError && (
        <Alert variant="error" onClose={() => setAddLessonError(null)}>
          {addLessonError}
        </Alert>
      )}
      <Input
        label="Module Title"
        value={newLessonTitle}
        onChange={(e) => setNewLessonTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onAdd();
          if (e.key === "Escape") onCancel();
        }}
        placeholder="e.g. Chapter 1: Core Architecture & Setup"
        autoFocus
      />
      <div className="flex justify-end gap-2 pt-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={onCancel}
          disabled={addingLessonLoading}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          variant="primary"
          isLoading={addingLessonLoading}
          onClick={onAdd}
        >
          Create Lesson
        </Button>
      </div>
    </div>
  );
}
