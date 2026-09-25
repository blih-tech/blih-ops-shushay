import React from "react";

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  variant?: "default" | "accent" | "coral";
  size?: "sm" | "md";
}

export const Chip: React.FC<ChipProps> = ({
  children,
  active = false,
  variant = "default",
  size = "md",
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center font-mono font-medium rounded-md transition-all duration-150 cursor-pointer select-none active:translate-y-px";

  const sizes = {
    sm: "text-[11px] px-2.5 py-1",
    md: "text-xs px-3 py-1.5",
  };

  const getVariantStyles = () => {
    if (active) {
      if (variant === "coral") {
        return "bg-orange-50 text-orange-700 border border-orange-500";
      }
      return "bg-[#EEF3FF] text-[#1E5BFF] border border-[#1E5BFF]";
    }
    return "bg-white text-[#6E6678] border border-[#D9CEDF] hover:border-[#1E5BFF]/50 hover:text-[#17131F]";
  };

  return (
    <button
      type="button"
      className={`${baseStyles} ${sizes[size]} ${getVariantStyles()} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
