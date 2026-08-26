"use client";

import React from "react";
import AuthGuard from "@/components/auth/AuthGuard";

export default function CompanyJobsPage() {
  return (
    <AuthGuard allowedRoles={["COMPANY"]}>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground pb-6 border-b border-border">
          My Published Jobs
        </h1>
        <div className="p-12 text-center bg-muted border border-border rounded-xl">
          <p className="text-sm text-muted-foreground font-sans">
            {"You haven't posted any job listings yet."}
          </p>
        </div>
      </div>
    </AuthGuard>
  );
}
