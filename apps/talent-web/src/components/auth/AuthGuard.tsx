"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { Role } from "@/types/user";
import { Spinner, Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui";
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted gap-3">
        <Spinner size="lg" color="primary" />
        <p className="text-sm text-muted-foreground font-sans animate-pulse">
          Loading security session...
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted px-4">
        <Card className="max-w-md w-full text-center">
          <CardHeader className="p-8 pb-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-2">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <CardTitle className="text-xl">Access Denied</CardTitle>
            <CardDescription className="text-sm">
              You do not have the required permissions to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-2">
            <Button
              onClick={() => {
                if (user.role === "COMPANY") {
                  window.location.href = "/company";
                } else {
                  window.location.href = "/profile";
                }
              }}
              variant="primary"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
