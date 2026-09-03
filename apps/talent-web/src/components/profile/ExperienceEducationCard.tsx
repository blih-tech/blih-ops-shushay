import React from "react";
import { Briefcase, GraduationCap } from "lucide-react";

export interface ExperienceEducationCardProps {
  experience?: any[];
  education?: any[];
}

export const ExperienceEducationCard: React.FC<ExperienceEducationCardProps> = ({
  experience,
  education,
}) => {
  return (
    <>
      {/* Work Experience */}
      {experience && experience.length > 0 && (
        <div className="bg-white border border-[#D9CEDF] rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
          <div className="space-y-1 pb-4 border-b border-[#D9CEDF]/70">
            <span className="font-mono text-xs uppercase tracking-wider text-[#1E5BFF] font-semibold">
              Professional Background
            </span>
            <h2 className="font-display text-2xl font-bold text-[#17131F]">
              Work Experience
            </h2>
          </div>

          <div className="space-y-6">
            {experience.map((exp: any, index: number) => (
              <div
                key={index}
                className="flex items-start gap-4 pb-6 border-b border-[#D9CEDF]/50 last:border-0 last:pb-0"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#EEF3FF] text-[#1E5BFF] flex items-center justify-center shrink-0 border border-[#1E5BFF]/20">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="font-display text-lg font-bold text-[#17131F]">
                      {exp.title}
                    </h4>
                    <span className="font-mono text-xs text-[#6E6678] bg-[#EEF3FF] px-3 py-1 rounded-full border border-[#D9CEDF]/60 self-start sm:self-auto">
                      {exp.startDate} – {exp.current ? "Present" : exp.endDate || "Ended"}
                    </span>
                  </div>
                  <p className="font-sans text-sm font-semibold text-[#1E5BFF]">
                    {exp.company}
                  </p>
                  {exp.description && (
                    <p className="font-sans text-sm text-[#6E6678] leading-relaxed pt-1">
                      {exp.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="bg-white border border-[#D9CEDF] rounded-3xl p-8 sm:p-10 shadow-sm space-y-6">
          <div className="space-y-1 pb-4 border-b border-[#D9CEDF]/70">
            <span className="font-mono text-xs uppercase tracking-wider text-[#6E6678] font-semibold">
              Academic & Accreditations
            </span>
            <h2 className="font-display text-2xl font-bold text-[#17131F]">
              Education & Credentials
            </h2>
          </div>

          <div className="space-y-6">
            {education.map((edu: any, index: number) => (
              <div
                key={index}
                className="flex items-start gap-4 pb-6 border-b border-[#D9CEDF]/50 last:border-0 last:pb-0"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#E6F5F0] text-[#2E8F79] flex items-center justify-center shrink-0 border border-[#2E8F79]/20">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h4 className="font-display text-lg font-bold text-[#17131F]">
                      {edu.degree} {edu.field ? `in ${edu.field}` : ""}
                    </h4>
                    <span className="font-mono text-xs text-[#2E8F79] bg-[#E6F5F0] px-3 py-1 rounded-full border border-[#2E8F79]/20 self-start sm:self-auto font-medium">
                      {edu.startYear
                        ? `${edu.startYear} – ${edu.endYear || "Present"}`
                        : edu.year || "Completed"}
                    </span>
                  </div>
                  <p className="font-sans text-sm text-[#6E6678]">
                    {edu.institution}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
