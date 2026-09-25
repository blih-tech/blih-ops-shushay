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
      "bg-[#EEF3FF] border border-[#1E5BFF]/20 text-[#1E5BFF] shadow-xs",
    surface:
      "bg-[#F9F8FC] border border-[#D9CEDF] text-[#17131F] shadow-xs",
    white: "bg-white border border-[#D9CEDF] text-[#17131F] shadow-xs",
  };

  const valueColors = {
    primary: "text-[#1E5BFF]",
    surface: "text-[#1E5BFF]",
    white: "text-[#17131F]",
  };

  return (
    <div
      className={`rounded-xl p-4 sm:p-5 flex flex-col justify-center items-center text-center gap-1 transition-all duration-200 hover:border-[#1E5BFF]/30 ${variantStyles[variant]} ${className}`}
    >
      <span
        title={String(value)}
        className={`font-serif text-xl sm:text-2xl font-bold tracking-tight truncate w-full ${valueColors[variant]}`}
      >
        {value}
      </span>
      <span className="font-mono text-[10px] sm:text-xs text-[#6E6678] uppercase tracking-wider font-medium">
        {label}
      </span>
    </div>
  );
};
