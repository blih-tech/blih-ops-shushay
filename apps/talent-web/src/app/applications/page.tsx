"use client";

import React from "react";
import AuthGuard from "@/components/auth/AuthGuard";

export default function ApplicationsPage() {
  return (
    <AuthGuard allowedRoles={["TALENT"]}>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground pb-6 border-b border-border">
          My Applications
        </h1>
        <div className="p-12 text-center bg-muted border border-dashed border-border rounded-xl">
          <p className="text-sm text-muted-foreground font-sans">
            {"You haven't submitted any job applications yet."}
          </p>
        </div>
      </div>
    </AuthGuard>
  );
}
