"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Compass, AlertTriangle } from "lucide-react";
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui";
import { useAuth } from "@/providers/AuthProvider";

export default function NotFound() {
  const { user } = useAuth();

  // Determine home path based on user role
  const homePath = user
    ? user.role === "ADMIN"
      ? "/admin"
      : "/dashboard"
    : "/";

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-center items-center bg-muted px-4 py-16">
      <Card className="max-w-md w-full text-center border-border/60 shadow-xl">
        <CardHeader className="p-8 pb-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-4 animate-bounce">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h1 className="font-serif text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent mb-2">
            404
          </h1>
          <CardTitle className="text-2xl font-semibold text-foreground font-sans">
            Page Not Found
          </CardTitle>
          <CardDescription className="text-sm mt-2 text-muted-foreground font-sans">
            Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-8 pt-2 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={homePath} className="flex-1">
              <Button
                variant="primary"
                fullWidth
                leftIcon={<Compass className="h-4 w-4" />}
              >
                Go Home
              </Button>
            </Link>
            <Link href="/courses" className="flex-1">
              <Button
                variant="outline"
                fullWidth
                leftIcon={<BookOpen className="h-4 w-4" />}
              >
                All Courses
              </Button>
            </Link>
          </div>

          <div className="pt-2">
            <button
              onClick={() => window.history.back()}
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors duration-200 cursor-pointer font-sans"
            >
              <ArrowLeft className="h-3 w-3" /> Go Back
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
