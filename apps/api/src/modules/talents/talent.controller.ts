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
    const profile = await talentService.getOrCreateProfile(req.user.id);
    res.json(profile);
  } catch (err) {
    next(err);
  }
}

export async function getTalentProfileById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) return next(new AppError(401, "Not authenticated"));
    const profile = await talentService.getTalentProfileById(
      req.params.talentId as string,
      req.user,
    );
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
    const updated = await talentService.updateProfile(req.user.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function uploadPhoto(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  photoUpload(req, res, async (err: any) => {
    if (err) {
      return next(err);
    }

    let uploadedAsset: { secure_url: string; public_id: string } | null = null;
    try {
      if (!req.user) return next(new AppError(401, "Not authenticated"));
      if (!req.file) {
        return next(new AppError(400, "No photo file uploaded"));
      }

      // Sanitize and use original filename with timestamp
      const fileBaseName = path
        .parse(req.file.originalname)
        .name.replace(/[^a-zA-Z0-9-_]/g, "_");

      // 1. Upload new asset first
      uploadedAsset = await uploadBuffer(req.file.buffer, {
        ...CloudinaryFolders.talentPhoto,
        public_id: `${fileBaseName}-${Date.now()}`,
      });

      // Retrieve profile
      const profile = await talentService.getOrCreateProfile(req.user.id);

      // 2. Persist new reference
      const updated = await talentService.updateFile(
        req.user.id,
        "photoUrl",
        uploadedAsset.secure_url,
        uploadedAsset.public_id,
      );

      // 3. Delete old asset on success
      if (profile.photoUrl) {
        await deleteOldAsset(profile.photoUrl, profile.photoPublicId, "image");
      }

      res.json(updated);
    } catch (dbErr) {
      // If DB update fails, delete newly uploaded asset
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

    const profile = await talentService.getOrCreateProfile(req.user.id);
    if (profile.photoUrl) {
      await deleteOldAsset(profile.photoUrl, profile.photoPublicId, "image");
    }

    const updated = await talentService.updateFile(
      req.user.id,
      "photoUrl",
      null,
      null,
    );
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
    if (err) {
      return next(err);
    }

    let uploadedAsset: { secure_url: string; public_id: string } | null = null;
    try {
      if (!req.user) return next(new AppError(401, "Not authenticated"));
      if (!req.file) {
        return next(new AppError(400, "No CV file uploaded"));
      }

      // Sanitize and use original filename with timestamp
      const fileBaseName = path
        .parse(req.file.originalname)
        .name.replace(/[^a-zA-Z0-9-_]/g, "_");

      // 1. Upload new asset first
      uploadedAsset = await uploadBuffer(req.file.buffer, {
        ...CloudinaryFolders.talentCv,
        public_id: `${fileBaseName}-${Date.now()}`,
      });

      // Retrieve profile
      const profile = await talentService.getOrCreateProfile(req.user.id);

      // 2. Persist new reference
      const updated = await talentService.updateFile(
        req.user.id,
        "cvUrl",
        uploadedAsset.secure_url,
        uploadedAsset.public_id,
      );

      // 3. Delete old asset on success
      if (profile.cvUrl) {
        await deleteOldAsset(profile.cvUrl, profile.cvPublicId, "raw");
      }

      res.json(updated);
    } catch (dbErr) {
      // If DB update fails, delete newly uploaded asset
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

    const profile = await talentService.getOrCreateProfile(req.user.id);
    if (profile.cvUrl) {
      await deleteOldAsset(profile.cvUrl, profile.cvPublicId, "raw");
    }

    const updated = await talentService.updateFile(
      req.user.id,
      "cvUrl",
      null,
      null,
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function addExperience(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) return next(new AppError(401, "Not authenticated"));
    const exp = await talentService.addExperience(req.user.id, req.body);
    res.status(201).json(exp);
  } catch (err) {
    next(err);
  }
}

export async function updateExperience(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) return next(new AppError(401, "Not authenticated"));
    const exp = await talentService.updateExperience(
      req.user.id,
      req.params.id as string,
      req.body,
    );
    res.json(exp);
  } catch (err) {
    next(err);
  }
}

export async function deleteExperience(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) return next(new AppError(401, "Not authenticated"));
    const result = await talentService.deleteExperience(
      req.user.id,
      req.params.id as string,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function addEducation(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) return next(new AppError(401, "Not authenticated"));
    const edu = await talentService.addEducation(req.user.id, req.body);
    res.status(201).json(edu);
  } catch (err) {
    next(err);
  }
}

export async function updateEducation(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) return next(new AppError(401, "Not authenticated"));
    const edu = await talentService.updateEducation(
      req.user.id,
      req.params.id as string,
      req.body,
    );
    res.json(edu);
  } catch (err) {
    next(err);
  }
}

export async function deleteEducation(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) return next(new AppError(401, "Not authenticated"));
    const result = await talentService.deleteEducation(
      req.user.id,
      req.params.id as string,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}
