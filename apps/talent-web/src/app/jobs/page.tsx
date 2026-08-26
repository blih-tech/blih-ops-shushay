"use client";

import React from "react";
import AuthGuard from "@/components/auth/AuthGuard";

export default function JobsPage() {
  return (
    <AuthGuard allowedRoles={["TALENT"]}>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground pb-6 border-b border-border">
          Browse Remote Jobs
        </h1>
        <div className="p-12 text-center bg-muted border border-border rounded-xl">
          <p className="text-sm text-muted-foreground font-sans">
            Job list will load once companies publish job positions.
          </p>
        </div>
      </div>
    </AuthGuard>
  );
}
