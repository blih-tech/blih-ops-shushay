import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import fsPromises from "fs/promises";
import { env } from "../../config/env";
import { AppError } from "../../middleware/errorHandler";
import { videoUpload, documentUpload } from "../../middleware/upload";
import * as courseService from "./course.service";
import { uploadStream, uploadBuffer, deleteFromCloudinary, CloudinaryFolders } from "../../services/cloudinary.service";

// Helper: safely extract a route param as string
function p(req: Request, key: string): string {
  return req.params[key] as string;
}

// Helper: delete uploaded file (non-fatal)
async function deleteOldAsset(
  fileUrl: string | null | undefined,
  publicId: string | null | undefined,
  resourceType: "image" | "video" | "raw"
) {
  if (publicId) {
    await deleteFromCloudinary(publicId, resourceType);
  } else if (fileUrl && fileUrl.includes("/uploads/")) {
    try {
      const parts = fileUrl.split("/uploads/");
      if (parts.length === 2) await fsPromises.unlink(path.join("uploads", parts[1]));
    } catch { /* non-fatal */ }
  }
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
      await deleteOldAsset(result.videoUrl, result.videoPublicId, "video");
    }
    if (result.documents && result.documents.length > 0) {
      for (const doc of result.documents) {
        await deleteOldAsset(doc.url, doc.publicId, "raw");
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
    let uploadedAsset: { secure_url: string; public_id: string } | null = null;
    let localFilePath: string | null = null;
    try {
      if (!req.file) return next(new AppError(400, "No video file uploaded"));
      localFilePath = req.file.path;
      const courseId = p(req, "courseId");
      const lessonId = p(req, "lessonId");

      // Sanitize and use original filename with timestamp
      const fileBaseName = path.parse(req.file.originalname).name.replace(/[^a-zA-Z0-9-_]/g, "_");

      // Use a readable stream to pipe video to Cloudinary
      const videoStream = fs.createReadStream(localFilePath);
      uploadedAsset = await uploadStream(videoStream, {
        ...CloudinaryFolders.courseVideo,
        public_id: `${fileBaseName}-${Date.now()}`
      });

      const existing = await courseService.getCourseAdmin(courseId);
      const lesson = (existing?.lessons ?? []).find((l: any) => l.id === lessonId);

      // Save references to DB
      const updated = await courseService.setLessonVideo(courseId, lessonId, uploadedAsset.secure_url, uploadedAsset.public_id);

      // Delete old asset
      if (lesson?.videoUrl) {
        await deleteOldAsset(lesson.videoUrl, lesson.videoPublicId, "video");
      }

      // Cleanup local temp file
      if (localFilePath) {
        await fsPromises.unlink(localFilePath).catch(() => {});
      }

      res.json(updated);
    } catch (dbErr) {
      // Cleanup local file
      if (localFilePath) {
        await fsPromises.unlink(localFilePath).catch(() => {});
      }
      // If DB update fails, delete from Cloudinary
      if (uploadedAsset) {
        await deleteFromCloudinary(uploadedAsset.public_id, "video");
      }
      next(dbErr);
    }
  });
}

export function uploadLessonDocument(req: Request, res: Response, next: NextFunction) {
  documentUpload(req, res, async (err: any) => {
    if (err) return next(err);
    let uploadedAsset: { secure_url: string; public_id: string } | null = null;
    try {
      if (!req.file) return next(new AppError(400, "No document file uploaded"));
      const courseId = p(req, "courseId");
      const lessonId = p(req, "lessonId");

      // Sanitize and use original filename with timestamp
      const fileBaseName = path.parse(req.file.originalname).name.replace(/[^a-zA-Z0-9-_]/g, "_");

      // Upload memory buffer to Cloudinary
      uploadedAsset = await uploadBuffer(req.file.buffer, {
        ...CloudinaryFolders.courseDocument,
        public_id: `${fileBaseName}-${Date.now()}`
      });

      const name: string = req.body.name || req.file.originalname;
      const updated = await courseService.addLessonDocument(courseId, lessonId, name, uploadedAsset.secure_url, uploadedAsset.public_id);
      res.status(201).json(updated);
    } catch (dbErr) {
      if (uploadedAsset) {
        await deleteFromCloudinary(uploadedAsset.public_id, "raw");
      }
      next(dbErr);
    }
  });
}

export async function deleteLessonDocument(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await courseService.deleteLessonDocument(p(req, "courseId"), p(req, "lessonId"), p(req, "documentId"));
    if (result.url) {
      await deleteOldAsset(result.url, result.publicId, "raw");
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