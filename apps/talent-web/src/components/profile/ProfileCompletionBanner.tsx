import React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@blih/ui";

interface ProfileCompletionBannerProps {
  isComplete: boolean;
}

export const ProfileCompletionBanner: React.FC<ProfileCompletionBannerProps> = ({ isComplete }) => {
  if (isComplete) return null;

  return (
    <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 font-sans mb-6">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h4 className="font-semibold text-amber-900 text-sm sm:text-base leading-snug">
            Profile Incomplete
          </h4>
          <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
            Please finish setting up your profile so that companies can find you and you can apply for jobs.
          </p>
        </div>
      </div>
      <Link href="/profile/setup" className="shrink-0">
        <Button
          variant="primary"
          size="sm"
          className="bg-amber-600 hover:bg-amber-700 text-white border-transparent"
          rightIcon={<ArrowRight className="h-4 w-4" />}
        >
          Setup Profile
        </Button>
      </Link>
    </div>
  );
};
export default ProfileCompletionBanner;
