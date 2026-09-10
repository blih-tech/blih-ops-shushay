import React from "react";

export interface MetricCardProps {
  value: string | number;
  label: string;
  variant?: "primary" | "surface" | "white";
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  value,
  label,
  variant = "surface",
  className = "",
}) => {
  const variantStyles = {
    primary:
      "bg-gradient-to-br from-[#EEF3FF] to-[#DDE7FF] border border-[#1E5BFF]/30 text-[#1E5BFF] shadow-xs",
    surface:
      "bg-gradient-to-br from-white via-[#F8FAFF] to-[#EEF3FF]/70 border border-[#D9CEDF]/80 text-[#17131F] shadow-xs",
    white: "bg-white border border-[#D9CEDF] text-[#17131F] shadow-xs",
  };

  const valueColors = {
    primary: "text-[#1E5BFF]",
    surface: "text-[#1E5BFF]",
    white: "text-[#17131F]",
  };

  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 flex flex-col justify-center items-center text-center gap-1 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${variantStyles[variant]} ${className}`}
    >
      <span
        title={String(value)}
        className={`font-display text-lg sm:text-xl font-bold tracking-tight truncate w-full ${valueColors[variant]}`}
      >
        {value}
      </span>
      <span className="font-mono text-[10px] sm:text-xs text-[#6E6678] uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
};
