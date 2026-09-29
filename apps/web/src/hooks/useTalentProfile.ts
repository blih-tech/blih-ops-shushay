import { useState, useEffect, useCallback } from "react";
import { TalentProfile } from "@/types/profile";
import { getTalentProfile } from "@/lib/talentApi";
import { getErrorMessage } from "@blih/api-client";

import { useAuth } from "@/providers/AuthProvider";
export function useTalentProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<TalentProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user || user.role !== "TALENT") {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getTalentProfile();
      setProfile(data);
    } catch (err: unknown) {
      console.error("Error fetching talent profile:", err);
      setError(getErrorMessage(err) || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [user]);

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

