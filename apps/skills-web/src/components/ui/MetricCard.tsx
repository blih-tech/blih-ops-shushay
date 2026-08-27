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
    primary: "bg-[#DDE7FF] border border-[#1E5BFF]/20 text-[#1E5BFF]",
    surface: "bg-[#EEF3FF] border border-[#D9CEDF]/70 text-[#17131F]",
    white: "bg-white border border-[#D9CEDF] text-[#17131F] shadow-sm",
  };

  const valueColors = {
    primary: "text-[#1E5BFF]",
    surface: "text-[#1E5BFF]",
    white: "text-[#17131F]",
  };

  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 flex flex-col justify-center items-center text-center gap-1 transition-all ${variantStyles[variant]} ${className}`}
    >
      <span className={`font-display text-2xl sm:text-3xl font-bold tracking-tight ${valueColors[variant]}`}>
        {value}
      </span>
      <span className="font-mono text-[10px] sm:text-xs text-[#6E6678] uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
};
