import { Request, Response, NextFunction } from "express";
import * as adminService from "./admin.service";
import { JobStatus } from "@prisma/client";

function qs(req: Request, key: string): string | undefined {
  const v = req.query[key];
  if (v === undefined || v === null) return undefined;
  if (Array.isArray(v)) return String(v[0]);
  return String(v);
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export async function getStats(req: Request, res: Response, next: NextFunction) {
  try {
    const stats = await adminService.getAdminStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function getUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const page = qs(req, "page");
    const limit = qs(req, "limit");
    const data = await adminService.getAdminUsers({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search: qs(req, "search"),
      role: qs(req, "role"),
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = String(req.params.userId);
    const result = await adminService.deleteUser(userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function grantSkillsAccess(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = String(req.params.userId);
    const { courseId } = req.body as { courseId?: string };
    if (!courseId) {
      res.status(400).json({ error: { message: "courseId is required in the request body" } });
      return;
    }
    const result = await adminService.grantSkillsAccess(userId, courseId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function revokeSkillsAccess(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = String(req.params.userId);
    const { courseId } = req.body as { courseId?: string };
    if (!courseId) {
      res.status(400).json({ error: { message: "courseId is required in the request body" } });
      return;
    }
    const result = await adminService.revokeSkillsAccess(userId, courseId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// ─── Talents ──────────────────────────────────────────────────────────────────

export async function getTalents(req: Request, res: Response, next: NextFunction) {
  try {
    const page = qs(req, "page");
    const limit = qs(req, "limit");
    const data = await adminService.getAdminTalents({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search: qs(req, "search"),
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
}

// ─── Companies ────────────────────────────────────────────────────────────────

export async function getCompanies(req: Request, res: Response, next: NextFunction) {
  try {
    const page = qs(req, "page");
    const limit = qs(req, "limit");
    const data = await adminService.getAdminCompanies({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search: qs(req, "search"),
      subscriptionStatus: qs(req, "subscriptionStatus"),
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
}

// ─── Jobs ─────────────────────────────────────────────────────────────────────

export async function getJobs(req: Request, res: Response, next: NextFunction) {
  try {
    const page = qs(req, "page");
    const limit = qs(req, "limit");
    const data = await adminService.getAdminJobs({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search: qs(req, "search"),
      status: qs(req, "status"),
      employmentType: qs(req, "employmentType"),
      experienceLevel: qs(req, "experienceLevel"),
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function getJobById(req: Request, res: Response, next: NextFunction) {
  try {
    const jobId = String(req.params.jobId);
    const data = await adminService.getAdminJobById(jobId);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function updateJobStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const jobId = String(req.params.jobId);
    const { status } = req.body as { status: JobStatus };
    if (!["ACTIVE", "CLOSED"].includes(status)) {
      res.status(400).json({ error: { message: "Invalid status. Must be ACTIVE or CLOSED." } });
      return;
    }
    const data = await adminService.adminUpdateJobStatus(jobId, status);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function deleteJob(req: Request, res: Response, next: NextFunction) {
  try {
    const jobId = String(req.params.jobId);
    const result = await adminService.adminDeleteJob(jobId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// ─── Applications ─────────────────────────────────────────────────────────────

export async function getApplications(req: Request, res: Response, next: NextFunction) {
  try {
    const page = qs(req, "page");
    const limit = qs(req, "limit");
    const data = await adminService.getAdminApplications({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search: qs(req, "search"),
      status: qs(req, "status"),
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
}

// ─── Payments ─────────────────────────────────────────────────────────────────

export async function getPayments(req: Request, res: Response, next: NextFunction) {
  try {
    const page = qs(req, "page");
    const limit = qs(req, "limit");
    const data = await adminService.getAdminPayments({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search: qs(req, "search"),
      status: qs(req, "status"),
      paymentType: qs(req, "paymentType"),
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
}

// ─── Subscriptions ────────────────────────────────────────────────────────────

export async function getSubscriptions(req: Request, res: Response, next: NextFunction) {
  try {
    const page = qs(req, "page");
    const limit = qs(req, "limit");
    const data = await adminService.getAdminSubscriptions({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search: qs(req, "search"),
      status: qs(req, "status"),
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
}

// ─── Certificates ─────────────────────────────────────────────────────────────

export async function getCertificates(req: Request, res: Response, next: NextFunction) {
  try {
    const page = qs(req, "page");
    const limit = qs(req, "limit");
    const data = await adminService.getAdminCertificates({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search: qs(req, "search"),
      courseId: qs(req, "courseId"),
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function deleteCertificate(req: Request, res: Response, next: NextFunction) {
  try {
    const certId = String(req.params.certId);
    const result = await adminService.adminDeleteCertificate(certId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// ─── Notifications ────────────────────────────────────────────────────────────

export async function getNotifications(req: Request, res: Response, next: NextFunction) {
  try {
    const page = qs(req, "page");
    const limit = qs(req, "limit");
    const data = await adminService.getAdminNotifications({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      search: qs(req, "search"),
      type: qs(req, "type"),
      read: qs(req, "read"),
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function getUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = String(req.params.userId);
    const data = await adminService.getAdminUserById(userId);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function getTalentById(req: Request, res: Response, next: NextFunction) {
  try {
    const talentId = String(req.params.talentId);
    const data = await adminService.getAdminTalentById(talentId);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function getCompanyById(req: Request, res: Response, next: NextFunction) {
  try {
    const companyId = String(req.params.companyId);
    const data = await adminService.getAdminCompanyById(companyId);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function getApplicationById(req: Request, res: Response, next: NextFunction) {
  try {
    const appId = String(req.params.appId);
    const data = await adminService.getAdminApplicationById(appId);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function getSubscriptionById(req: Request, res: Response, next: NextFunction) {
  try {
    const subId = String(req.params.subId);
    const data = await adminService.getAdminSubscriptionById(subId);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function getCertificateById(req: Request, res: Response, next: NextFunction) {
  try {
    const certId = String(req.params.certId);
    const data = await adminService.getAdminCertificateById(certId);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function getNotificationById(req: Request, res: Response, next: NextFunction) {
  try {
    const id = String(req.params.id);
    const data = await adminService.getAdminNotificationById(id);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function getPaymentById(req: Request, res: Response, next: NextFunction) {
  try {
    const paymentId = String(req.params.paymentId);
    const data = await adminService.getAdminPaymentById(paymentId);
    res.json(data);
  } catch (err) {
    next(err);
  }
}
