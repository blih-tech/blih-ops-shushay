import { Request, Response, NextFunction } from "express";
import * as notificationService from "./notification.service";
import { sseNotificationManager } from "./sse.service";

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

export async function markAllAsRead(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user!.id;
    const updated = await notificationService.markAllNotificationsAsRead(userId);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export function streamNotifications(req: Request, res: Response) {
  const userId = req.user!.id;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  // Send initial handshake
  res.write(
    `data: ${JSON.stringify({ type: "INIT", message: "Real-time notification stream connected" })}\n\n`,
  );

  sseNotificationManager.addClient(userId, res);

  req.on("close", () => {
    sseNotificationManager.removeClient(userId, res);
  });
}
