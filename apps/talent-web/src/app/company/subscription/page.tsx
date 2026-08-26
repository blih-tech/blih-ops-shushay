"use client";

import React from "react";
import AuthGuard from "@/components/auth/AuthGuard";

export default function CompanySubscriptionPage() {
  return (
    <AuthGuard allowedRoles={["COMPANY"]}>
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground pb-6 border-b border-border">
          Manage Subscription
        </h1>
        <div className="p-8 bg-card border border-border rounded-xl space-y-4">
          <p className="text-sm text-body">
            Subscription options and billing history will load in future phases.
          </p>
        </div>
      </div>
    </AuthGuard>
  );
}
