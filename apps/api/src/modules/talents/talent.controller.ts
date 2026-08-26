import { Request, Response, NextFunction } from "express";
import fs from "fs/promises";
import path from "path";
import { env } from "../../config/env";
import { AppError } from "../../middleware/errorHandler";
import * as talentService from "./talent.service";
import { photoUpload, cvUpload } from "../../middleware/upload";

// Helper to delete old file
async function deleteOldFile(fileUrl: string | null | undefined) {
  if (!fileUrl) return;
  try {
    const urlParts = fileUrl.split("/uploads/");
    if (urlParts.length === 2) {
      const relativePath = urlParts[1];
      const localPath = path.join("uploads", relativePath);
      await fs.unlink(localPath);
    }
  } catch (err) {
    console.warn("Could not delete old file:", err);
  }
}

export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) return next(new AppError(401, "Not authenticated"));
    const profile = await talentService.getOrCreateProfile(req.user.id);
    res.json(profile);
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) return next(new AppError(401, "Not authenticated"));
    const updated = await talentService.updateProfile(req.user.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function uploadPhoto(req: Request, res: Response, next: NextFunction) {
  photoUpload(req, res, async (err: any) => {
    if (err) {
      return next(err);
    }

    try {
      if (!req.user) return next(new AppError(401, "Not authenticated"));
      if (!req.file) {
        return next(new AppError(400, "No photo file uploaded"));
      }

      // Snort file url
      const fileUrl = `${env.uploadsBaseUrl}/photos/${req.file.filename}`;

      // Retrieve profile to delete old photo
      const profile = await talentService.getOrCreateProfile(req.user.id);
      if (profile.photoUrl) {
        await deleteOldFile(profile.photoUrl);
      }

      const updated = await talentService.updateFile(req.user.id, "photoUrl", fileUrl);
      res.json(updated);
    } catch (dbErr) {
      next(dbErr);
    }
  });
}

export async function deletePhoto(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) return next(new AppError(401, "Not authenticated"));

    const profile = await talentService.getOrCreateProfile(req.user.id);
    if (profile.photoUrl) {
      await deleteOldFile(profile.photoUrl);
    }

    const updated = await talentService.updateFile(req.user.id, "photoUrl", null);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function uploadCv(req: Request, res: Response, next: NextFunction) {
  cvUpload(req, res, async (err: any) => {
    if (err) {
      return next(err);
    }

    try {
      if (!req.user) return next(new AppError(401, "Not authenticated"));
      if (!req.file) {
        return next(new AppError(400, "No CV file uploaded"));
      }

      // Snort file url
      const fileUrl = `${env.uploadsBaseUrl}/cvs/${req.file.filename}`;

      // Retrieve profile to delete old CV
      const profile = await talentService.getOrCreateProfile(req.user.id);
      if (profile.cvUrl) {
        await deleteOldFile(profile.cvUrl);
      }

      const updated = await talentService.updateFile(req.user.id, "cvUrl", fileUrl);
      res.json(updated);
    } catch (dbErr) {
      next(dbErr);
    }
  });
}

export async function deleteCv(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) return next(new AppError(401, "Not authenticated"));

    const profile = await talentService.getOrCreateProfile(req.user.id);
    if (profile.cvUrl) {
      await deleteOldFile(profile.cvUrl);
    }

    const updated = await talentService.updateFile(req.user.id, "cvUrl", null);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function addExperience(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) return next(new AppError(401, "Not authenticated"));
    const exp = await talentService.addExperience(req.user.id, req.body);
    res.status(201).json(exp);
  } catch (err) {
    next(err);
  }
}

export async function updateExperience(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) return next(new AppError(401, "Not authenticated"));
    const exp = await talentService.updateExperience(req.user.id, req.params.id as string, req.body);
    res.json(exp);
  } catch (err) {
    next(err);
  }
}

export async function deleteExperience(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) return next(new AppError(401, "Not authenticated"));
    const result = await talentService.deleteExperience(req.user.id, req.params.id as string);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function addEducation(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) return next(new AppError(401, "Not authenticated"));
    const edu = await talentService.addEducation(req.user.id, req.body);
    res.status(201).json(edu);
  } catch (err) {
    next(err);
  }
}

export async function updateEducation(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) return next(new AppError(401, "Not authenticated"));
    const edu = await talentService.updateEducation(req.user.id, req.params.id as string, req.body);
    res.json(edu);
  } catch (err) {
    next(err);
  }
}

export async function deleteEducation(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) return next(new AppError(401, "Not authenticated"));
    const result = await talentService.deleteEducation(req.user.id, req.params.id as string);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
