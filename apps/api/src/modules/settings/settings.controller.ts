import { Request, Response, NextFunction } from "express";
import * as settingsService from "./settings.service";
import { AppError } from "../../middleware/errorHandler";

export async function getPricingSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const skillsPrice = await settingsService.getSetting("PRICE_SKILLS_ACCESS", "1000");
    const subMonthly = await settingsService.getSetting("PRICE_SUBSCRIPTION_MONTHLY", "2000");
    const subYearly = await settingsService.getSetting("PRICE_SUBSCRIPTION_YEARLY", "10000");

    res.json({
      PRICE_SKILLS_ACCESS: skillsPrice,
      PRICE_SUBSCRIPTION_MONTHLY: subMonthly,
      PRICE_SUBSCRIPTION_YEARLY: subYearly,
    });
  } catch (err) {
    next(err);
  }
}

export async function updatePricingSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const { PRICE_SKILLS_ACCESS, PRICE_SUBSCRIPTION_MONTHLY, PRICE_SUBSCRIPTION_YEARLY } = req.body;
    
    const updates: Record<string, string> = {};
    if (PRICE_SKILLS_ACCESS) updates.PRICE_SKILLS_ACCESS = String(PRICE_SKILLS_ACCESS);
    if (PRICE_SUBSCRIPTION_MONTHLY) updates.PRICE_SUBSCRIPTION_MONTHLY = String(PRICE_SUBSCRIPTION_MONTHLY);
    if (PRICE_SUBSCRIPTION_YEARLY) updates.PRICE_SUBSCRIPTION_YEARLY = String(PRICE_SUBSCRIPTION_YEARLY);

    await settingsService.updateSettings(updates);
    
    res.json({ message: "Settings updated successfully" });
  } catch (err) {
    next(err);
  }
}
