"use client";

import React from "react";
import AuthGuard from "@/components/auth/AuthGuard";

export default function CompanyTalentSearchPage() {
  return (
    <AuthGuard allowedRoles={["COMPANY"]}>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground pb-6 border-b border-border">
          Search Graduates & Talents
        </h1>
        <div className="p-12 text-center bg-muted border border-border rounded-xl">
          <p className="text-sm text-muted-foreground font-sans">
            Graduate directory will be available to subscribers.
          </p>
        </div>
      </div>
    </AuthGuard>
  );
}
