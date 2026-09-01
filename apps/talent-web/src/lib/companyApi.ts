import { apiFetch } from "./api";
import { CompanyProfile } from "@/types/profile";

export async function getCompanyProfile(): Promise<CompanyProfile> {
  return apiFetch<CompanyProfile>("/companies/profile");
}

export async function updateCompanyProfile(
  data: Partial<CompanyProfile>,
): Promise<CompanyProfile> {
  return apiFetch<CompanyProfile>("/companies/profile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function uploadCompanyLogo(file: File): Promise<CompanyProfile> {
  const formData = new FormData();
  formData.append("logo", file);
  return apiFetch<CompanyProfile>("/companies/profile/logo", {
    method: "POST",
    body: formData,
  });
}

export async function deleteCompanyLogo(): Promise<CompanyProfile> {
  return apiFetch<CompanyProfile>("/companies/profile/logo", {
    method: "DELETE",
  });
}
