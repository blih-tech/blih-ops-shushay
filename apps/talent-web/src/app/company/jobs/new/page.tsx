import React from "react";
import AuthGuard from "@/components/auth/AuthGuard";

export default function CompanyNewJobPage() {
  return (
    <AuthGuard allowedRoles={["COMPANY"]}>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground pb-6 border-b border-border">
          Create a New Job Listing
        </h1>
      </div>
    </AuthGuard>
  );
}
