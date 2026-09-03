"use client";

import React from "react";
import Link from "next/link";
import { Badge, Button } from "@blih/ui";
import { ArrowRight, MapPin, DollarSign, ShieldCheck } from "lucide-react";
import { MOCK_FEATURED_JOBS } from "@/data/mockExploreData";

export function FeaturedJobsPreview() {
  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <Badge variant="coral" size="sm">
            Live Hiring Stream
          </Badge>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#17131F] tracking-tight">
            Matched Opportunities Ready For Proof
          </h2>
          <p className="font-sans text-base text-[#6E6678] max-w-xl">
            Positions with upfront compensation, verified technical requirements, and direct application via profile evidence.
          </p>
        </div>
        <Link href="/jobs" className="shrink-0">
          <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
            View All Openings
          </Button>
        </Link>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_FEATURED_JOBS.map((job) => (
          <div
            key={job.id}
            className="bg-white border border-[#D9CEDF] rounded-3xl p-6 shadow-[0_4px_20px_rgba(23,19,31,0.04)] hover:shadow-[0_16px_40px_rgba(30,91,255,0.08)] hover:border-[#1E5BFF]/40 transition-all duration-300 flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[11px] font-semibold text-[#1E5BFF] bg-[#EEF3FF] px-3 py-1 rounded-full flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {job.matchScore}
                </span>
                <span className="font-mono text-[11px] text-[#6E6678] uppercase tracking-wider">
                  {job.type}
                </span>
              </div>

              <div>
                <h3 className="font-display text-xl font-bold text-[#17131F] group-hover:text-[#1E5BFF] transition-colors leading-snug">
                  {job.title}
                </h3>
                <p className="font-sans text-sm font-medium text-[#6E6678] mt-1">
                  {job.company}
                </p>
              </div>

              <div className="space-y-1.5 font-sans text-xs text-[#6E6678] pt-2 border-t border-[#D9CEDF]/50">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#1E5BFF]" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5 text-[#FF8A5B]" />
                  <span className="font-semibold text-[#17131F]">{job.salary}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="font-mono text-[10px] bg-[#FAF9FC] text-[#6E6678] border border-[#D9CEDF]/60 px-2.5 py-1 rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[#D9CEDF]/50">
              <Link href={`/jobs/${job.id}`}>
                <Button size="sm" fullWidth variant="secondary" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Apply with Profile Evidence
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
