"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Spinner, Badge } from "@/components/ui";
import { BookOpen, LogOut, LogIn, UserPlus } from "lucide-react";

export default function HomePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3003";

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }
  }, [user, loading, router]);

  if (loading || user) {
    return (
      <div className="flex-1 flex flex-col justify-center items-center bg-muted px-4 py-16">
        <div className="flex flex-col items-center gap-3">
          <Spinner size="lg" />
          <p className="text-sm text-muted-foreground font-sans animate-pulse">
            Redirecting...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col justify-center items-center bg-muted px-4 py-16">
      <Card className="max-w-xl w-full text-center">
        <CardHeader className="p-8 pb-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
            <BookOpen className="h-6 w-6" />
          </div>
          <CardTitle className="text-3xl">Blih Skills</CardTitle>
          <CardDescription className="text-base">
            Prepare for remote work with practical, expert-led courses.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 pt-2">
          <div className="flex justify-center gap-4 pt-2">
            <a
              href={`${AUTH_URL}/login?returnTo=${encodeURIComponent(
                window.location.origin + "/dashboard"
              )}`}
            >
              <Button
                variant="primary"
                leftIcon={<LogIn className="h-4 w-4" />}
              >
                Sign In
              </Button>
            </a>
            <a href={`${AUTH_URL}/register`}>
              <Button
                variant="outline"
                leftIcon={<UserPlus className="h-4 w-4" />}
              >
                Register
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
