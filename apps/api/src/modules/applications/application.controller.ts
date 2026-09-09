import { Request, Response, NextFunction } from "express";
import { AppError } from "../../middleware/errorHandler";
import * as applicationService from "./application.service";

export async function applyToJob(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) return next(new AppError(401, "Not authenticated"));
    const application = await applicationService.applyToJob(
      req.user.id,
      req.body,
    );
    res.status(201).json(application);
  } catch (err) {
    next(err);
  }
}

export async function getTalentApplications(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) return next(new AppError(401, "Not authenticated"));
    const applications = await applicationService.getTalentApplications(
      req.user.id,
    );
    res.json(applications);
  } catch (err) {
    next(err);
  }
}

export async function getJobApplications(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) return next(new AppError(401, "Not authenticated"));
    const jobId = req.params.jobId as string;
    const applications = await applicationService.getJobApplicationsForCompany(
      jobId,
      req.user.id,
    );
    res.json(applications);
  } catch (err) {
    next(err);
  }
}

export async function updateApplicationStatus(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) return next(new AppError(401, "Not authenticated"));
    const applicationId = req.params.id as string;
    const { status } = req.body;
    const updated = await applicationService.updateApplicationStatus(
      applicationId,
      req.user.id,
      status,
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
}
