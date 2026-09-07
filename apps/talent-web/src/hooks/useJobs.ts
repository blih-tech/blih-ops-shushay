import { useState, useEffect, useCallback } from "react";
import { Job, JobFilters } from "@/types/job";
import { listActiveJobs } from "@/lib/jobApi";

export function useJobs(initialFilters: JobFilters = {}) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobFilters>(initialFilters);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listActiveJobs(filters);
      setJobs(res.jobs || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err: any) {
      console.error("Error fetching jobs:", err);
      setError(err?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  return {
    jobs,
    total,
    totalPages,
    loading,
    error,
    filters,
    setFilters,
    refetch: fetchJobs,
  };
}
