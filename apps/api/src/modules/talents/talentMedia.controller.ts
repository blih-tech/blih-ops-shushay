import { Request, Response, NextFunction } from "express";
import fs from "fs/promises";
import path from "path";
import { AppError } from "../../middleware/errorHandler";
import * as talentService from "./talent.service";
import { photoUpload, cvUpload } from "../../middleware/upload";
import {
  uploadBuffer,
  deleteFromCloudinary,
  CloudinaryFolders,
} from "../../services/cloudinary.service";

export async function deleteOldAsset(
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

export async function uploadPhoto(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  photoUpload(req, res, async (err: any) => {
    if (err) return next(err);

    let uploadedAsset: { secure_url: string; public_id: string } | null = null;
    try {
      if (!req.user) return next(new AppError(401, "Not authenticated"));
      if (!req.file) {
        return next(new AppError(400, "No photo file uploaded"));
      }

      const fileBaseName = path
        .parse(req.file.originalname)
        .name.replace(/[^a-zA-Z0-9-_]/g, "_");

      uploadedAsset = await uploadBuffer(req.file.buffer, {
        ...CloudinaryFolders.talentPhoto,
        public_id: `${fileBaseName}-${Date.now()}`,
      });

      const currentProfile = await talentService.getOrCreateProfile(
        req.user.id,
      );
      const updated = await talentService.updateFile(
        req.user.id,
        "photoUrl",
        uploadedAsset.secure_url,
        uploadedAsset.public_id,
      );

      if (currentProfile.photoUrl) {
        await deleteOldAsset(
          currentProfile.photoUrl,
          currentProfile.photoPublicId,
          "image",
        );
      }

      res.json(updated);
    } catch (dbErr) {
      if (uploadedAsset) {
        await deleteFromCloudinary(uploadedAsset.public_id, "image");
      }
      next(dbErr);
    }
  });
}

export async function deletePhoto(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) return next(new AppError(401, "Not authenticated"));
    const currentProfile = await talentService.getOrCreateProfile(req.user.id);

    const updated = await talentService.updateFile(
      req.user.id,
      "photoUrl",
      null,
      null,
    );

    if (currentProfile.photoUrl) {
      await deleteOldAsset(
        currentProfile.photoUrl,
        currentProfile.photoPublicId,
        "image",
      );
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function uploadCv(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  cvUpload(req, res, async (err: any) => {
    if (err) return next(err);

    let uploadedAsset: { secure_url: string; public_id: string } | null = null;
    try {
      if (!req.user) return next(new AppError(401, "Not authenticated"));
      if (!req.file) {
        return next(new AppError(400, "No CV file uploaded"));
      }

      const fileBaseName = path
        .parse(req.file.originalname)
        .name.replace(/[^a-zA-Z0-9-_]/g, "_");

      uploadedAsset = await uploadBuffer(req.file.buffer, {
        ...CloudinaryFolders.talentCv,
        public_id: `${fileBaseName}-${Date.now()}`,
      });

      const currentProfile = await talentService.getOrCreateProfile(
        req.user.id,
      );
      const updated = await talentService.updateFile(
        req.user.id,
        "cvUrl",
        uploadedAsset.secure_url,
        uploadedAsset.public_id,
      );

      if (currentProfile.cvUrl) {
        await deleteOldAsset(
          currentProfile.cvUrl,
          currentProfile.cvPublicId,
          "raw",
        );
      }

      res.json(updated);
    } catch (dbErr) {
      if (uploadedAsset) {
        await deleteFromCloudinary(uploadedAsset.public_id, "raw");
      }
      next(dbErr);
    }
  });
}

export async function deleteCv(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) return next(new AppError(401, "Not authenticated"));
    const currentProfile = await talentService.getOrCreateProfile(req.user.id);

    const updated = await talentService.updateFile(
      req.user.id,
      "cvUrl",
      null,
      null,
    );

    if (currentProfile.cvUrl) {
      await deleteOldAsset(
        currentProfile.cvUrl,
        currentProfile.cvPublicId,
        "raw",
      );
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
}
