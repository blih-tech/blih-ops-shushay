import { Request, Response, NextFunction } from "express";
import {
  getUserCertificates,
  getCertificateById,
  generateCertificatePdfStream,
} from "./certificate.service";

export async function getMyCertificates(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user!.id;
    const certificates = await getUserCertificates(userId);
    res.json({ certificates });
  } catch (err) {
    next(err);
  }
}

export async function downloadCertificate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const certificateId = req.params.id as string;
    const user = req.user!;

    const cert = await getCertificateById(certificateId, user);
    await generateCertificatePdfStream(cert, res);
  } catch (err) {
    next(err);
  }
}
