import { useState, useEffect, useCallback } from "react";
import { Job, JobFilters } from "@/types/job";
import {
  listCompanyJobs,
  closeJob as apiCloseJob,
  reopenJob as apiReopenJob,
} from "@/lib/jobApi";

export function useCompanyJobs(initialFilters: JobFilters = {}) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobFilters>(initialFilters);

  const fetchCompanyJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await listCompanyJobs(filters);
      setJobs(res.jobs || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err: any) {
      console.error("Error fetching company jobs:", err);
      setError(err?.message || "Failed to load your jobs");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchCompanyJobs();
  }, [fetchCompanyJobs]);

  const closeJob = async (jobId: string) => {
    try {
      await apiCloseJob(jobId);
      await fetchCompanyJobs();
    } catch (err: any) {
      console.error("Error closing job:", err);
      throw err;
    }
  };

  const reopenJob = async (jobId: string) => {
    try {
      await apiReopenJob(jobId);
      await fetchCompanyJobs();
    } catch (err: any) {
      console.error("Error reopening job:", err);
      throw err;
    }
  };

  return {
    jobs,
    total,
    totalPages,
    loading,
    error,
    filters,
    setFilters,
    refetch: fetchCompanyJobs,
    closeJob,
    reopenJob,
  };
}
