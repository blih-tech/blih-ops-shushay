import { useState, useEffect, useCallback } from "react";
import { searchTalents, TalentSearchResultItem } from "@/lib/talentApi";
import { ApiError } from "@/lib/api";
import { getErrorMessage } from "@blih/api-client";

export interface TalentSearchFilters {
  search?: string;
  skills?: string;
  englishLevel?: string;
  country?: string;
  city?: string;
  page?: number;
  limit?: number;
}

export function useTalentSearch(initialFilters: TalentSearchFilters = {}) {
  const [talents, setTalents] = useState<TalentSearchResultItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [subscriptionRequired, setSubscriptionRequired] =
    useState<boolean>(false);
  const [filters, setFilters] = useState<TalentSearchFilters>(initialFilters);

  const fetchTalents = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSubscriptionRequired(false);
    try {
      const res = await searchTalents(filters);
      setTalents(res.talents || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err: unknown) {
      console.error("Error searching talents:", err);
      if (err instanceof ApiError && err.status === 402) {
        setSubscriptionRequired(true);
        setError("Active company subscription required to search talents.");
      } else {
        setError(getErrorMessage(err) || "Failed to load talents");
      }
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTalents();
  }, [fetchTalents]);

  return {
    talents,
    total,
    totalPages,
    loading,
    error,
    subscriptionRequired,
    filters,
    setFilters,
    refetch: fetchTalents,
  };
}
