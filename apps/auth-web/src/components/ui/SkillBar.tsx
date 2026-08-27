import React from "react";

export interface SkillBarProps {
  name: string;
  score: number; // 0 to 100
  status?: string; // e.g. "Verified", "Developing"
  variant?: "primary" | "coral" | "verified";
  className?: string;
}

export const SkillBar: React.FC<SkillBarProps> = ({
  name,
  score,
  status = "Verified",
  variant = "primary",
  className = "",
}) => {
  const fillColors = {
    primary: "bg-[#1E5BFF]",
    coral: "bg-[#FF8A5B]",
    verified: "bg-[#2E8F79]",
  };

  const textColors = {
    primary: "text-[#1E5BFF]",
    coral: "text-[#FF8A5B]",
    verified: "text-[#2E8F79]",
  };

  return (
    <div className={`flex items-center justify-between gap-4 py-2 ${className}`}>
      <span className="font-sans text-sm font-medium text-[#17131F] min-w-[110px] truncate">
        {name}
      </span>
      <div className="flex-1 bg-[#EEF3FF] h-2 rounded-full overflow-hidden relative">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${fillColors[variant]}`}
          style={{ width: `${Math.min(Math.max(score, 0), 100)}%` }}
        />
      </div>
      <div className="flex items-baseline gap-1 min-w-[64px] justify-end">
        <span className={`font-display text-base font-bold ${textColors[variant]}`}>
          {score}
        </span>
        {status && (
          <span className="font-mono text-[10px] text-[#6E6678]">
            {status}
          </span>
        )}
      </div>
    </div>
  );
};
