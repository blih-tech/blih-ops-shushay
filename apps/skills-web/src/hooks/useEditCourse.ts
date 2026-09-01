import { useState, useEffect, useCallback } from "react";
import {
  fetchAdminCourse,
  updateCourse,
  publishCourse,
  unpublishCourse,
  createLesson,
  deleteLesson,
  reorderLessons,
} from "@/lib/courses";
import type { Course, Lesson } from "@/types/course";

export function useEditCourse(courseId: string) {
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editingMeta, setEditingMeta] = useState(false);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDesc, setMetaDesc] = useState("");
  const [metaSaving, setMetaSaving] = useState(false);
  const [metaError, setMetaError] = useState<string | null>(null);
  const [publishLoading, setPublishLoading] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [confirmUnpublish, setConfirmUnpublish] = useState(false);
  const [addingLesson, setAddingLesson] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [addingLessonLoading, setAddingLessonLoading] = useState(false);
  const [addLessonError, setAddLessonError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await fetchAdminCourse(courseId);
      if (!data) throw new Error("Course not found");
      setCourse(data);
      setMetaTitle(data.title);
      setMetaDesc(data.description);
      setLessons((data.lessons ?? []) as Lesson[]);
    } catch (e: any) {
      setLoadError(e.message ?? "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    load();
  }, [load]);

  async function saveMeta() {
    setMetaSaving(true);
    setMetaError(null);
    try {
      const updated = await updateCourse(courseId, {
        title: metaTitle.trim(),
        description: metaDesc.trim(),
      });
      setCourse((c) =>
        c
          ? { ...c, title: updated.title, description: updated.description }
          : c,
      );
      setEditingMeta(false);
    } catch (e: any) {
      setMetaError(e.message ?? "Failed to save");
    } finally {
      setMetaSaving(false);
    }
  }

  async function handlePublish() {
    if (!course) return;
    if (course.status === "PUBLISHED") {
      setConfirmUnpublish(true);
      return;
    }
    setPublishLoading(true);
    setPublishError(null);
    try {
      const updated = await publishCourse(courseId);
      setCourse((c) => (c ? { ...c, status: updated.status } : c));
    } catch (e: any) {
      setPublishError(e.message ?? "Failed to publish");
    } finally {
      setPublishLoading(false);
    }
  }

  async function doUnpublish() {
    setPublishLoading(true);
    setPublishError(null);
    setConfirmUnpublish(false);
    try {
      const updated = await unpublishCourse(courseId);
      setCourse((c) => (c ? { ...c, status: updated.status } : c));
    } catch (e: any) {
      setPublishError(e.message ?? "Failed to unpublish");
    } finally {
      setPublishLoading(false);
    }
  }

  async function handleAddLesson() {
    if (!newLessonTitle.trim()) return;
    setAddingLessonLoading(true);
    setAddLessonError(null);
    try {
      const lesson = await createLesson(courseId, {
        title: newLessonTitle.trim(),
      });
      setLessons((prev) => [...prev, lesson as Lesson]);
      setNewLessonTitle("");
      setAddingLesson(false);
    } catch (e: any) {
      setAddLessonError(e.message ?? "Failed to add lesson");
    } finally {
      setAddingLessonLoading(false);
    }
  }

  async function handleDeleteLesson(lessonId: string) {
    try {
      await deleteLesson(courseId, lessonId);
      setLessons((prev) => prev.filter((l) => l.id !== lessonId));
    } catch (e: any) {
      setLoadError(e.message ?? "Failed to delete lesson");
    }
  }

  async function handleMove(index: number, direction: "up" | "down") {
    const newLessons = [...lessons];
    const swap = direction === "up" ? index - 1 : index + 1;
    [newLessons[index], newLessons[swap]] = [
      newLessons[swap],
      newLessons[index],
    ];
    const withOrder = newLessons.map((l, i) => ({ ...l, order: i }));
    setLessons(withOrder);
    try {
      await reorderLessons(
        courseId,
        withOrder.map((l) => ({ id: l.id, order: l.order })),
      );
    } catch (e: any) {
      setLoadError(e.message ?? "Reorder failed");
      load();
    }
  }

  return {
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
  };
}
