import React from "react";
import Link from "next/link";
import {
  ArrowLeft, Pencil, Eye, EyeOff, Save, Plus, BookOpen, Layers
} from "lucide-react";
import {
  Button, Badge, Alert, ConfirmDialog, Card, CardHeader, CardTitle, CardContent, GlobalNavbar, Input, Textarea
} from "@blih/ui";
import { useAuth } from "@/providers/AuthProvider";
import { LessonPanel } from "./LessonPanel";
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
    handleMove
  } = useEditCourse(courseId);

  if (loading) {
    return <EditCourseSkeleton user={user} onSignOut={logout} />;
  }

  if (loadError || !course) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <GlobalNavbar currentApp="courses" user={user} onSignOut={logout} />
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-4 flex-1">
          <Link href="/admin/courses">
            <Button variant="ghost" leftIcon={<ArrowLeft className="h-4 w-4" />} size="sm">
              Back to Courses
            </Button>
          </Link>
          <Alert variant="error">{loadError ?? "Course not found"}</Alert>
        </div>
      </div>
    );
  }

  const isPublished = course.status === "PUBLISHED";

  return (
    <div className="min-h-screen bg-white text-[#17131F] flex flex-col font-sans antialiased relative">
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#EEF3FF] via-white/50 to-transparent pointer-events-none -z-10" />

      {/* Global Navbar */}
      <GlobalNavbar currentApp="courses" user={user} onSignOut={logout} />

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 flex-1">
        {/* Top Header Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#D9CEDF]">
          <div className="space-y-1.5">
            <Link
              href="/admin/courses"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-[#1E5BFF] hover:underline mb-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Course Management
            </Link>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#17131F]">
                {course.title}
              </h1>
              <Badge variant={isPublished ? "verified" : "secondary"}>
                {isPublished ? "PUBLISHED" : "DRAFT"}
              </Badge>
            </div>
            <p className="text-sm text-[#6E6678]">
              Manage curriculum structure, video lectures, assessments, and learning resources.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto self-start lg:self-center">
            <Button
              variant={isPublished ? "outline" : "primary"}
              className="w-full sm:w-auto"
              leftIcon={isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              isLoading={publishLoading}
              onClick={handlePublish}
            >
              {isPublished ? "Unpublish Catalog" : "Publish Course"}
            </Button>
          </div>
        </div>

        {publishError && <Alert variant="error" onClose={() => setPublishError(null)}>{publishError}</Alert>}
        {loadError && <Alert variant="error" onClose={() => setPublishError(null)}>{loadError}</Alert>}

        {/* 2-Column Responsive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Lessons Column (8 cols) */}
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
                  <p className="text-xs font-mono text-[#6E6678]">{lessons.length} Modules in sequence</p>
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
              <div className="border-2 border-[#1E5BFF] bg-[#EEF3FF]/40 rounded-3xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <h4 className="font-display font-bold text-lg text-[#17131F]">New Lesson Module</h4>
                  <Badge variant="primary" size="sm">STEP {lessons.length + 1}</Badge>
                </div>
                {addLessonError && <Alert variant="error" onClose={() => setAddLessonError(null)}>{addLessonError}</Alert>}
                <Input
                  label="Module Title"
                  value={newLessonTitle}
                  onChange={(e) => setNewLessonTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddLesson();
                    if (e.key === "Escape") {
                      setAddingLesson(false);
                      setNewLessonTitle("");
                    }
                  }}
                  placeholder="e.g. Chapter 1: Core Architecture & Setup"
                  autoFocus
                />
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setAddingLesson(false);
                      setNewLessonTitle("");
                    }}
                    disabled={addingLessonLoading}
                  >
                    Cancel
                  </Button>
                  <Button size="sm" variant="primary" isLoading={addingLessonLoading} onClick={handleAddLesson}>
                    Create Lesson
                  </Button>
                </div>
              </div>
            )}

            {lessons.length === 0 && !addingLesson && (
              <div className="border-2 border-dashed border-[#D9CEDF] rounded-3xl p-12 text-center bg-white space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center mx-auto shadow-xs">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="font-display font-bold text-lg text-[#17131F]">No curriculum modules yet</h3>
                <p className="text-sm text-[#6E6678] font-sans max-w-sm mx-auto">
                  Click &quot;Add Lesson&quot; to begin building chapters, video lectures, and quizzes for this course.
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
                    setLessons((prev) => prev.map((l) => (l.id === updated.id ? updated : l)))
                  }
                  onDelete={() => handleDeleteLesson(lesson.id)}
                  onMoveUp={() => handleMove(index, "up")}
                  onMoveDown={() => handleMove(index, "down")}
                />
              ))}
            </div>
          </div>

          {/* Sidebar Column (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Course Metadata Card */}
            <Card className="border border-[#D9CEDF] rounded-3xl shadow-sm bg-white overflow-hidden">
              <CardHeader className="p-6 bg-gradient-to-r from-[#EEF3FF] via-[#F7F9FF] to-white border-b border-[#D9CEDF]">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold font-display text-[#17131F]">Course Overview</CardTitle>
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
                    {metaError && <Alert variant="error" onClose={() => setMetaError(null)}>{metaError}</Alert>}
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
                      <Button size="sm" variant="ghost" onClick={() => setEditingMeta(false)} disabled={metaSaving}>
                        Cancel
                      </Button>
                      <Button size="sm" variant="primary" leftIcon={<Save className="h-3.5 w-3.5" />} isLoading={metaSaving} onClick={saveMeta}>
                        Save Details
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 font-sans">
                    <div>
                      <p className="text-xs font-mono text-[#6E6678] uppercase tracking-wider">Title</p>
                      <p className="text-base font-bold text-[#17131F] font-display mt-0.5">{course.title}</p>
                    </div>
                    <div>
                      <p className="text-xs font-mono text-[#6E6678] uppercase tracking-wider">Description</p>
                      <p className="text-sm text-[#6E6678] mt-0.5 leading-relaxed">{course.description}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats Panel */}
            <Card className="border border-[#D9CEDF] rounded-3xl shadow-sm bg-white p-6 space-y-4">
              <h3 className="font-display font-bold text-lg text-[#17131F]">Curriculum Metrics</h3>
              <div className="grid grid-cols-2 gap-3 font-sans">
                <div className="p-3.5 bg-[#EEF3FF]/50 border border-[#D9CEDF]/70 rounded-2xl">
                  <p className="text-xs font-mono text-[#6E6678] uppercase">Lessons</p>
                  <p className="text-2xl font-bold font-display text-[#1E5BFF] mt-1">{lessons.length}</p>
                </div>
                <div className="p-3.5 bg-[#EEF3FF]/50 border border-[#D9CEDF]/70 rounded-2xl">
                  <p className="text-xs font-mono text-[#6E6678] uppercase">Videos</p>
                  <p className="text-2xl font-bold font-display text-[#2E8F79] mt-1">
                    {lessons.filter((l) => l.videoUrl).length}
                  </p>
                </div>
                <div className="p-3.5 bg-[#EEF3FF]/50 border border-[#D9CEDF]/70 rounded-2xl">
                  <p className="text-xs font-mono text-[#6E6678] uppercase">Quizzes</p>
                  <p className="text-2xl font-bold font-display text-[#FF8A5B] mt-1">
                    {lessons.filter((l) => l.quiz).length}
                  </p>
                </div>
                <div className="p-3.5 bg-[#EEF3FF]/50 border border-[#D9CEDF]/70 rounded-2xl">
                  <p className="text-xs font-mono text-[#6E6678] uppercase">Assignments</p>
                  <p className="text-2xl font-bold font-display text-[#17131F] mt-1">
                    {lessons.filter((l) => l.assignment).length}
                  </p>
                </div>
              </div>
            </Card>
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
    </div>
  );
}
