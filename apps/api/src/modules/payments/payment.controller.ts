import { Request, Response, NextFunction } from "express";
import * as paymentService from "./payment.service";

export async function initializeSkillsPayment(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user!.id;
    const result = await paymentService.initializeSkillsPayment(userId, req.body);
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
    const txRef = (req.params.txRef || req.body.txRef || req.query.txRef || req.query.tx_ref) as string;
    if (!txRef) {
      res.status(400).json({ error: "Transaction reference (txRef) is required" });
      return;
    }
    const result = await paymentService.verifyAndCompletePayment(txRef);
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
    const signature = (req.headers["x-chapa-signature"] || req.headers["chapa-signature"]) as string | undefined;
    if (signature && !chapaService.verifyWebhookSignature(req.body, signature)) {
      res.status(401).json({ status: "error", message: "Invalid webhook signature" });
      return;
    }

    // Chapa sends tx_ref or reference in body/query
    const txRef = (req.body?.tx_ref || req.body?.txRef || req.query?.tx_ref || req.query?.txRef) as string;

    if (!txRef) {
      res.status(400).json({ error: "Missing tx_ref in webhook payload" });
      return;
    }

    const result = await paymentService.verifyAndCompletePayment(txRef);
    res.json({ status: "success", result });
  } catch (err) {
    // Return 200/400 JSON so Chapa webhook receiver gets a clear response
    res.status(400).json({ status: "error", message: (err as Error).message });
  }
}


export async function getSkillsAccessStatus(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user!.id;
    const result = await paymentService.getSkillsAccessStatus(userId);
    res.json(result);
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
