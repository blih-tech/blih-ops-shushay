import React, { useRef, useEffect } from "react";
import { Eye, EyeOff, CheckCircle, Plus, BookOpen, Layers, Save, X } from "lucide-react";

import { Button, Badge, Alert, ConfirmDialog, Input, Textarea } from "@blih/ui";
import { useAuth } from "@/providers/AuthProvider";
import { LessonPanel } from "./LessonPanel";
import { CourseOverviewCard } from "./CourseOverviewCard";
import { CurriculumMetricsCard } from "./CurriculumMetricsCard";
import { AddLessonForm } from "./AddLessonForm";
import { useEditCourse } from "@/hooks/useEditCourse";
import { EditCourseSkeleton } from "./EditCourseSkeleton";

interface EditCourseContentProps {
  courseId: string;
}

export function EditCourseContent({ courseId }: EditCourseContentProps) {
  const { user, logout } = useAuth();
  const {
    course,
    lessons,
    loading,
    loadError,
    editingMeta,
    setEditingMeta,
    metaTitle,
    setMetaTitle,
    metaDesc,
    setMetaDesc,
    metaSaving,
    metaError,
    setMetaError,
    publishLoading,
    publishError,
    setPublishError,
    confirmUnpublish,
    setConfirmUnpublish,
    addingLesson,
    setAddingLesson,
    newLessonTitle,
    setNewLessonTitle,
    addingLessonLoading,
    addLessonError,
    setAddLessonError,
    setLessons,
    saveMeta,
    handlePublish,
    doUnpublish,
    handleAddLesson,
    handleDeleteLesson,
    handleMove,
  } = useEditCourse(courseId);

  const metaFormRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editingMeta && metaFormRef.current) {
      metaFormRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [editingMeta]);

  if (loading) {
    return <EditCourseSkeleton user={user} onSignOut={logout} />;
  }

  if (loadError || !course) {
    return (
      <main className="w-full px-6 py-6 space-y-4 flex-1">
        <Alert variant="error">{loadError ?? "Course not found"}</Alert>
      </main>
    );
  }

  const isPublished = course.status === "PUBLISHED";

  return (
    <>
      <main className="w-full px-6 py-6 space-y-8 flex-1">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#D9CEDF]">
          <div className="space-y-1.5">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-display text-2xl font-bold tracking-tight text-[#17131F]">
                {course.title}
              </h1>
              <Badge variant={isPublished ? "verified" : "secondary"}>
                {isPublished ? "PUBLISHED" : "DRAFT"}
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-[#6E6678] mt-1">
              Manage curriculum structure, video lectures, assessments, and
              learning resources.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto self-start lg:self-center">
            <Button
              size="sm"
              variant={isPublished ? "outline" : "secondary"}
              className="w-full sm:w-auto"
              leftIcon={
                isPublished ? (
                  <EyeOff className="h-3.5 w-3.5 text-[#D97706]" />
                ) : (
                  <CheckCircle className="h-3.5 w-3.5 text-[#2E8F79]" />
                )
              }
              isLoading={publishLoading}
              onClick={handlePublish}
            >
              {isPublished ? "Unpublish Course" : "Publish Course"}
            </Button>
          </div>
        </div>

        {publishError && (
          <Alert variant="error" onClose={() => setPublishError(null)}>
            {publishError}
          </Alert>
        )}
        {loadError && (
          <Alert variant="error" onClose={() => setPublishError(null)}>
            {loadError}
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center shrink-0">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold text-[#17131F]">
                    Course Curriculum
                  </h2>
                  <p className="text-xs font-mono text-[#6E6678]">
                    {lessons.length} Modules in sequence
                  </p>
                </div>
              </div>
              {!addingLesson && (
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full sm:w-auto"
                  leftIcon={<Plus className="h-4 w-4" />}
                  onClick={() => setAddingLesson(true)}
                >
                  Add Lesson
                </Button>
              )}
            </div>

            {addingLesson && (
              <AddLessonForm
                stepNumber={lessons.length + 1}
                newLessonTitle={newLessonTitle}
                setNewLessonTitle={setNewLessonTitle}
                addingLessonLoading={addingLessonLoading}
                addLessonError={addLessonError}
                setAddLessonError={setAddLessonError}
                onCancel={() => {
                  setAddingLesson(false);
                  setNewLessonTitle("");
                }}
                onAdd={handleAddLesson}
              />
            )}

            {lessons.length === 0 && !addingLesson && (
              <div className="border-2 border-dashed border-[#D9CEDF] rounded-3xl p-12 text-center bg-white space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center mx-auto shadow-xs">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-[#17131F]">
                  No curriculum modules yet
                </h3>
                <p className="text-sm text-[#6E6678] font-sans max-w-sm mx-auto">
                  Click &quot;Add Lesson&quot; to begin building chapters, video
                  lectures, and quizzes for this course.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Plus className="h-4 w-4" />}
                  onClick={() => setAddingLesson(true)}
                >
                  Add First Lesson
                </Button>
              </div>
            )}

            <div className="space-y-4">
              {lessons.map((lesson, index) => (
                <LessonPanel
                  key={lesson.id}
                  courseId={courseId}
                  lesson={lesson}
                  lessonIndex={index}
                  totalLessons={lessons.length}
                  onUpdate={(updated) =>
                    setLessons((prev) =>
                      prev.map((l) => (l.id === updated.id ? updated : l)),
                    )
                  }
                  onDelete={() => handleDeleteLesson(lesson.id)}
                  onMoveUp={() => handleMove(index, "up")}
                  onMoveDown={() => handleMove(index, "down")}
                />
              ))}
            </div>

            {/* Inline course meta edit form — appears below lessons */}
            {editingMeta && (
              <div
                ref={metaFormRef}
                className="border border-[#1E5BFF]/30 rounded-2xl bg-white shadow-sm overflow-hidden"
              >
                <div className="flex items-center justify-between px-5 py-4 bg-[#EEF3FF]/60 border-b border-[#1E5BFF]/20">
                  <h3 className="text-sm font-semibold font-display text-[#17131F]">
                    Edit Course Details
                  </h3>
                  <button
                    onClick={() => setEditingMeta(false)}
                    className="p-1.5 text-[#6E6678] hover:text-[#17131F] hover:bg-white rounded-lg transition-colors cursor-pointer"
                    title="Cancel"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="px-5 py-5 space-y-4">
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
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-6">
            <CourseOverviewCard
              course={course}
              editingMeta={editingMeta}
              onEditClick={() => {
                setMetaTitle(course.title);
                setMetaDesc(course.description);
                setEditingMeta(!editingMeta);
              }}
            />

            <CurriculumMetricsCard lessons={lessons} />
          </div>
        </div>
      </main>

      <ConfirmDialog
        isOpen={confirmUnpublish}
        onClose={() => setConfirmUnpublish(false)}
        onConfirm={doUnpublish}
        title="Unpublish Course"
        message="This course will be removed from the public catalog. Learner data is preserved. Continue?"
        confirmText="Unpublish Course"
        variant="destructive"
      />
    </>
  );
}
