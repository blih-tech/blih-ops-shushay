import { Request, Response, NextFunction } from "express";
import path from "path";
import fs from "fs";
import fsPromises from "fs/promises";
import { AppError } from "../../middleware/errorHandler";
import { videoUpload, documentUpload } from "../../middleware/upload";
import * as courseService from "./course.service";
import {
  uploadStream,
  uploadBuffer,
  deleteFromCloudinary,
  CloudinaryFolders,
} from "../../services/cloudinary.service";
import { deleteOldAsset } from "../../utils/media";

function p(req: Request, key: string): string {
  return req.params[key] as string;
}



export function uploadLessonVideo(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  videoUpload(req, res, async (err: any) => {
    if (err) return next(err);
    let uploadedAsset: { secure_url: string; public_id: string } | null = null;
    let localFilePath: string | null = null;
    try {
      if (!req.file) return next(new AppError(400, "No video file uploaded"));
      localFilePath = req.file.path;
      const courseId = p(req, "courseId");
      const lessonId = p(req, "lessonId");

      const fileBaseName = path
        .parse(req.file.originalname)
        .name.replace(/[^a-zA-Z0-9-_]/g, "_");

      const videoStream = fs.createReadStream(localFilePath);
      uploadedAsset = await uploadStream(videoStream, {
        ...CloudinaryFolders.courseVideo,
        public_id: `${fileBaseName}-${Date.now()}`,
      });

      const existing = await courseService.getCourseAdmin(courseId);
      const lesson = (existing?.lessons ?? []).find(
        (l) => l.id === lessonId,
      );

      const updated = await courseService.setLessonVideo(
        courseId,
        lessonId,
        uploadedAsset.secure_url,
        uploadedAsset.public_id,
      );

      if (lesson?.videoUrl) {
        await deleteOldAsset(lesson.videoUrl, lesson.videoPublicId, "video");
      }

      if (localFilePath) {
        await fsPromises.unlink(localFilePath).catch(() => {});
      }

      res.json(updated);
    } catch (dbErr) {
      if (localFilePath) {
        await fsPromises.unlink(localFilePath).catch(() => {});
      }
      if (uploadedAsset) {
        await deleteFromCloudinary(uploadedAsset.public_id, "video");
      }
      next(dbErr);
    }
  });
}

export function uploadLessonDocument(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  documentUpload(req, res, async (err: any) => {
    if (err) return next(err);
    let uploadedAsset: { secure_url: string; public_id: string } | null = null;
    try {
      if (!req.file)
        return next(new AppError(400, "No document file uploaded"));
      const courseId = p(req, "courseId");
      const lessonId = p(req, "lessonId");

      const fileBaseName = path
        .parse(req.file.originalname)
        .name.replace(/[^a-zA-Z0-9-_]/g, "_");

      uploadedAsset = await uploadBuffer(req.file.buffer, {
        ...CloudinaryFolders.courseDocument,
        public_id: `${fileBaseName}-${Date.now()}`,
      });

      const name: string = req.body.name || req.file.originalname;
      const updated = await courseService.addLessonDocument(
        courseId,
        lessonId,
        name,
        uploadedAsset.secure_url,
        uploadedAsset.public_id,
      );
      res.status(201).json(updated);
    } catch (dbErr) {
      if (uploadedAsset) {
        await deleteFromCloudinary(uploadedAsset.public_id, "raw");
      }
      next(dbErr);
    }
  });
}

export async function deleteLessonDocument(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await courseService.deleteLessonDocument(
      p(req, "courseId"),
      p(req, "lessonId"),
      p(req, "documentId"),
    );
    if (result.url) {
      await deleteOldAsset(result.url, result.publicId, "raw");
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function deleteLessonVideo(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await courseService.deleteLessonVideo(
      p(req, "courseId"),
      p(req, "lessonId"),
    );
    if (result.videoUrl) {
      await deleteOldAsset(result.videoUrl, result.videoPublicId, "video");
    }
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
