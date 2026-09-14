import React from "react";
import Link from "next/link";
import { Button, Card } from "@blih/ui";
import { MapPin, Eye, Award } from "lucide-react";
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
        {/* Header: Avatar, Name, Title, and Verified Credentials Badge */}
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-[#BFD0FF] shrink-0 bg-[#EEF3FF] relative flex items-center justify-center">
            {talent.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={talent.photoUrl}
                alt={talent.fullName}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full bg-[#1E5BFF] text-white flex items-center justify-center font-display font-bold text-lg shadow-xs rounded-full">
                {talent.fullName.charAt(0)}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1 space-y-1">
            <h3 className="font-display text-base sm:text-lg font-bold text-[#17131F] truncate leading-tight">
              {talent.fullName}
            </h3>
            <p className="text-xs font-mono text-[#1E5BFF] font-semibold truncate">
              {talent.title || "Technical Specialist"}
            </p>
            {talent.certificatesCount > 0 && (
              <div className="pt-0.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E6F5F0] text-[#2E8F79] font-mono text-[11px] font-bold border border-[#BDE8D0]">
                  <Award className="w-3 h-3 text-[#2E8F79] shrink-0" />
                  <span>
                    {talent.certificatesCount} Verified {talent.certificatesCount === 1 ? "Credential" : "Credentials"}
                  </span>
                </span>
              </div>
            )}
          </div>
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
