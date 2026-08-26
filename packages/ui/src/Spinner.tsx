import React from "react";
import { Loader2 } from "lucide-react";

export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "current" | "white";
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  color = "primary",
  className = "",
  ...props
}) => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-10 w-10",
  };

  const colors = {
    primary: "text-primary",
    current: "text-current",
    white: "text-white",
  };

  return (
    <Loader2
      className={`animate-spin ${sizes[size]} ${colors[color]} ${className}`}
      role="status"
      aria-label="Loading"
      {...props}
    />
  );
};
