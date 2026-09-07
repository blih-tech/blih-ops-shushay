"use client";

import React from "react";
import { Briefcase, GraduationCap, Award } from "lucide-react";
import { Badge, Card } from "@blih/ui";

interface TalentCredentialSectionsProps {
  experience?: any[];
  education?: any[];
  certificates?: any[];
}

export function TalentCredentialSections({
  experience,
  education,
  certificates,
}: TalentCredentialSectionsProps) {
  return (
    <>
      {/* Experience Timeline */}
      {experience && experience.length > 0 && (
        <section className="reveal-profile-block space-y-4">
          <div className="flex items-center gap-2.5">
            <Briefcase className="h-5 w-5 text-[#1E5BFF]" />
            <h2 className="font-display text-xl font-bold text-[#17131F]">
              Work Experience
            </h2>
          </div>
          <div className="divide-y divide-[#E6EAF3] border-t border-b border-[#E6EAF3]">
            {experience.map((exp: any) => (
              <div key={exp.id} className="py-4 space-y-1.5">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <h4 className="font-sans text-base font-bold text-[#17131F]">
                    {exp.title}
                  </h4>
                  <span className="text-xs font-mono text-[#6E6678]">
                    {new Date(exp.startDate).getFullYear()} –{" "}
                    {exp.current
                      ? "Present"
                      : exp.endDate
                      ? new Date(exp.endDate).getFullYear()
                      : ""}
                  </span>
                </div>
                <p className="text-sm font-semibold text-[#1E5BFF]">
                  {exp.company}
                </p>
                {exp.description && (
                  <p className="text-sm text-[#6E6678] leading-relaxed pt-0.5">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="reveal-profile-block space-y-4">
          <div className="flex items-center gap-2.5">
            <GraduationCap className="h-5 w-5 text-[#1E5BFF]" />
            <h2 className="font-display text-xl font-bold text-[#17131F]">
              Education
            </h2>
          </div>
          <div className="divide-y divide-[#E6EAF3] border-t border-b border-[#E6EAF3]">
            {education.map((edu: any) => (
              <div key={edu.id} className="py-4 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <h4 className="font-sans text-base font-bold text-[#17131F]">
                    {edu.degree}
                  </h4>
                  <span className="text-xs font-mono text-[#6E6678]">
                    {edu.startYear} – {edu.endYear || "Present"}
                  </span>
                </div>
                <p className="text-sm font-semibold text-[#1E5BFF]">
                  {edu.institution} {edu.field ? `· ${edu.field}` : ""}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certificates & Completed Courses */}
      {certificates && certificates.length > 0 && (
        <section className="reveal-profile-block space-y-4">
          <div className="flex items-center gap-2.5">
            <Award className="h-5 w-5 text-[#2E8F79]" />
            <h2 className="font-display text-xl font-bold text-[#17131F]">
              Verified Certificates ({certificates.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {certificates.map((cert: any) => (
              <Card
                key={cert.id}
                className="p-4 border border-[#D9CEDF] rounded-2xl bg-white space-y-2"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="verified" size="sm">
                    Verified
                  </Badge>
                  <span className="text-[10px] font-mono text-[#6E6678]">
                    {new Date(
                      cert.createdAt || cert.issueDate,
                    ).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="font-display text-base font-bold text-[#17131F]">
                  {cert.course?.title || "Specialized Certification"}
                </h4>
                <p className="font-mono text-xs text-[#2E8F79]">
                  ID: {cert.certificateNumber}
                </p>
              </Card>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
