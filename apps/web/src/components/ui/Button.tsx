import React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "coral"
    | "destructive"
    | "dark";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  loading?: boolean;
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
      loading,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = "",
      type = "button",
      ...props
    },
    ref,
  ) => {
    const isSpinning = isLoading || !!loading;

    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap font-sans font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E5BFF]/30 focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none rounded-md cursor-pointer select-none active:translate-y-px";

    const variants = {
      primary:
        "bg-[#1E5BFF] text-white hover:bg-[#1E5BFF]/90 active:bg-[#1648CC] border border-transparent shadow-xs",
      secondary:
        "bg-[#F4F1F8] text-[#17131F] hover:bg-[#EBE5F0] border border-transparent shadow-xs",
      outline:
        "border border-[#D9CEDF] bg-white text-[#17131F] hover:bg-[#F9F8FC] hover:text-[#17131F] shadow-xs",
      ghost:
        "text-[#17131F] hover:bg-[#F4F1F8] hover:text-[#17131F] border border-transparent",
      coral:
        "bg-[#F97316] text-white hover:bg-[#EA580C] border border-transparent shadow-xs",
      destructive:
        "bg-[#EF4444] text-white hover:bg-[#DC2626] border border-transparent shadow-xs",
      dark: "bg-[#17131F] text-white hover:bg-[#2D2438] border border-transparent shadow-xs",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs gap-1.5 h-8 min-h-[32px]",
      md: "px-4 py-2 text-sm gap-2 h-10 min-h-[40px]",
      lg: "px-5 py-2.5 text-sm gap-2.5 h-11 min-h-[44px]",
    };

    const widthClass = fullWidth ? "w-full" : "";

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isSpinning}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
        {...props}
      >
        {isSpinning ? (
          <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-current shrink-0" />
        ) : leftIcon ? (
          <span className="inline-flex shrink-0">{leftIcon}</span>
        ) : null}
        <span className="inline-flex items-center justify-center gap-2">
          {children}
        </span>
        {!isSpinning && rightIcon ? (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        ) : null}
      </button>
    );
  },
);

Button.displayName = "Button";
