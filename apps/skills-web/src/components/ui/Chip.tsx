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
    "inline-flex items-center font-mono font-normal rounded-xl transition-all duration-200 cursor-pointer select-none active:scale-[0.98]";

  const sizes = {
    sm: "text-[11px] px-2.5 py-1",
    md: "text-xs px-3.5 py-1.5",
  };

  const getVariantStyles = () => {
    if (active) {
      if (variant === "coral") {
        return "bg-[#FFF0EB] text-[#FF8A5B] border border-[#FF8A5B]";
      }
      return "bg-[#DDE7FF] text-[#1E5BFF] border border-[#1E5BFF]";
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
