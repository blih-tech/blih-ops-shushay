"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Eye, Award, Briefcase, GraduationCap } from "lucide-react";
import { Button, Skeleton } from "@blih/ui";
import type { TalentSearchResultItem } from "@/lib/talentApi";

interface CompanyTalentsTableProps {
  talents: TalentSearchResultItem[];
  loading?: boolean;
}

const TableHeader = () => (
  <thead>
    <tr className="border-b border-[#D9CEDF]/70 bg-[#FAF9FC] text-[11px] font-mono font-semibold uppercase tracking-wider text-[#6E6678]">
      <th className="py-3.5 px-6">Candidate</th>
      <th className="py-3.5 px-6">Skills</th>
      <th className="py-3.5 px-6">Location</th>
      <th className="py-3.5 px-6">English</th>
      <th className="py-3.5 px-6">Evidence / Proof</th>
      <th className="py-3.5 px-6 text-right">Action</th>
    </tr>
  </thead>
);

export function CompanyTalentsTable({
  talents,
  loading = false,
}: CompanyTalentsTableProps) {
  if (loading) {
    return (
      <div className="bg-white border border-[#D9CEDF] rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <TableHeader />
            <tbody className="divide-y divide-[#D9CEDF]/40">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <Skeleton
                        variant="circular"
                        width={40}
                        height={40}
                        className="rounded-full bg-[#EEF3FF]"
                      />
                      <div className="space-y-1">
                        <Skeleton
                          variant="rectangular"
                          width={140}
                          height={16}
                          className="rounded bg-[#EEF3FF]"
                        />
                        <Skeleton
                          variant="rectangular"
                          width={100}
                          height={12}
                          className="rounded bg-[#EEF3FF]"
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-1.5">
                      <Skeleton
                        variant="rectangular"
                        width={50}
                        height={20}
                        className="rounded-md bg-[#EEF3FF]"
                      />
                      <Skeleton
                        variant="rectangular"
                        width={60}
                        height={20}
                        className="rounded-md bg-[#EEF3FF]"
                      />
                      <Skeleton
                        variant="rectangular"
                        width={45}
                        height={20}
                        className="rounded-md bg-[#EEF3FF]"
                      />
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <Skeleton
                      variant="rectangular"
                      width={100}
                      height={16}
                      className="rounded bg-[#EEF3FF]"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <Skeleton
                      variant="rectangular"
                      width={80}
                      height={20}
                      className="rounded-md bg-[#EEF3FF]"
                    />
                  </td>
                  <td className="py-4 px-6">
                    <Skeleton
                      variant="rectangular"
                      width={110}
                      height={20}
                      className="rounded-full bg-[#EEF3FF]"
                    />
                  </td>
                  <td className="py-4 px-6 text-right">
                    <Skeleton
                      variant="rectangular"
                      width={90}
                      height={32}
                      className="rounded-xl bg-[#EEF3FF] ml-auto"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#D9CEDF] rounded-3xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <TableHeader />
          <tbody className="divide-y divide-[#D9CEDF]/40 font-sans text-sm">
            {talents.map((talent) => {
              const location =
                [talent.city, talent.country].filter(Boolean).join(", ") ||
                "Remote";

              return (
                <tr
                  key={talent.id}
                  className="hover:bg-[#FAF9FC]/60 transition-colors duration-150"
                >
                  {/* Candidate Name & Title */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-[#BFD0FF] shrink-0 bg-[#EEF3FF] relative flex items-center justify-center aspect-square">
                        {talent.photoUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={talent.photoUrl}
                            alt={talent.fullName}
                            className="w-full h-full object-cover rounded-full aspect-square"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#1E5BFF] text-white flex items-center justify-center font-display font-bold text-sm shadow-2xs rounded-full">
                            {talent.fullName.charAt(0)}
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 max-w-xs sm:max-w-sm">
                        <Link
                          href={`/company/talents/${talent.id}`}
                          className="font-display font-bold text-[#17131F] hover:text-[#1E5BFF] transition-colors truncate block"
                        >
                          {talent.fullName}
                        </Link>
                        <p className="text-xs font-mono text-[#1E5BFF] font-semibold truncate">
                          {talent.title || "Technical Specialist"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Skills */}
                  <td className="py-4 px-6 max-w-xs">
                    {talent.skills && talent.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {talent.skills.slice(0, 3).map((skill: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-[#EEF3FF] border border-[#1E5BFF]/15 text-[11px] font-mono text-[#1E5BFF] font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {talent.skills.length > 3 && (
                          <span className="px-1.5 py-0.5 text-[11px] font-mono text-[#6E6678] bg-[#F4F1F7] rounded-md">
                            +{talent.skills.length - 3}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-[#6E6678] italic">
                        No skills listed
                      </span>
                    )}
                  </td>

                  {/* Location */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="flex items-center gap-1.5 text-xs text-[#17131F]">
                      <MapPin className="w-3.5 h-3.5 text-[#1E5BFF] shrink-0" />
                      <span className="truncate max-w-[140px]">{location}</span>
                    </div>
                  </td>

                  {/* English Proficiency */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    {talent.englishLevel ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-[#FAF9FC] text-[#17131F] border border-[#D9CEDF]/70">
                        {talent.englishLevel}
                      </span>
                    ) : (
                      <span className="text-xs text-[#6E6678]">-</span>
                    )}
                  </td>

                  {/* Evidence / Proof */}
                  <td className="py-4 px-6 whitespace-nowrap">
                    <div className="space-y-1">
                      {talent.certificatesCount > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E6F5F0] text-[#2E8F79] font-mono text-[11px] font-bold border border-[#BDE8D0]">
                          <Award className="w-3 h-3 text-[#2E8F79] shrink-0" />
                          <span>
                            {talent.certificatesCount} Verified
                          </span>
                        </span>
                      )}
                      <span className="text-xs font-mono text-[#6E6678] block">
                        {talent.experienceCount} exp item
                        {talent.experienceCount !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-4 px-6 whitespace-nowrap text-right">
                    <Link href={`/company/talents/${talent.id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 px-3 text-xs font-semibold rounded-xl border-[#D9CEDF] text-[#17131F] hover:bg-[#EEF3FF] hover:border-[#1E5BFF] hover:text-[#1E5BFF] transition-all"
                        leftIcon={<Eye className="h-3.5 w-3.5 text-[#1E5BFF]" />}
                      >
                        View Profile
                      </Button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
