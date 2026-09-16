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
    primary: "bg-[#DDE7FF] text-[#1E5BFF] border border-[#1E5BFF]/20",
    default: "bg-[#DDE7FF] text-[#1E5BFF] border border-[#1E5BFF]/20",
    secondary: "bg-[#EEF3FF] text-[#17131F] border border-[#D9CEDF]",
    verified: "bg-[#E6F5F0] text-[#2E8F79] border border-[#2E8F79]/30",
    success: "bg-[#E6F5F0] text-[#2E8F79] border border-[#2E8F79]/30",
    coral: "bg-[#FFF0EB] text-[#FF8A5B] border border-[#FF8A5B]/30",
    amber: "bg-[#FFF9EB] text-[#DDAA3C] border border-[#DDAA3C]/30",
    warning: "bg-[#FFF9EB] text-[#DDAA3C] border border-[#DDAA3C]/30",
    danger: "bg-[#FFF0F0] text-[#EF4444] border border-[#EF4444]/30",
    outline: "bg-white text-[#6E6678] border border-[#D9CEDF]",
    dark: "bg-[#17131F] text-white border border-transparent",
  };

  const dotColors: Record<string, string> = {
    primary: "bg-[#1E5BFF]",
    default: "bg-[#1E5BFF]",
    secondary: "bg-[#6E6678]",
    verified: "bg-[#2E8F79]",
    success: "bg-[#2E8F79]",
    coral: "bg-[#FF8A5B]",
    amber: "bg-[#DDAA3C]",
    warning: "bg-[#DDAA3C]",
    danger: "bg-[#EF4444]",
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
