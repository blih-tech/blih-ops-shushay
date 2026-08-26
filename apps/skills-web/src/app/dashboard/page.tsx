"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/providers/AuthProvider";
import { Button, Card, CardHeader, CardTitle, CardDescription, Badge, Spinner } from "@/components/ui";
import { LogOut, BookOpen, Award, Settings } from "lucide-react";

function DashboardContent() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user?.role === "ADMIN") {
      router.push("/admin");
    }
  }, [user, router]);

  if (user?.role === "ADMIN") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-muted gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-muted-foreground font-sans animate-pulse">
          Redirecting to Admin Portal...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl 2xl:max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 2xl:px-12 py-8 2xl:py-12 space-y-6 2xl:space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-serif text-2xl sm:text-3xl 2xl:text-4xl font-semibold tracking-tight text-foreground">
              Skills Dashboard
            </h1>
            {user?.role && <Badge variant="primary">{user.role}</Badge>}
          </div>
          <p className="text-sm 2xl:text-base text-muted-foreground font-sans mt-1">
            Welcome back, <strong className="text-foreground">{user?.email}</strong>
          </p>
        </div>
        <div>
          <Button
            variant="outline"
            onClick={logout}
            leftIcon={<LogOut className="h-4 w-4" />}
            className="w-full sm:w-auto"
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <Card className="hover:border-primary/50 transition-colors cursor-pointer">
          <CardHeader className="p-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
              <BookOpen className="h-5 w-5" />
            </div>
            <CardTitle className="text-lg">My Courses</CardTitle>
            <CardDescription>
              Browse and learn remote-work skills.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:border-primary/50 transition-colors cursor-pointer">
          <CardHeader className="p-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
              <Award className="h-5 w-5" />
            </div>
            <CardTitle className="text-lg">Certificates</CardTitle>
            <CardDescription>
              View or download earned credentials.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:border-primary/50 transition-colors cursor-pointer">
          <CardHeader className="p-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
              <Settings className="h-5 w-5" />
            </div>
            <CardTitle className="text-lg">Settings</CardTitle>
            <CardDescription>
              Update learning preferences.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGuard allowedRoles={["TALENT", "ADMIN"]}>
      <DashboardContent />
    </AuthGuard>
  );
}
