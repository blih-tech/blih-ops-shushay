import { Request, Response, NextFunction } from "express";
import * as companySubscriptionService from "./company-subscription.service";
import { initializeSubscriptionSchema } from "./company-subscription.schemas";

export async function initializeCompanySubscription(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user!.id;
    const validated = initializeSubscriptionSchema.parse(req.body);
    const result = await companySubscriptionService.initializeCompanySubscription(
      userId,
      validated.plan,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getCompanySubscriptionStatus(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user!.id;
    const result = await companySubscriptionService.getCompanySubscriptionStatus(
      userId,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}
