import { Request, Response, NextFunction } from "express";
import * as learningService from "./learning.service";
import { documentUpload } from "../../middleware/upload";
import { uploadBuffer, CloudinaryFolders } from "../../services/cloudinary.service";

// Helper
function p(req: Request, key: string): string {
  return req.params[key] as string;
}

export async function markLessonComplete(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await learningService.markLessonComplete(
      req.user!.id,
      req.body.lessonId,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function submitQuiz(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await learningService.submitQuiz(req.user!.id, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// documentUpload is already configured as .single("document") in upload.ts
export const submitAssignmentFiles = documentUpload;

export async function submitAssignment(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    let fileInfo: { fileUrl: string; filePublicId?: string } | undefined =
      undefined;

    if (req.file) {
      const uploadResult = await uploadBuffer(req.file.buffer, {
        folder: CloudinaryFolders.courseDocument.folder,
        resource_type: "raw",
      });
      fileInfo = {
        fileUrl: uploadResult.secure_url,
        filePublicId: uploadResult.public_id,
      };
    }

    const result = await learningService.submitAssignment(
      req.user!.id,
      req.body,
      fileInfo,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getCourseProgress(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await learningService.getCourseProgress(
      req.user!.id,
      p(req, "courseId"),
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}
