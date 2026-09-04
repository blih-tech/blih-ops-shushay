"use client";

import React, { use } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, MapPin, DollarSign } from "lucide-react";
import { Button, Badge, Card, SkillBar } from "@blih/ui";
import AuthGuard from "@/components/auth/AuthGuard";
import { mockJobs } from "@/data";

interface PageProps {
  params: Promise<{ jobId: string }>;
}

function JobDetailsContent({ jobId }: { jobId: string }) {

  const job = mockJobs.find((j) => j.id === jobId) || mockJobs[0];

  return (
    <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Link
        href="/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-mono text-[#1E5BFF] hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Opportunities Feed
      </Link>

      {/* Job Header Card */}
      <div className="bg-white border border-[#D9CEDF] rounded-3xl p-6 sm:p-10 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#17131F]">
                {job.title}
              </h1>
              <Badge variant="verified">{job.matchScore}% Match</Badge>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono text-[#6E6678] flex-wrap pt-1">
              <span className="flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5 text-[#1E5BFF]" />{" "}
                {job.company}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-[#1E5BFF]" />{" "}
                {job.location}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="h-3.5 w-3.5 text-[#2E8F79]" />{" "}
                {job.salary}
              </span>
            </div>
          </div>

          <Button size="lg" variant="primary">
            Apply with Evidence Profile
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#D9CEDF]/60">
          {job.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-xl bg-[#EEF3FF] border border-[#1E5BFF]/15 text-xs font-mono text-[#1E5BFF] font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Job Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8 space-y-6">
          <Card className="border border-[#D9CEDF] rounded-3xl p-6 sm:p-8 space-y-4 bg-white">
            <h2 className="font-display text-xl font-bold text-[#17131F]">
              Role Overview
            </h2>
            <p className="text-sm text-[#6E6678] leading-relaxed font-sans">
              {job.description}
            </p>
            <p className="text-sm text-[#6E6678] leading-relaxed font-sans">
              In this position, you will work closely with cross-functional
              product and engineering teams to design, architect, and ship
              high-impact features. Candidate selection is driven by verified
              technical proof rather than traditional resume keywords.
            </p>
          </Card>
        </div>

        <div className="md:col-span-4 space-y-6">
          <Card className="border border-[#D9CEDF] rounded-3xl p-6 space-y-4 bg-white">
            <h3 className="font-display text-lg font-bold text-[#17131F]">
              Required Proof Scores
            </h3>
            <div className="space-y-3">
              {job.requiredSkills.map((req) => (
                <SkillBar
                  key={req.name}
                  name={req.name}
                  score={req.score}
                  status="Benchmark"
                  variant="primary"
                />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}

export default function JobDetailsPage({ params }: PageProps) {
  const resolvedParams = use(params);
  return (
    <AuthGuard allowedRoles={["TALENT", "COMPANY", "ADMIN"]}>
      <JobDetailsContent jobId={resolvedParams.jobId} />
    </AuthGuard>
  );
}
