"use client";

import React from "react";
import Link from "next/link";
import AuthGuard from "@/components/auth/AuthGuard";
import { useAuth } from "@/providers/AuthProvider";
import { Button, Card, CardHeader, CardTitle, CardDescription, Badge } from "@/components/ui";
import { LogOut, Briefcase, Search, CreditCard, Building } from "lucide-react";

function CompanyDashboardContent() {
  const { user, logout } = useAuth();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              Company Portal
            </h1>
            <Badge variant="primary">COMPANY</Badge>
          </div>
          <p className="text-sm text-muted-foreground font-sans mt-1">
            Registered Email: <strong className="text-foreground">{user?.email}</strong>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
        <Card className="hover:border-primary/50 transition-colors cursor-pointer">
          <CardHeader className="p-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
              <Building className="h-5 w-5" />
            </div>
            <CardTitle className="text-lg">Company Profile</CardTitle>
            <CardDescription>
              Set up organization branding, website, and contacts.
            </CardDescription>
          </CardHeader>
          <div className="px-6 pb-6 mt-auto">
            <Link href="/company/profile">
              <Button size="sm" variant="outline" className="w-full">Manage Profile</Button>
            </Link>
          </div>
        </Card>

        <Card className="hover:border-primary/50 transition-colors cursor-pointer">
          <CardHeader className="p-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
              <Briefcase className="h-5 w-5" />
            </div>
            <CardTitle className="text-lg">Job Board</CardTitle>
            <CardDescription>
              Post unlimited job roles and review applicant pools.
            </CardDescription>
          </CardHeader>
          <div className="px-6 pb-6 mt-auto">
            <Button size="sm" variant="outline" disabled className="w-full">Phase 8 MVP</Button>
          </div>
        </Card>

        <Card className="hover:border-primary/50 transition-colors cursor-pointer">
          <CardHeader className="p-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
              <Search className="h-5 w-5" />
            </div>
            <CardTitle className="text-lg">Talent Search</CardTitle>
            <CardDescription>
              Browse remote-ready graduates and view profiles.
            </CardDescription>
          </CardHeader>
          <div className="px-6 pb-6 mt-auto">
            <Button size="sm" variant="outline" disabled className="w-full">Phase 8 MVP</Button>
          </div>
        </Card>

        <Card className="hover:border-primary/50 transition-colors cursor-pointer">
          <CardHeader className="p-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2">
              <CreditCard className="h-5 w-5" />
            </div>
            <CardTitle className="text-lg">Subscription</CardTitle>
            <CardDescription>
              Manage your subscription status (Chapa Integration).
            </CardDescription>
          </CardHeader>
          <div className="px-6 pb-6 mt-auto">
            <Button size="sm" variant="outline" disabled className="w-full">Phase 7 MVP</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function CompanyDashboardPage() {
  return (
    <AuthGuard allowedRoles={["COMPANY"]}>
      <CompanyDashboardContent />
    </AuthGuard>
  );
}
