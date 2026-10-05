"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { Role } from "@blih/types";
import {
  Spinner,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@blih/ui";
import { ShieldAlert } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const allowedRolesKey = allowedRoles ? allowedRoles.slice().sort().join(",") : "";

  useEffect(() => {
    if (!loading) {
      if (!user) {
        const returnTo = encodeURIComponent(window.location.pathname + window.location.search);
        router.replace(`/login?returnTo=${returnTo}`);
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Automatically redirect unauthorized users to their designated portal
        const targetPortal =
          user.role === "COMPANY"
            ? "/company"
            : user.role === "TALENT"
            ? "/dashboard"
            : user.role === "ADMIN"
            ? "/admin"
            : "/";
        if (typeof window !== "undefined" && window.location.pathname !== targetPortal) {
          window.location.href = targetPortal;
        }
      }
    }
  }, [user?.id, user?.role, loading, allowedRolesKey, router]);

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
    const targetPortalName =
      user.role === "ADMIN"
        ? "Admin Portal"
        : user.role === "COMPANY"
        ? "Company Portal"
        : "Dashboard";

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F8FC] px-4 relative antialiased">
        <Card className="max-w-md w-full text-center rounded-xl border border-[#D9CEDF] shadow-lg p-6 bg-white">
          <CardHeader className="p-4 pb-2">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-[#FFF0F0] text-[#EF4444] border border-[#EF4444]/20 flex items-center justify-center mb-3">
              <ShieldAlert className="h-7 w-7" />
            </div>
            <CardTitle className="text-2xl font-bold font-display text-[#17131F]">
              Access Restricted
            </CardTitle>
            <CardDescription className="text-sm text-[#6E6678] font-sans mt-1">
              You do not have permission to access this area. Redirecting to your {targetPortalName}...
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-4">
            <Button
              onClick={() => {
                if (user.role === "ADMIN") {
                  router.push("/admin");
                } else if (user.role === "COMPANY") {
                  router.push("/company");
                } else {
                  router.push("/dashboard");
                }
              }}
              variant="primary"
              fullWidth
              size="lg"
            >
              Go to {targetPortalName}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}

export default AuthGuard;
