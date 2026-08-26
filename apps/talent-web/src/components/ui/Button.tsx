import React from "react";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
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
      "inline-flex items-center justify-center font-sans font-medium transition-colors duration-interactive ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-md cursor-pointer select-none";

    const variants = {
      primary: "bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/95 border border-transparent shadow-sm",
      secondary: "bg-secondary text-foreground hover:bg-secondary/80 border border-transparent",
      outline: "border border-border bg-background text-foreground hover:bg-muted active:bg-secondary",
      ghost: "text-foreground hover:bg-muted active:bg-secondary border border-transparent",
      destructive: "bg-destructive text-white hover:bg-destructive/90 active:bg-destructive/95 border border-transparent shadow-sm",
    };

    const sizes = {
      sm: "px-3 py-2 text-xs gap-1.5 min-h-[36px]",
      md: "px-4 py-3 sm:py-2.5 text-base sm:text-sm gap-2 min-h-[48px]",
      lg: "px-6 py-3.5 sm:py-3 text-lg sm:text-base gap-2.5 min-h-[52px]",
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
