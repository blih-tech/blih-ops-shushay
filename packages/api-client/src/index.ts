import type {
  ApplicationStatus,
  SubscriptionPlan,
  SubscriptionStatus,
  Job,
  CreateJobPayload,
  UpdateJobPayload,
  JobsListResponse,
  JobFilters
} from "@blih/types";

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

/**
 * Safely extracts a human-readable error message from any thrown value.
 * Use this instead of `(err as any).message` in catch blocks.
 *
 * @example
 * try { ... } catch (err: unknown) { setError(getErrorMessage(err)); }
 */
export function getErrorMessage(err: unknown): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "An unexpected error occurred";
}

export function buildUrl(path: string): string {
  const baseUrl = API_URL ? API_URL.replace(/\/+$/, "") : "";
  const normalizedPath = path.startsWith("/api/v1")
    ? path.replace(/^\/api\/v1/, "")
    : path;
  return `${baseUrl}${normalizedPath.startsWith("/") ? "" : "/"}${normalizedPath}`;
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = buildUrl(path);

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
  const url = buildUrl(path);

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

// ─── Payment & Enrollment API Client Helpers ──────────────────────────────────

/**
 * Initiates a payment checkout session for a specific course.
 * Returns a Chapa checkout URL, or alreadyEnrolled=true if already enrolled.
 */
export async function initializeCoursePayment(courseId: string) {
  return apiFetch<{
    alreadyEnrolled: boolean;
    checkoutUrl: string | null;
    txRef: string | null;
  }>("/payments/courses/enroll", {
    method: "POST",
    body: JSON.stringify({ courseId }),
  });
}

export async function verifyPayment(txRef: string) {
  return apiFetch<{
    verified: boolean;
    payment: any;
    enrollment?: any;
    subscription?: any;
    message: string;
  }>(`/payments/verify/${txRef}`);
}

/**
 * Returns whether the authenticated user is enrolled in a specific course.
 */
export async function getCourseAccessStatus(courseId: string) {
  return apiFetch<{
    hasAccess: boolean;
    grantedAt?: string | null;
    enrollment?: any;
  }>(`/payments/courses/${courseId}/access-status`);
}

/**
 * Returns all courses the authenticated user is enrolled in.
 */
export async function getUserEnrollments() {
  return apiFetch<
    Array<{
      courseId: string;
      grantedAt: string;
      course: { id: string; title: string; status: string };
    }>
  >("/payments/enrollments");
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

export function buildQueryString(params?: Record<string, any>): string {
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

export async function listActiveJobs(params?: JobFilters) {
  return apiFetch<JobsListResponse>(`/jobs${buildQueryString(params)}`);
}

export async function getJobById(jobId: string) {
  return apiFetch<Job>(`/jobs/${jobId}`);
}

export async function createJob(data: CreateJobPayload) {
  return apiFetch<Job>("/jobs", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateJob(jobId: string, data: UpdateJobPayload) {
  return apiFetch<Job>(`/jobs/${jobId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function closeJob(jobId: string) {
  return apiFetch<Job>(`/jobs/${jobId}/close`, {
    method: "POST",
  });
}

export async function listCompanyJobs(params?: JobFilters) {
  return apiFetch<JobsListResponse>(`/jobs/company/mine${buildQueryString(params)}`);
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
