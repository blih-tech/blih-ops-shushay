import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "primary"
    | "secondary"
    | "verified"
    | "success"
    | "coral"
    | "amber"
    | "warning"
    | "default"
    | "outline"
    | "dark"
    | "danger";
  size?: "sm" | "md";
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  size = "md",
  dot = false,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center font-mono font-medium rounded-full tracking-tight transition-colors";

  const variants: Record<string, string> = {
    primary: "bg-[#EEF3FF] text-[#1E5BFF] border border-[#1E5BFF]/20",
    default: "bg-[#F9F8FC] text-[#6E6678] border border-[#D9CEDF]",
    secondary: "bg-[#F4F1F8] text-[#17131F] border border-[#D9CEDF]",
    verified: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    coral: "bg-orange-50 text-orange-700 border border-orange-200",
    amber: "bg-amber-50 text-amber-700 border border-amber-200",
    warning: "bg-amber-50 text-amber-700 border border-amber-200",
    danger: "bg-red-50 text-red-700 border border-red-200",
    outline: "bg-white text-[#6E6678] border border-[#D9CEDF]",
    dark: "bg-[#17131F] text-white border border-transparent",
  };

  const dotColors: Record<string, string> = {
    primary: "bg-[#1E5BFF]",
    default: "bg-[#6E6678]",
    secondary: "bg-[#6E6678]",
    verified: "bg-emerald-500",
    success: "bg-emerald-500",
    coral: "bg-orange-500",
    amber: "bg-amber-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
    outline: "bg-[#6E6678]",
    dark: "bg-white",
  };

  const sizes = {
    sm: "text-[11px] px-2.5 py-0.5 gap-1.5",
    md: "text-xs px-3 py-1 gap-1.5",
  };

  return (
    <span
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size]} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant] || dotColors.primary}`}
        />
      )}
      {children}
    </span>
  );
};
