import { Request, Response, NextFunction } from "express";
import fs from "fs/promises";
import path from "path";
import { AppError } from "../../middleware/errorHandler";
import * as companyService from "./company.service";
import { logoUpload } from "../../middleware/upload";

import {
  uploadBuffer,
  deleteFromCloudinary,
  CloudinaryFolders,
} from "../../services/cloudinary.service";

// Helper to delete old file/asset
async function deleteOldAsset(
  fileUrl: string | null | undefined,
  publicId: string | null | undefined,
  resourceType: "image" | "video" | "raw",
) {
  if (publicId) {
    await deleteFromCloudinary(publicId, resourceType);
  } else if (fileUrl && fileUrl.includes("/uploads/")) {
    try {
      const urlParts = fileUrl.split("/uploads/");
      if (urlParts.length === 2) {
        const relativePath = urlParts[1];
        const localPath = path.join("uploads", relativePath);
        await fs.unlink(localPath);
      }
    } catch (err) {
      console.warn("Could not delete old local file:", err);
    }
  }
}

export async function getProfile(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) return next(new AppError(401, "Not authenticated"));
    const profile = await companyService.getOrCreateProfile(req.user.id);
    res.json(profile);
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) return next(new AppError(401, "Not authenticated"));
    const updated = await companyService.updateProfile(req.user.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function uploadLogo(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logoUpload(req, res, async (err: any) => {
    if (err) {
      return next(err);
    }

    let uploadedAsset: { secure_url: string; public_id: string } | null = null;
    try {
      if (!req.user) return next(new AppError(401, "Not authenticated"));
      if (!req.file) {
        return next(new AppError(400, "No logo file uploaded"));
      }

      // Sanitize and use original filename with timestamp
      const fileBaseName = path
        .parse(req.file.originalname)
        .name.replace(/[^a-zA-Z0-9-_]/g, "_");

      // 1. Upload new logo to Cloudinary first
      uploadedAsset = await uploadBuffer(req.file.buffer, {
        ...CloudinaryFolders.companyLogo,
        public_id: `${fileBaseName}-${Date.now()}`,
      });

      // Retrieve profile
      const profile = await companyService.getOrCreateProfile(req.user.id);

      // 2. Persist new reference
      const updated = await companyService.updateFile(
        req.user.id,
        "logoUrl",
        uploadedAsset.secure_url,
        uploadedAsset.public_id,
      );

      // 3. Delete old logo on success
      if (profile.logoUrl) {
        await deleteOldAsset(profile.logoUrl, profile.logoPublicId, "image");
      }

      res.json(updated);
    } catch (dbErr) {
      // If DB update fails, delete newly uploaded logo
      if (uploadedAsset) {
        await deleteFromCloudinary(uploadedAsset.public_id, "image");
      }
      next(dbErr);
    }
  });
}

export async function deleteLogo(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) return next(new AppError(401, "Not authenticated"));

    const profile = await companyService.getOrCreateProfile(req.user.id);
    if (profile.logoUrl) {
      await deleteOldAsset(profile.logoUrl, profile.logoPublicId, "image");
    }

    const updated = await companyService.updateFile(
      req.user.id,
      "logoUrl",
      null,
      null,
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function getCompanyById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const company = await companyService.getCompanyById(
      req.params.companyId as string,
    );
    res.json(company);
  } catch (err) {
    next(err);
  }
}
