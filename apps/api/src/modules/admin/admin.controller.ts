import { Request, Response, NextFunction } from "express";
import * as adminService from "./admin.service";

export async function getStats(req: Request, res: Response, next: NextFunction) {
  try {
    const stats = await adminService.getAdminStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
}

export async function getTalents(req: Request, res: Response, next: NextFunction) {
  try {
    const talents = await adminService.getAdminTalents();
    res.json(talents);
  } catch (err) {
    next(err);
  }
}

export async function getCompanies(req: Request, res: Response, next: NextFunction) {
  try {
    const companies = await adminService.getAdminCompanies();
    res.json(companies);
  } catch (err) {
    next(err);
  }
}
