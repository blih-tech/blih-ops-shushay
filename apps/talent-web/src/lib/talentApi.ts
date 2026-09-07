import { apiFetch } from "./api";
import { TalentProfile, Experience, Education } from "@/types/profile";

export async function getTalentProfile(): Promise<TalentProfile> {
  return apiFetch<TalentProfile>("/talents/profile");
}

export async function updateTalentProfile(
  data: Partial<TalentProfile>,
): Promise<TalentProfile> {
  return apiFetch<TalentProfile>("/talents/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function uploadTalentPhoto(file: File): Promise<TalentProfile> {
  const formData = new FormData();
  formData.append("photo", file);
  return apiFetch<TalentProfile>("/talents/profile/photo", {
    method: "POST",
    body: formData,
  });
}

export async function deleteTalentPhoto(): Promise<TalentProfile> {
  return apiFetch<TalentProfile>("/talents/profile/photo", {
    method: "DELETE",
  });
}

export async function uploadTalentCv(file: File): Promise<TalentProfile> {
  const formData = new FormData();
  formData.append("cv", file);
  return apiFetch<TalentProfile>("/talents/profile/cv", {
    method: "POST",
    body: formData,
  });
}

export async function deleteTalentCv(): Promise<TalentProfile> {
  return apiFetch<TalentProfile>("/talents/profile/cv", {
    method: "DELETE",
  });
}

export async function addExperience(
  data: Omit<Experience, "id" | "profileId">,
): Promise<Experience> {
  return apiFetch<Experience>("/talents/profile/experience", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateExperience(
  id: string,
  data: Partial<Omit<Experience, "id" | "profileId">>,
): Promise<Experience> {
  return apiFetch<Experience>(`/talents/profile/experience/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteExperience(
  id: string,
): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(`/talents/profile/experience/${id}`, {
    method: "DELETE",
  });
}

export async function addEducation(
  data: Omit<Education, "id" | "profileId">,
): Promise<Education> {
  return apiFetch<Education>("/talents/profile/education", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateEducation(
  id: string,
  data: Partial<Omit<Education, "id" | "profileId">>,
): Promise<Education> {
  return apiFetch<Education>(`/talents/profile/education/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteEducation(
  id: string,
): Promise<{ success: boolean }> {
  return apiFetch<{ success: boolean }>(`/talents/profile/education/${id}`, {
    method: "DELETE",
  });
}

export interface TalentSearchResultItem {
  id: string;
  userId: string;
  fullName: string;
  title?: string | null;
  bio?: string | null;
  photoUrl?: string | null;
  country?: string | null;
  city?: string | null;
  englishLevel?: string | null;
  skills: string[];
  experienceCount: number;
  educationCount: number;
  certificatesCount: number;
  isComplete: boolean;
}

export interface TalentSearchResponse {
  talents: TalentSearchResultItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function searchTalents(
  params?: Record<string, any>,
): Promise<TalentSearchResponse> {
  const searchParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, String(value));
      }
    });
  }
  const qs = searchParams.toString();
  return apiFetch<TalentSearchResponse>(`/talents/search${qs ? `?${qs}` : ""}`);
}

export async function getTalentProfileById(
  talentId: string,
): Promise<TalentProfile & { certificates?: any[]; completedCourses?: any[]; email?: string }> {
  return apiFetch<TalentProfile & { certificates?: any[]; completedCourses?: any[]; email?: string }>(
    `/talents/${talentId}`,
  );
}

