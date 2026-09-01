import React from "react";
import { Pencil, Save } from "lucide-react";
import {
  Button,
  Alert,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Textarea,
} from "@blih/ui";
import type { Course } from "@/types/course";

interface CourseOverviewCardProps {
  course: Course;
  editingMeta: boolean;
  setEditingMeta: (editing: boolean) => void;
  metaTitle: string;
  setMetaTitle: (title: string) => void;
  metaDesc: string;
  setMetaDesc: (desc: string) => void;
  metaSaving: boolean;
  metaError: string | null;
  setMetaError: (error: string | null) => void;
  saveMeta: () => void;
}

export function CourseOverviewCard({
  course,
  editingMeta,
  setEditingMeta,
  metaTitle,
  setMetaTitle,
  metaDesc,
  setMetaDesc,
  metaSaving,
  metaError,
  setMetaError,
  saveMeta,
}: CourseOverviewCardProps) {
  return (
    <Card className="border border-[#D9CEDF] rounded-3xl shadow-sm bg-white overflow-hidden">
      <CardHeader className="p-6 bg-gradient-to-r from-[#EEF3FF] via-[#F7F9FF] to-white border-b border-[#D9CEDF]">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold font-display text-[#17131F]">
            Course Overview
          </CardTitle>
          {!editingMeta && (
            <button
              onClick={() => {
                setMetaTitle(course.title);
                setMetaDesc(course.description);
                setEditingMeta(true);
              }}
              className="p-2 text-[#6E6678] hover:text-[#1E5BFF] hover:bg-[#EEF3FF] rounded-xl transition-colors cursor-pointer"
              title="Edit Course Details"
            >
              <Pencil className="h-4 w-4" />
            </button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4 bg-white">
        {editingMeta ? (
          <div className="space-y-4">
            {metaError && (
              <Alert variant="error" onClose={() => setMetaError(null)}>
                {metaError}
              </Alert>
            )}
            <Input
              label="Title"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              maxLength={200}
            />
            <Textarea
              label="Description"
              value={metaDesc}
              onChange={(e) => setMetaDesc(e.target.value)}
              rows={4}
              maxLength={2000}
              placeholder="Course description..."
            />
            <div className="flex justify-end gap-2 pt-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditingMeta(false)}
                disabled={metaSaving}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="primary"
                leftIcon={<Save className="h-3.5 w-3.5" />}
                isLoading={metaSaving}
                onClick={saveMeta}
              >
                Save Details
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 font-sans">
            <div>
              <p className="text-xs font-mono text-[#6E6678] uppercase tracking-wider">
                Title
              </p>
              <p className="text-base font-bold text-[#17131F] font-display mt-0.5">
                {course.title}
              </p>
            </div>
            <div>
              <p className="text-xs font-mono text-[#6E6678] uppercase tracking-wider">
                Description
              </p>
              <p className="text-sm text-[#6E6678] mt-0.5 leading-relaxed">
                {course.description}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
