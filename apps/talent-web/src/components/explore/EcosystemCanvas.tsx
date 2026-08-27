"use client";

import React from "react";
import { Card, CardTitle, CardDescription } from "@/components/ui";
import { ShieldCheck, Briefcase, Building2 } from "lucide-react";

export function EcosystemCanvas() {
  return (
    <div className="bg-[#EEF3FF] border border-[#D9CEDF] rounded-3xl p-8 sm:p-12 space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-wider text-[#1E5BFF] font-semibold">
            ONE PROFILE, CONTINUOUS GROWTH
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#17131F]">
            Evidence becomes professional identity.
          </h2>
        </div>
        <p className="font-sans text-sm sm:text-base text-[#6E6678] max-w-md">
          Learning, assessments, real projects and reviews strengthen one Skill Profile instead of living in separate places.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        <Card className="bg-white">
          <div className="w-10 h-10 rounded-xl bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <CardTitle className="text-xl mb-2">Verified Capabilities</CardTitle>
          <CardDescription>
            Stand out with proof scores calibrated by automated testing and expert evaluations.
          </CardDescription>
        </Card>

        <Card className="bg-white">
          <div className="w-10 h-10 rounded-xl bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center mb-4">
            <Briefcase className="w-5 h-5" />
          </div>
          <CardTitle className="text-xl mb-2">Evidence-Matched Jobs</CardTitle>
          <CardDescription>
            Receive tailored opportunity recommendations where your verified skills directly match employer requirements.
          </CardDescription>
        </Card>

        <Card className="bg-white">
          <div className="w-10 h-10 rounded-xl bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center mb-4">
            <Building2 className="w-5 h-5" />
          </div>
          <CardTitle className="text-xl mb-2">For Growing Companies</CardTitle>
          <CardDescription>
            Hire talent based on demonstrated abilities, reducing recruitment friction and onboarding ramp-up.
          </CardDescription>
        </Card>
      </div>
    </div>
  );
}
