import type { JobFilters, JobsListResponse, Job, CreateJobPayload, UpdateJobPayload } from "@blih/types";
import { apiFetch, buildQueryString } from "./api";

export async function listActiveJobs(
  filters?: JobFilters,
): Promise<JobsListResponse> {
  return apiFetch<JobsListResponse>(`/jobs${buildQueryString(filters)}`);
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

export async function reopenJob(jobId: string): Promise<Job> {
  return apiFetch<Job>(`/jobs/${jobId}/reopen`, {
    method: "POST",
  });
}


export async function listCompanyJobs(
  filters?: JobFilters,
): Promise<JobsListResponse> {
  return apiFetch<JobsListResponse>(`/jobs/company/mine${buildQueryString(filters)}`);
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
