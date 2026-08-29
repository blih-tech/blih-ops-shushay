"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { Role } from "@/types/user";
import { Spinner, Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from "@blih/ui";
import { ShieldAlert } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export default function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { user, loading } = useAuth();
  const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3003";

  useEffect(() => {
    if (!loading && !user) {
      const returnTo = encodeURIComponent(window.location.href);
      window.location.href = `${AUTH_URL}/login?returnTo=${returnTo}`;
    }
  }, [user, loading, AUTH_URL]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-3 antialiased">
        <Spinner size="lg" />
        <p className="text-sm text-[#6E6678] font-sans">
          Verifying security session...
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4 relative antialiased">
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-[#EEF3FF] via-white/50 to-transparent pointer-events-none -z-10" />
        <Card className="max-w-md w-full text-center rounded-3xl border border-[#D9CEDF] shadow-lg p-6 bg-white">
          <CardHeader className="p-4 pb-2">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-[#FFF0F0] text-[#EF4444] border border-[#EF4444]/20 flex items-center justify-center mb-3">
              <ShieldAlert className="h-7 w-7" />
            </div>
            <CardTitle className="text-2xl font-bold font-display text-[#17131F]">Access Restricted</CardTitle>
            <CardDescription className="text-sm text-[#6E6678] font-sans mt-1">
              You do not have the required role permissions to access this workspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-4">
            <Button
              onClick={() => {
                if (user.role === "ADMIN") {
                  window.location.href = "/admin";
                } else {
                  window.location.href = "/dashboard";
                }
              }}
              variant="primary"
              fullWidth
              size="lg"
            >
              {user.role === "ADMIN" ? "Go to Admin Portal" : "Go to Dashboard"}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
