import { Request, Response, NextFunction } from "express";
import * as notificationService from "./notification.service";

export async function getUserNotifications(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user!.id;
    const notifications =
      await notificationService.getUserNotifications(userId);
    res.json(notifications);
  } catch (err) {
    next(err);
  }
}

export async function markAsRead(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user!.id;
    const notificationId = req.params.id as string;
    const updated = await notificationService.markNotificationAsRead(
      userId,
      notificationId,
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
}
