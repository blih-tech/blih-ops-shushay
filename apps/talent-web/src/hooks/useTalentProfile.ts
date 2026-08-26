import { useState, useEffect, useCallback } from "react";
import { TalentProfile } from "@/types/profile";
import { getTalentProfile } from "@/lib/talentApi";

export function useTalentProfile() {
  const [profile, setProfile] = useState<TalentProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTalentProfile();
      setProfile(data);
    } catch (err: any) {
      console.error("Error fetching talent profile:", err);
      setError(err?.message || "Failed to load profile");
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
    setProfile
  };
}
