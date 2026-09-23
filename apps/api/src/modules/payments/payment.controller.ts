import { Request, Response, NextFunction } from "express";
import * as paymentService from "./payment.service";

export async function initializeCoursePayment(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user!.id;
    const { courseId } = req.body as { courseId: string };
    const result = await paymentService.initializeCoursePayment(userId, courseId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function verifyPayment(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // Canonical source: URL param for GET /verify/:txRef, body for POST /verify
    const txRef = (req.params.txRef || req.body?.txRef) as string | undefined;
    if (!txRef) {
      res
        .status(400)
        .json({ error: "Transaction reference (txRef) is required" });
      return;
    }
    // Pass caller's userId for ownership enforcement
    const result = await paymentService.verifyAndCompletePayment(
      txRef,
      req.user!.id,
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

import { chapaService } from "./chapa.service";

export async function chapaWebhook(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const signature = (req.headers["x-chapa-signature"] ||
      req.headers["chapa-signature"]) as string | undefined;
    const isMockMode =
      !process.env.CHAPA_SECRET_KEY ||
      process.env.CHAPA_SECRET_KEY === "mock-secret-key";

    if (!isMockMode) {
      // Production: unconditionally require a valid HMAC signature
      if (
        !signature ||
        !chapaService.verifyWebhookSignature(req.rawBody ?? req.body, signature)
      ) {
        res.status(401).json({
          status: "error",
          message: "Invalid or missing webhook signature",
        });
        return;
      }
    } else if (!signature) {
      // Dev/test: unsigned webhook received — allow it but surface a clear warning
      console.warn(
        "[chapaWebhook] Unsigned webhook received in mock/dev mode — HMAC verification skipped",
      );
    } else if (
      !chapaService.verifyWebhookSignature(req.rawBody ?? req.body, signature)
    ) {
      // Dev/test: signature present but wrong — still reject
      res
        .status(401)
        .json({ status: "error", message: "Invalid webhook signature" });
      return;
    }

    // Chapa sends tx_ref in the POST body
    const txRef = (req.body?.tx_ref || req.body?.txRef) as string | undefined;

    if (!txRef) {
      res.status(400).json({ error: "Missing tx_ref in webhook payload" });
      return;
    }

    const result = await paymentService.verifyAndCompletePayment(txRef);
    res.json({ status: "success", result });
  } catch (err: unknown) {
    // Log for centralized observability — webhook errors must never be silent.
    console.error("[chapaWebhook] Error processing webhook:", err);
    // Return 200 to Chapa to prevent retries on validation-type errors.
    // The error is also forwarded to the centralized error handler for monitoring.
    const appErr = err as { statusCode?: number; message?: string };
    res.status(appErr.statusCode || 500).json({
      status: "error",
      message: appErr.message ?? "Internal server error",
    });
  }
}

export async function getCourseAccessStatus(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user!.id;
    const courseId = req.params.courseId as string;
    if (!courseId) {
      res.status(400).json({ error: "courseId is required" });
      return;
    }
    const result = await paymentService.getCourseAccessStatus(userId, courseId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getUserEnrollments(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user!.id;
    const enrollments = await paymentService.getUserEnrollments(userId);
    res.json(enrollments);
  } catch (err) {
    next(err);
  }
}

export async function listUserPayments(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user!.id;
    const payments = await paymentService.listUserPayments(userId);
    res.json(payments);
  } catch (err) {
    next(err);
  }
}
