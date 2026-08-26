import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs/promises";
import { env } from "../../config/env";
import { AppError } from "../../middleware/errorHandler";
import { videoUpload, documentUpload } from "../../middleware/upload";
import * as courseService from "./course.service";

// Helper: safely extract a route param as string
function p(req: Request, key: string): string {
  return req.params[key] as string;
}

// Helper: delete uploaded file (non-fatal)
async function deleteOldFile(fileUrl: string | null | undefined) {
  if (!fileUrl) return;
  try {
    const parts = fileUrl.split("/uploads/");
    if (parts.length === 2) await fs.unlink(path.join("uploads", parts[1]));
  } catch { /* non-fatal */ }
}

// ─── Admin course handlers ────────────────────────────────────────────────────

export async function listCoursesAdmin(_req: Request, res: Response, next: NextFunction) {
  try { res.json(await courseService.listCoursesAdmin()); } catch (err) { next(err); }
}

export async function getCourseAdmin(req: Request, res: Response, next: NextFunction) {
  try { res.json(await courseService.getCourseAdmin(p(req, "courseId"))); } catch (err) { next(err); }
}

export async function createCourse(req: Request, res: Response, next: NextFunction) {
  try { res.status(201).json(await courseService.createCourse(req.body)); } catch (err) { next(err); }
}

export async function updateCourse(req: Request, res: Response, next: NextFunction) {
  try { res.json(await courseService.updateCourse(p(req, "courseId"), req.body)); } catch (err) { next(err); }
}

export async function publishCourse(req: Request, res: Response, next: NextFunction) {
  try { res.json(await courseService.publishCourse(p(req, "courseId"))); } catch (err) { next(err); }
}

export async function unpublishCourse(req: Request, res: Response, next: NextFunction) {
  try { res.json(await courseService.unpublishCourse(p(req, "courseId"))); } catch (err) { next(err); }
}

// ─── Public course handlers ───────────────────────────────────────────────────

export async function listCoursesPublic(_req: Request, res: Response, next: NextFunction) {
  try { res.json(await courseService.listCoursesPublic()); } catch (err) { next(err); }
}

export async function getCoursePublic(req: Request, res: Response, next: NextFunction) {
  try { res.json(await courseService.getCoursePublic(p(req, "courseId"))); } catch (err) { next(err); }
}

// ─── Lesson handlers ─────────────────────────────────────────────────────────

export async function createLesson(req: Request, res: Response, next: NextFunction) {
  try { res.status(201).json(await courseService.createLesson(p(req, "courseId"), req.body)); } catch (err) { next(err); }
}

export async function updateLesson(req: Request, res: Response, next: NextFunction) {
  try { res.json(await courseService.updateLesson(p(req, "courseId"), p(req, "lessonId"), req.body)); } catch (err) { next(err); }
}

export async function deleteLesson(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await courseService.deleteLesson(p(req, "courseId"), p(req, "lessonId"));
    if (result.videoUrl) {
      await deleteOldFile(result.videoUrl);
    }
    if (result.documentUrls && result.documentUrls.length > 0) {
      for (const docUrl of result.documentUrls) {
        await deleteOldFile(docUrl);
      }
    }
    res.json({ success: true });
  } catch (err) { next(err); }
}

export async function reorderLessons(req: Request, res: Response, next: NextFunction) {
  try { res.json(await courseService.reorderLessons(p(req, "courseId"), req.body)); } catch (err) { next(err); }
}

// ─── Upload handlers ─────────────────────────────────────────────────────────

export function uploadLessonVideo(req: Request, res: Response, next: NextFunction) {
  videoUpload(req, res, async (err: any) => {
    if (err) return next(err);
    try {
      if (!req.file) return next(new AppError(400, "No video file uploaded"));
      const courseId = p(req, "courseId");
      const lessonId = p(req, "lessonId");
      const fileUrl = env.uploadsBaseUrl + "/videos/" + req.file.filename;
      const existing = await courseService.getCourseAdmin(courseId);
      const lesson = (existing?.lessons ?? []).find((l: any) => l.id === lessonId);
      if (lesson?.videoUrl) await deleteOldFile(lesson.videoUrl);
      res.json(await courseService.setLessonVideo(courseId, lessonId, fileUrl));
    } catch (dbErr) { next(dbErr); }
  });
}

export function uploadLessonDocument(req: Request, res: Response, next: NextFunction) {
  documentUpload(req, res, async (err: any) => {
    if (err) return next(err);
    try {
      if (!req.file) return next(new AppError(400, "No document file uploaded"));
      const courseId = p(req, "courseId");
      const lessonId = p(req, "lessonId");
      const fileUrl = env.uploadsBaseUrl + "/documents/" + req.file.filename;
      const name: string = req.body.name || req.file.originalname;
      res.status(201).json(await courseService.addLessonDocument(courseId, lessonId, name, fileUrl));
    } catch (dbErr) { next(dbErr); }
  });
}

export async function deleteLessonDocument(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await courseService.deleteLessonDocument(p(req, "courseId"), p(req, "lessonId"), p(req, "documentId"));
    if (result.url) {
      await deleteOldFile(result.url);
    }
    res.json({ success: true });
  } catch (err) { next(err); }
}

// ─── Quiz / Assignment handlers ───────────────────────────────────────────────

export async function upsertQuiz(req: Request, res: Response, next: NextFunction) {
  try { res.json(await courseService.upsertQuiz(p(req, "courseId"), p(req, "lessonId"), req.body)); } catch (err) { next(err); }
}

export async function upsertAssignment(req: Request, res: Response, next: NextFunction) {
  try { res.json(await courseService.upsertAssignment(p(req, "courseId"), p(req, "lessonId"), req.body)); } catch (err) { next(err); }
}