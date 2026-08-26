"use client";

import React, { use } from "react";
import AuthGuard from "@/components/auth/AuthGuard";

interface PageProps {
  params: Promise<{ talentId: string }>;
}

function CompanyTalentDetailsContent({ talentId }: { talentId: string }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground pb-6 border-b border-border">
        Talent Profile Details
      </h1>
      <div className="p-8 bg-card border border-border rounded-xl">
        <h3 className="text-md font-semibold text-foreground mb-2">Talent ID: {talentId}</h3>
        <p className="text-sm text-body">
          Full details are visible only with an active subscription.
        </p>
      </div>
    </div>
  );
}

export default function CompanyTalentDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  return (
    <AuthGuard allowedRoles={["COMPANY"]}>
      <CompanyTalentDetailsContent talentId={resolvedParams.talentId} />
    </AuthGuard>
  );
}
