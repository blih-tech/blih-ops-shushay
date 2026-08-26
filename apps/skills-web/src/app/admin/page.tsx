"use client";

import React from "react";
import Link from "next/link";
import { BookOpen, ChevronRight, LogOut } from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import { Button, Card, CardHeader, CardTitle, CardDescription } from "@/components/ui";
import { useAuth } from "@/providers/AuthProvider";

function AdminContent() {
  const { logout } = useAuth();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
            Administration Portal
          </h1>
          <p className="text-sm text-muted-foreground font-sans mt-1">
            Manage Blih Skills courses and content.
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/admin/courses" className="block group">
          <Card className="h-full hover:border-primary/50 hover:shadow-sm transition-all">
            <CardHeader className="p-6">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-3">
                  <BookOpen className="h-5 w-5" />
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
              </div>
              <CardTitle className="text-lg">Courses</CardTitle>
              <CardDescription>Create, edit, publish, and manage course content and lessons.</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <AdminContent />
    </AuthGuard>
  );
}
