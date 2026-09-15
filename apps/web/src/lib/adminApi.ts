import { apiFetch } from "./api";
import type {
  AdminStats,
  AdminUserListResponse,
  AdminTalentListResponse,
  AdminCompanyListResponse,
  AdminJobListResponse,
  AdminJobDetail,
  AdminApplicationListResponse,
  AdminPaymentListResponse,
  AdminSubscriptionListResponse,
  AdminCertificateListResponse,
  AdminNotificationListResponse,
} from "@/types/admin";

function qs(params: Record<string, any>): string {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") sp.append(k, String(v));
  });
  const s = sp.toString();
  return s ? `?${s}` : "";
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export async function fetchAdminStats(): Promise<AdminStats> {
  return apiFetch<AdminStats>("/admin/stats");
}

// ─── Users ────────────────────────────────────────────────────────────────────

export async function fetchAdminUsers(params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}): Promise<AdminUserListResponse> {
  return apiFetch<AdminUserListResponse>(`/admin/users${qs(params ?? {})}`);
}

export async function deleteAdminUser(userId: string): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(`/admin/users/${userId}`, {
    method: "DELETE",
  });
}

export async function grantAdminSkillsAccess(
  userId: string,
): Promise<{ alreadyGranted: boolean; entitlement: any }> {
  return apiFetch(`/admin/users/${userId}/skills-access`, { method: "POST" });
}

export async function revokeAdminSkillsAccess(userId: string): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(`/admin/users/${userId}/skills-access`, {
    method: "DELETE",
  });
}

// ─── Talents ──────────────────────────────────────────────────────────────────

export async function fetchAdminTalents(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<AdminTalentListResponse> {
  const result = await apiFetch<AdminTalentListResponse>(`/admin/talents${qs(params ?? {})}`);
  // Support legacy callers that expect a flat array — handle both shapes
  if (Array.isArray(result)) {
    return { talents: result as any, total: (result as any).length, page: 1, limit: 50, totalPages: 1 };
  }
  return result;
}

// ─── Companies ────────────────────────────────────────────────────────────────

export async function fetchAdminCompanies(params?: {
  page?: number;
  limit?: number;
  search?: string;
  subscriptionStatus?: string;
}): Promise<AdminCompanyListResponse> {
  const result = await apiFetch<AdminCompanyListResponse>(`/admin/companies${qs(params ?? {})}`);
  if (Array.isArray(result)) {
    return { companies: result as any, total: (result as any).length, page: 1, limit: 50, totalPages: 1 };
  }
  return result;
}

// ─── Jobs ─────────────────────────────────────────────────────────────────────

export async function fetchAdminJobs(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  employmentType?: string;
  experienceLevel?: string;
}): Promise<AdminJobListResponse> {
  return apiFetch<AdminJobListResponse>(`/admin/jobs${qs(params ?? {})}`);
}

export async function fetchAdminJobById(jobId: string): Promise<AdminJobDetail> {
  return apiFetch<AdminJobDetail>(`/admin/jobs/${jobId}`);
}

export async function updateAdminJobStatus(
  jobId: string,
  status: "ACTIVE" | "CLOSED",
): Promise<any> {
  return apiFetch(`/admin/jobs/${jobId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function deleteAdminJob(jobId: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/admin/jobs/${jobId}`, {
    method: "DELETE",
  });
}

// ─── Applications ─────────────────────────────────────────────────────────────

export async function fetchAdminApplications(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}): Promise<AdminApplicationListResponse> {
  return apiFetch<AdminApplicationListResponse>(`/admin/applications${qs(params ?? {})}`);
}

// ─── Payments ─────────────────────────────────────────────────────────────────

export async function fetchAdminPayments(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  paymentType?: string;
}): Promise<AdminPaymentListResponse> {
  return apiFetch<AdminPaymentListResponse>(`/admin/payments${qs(params ?? {})}`);
}

// ─── Subscriptions ────────────────────────────────────────────────────────────

export async function fetchAdminSubscriptions(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}): Promise<AdminSubscriptionListResponse> {
  return apiFetch<AdminSubscriptionListResponse>(`/admin/subscriptions${qs(params ?? {})}`);
}

// ─── Certificates ─────────────────────────────────────────────────────────────

export async function fetchAdminCertificates(params?: {
  page?: number;
  limit?: number;
  search?: string;
  courseId?: string;
}): Promise<AdminCertificateListResponse> {
  return apiFetch<AdminCertificateListResponse>(`/admin/certificates${qs(params ?? {})}`);
}

export async function deleteAdminCertificate(certId: string): Promise<{ message: string }> {
  return apiFetch<{ message: string }>(`/admin/certificates/${certId}`, {
    method: "DELETE",
  });
}

// ─── Notifications ────────────────────────────────────────────────────────────

export async function fetchAdminNotifications(params?: {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  read?: string;
}): Promise<AdminNotificationListResponse> {
  return apiFetch<AdminNotificationListResponse>(`/admin/notifications${qs(params ?? {})}`);
}

// ─── Single Item Fetchers ──────────────────────────────────────────────────────

export async function fetchAdminUserById(userId: string): Promise<any> {
  return apiFetch(`/admin/users/${userId}`);
}

export async function fetchAdminTalentById(talentId: string): Promise<any> {
  return apiFetch(`/admin/talents/${talentId}`);
}

export async function fetchAdminCompanyById(companyId: string): Promise<any> {
  return apiFetch(`/admin/companies/${companyId}`);
}

export async function fetchAdminApplicationById(appId: string): Promise<any> {
  return apiFetch(`/admin/applications/${appId}`);
}

export async function fetchAdminPaymentById(paymentId: string): Promise<any> {
  return apiFetch(`/admin/payments/${paymentId}`);
}

export async function fetchAdminSubscriptionById(subId: string): Promise<any> {
  return apiFetch(`/admin/subscriptions/${subId}`);
}

export async function fetchAdminCertificateById(certId: string): Promise<any> {
  return apiFetch(`/admin/certificates/${certId}`);
}

export async function fetchAdminNotificationById(id: string): Promise<any> {
  return apiFetch(`/admin/notifications/${id}`);
}
