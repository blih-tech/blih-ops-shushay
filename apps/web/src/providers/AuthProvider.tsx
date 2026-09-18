"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { User } from "@blih/types";
import { Modal } from "@blih/ui";
import { Button } from "@blih/ui";

export type { User };

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      const data = await apiFetch<{ user: User }>("/auth/me");
      setUser(data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, []);

  const confirmLogout = async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
      setIsLogoutModalOpen(false);
      router.push("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const logout = async () => {
    setIsLogoutModalOpen(true);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, refresh: fetchUser }}>
      {children}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Sign Out"
        description="Are you sure you want to sign out?"
        size="sm"
        footer={
          <>
            <Button variant="outline" size="sm" className="w-24" onClick={() => setIsLogoutModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" className="w-24" onClick={confirmLogout}>
              Sign Out
            </Button>
          </>
        }
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
