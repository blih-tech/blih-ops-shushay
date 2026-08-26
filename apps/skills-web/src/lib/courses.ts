import { apiFetch, apiFetchFormData } from "./api";
import type {
  Course,
  PublicCourse,
  PublicCourseListItem,
  Lesson,
  Quiz,
  Assignment,
  LessonDocument,
  QuizQuestion,
} from "@/types/course";

const BASE = "/courses";

// ─── Public ───────────────────────────────────────────────────────────────────

export function fetchPublicCourses(): Promise<PublicCourseListItem[]> {
  return apiFetch<PublicCourseListItem[]>(BASE);
}

export function fetchPublicCourse(id: string): Promise<PublicCourse> {
  return apiFetch<PublicCourse>(`${BASE}/public/${id}`);
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export function fetchAdminCourses(): Promise<Course[]> {
  return apiFetch<Course[]>(`${BASE}/admin`);
}

export function fetchAdminCourse(id: string): Promise<Course> {
  return apiFetch<Course>(`${BASE}/admin/${id}`);
}

export function createCourse(data: { title: string; description: string }): Promise<Course> {
  return apiFetch<Course>(BASE, { method: "POST", body: JSON.stringify(data) });
}

export function updateCourse(id: string, data: { title?: string; description?: string }): Promise<Course> {
  return apiFetch<Course>(`${BASE}/${id}`, { method: "PATCH", body: JSON.stringify(data) });
}

export function publishCourse(id: string): Promise<Course> {
  return apiFetch<Course>(`${BASE}/${id}/publish`, { method: "POST" });
}

export function unpublishCourse(id: string): Promise<Course> {
  return apiFetch<Course>(`${BASE}/${id}/unpublish`, { method: "POST" });
}

// ─── Lessons ──────────────────────────────────────────────────────────────────

export function createLesson(courseId: string, data: { title: string; content?: string | null }): Promise<Lesson> {
  return apiFetch<Lesson>(`${BASE}/${courseId}/lessons`, { method: "POST", body: JSON.stringify(data) });
}

export function updateLesson(
  courseId: string,
  lessonId: string,
  data: { title?: string; content?: string | null }
): Promise<Lesson> {
  return apiFetch<Lesson>(`${BASE}/${courseId}/lessons/${lessonId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export function deleteLesson(courseId: string, lessonId: string): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(`${BASE}/${courseId}/lessons/${lessonId}`, { method: "DELETE" });
}

export function reorderLessons(
  courseId: string,
  lessons: Array<{ id: string; order: number }>
): Promise<Lesson[]> {
  return apiFetch<Lesson[]>(`${BASE}/${courseId}/lessons/reorder`, {
    method: "POST",
    body: JSON.stringify({ lessons }),
  });
}

// ─── Uploads ──────────────────────────────────────────────────────────────────

export function uploadLessonVideo(courseId: string, lessonId: string, file: File): Promise<Lesson> {
  const form = new FormData();
  form.append("video", file);
  return apiFetchFormData<Lesson>(`${BASE}/${courseId}/lessons/${lessonId}/video`, form);
}

export function uploadLessonDocument(
  courseId: string,
  lessonId: string,
  file: File,
  name?: string
): Promise<LessonDocument> {
  const form = new FormData();
  form.append("document", file);
  if (name) form.append("name", name);
  return apiFetchFormData<LessonDocument>(`${BASE}/${courseId}/lessons/${lessonId}/documents`, form);
}

export function deleteLessonDocument(
  courseId: string,
  lessonId: string,
  documentId: string
): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(
    `${BASE}/${courseId}/lessons/${lessonId}/documents/${documentId}`,
    { method: "DELETE" }
  );
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────

export function upsertQuiz(
  courseId: string,
  lessonId: string,
  data: { title: string; questions: QuizQuestion[] }
): Promise<Quiz> {
  return apiFetch<Quiz>(`${BASE}/${courseId}/lessons/${lessonId}/quiz`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// ─── Assignment ───────────────────────────────────────────────────────────────

export function upsertAssignment(
  courseId: string,
  lessonId: string,
  data: { title: string; instructions: string }
): Promise<Assignment> {
  return apiFetch<Assignment>(`${BASE}/${courseId}/lessons/${lessonId}/assignment`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
