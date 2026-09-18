import { useState, useEffect, useCallback } from "react";
import { CompanyProfile } from "@/types/profile";
import { getCompanyProfile } from "@/lib/companyApi";
import { getErrorMessage } from "@blih/api-client";

export function useCompanyProfile() {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCompanyProfile();
      setProfile(data);
    } catch (err: unknown) {
      console.error("Error fetching company profile:", err);
      setError(getErrorMessage(err) || "Failed to load company profile");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    refetch: fetchProfile,
    setProfile,
  };
}
