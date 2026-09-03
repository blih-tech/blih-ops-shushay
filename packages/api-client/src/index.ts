const API_URL = process.env.NEXT_PUBLIC_API_URL!;

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
    entitlement: any;
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
  file?: File
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
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";
  return `${API_URL}/certificates/${certificateId}/download`;
}
