"use client";

import React from "react";

export function GrowthCycleStrip() {
  return (
    <div className="bg-[#EEF3FF] border border-[#D9CEDF]/80 rounded-3xl p-8 sm:p-12">
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <span className="font-mono text-xs text-[#1E5BFF] uppercase tracking-wider font-semibold">
          The Continuous Growth Cycle
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#17131F]">
          How abilities turn into opportunities
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-[#D9CEDF] rounded-2xl p-6 space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#DDE7FF] text-[#1E5BFF] flex items-center justify-center font-mono font-bold text-sm">
            01
          </div>
          <h3 className="font-display text-xl font-bold text-[#17131F]">
            Learn
          </h3>
          <p className="font-sans text-sm text-[#6E6678]">
            Master practical modern stacks with industry-calibrated courses and coding exercises.
          </p>
        </div>

        <div className="bg-white border border-[#D9CEDF] rounded-2xl p-6 space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#DDE7FF] text-[#1E5BFF] flex items-center justify-center font-mono font-bold text-sm">
            02
          </div>
          <h3 className="font-display text-xl font-bold text-[#17131F]">
            Practice
          </h3>
          <p className="font-sans text-sm text-[#6E6678]">
            Build real application briefs with test suites, architectural decisions, and portfolio work.
          </p>
        </div>

        <div className="bg-white border border-[#D9CEDF] rounded-2xl p-6 space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#DDE7FF] text-[#1E5BFF] flex items-center justify-center font-mono font-bold text-sm">
            03
          </div>
          <h3 className="font-display text-xl font-bold text-[#17131F]">
            Prove
          </h3>
          <p className="font-sans text-sm text-[#6E6678]">
            Take rigorous skill assessments and generate verifiable digital certificates with score records.
          </p>
        </div>

        <div className="bg-white border border-[#D9CEDF] rounded-2xl p-6 space-y-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-[#DDE7FF] text-[#1E5BFF] flex items-center justify-center font-mono font-bold text-sm">
            04
          </div>
          <h3 className="font-display text-xl font-bold text-[#17131F]">
            Get Hired
          </h3>
          <p className="font-sans text-sm text-[#6E6678]">
            Match automatically with companies hiring for proven capabilities on Blih Talent.
          </p>
        </div>
      </div>
    </div>
  );
}
