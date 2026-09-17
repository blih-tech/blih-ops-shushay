import { Request, Response, NextFunction } from "express";
import { AppError } from "../../middleware/errorHandler";
import * as jobService from "./job.service";
import { jobQuerySchema } from "./job.schemas";

export async function createJob(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) return next(new AppError(401, "Not authenticated"));
    const job = await jobService.createJob(req.user.id, req.body);
    res.status(201).json(job);
  } catch (err) {
    next(err);
  }
}

export async function getCompanyJobs(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) return next(new AppError(401, "Not authenticated"));
    const query = jobQuerySchema.parse(req.query);
    const result = await jobService.getCompanyJobs(req.user.id, query);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getJobById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const jobId = req.params.jobId as string;
    const job = await jobService.getJobById(jobId, req.user?.id);
    res.json(job);
  } catch (err) {
    next(err);
  }
}

export async function updateJob(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) return next(new AppError(401, "Not authenticated"));
    const jobId = req.params.jobId as string;
    const updated = await jobService.updateJob(jobId, req.user.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function closeJob(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) return next(new AppError(401, "Not authenticated"));
    const jobId = req.params.jobId as string;
    const closed = await jobService.closeJob(jobId, req.user.id);
    res.json(closed);
  } catch (err) {
    next(err);
  }
}

export async function reopenJob(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user) return next(new AppError(401, "Not authenticated"));
    const jobId = req.params.jobId as string;
    const reopened = await jobService.reopenJob(jobId, req.user.id);
    res.json(reopened);
  } catch (err) {
    next(err);
  }
}


export async function listActiveJobs(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const query = jobQuerySchema.parse(req.query);
    const result = await jobService.listActiveJobs(query, req.user?.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}
