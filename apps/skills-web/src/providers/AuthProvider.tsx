"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { User } from "@/types/user";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";

export type { User };

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const fetchUser = async () => {
    try {
      const data = await apiFetch<{ user: User }>("/auth/me");
      setUser(data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const confirmLogout = async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
      setUser(null);
      setIsLogoutModalOpen(false);
      const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3003";
      window.location.href = `${AUTH_URL}/login`;
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
