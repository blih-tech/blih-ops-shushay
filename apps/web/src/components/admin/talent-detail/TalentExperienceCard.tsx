"use client";

import React from "react";
import { Briefcase, GraduationCap } from "lucide-react";

interface TalentExperienceCardProps {
  talent: any;
}

export function TalentExperienceCard({ talent }: TalentExperienceCardProps) {
  const experiences: any[] = talent.experience || [];
  const educations: any[] = talent.education || [];

  return (
    <div className="space-y-6">
      {/* Bio Summary */}
      {talent.bio && (
        <div className="bg-white rounded-2xl border border-[#EBE5F0] shadow-xs p-6 space-y-3">
          <h2 className="font-display font-bold text-sm text-[#17131F] uppercase tracking-wider">
            About & Bio
          </h2>
          <p className="text-sm text-[#4A4453] leading-relaxed whitespace-pre-line">
            {talent.bio}
          </p>
        </div>
      )}

      {/* Work Experience */}
      <div className="bg-white rounded-2xl border border-[#EBE5F0] shadow-xs overflow-hidden">
        <div className="px-6 py-4.5 border-b border-[#EBE5F0] bg-[#FDFCFD] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#2E8F79]/10 text-[#2E8F79]">
              <Briefcase className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm text-[#17131F]">
                Work Experience
              </h2>
              <p className="text-xs text-[#6E6678]">
                Career trajectory and professional track record
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-[#6E6678] bg-[#F4EFF7] px-2.5 py-1 rounded-md">
            {experiences.length} {experiences.length === 1 ? "Role" : "Roles"}
          </span>
        </div>

        <div className="p-6">
          {experiences.length > 0 ? (
            <div className="space-y-5">
              {experiences.map((exp, idx) => (
                <div
                  key={exp.id || idx}
                  className={`flex gap-4 ${
                    idx > 0 ? "pt-5 border-t border-[#F4EFF7]" : ""
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-[#F9F8FC] border border-[#EBE5F0] flex items-center justify-center shrink-0 mt-0.5 text-[#17131F]">
                    <Briefcase className="h-4 w-4 text-[#6E6678]" />
                  </div>
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h3 className="font-semibold text-sm text-[#17131F]">
                        {exp.title}{" "}
                        <span className="text-[#6E6678] font-normal">
                          at {exp.company}
                        </span>
                      </h3>
                      <span className="text-xs font-mono text-[#9E95A8] shrink-0">
                        {new Date(exp.startDate).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}{" "}
                        –{" "}
                        {exp.current
                          ? "Present"
                          : exp.endDate
                          ? new Date(exp.endDate).toLocaleDateString("en-US", {
                              month: "short",
                              year: "numeric",
                            })
                          : "Present"}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="text-xs text-[#4A4453] leading-relaxed mt-1">
                        {exp.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-[#6E6678]">
              No work experience listed yet.
            </div>
          )}
        </div>
      </div>

      {/* Education */}
      <div className="bg-white rounded-2xl border border-[#EBE5F0] shadow-xs overflow-hidden">
        <div className="px-6 py-4.5 border-b border-[#EBE5F0] bg-[#FDFCFD] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#7B2CBF]/10 text-[#7B2CBF]">
              <GraduationCap className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm text-[#17131F]">
                Education History
              </h2>
              <p className="text-xs text-[#6E6678]">
                Academic degrees and credentials
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-[#6E6678] bg-[#F4EFF7] px-2.5 py-1 rounded-md">
            {educations.length} {educations.length === 1 ? "Record" : "Records"}
          </span>
        </div>

        <div className="p-6">
          {educations.length > 0 ? (
            <div className="space-y-4">
              {educations.map((edu, idx) => (
                <div
                  key={edu.id || idx}
                  className={`flex gap-4 ${
                    idx > 0 ? "pt-4 border-t border-[#F4EFF7]" : ""
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-[#F9F8FC] border border-[#EBE5F0] flex items-center justify-center shrink-0 mt-0.5 text-[#17131F]">
                    <GraduationCap className="h-4 w-4 text-[#6E6678]" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-sm text-[#17131F]">
                      {edu.degree} in {edu.fieldOfStudy || edu.field}
                    </h3>
                    <p className="text-xs text-[#6E6678]">
                      {edu.institution} · {edu.startYear} –{" "}
                      {edu.endYear || "Present"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-[#6E6678]">
              No formal education records listed.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
