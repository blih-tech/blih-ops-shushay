import React from "react";
import { Sparkles, CheckCircle2, ExternalLink } from "lucide-react";
import { Card, CardTitle, CardDescription, Button } from "@blih/ui";
import type { TalentProfile } from "@/types/talent";

interface ProfileCompletionCardProps {
  profile: TalentProfile | null;
  loading: boolean;
  talentUrl: string;
}

export function ProfileCompletionCard({
  profile,
  loading,
  talentUrl,
}: ProfileCompletionCardProps) {
  const getFriendlyFieldName = (field: string) => {
    const names: Record<string, string> = {
      fullName: "Full Name",
      title: "Professional Title",
      phone: "Phone Number",
      country: "Country",
      city: "City",
      englishLevel: "English Level",
      skills: "Skills List",
      experience: "Work Experience",
      education: "Education Details",
      cvUrl: "CV Document Upload",
    };
    return names[field] || field;
  };

  return (
    <Card className="border border-[#D9CEDF] rounded-3xl p-6 bg-white shadow-xs space-y-6">
      <div>
        <CardTitle className="text-xl font-bold font-display flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#1E5BFF]" />
          <span>Profile Completion</span>
        </CardTitle>
        <CardDescription className="font-sans text-xs text-[#6E6678] mt-1">
          Complete your verified profile to apply for opportunities.
        </CardDescription>
      </div>

      {!loading && profile && (
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-baseline text-sm">
              <span className="font-mono text-xs font-bold text-[#6E6678] uppercase">
                Current Level
              </span>
              <span className="font-display text-2xl font-bold text-[#1E5BFF]">
                {profile.profileCompletion.percentage}%
              </span>
            </div>
            <div className="w-full bg-[#EEF3FF] h-3 rounded-full overflow-hidden">
              <div
                className="bg-[#1E5BFF] h-full rounded-full transition-all duration-500"
                style={{
                  width: `${profile.profileCompletion.percentage}%`,
                }}
              />
            </div>
          </div>

          {profile.profileCompletion.missingFields.length > 0 ? (
            <div className="space-y-3">
              <span className="font-mono text-xs font-bold text-[#6E6678] uppercase block">
                Remaining Items (
                {profile.profileCompletion.missingFields.length})
              </span>
              <div className="space-y-2">
                {profile.profileCompletion.missingFields.map((field) => (
                  <div
                    key={field}
                    className="flex items-center gap-2 text-xs text-[#6E6678] font-sans"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#6E6678]" />
                    <span>{getFriendlyFieldName(field)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-sans text-[#2E8F79] bg-[#E6F5F0] p-3 rounded-xl border border-[#2E8F79]/10">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2E8F79]" />
              <span>
                Your profile is fully complete and ready for applications!
              </span>
            </div>
          )}

          <div className="pt-4 border-t border-[#D9CEDF]/50">
            <a
              href={`${talentUrl}/profile/edit`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                fullWidth
                size="sm"
                rightIcon={<ExternalLink className="w-3.5 h-3.5" />}
              >
                Upload CV & Experience
              </Button>
            </a>
          </div>
        </div>
      )}
    </Card>
  );
}
