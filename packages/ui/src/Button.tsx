import React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "coral" | "destructive" | "dark";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = "",
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap font-sans font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1E5BFF]/20 focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none rounded-xl cursor-pointer select-none active:scale-[0.98]";

    const variants = {
      primary: "bg-[#1E5BFF] text-white hover:bg-[#1546CC] active:bg-[#0F35A0] border border-transparent shadow-[0_2px_10px_rgba(30,91,255,0.2)]",
      secondary: "bg-[#EEF3FF] text-[#1E5BFF] hover:bg-[#DDE7FF] border border-[#1E5BFF]/20",
      outline: "border border-[#D9CEDF] bg-white text-[#17131F] hover:bg-[#EEF3FF] hover:border-[#1E5BFF]/30",
      ghost: "text-[#17131F] hover:bg-[#EEF3FF] border border-transparent",
      coral: "bg-[#FF8A5B] text-white hover:bg-[#E57648] active:bg-[#CC6338] border border-transparent shadow-[0_2px_10px_rgba(255,138,91,0.2)]",
      destructive: "bg-[#EF4444] text-white hover:bg-[#DC2626] border border-transparent shadow-[0_2px_10px_rgba(239,68,68,0.2)]",
      dark: "bg-[#17131F] text-white hover:bg-[#252030] border border-transparent shadow-sm",
    };

    const sizes = {
      sm: "px-3.5 py-2 text-xs gap-1.5 h-9 min-h-[36px]",
      md: "px-5 py-3 text-sm gap-2 h-12 min-h-[48px]",
      lg: "px-7 py-3 text-base gap-2.5 h-12 min-h-[48px]",
    };

    const widthClass = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-current shrink-0" />
        ) : leftIcon ? (
          <span className="inline-flex shrink-0">{leftIcon}</span>
        ) : null}
        <span>{children}</span>
        {!isLoading && rightIcon ? <span className="inline-flex shrink-0">{rightIcon}</span> : null}
      </button>
    );
  }
);

Button.displayName = "Button";
