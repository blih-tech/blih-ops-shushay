import type { ApplicationStatus, SubscriptionPlan, SubscriptionStatus } from "@blih/types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const baseUrl = API_URL ? API_URL.replace(/\/+$/, "") : "";
  const normalizedPath = path.startsWith("/api/v1")
    ? path.replace(/^\/api\/v1/, "")
    : path;
  const url = `${baseUrl}${normalizedPath.startsWith("/") ? "" : "/"}${normalizedPath}`;

  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(
      res.status,
      body?.error?.message ?? "Request failed",
      body?.error?.details,
    );
  }

  return res.json();
}

/** For multipart/form-data uploads — do NOT set Content-Type (browser sets boundary). */
export async function apiFetchFormData<T>(
  path: string,
  formData: FormData,
  method = "POST",
): Promise<T> {
  const baseUrl = API_URL ? API_URL.replace(/\/+$/, "") : "";
  const normalizedPath = path.startsWith("/api/v1")
    ? path.replace(/^\/api\/v1/, "")
    : path;
  const url = `${baseUrl}${normalizedPath.startsWith("/") ? "" : "/"}${normalizedPath}`;

  const res = await fetch(url, {
    method,
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(
      res.status,
      body?.error?.message ?? "Upload failed",
      body?.error?.details,
    );
  }

  return res.json();
}

// ─── Payment & Entitlement API Client Helpers ────────────────────────────────

export async function initializeSkillsPayment(returnUrl?: string) {
  return apiFetch<{
    alreadyHasAccess: boolean;
    checkoutUrl: string | null;
    txRef: string | null;
  }>("/payments/skills/initialize", {
    method: "POST",
    body: JSON.stringify({ returnUrl }),
  });
}

export async function verifyPayment(txRef: string) {
  return apiFetch<{
    verified: boolean;
    payment: any;
    entitlement?: any;
    subscription?: any;
    message: string;
  }>(`/payments/verify/${txRef}`);
}

export async function getSkillsAccessStatus() {
  return apiFetch<{
    hasAccess: boolean;
    grantedAt?: string | null;
    payment?: any;
  }>(`/payments/skills/access-status`);
}

// ─── Company Subscription API Client Helpers ─────────────────────────────────

export async function initializeCompanySubscription(
  plan: SubscriptionPlan,
) {
  return apiFetch<{
    checkoutUrl: string | null;
    txRef: string;
    paymentId: string;
    alreadyActive?: boolean;
  }>("/company/subscription/initialize", {
    method: "POST",
    body: JSON.stringify({ plan }),
  });
}

export async function getCompanySubscriptionStatus() {
  return apiFetch<{
    hasActiveSubscription: boolean;
    subscription: {
      id: string;
      plan: SubscriptionPlan;
      status: SubscriptionStatus;
      amount: number;
      currency: string;
      startDate: string;
      expiresAt: string;
    } | null;
    expiresAt: string | null;
    daysRemaining: number;
  }>("/company/subscription/status");
}

// ─── Learning API Client Helpers ─────────────────────────────────────────────

export async function getCourseProgress(courseId: string) {
  return apiFetch<any>(`/learning/progress/${courseId}`);
}

export async function markLessonComplete(lessonId: string) {
  return apiFetch<any>("/learning/lesson/complete", {
    method: "POST",
    body: JSON.stringify({ lessonId }),
  });
}

export async function submitQuiz(quizId: string, answers: number[]) {
  return apiFetch<any>("/learning/quiz/submit", {
    method: "POST",
    body: JSON.stringify({ quizId, answers }),
  });
}

export async function submitAssignment(
  assignmentId: string,
  content?: string,
  file?: File,
) {
  const formData = new FormData();
  formData.append("assignmentId", assignmentId);
  if (content) {
    formData.append("content", content);
  }
  if (file) {
    formData.append("document", file);
  }
  return apiFetchFormData<any>("/learning/assignment/submit", formData);
}

// ─── Certificate API Client Helpers ──────────────────────────────────────────

export async function getUserCertificates() {
  return apiFetch<{ certificates: any[] }>("/certificates");
}

export function getCertificateDownloadUrl(certificateId: string): string {
  return `${API_URL}/certificates/${certificateId}/download`;
}

// ─── Jobs API Client Helpers ──────────────────────────────────────────────────

function buildQueryString(params?: Record<string, any>): string {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

export async function listActiveJobs(params?: Record<string, any>) {
  return apiFetch<any>(`/jobs${buildQueryString(params)}`);
}

export async function getJobById(jobId: string) {
  return apiFetch<any>(`/jobs/${jobId}`);
}

export async function createJob(data: any) {
  return apiFetch<any>("/jobs", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateJob(jobId: string, data: any) {
  return apiFetch<any>(`/jobs/${jobId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function closeJob(jobId: string) {
  return apiFetch<any>(`/jobs/${jobId}/close`, {
    method: "POST",
  });
}

export async function listCompanyJobs(params?: Record<string, any>) {
  return apiFetch<any>(`/jobs/company/mine${buildQueryString(params)}`);
}

// ─── Job Applications API Client Helpers ─────────────────────────────────────

export async function applyToJob(jobId: string, coverLetter?: string) {
  return apiFetch<any>("/applications", {
    method: "POST",
    body: JSON.stringify({ jobId, coverLetter }),
  });
}

export async function getTalentApplications() {
  return apiFetch<any[]>("/applications/mine");
}

export async function getJobApplications(jobId: string) {
  return apiFetch<any[]>(`/applications/job/${jobId}`);
}

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus,
) {
  return apiFetch<any>(`/applications/${applicationId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

// ─── Notifications API Client Helpers ────────────────────────────────────────

export async function getUserNotifications() {
  return apiFetch<any[]>("/notifications");
}

export async function markNotificationAsRead(id: string) {
  return apiFetch<any>(`/notifications/${id}/read`, {
    method: "PATCH",
  });
}

// ─── Talent Search API Client Helpers ────────────────────────────────────────

export async function searchTalents(params?: Record<string, any>) {
  return apiFetch<any>(`/talents/search${buildQueryString(params)}`);
}

// ─── Company API Client Helpers ─────────────────────────────────────────────

export async function getCompanyById(companyId: string) {
  return apiFetch<any>(`/companies/${companyId}`);
}
