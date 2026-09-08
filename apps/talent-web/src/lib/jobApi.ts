import { apiFetch } from "./api";
import {
  Job,
  JobsListResponse,
  CreateJobPayload,
  UpdateJobPayload,
  JobFilters,
} from "@/types/job";

function buildQuery(filters?: JobFilters): string {
  if (!filters) return "";
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== "") {
      params.append(key, String(val));
    }
  });
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function listActiveJobs(
  filters?: JobFilters,
): Promise<JobsListResponse> {
  return apiFetch<JobsListResponse>(`/jobs${buildQuery(filters)}`);
}

export async function getJobById(jobId: string): Promise<Job> {
  return apiFetch<Job>(`/jobs/${jobId}`);
}

export async function createJob(payload: CreateJobPayload): Promise<Job> {
  return apiFetch<Job>("/jobs", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateJob(
  jobId: string,
  payload: UpdateJobPayload,
): Promise<Job> {
  return apiFetch<Job>(`/jobs/${jobId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function closeJob(jobId: string): Promise<Job> {
  return apiFetch<Job>(`/jobs/${jobId}/close`, {
    method: "POST",
  });
}

export async function listCompanyJobs(
  filters?: JobFilters,
): Promise<JobsListResponse> {
  return apiFetch<JobsListResponse>(`/jobs/company/mine${buildQuery(filters)}`);
}

export async function applyToJob(
  jobId: string,
  coverLetter?: string,
): Promise<any> {
  return apiFetch<any>("/applications", {
    method: "POST",
    body: JSON.stringify({ jobId, coverLetter }),
  });
}

export async function getTalentApplications(): Promise<any[]> {
  return apiFetch<any[]>("/applications/mine");
}

export async function getJobApplications(jobId: string): Promise<any[]> {
  return apiFetch<any[]>(`/applications/job/${jobId}`);
}

export async function updateApplicationStatus(
  applicationId: string,
  status: "IN_REVIEW",
): Promise<any> {
  return apiFetch<any>(`/applications/${applicationId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

