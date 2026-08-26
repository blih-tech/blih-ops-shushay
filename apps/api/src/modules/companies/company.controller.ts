import { Request, Response, NextFunction } from "express";
import fs from "fs/promises";
import path from "path";
import { env } from "../../config/env";
import { AppError } from "../../middleware/errorHandler";
import * as companyService from "./company.service";
import { logoUpload } from "../../middleware/upload";

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
    const profile = await companyService.getOrCreateProfile(req.user.id);
    res.json(profile);
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) return next(new AppError(401, "Not authenticated"));
    const updated = await companyService.updateProfile(req.user.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function uploadLogo(req: Request, res: Response, next: NextFunction) {
  logoUpload(req, res, async (err: any) => {
    if (err) {
      return next(err);
    }

    try {
      if (!req.user) return next(new AppError(401, "Not authenticated"));
      if (!req.file) {
        return next(new AppError(400, "No logo file uploaded"));
      }

      // Snort file url
      const fileUrl = `${env.uploadsBaseUrl}/logos/${req.file.filename}`;

      // Retrieve profile to delete old logo
      const profile = await companyService.getOrCreateProfile(req.user.id);
      if (profile.logoUrl) {
        await deleteOldFile(profile.logoUrl);
      }

      const updated = await companyService.updateFile(req.user.id, "logoUrl", fileUrl);
      res.json(updated);
    } catch (dbErr) {
      next(dbErr);
    }
  });
}

export async function deleteLogo(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) return next(new AppError(401, "Not authenticated"));

    const profile = await companyService.getOrCreateProfile(req.user.id);
    if (profile.logoUrl) {
      await deleteOldFile(profile.logoUrl);
    }

    const updated = await companyService.updateFile(req.user.id, "logoUrl", null);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}
