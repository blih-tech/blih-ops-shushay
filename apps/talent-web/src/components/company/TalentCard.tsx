"use client";

import React from "react";
import Link from "next/link";
import { Button, Card } from "@blih/ui";
import { MapPin, Eye } from "lucide-react";
import type { TalentSearchResultItem } from "@/lib/talentApi";

interface TalentCardProps {
  talent: TalentSearchResultItem;
}

export function TalentCard({ talent }: TalentCardProps) {
  const location =
    [talent.city, talent.country].filter(Boolean).join(", ") || "Remote";

  return (
    <Card className="border border-[#D9CEDF] rounded-3xl shadow-sm bg-white overflow-hidden flex flex-col justify-between hover:border-[#1E5BFF]/50 hover:shadow-md transition-all duration-300">
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div
              className="w-12 h-12 rounded-full overflow-hidden border border-[#BFD0FF] shrink-0 bg-[#EEF3FF] relative flex items-center justify-center"
              style={{
                width: "48px",
                height: "48px",
                minWidth: "48px",
                minHeight: "48px",
                maxWidth: "48px",
                maxHeight: "48px",
                borderRadius: "50%",
              }}
            >
              {talent.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={talent.photoUrl}
                  alt={talent.fullName}
                  className="w-full h-full object-cover rounded-full"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
              ) : (
                <div className="w-full h-full bg-[#1E5BFF] text-white flex items-center justify-center font-display font-bold text-lg shadow-xs rounded-full">
                  {talent.fullName.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-[#17131F]">
                {talent.fullName}
              </h3>
              <p className="text-xs font-mono text-[#1E5BFF] font-semibold">
                {talent.title || "Technical Specialist"}
              </p>
            </div>
          </div>

          {talent.certificatesCount > 0 && (
            <div className="text-right">
              <span className="inline-block px-2 py-0.5 rounded-lg bg-[#E6F5F0] text-[#2E8F79] font-mono text-[10px] font-bold border border-[#2E8F79]/20">
                {talent.certificatesCount} CERTIFIED
              </span>
            </div>
          )}
        </div>

        {talent.bio && (
          <p className="text-xs text-[#6E6678] font-sans line-clamp-2 leading-relaxed">
            {talent.bio}
          </p>
        )}

        {talent.skills && talent.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {talent.skills.slice(0, 5).map((skill: string, si: number) => (
              <span
                key={si}
                className="px-2.5 py-0.5 rounded-lg bg-[#EEF3FF] border border-[#1E5BFF]/15 text-[11px] font-mono text-[#1E5BFF] font-medium"
              >
                {skill}
              </span>
            ))}
            {talent.skills.length > 5 && (
              <span className="px-2 py-0.5 text-[11px] font-mono text-[#6E6678]">
                +{talent.skills.length - 5}
              </span>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#D9CEDF]/60 text-xs font-mono text-[#6E6678]">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="h-3.5 w-3.5 text-[#1E5BFF]" />
            <span className="truncate">{location}</span>
          </div>
          <div className="text-right">
            {talent.englishLevel && (
              <>
                <span className="text-[#17131F] font-bold">
                  {talent.englishLevel}
                </span>{" "}
                English
              </>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-3.5 bg-[#EEF3FF]/30 border-t border-[#D9CEDF]/70 flex items-center justify-between">
        <span className="text-xs font-mono text-[#6E6678]">
          {talent.experienceCount} exp item
          {talent.experienceCount !== 1 ? "s" : ""}
        </span>
        <Link href={`/company/talents/${talent.id}`}>
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<Eye className="h-3.5 w-3.5" />}
          >
            View Profile
          </Button>
        </Link>
      </div>
    </Card>
  );
}
