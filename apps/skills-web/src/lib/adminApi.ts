import { apiFetch } from "./api";
import type {
  AdminStats,
  AdminTalentItem,
  AdminCompanyItem,
} from "@/types/admin";

export async function fetchAdminStats(): Promise<AdminStats> {
  return apiFetch<AdminStats>("/admin/stats");
}

export async function fetchAdminTalents(): Promise<AdminTalentItem[]> {
  const data = await apiFetch<AdminTalentItem[]>("/admin/talents");
  return data || [];
}

export async function fetchAdminCompanies(): Promise<AdminCompanyItem[]> {
  const data = await apiFetch<AdminCompanyItem[]>("/admin/companies");
  return data || [];
}
