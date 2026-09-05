'use client'

import React, { useState } from "react";
import { FileCheck, Plus, Pencil, Save } from "lucide-react";
import { Button, Alert, Input, Textarea } from "@blih/ui";
import { upsertAssignment } from "@/lib/courses";
import type { Lesson } from "@/types/course";
import { SectionCard } from "./SectionCard";

interface AssignmentSectionProps {
  courseId: string;
  lesson: Lesson;
  onUpdate: (l: Lesson) => void;
}

export function AssignmentSection({
  courseId,
  lesson,
  onUpdate,
}: AssignmentSectionProps) {
  const existing = lesson.assignment;
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(existing?.title ?? "");
  const [instructions, setInstructions] = useState(
    existing?.instructions ?? "",
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const assignment = await upsertAssignment(courseId, lesson.id, {
        title,
        instructions,
      });
      onUpdate({ ...lesson, assignment });
      setEditing(false);
    } catch (e: any) {
      setError(e.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (!editing && !existing) {
    return (
      <SectionCard
        title="Practical Assignment"
        icon={<FileCheck className="h-4 w-4" />}
      >
        <div className="flex items-center justify-between">
          <p className="text-xs font-mono text-[#6E6678]">
            No practical assignment assigned.
          </p>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Plus className="h-3.5 w-3.5" />}
            onClick={() => setEditing(true)}
          >
            Add Assignment
          </Button>
        </div>
      </SectionCard>
    );
  }

  if (!editing && existing) {
    return (
      <SectionCard
        title="Practical Assignment"
        icon={<FileCheck className="h-4 w-4" />}
      >
        <div className="flex items-start justify-between gap-3 p-3.5 bg-[#EEF3FF]/40 border border-[#D9CEDF] rounded-xl">
          <div className="min-w-0">
            <p className="text-sm font-bold text-[#17131F] font-display">
              {existing.title}
            </p>
            <p className="text-xs text-[#6E6678] font-sans line-clamp-2 mt-0.5">
              {existing.instructions}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Pencil className="h-3.5 w-3.5" />}
            onClick={() => {
              setTitle(existing.title);
              setInstructions(existing.instructions);
              setEditing(true);
            }}
          >
            Edit
          </Button>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Practical Assignment Brief"
      icon={<FileCheck className="h-4 w-4" />}
    >
      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      <Input
        label="Assignment Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. Real-World Case Study"
      />
      <Textarea
        label="Instructions & Deliverables"
        value={instructions}
        onChange={(e) => setInstructions(e.target.value)}
        rows={4}
        placeholder="Specify instructions, rubric requirements, and submission links..."
      />
      <div className="flex justify-end gap-2 pt-1">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setEditing(false)}
          disabled={saving}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          variant="primary"
          leftIcon={<Save className="h-3.5 w-3.5" />}
          isLoading={saving}
          onClick={save}
        >
          Save Assignment
        </Button>
      </div>
    </SectionCard>
  );
}
