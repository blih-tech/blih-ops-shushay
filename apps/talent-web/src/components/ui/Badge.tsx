import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "destructive" | "outline";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center font-sans font-medium rounded-full tracking-wide uppercase transition-colors";

  const variants = {
    default: "bg-muted text-muted-foreground border border-transparent",
    primary: "bg-primary/15 text-primary border border-primary/20",
    secondary: "bg-secondary text-foreground border border-transparent",
    success: "bg-accent text-accent-foreground border border-accent-foreground/10",
    warning: "bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/20",
    destructive: "bg-destructive/15 text-destructive border border-destructive/20",
    outline: "bg-transparent text-foreground border border-border",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[0.625rem]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </span>
  );
};
