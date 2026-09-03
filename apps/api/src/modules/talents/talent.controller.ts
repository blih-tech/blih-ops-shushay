import { Request, Response, NextFunction } from "express";
import { AppError } from "../../middleware/errorHandler";
import * as talentService from "./talent.service";

export {
  uploadPhoto,
  deletePhoto,
  uploadCv,
  deleteCv,
} from "./talentMedia.controller";

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

export async function addExperience(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) return next(new AppError(401, "Not authenticated"));
    const created = await talentService.addExperience(req.user.id, req.body);
    res.status(201).json(created);
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
    const updated = await talentService.updateExperience(
      req.user.id,
      req.params.id as string,
      req.body,
    );
    res.json(updated);
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
    const created = await talentService.addEducation(req.user.id, req.body);
    res.status(201).json(created);
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
    const updated = await talentService.updateEducation(
      req.user.id,
      req.params.id as string,
      req.body,
    );
    res.json(updated);
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
