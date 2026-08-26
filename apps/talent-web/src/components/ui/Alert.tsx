import React from "react";
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from "lucide-react";

export interface AlertProps {
  variant?: "error" | "success" | "warning" | "info";
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = "error",
  title,
  children,
  onClose,
  className = "",
}) => {
  const styles = {
    error: {
      container: "bg-destructive/10 border-destructive/30 text-destructive",
      icon: <AlertCircle className="h-5 w-5 shrink-0" />,
    },
    success: {
      container: "bg-accent border-accent-foreground/20 text-accent-foreground",
      icon: <CheckCircle2 className="h-5 w-5 shrink-0" />,
    },
    warning: {
      container: "bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300",
      icon: <AlertTriangle className="h-5 w-5 shrink-0" />,
    },
    info: {
      container: "bg-muted border-border text-foreground",
      icon: <Info className="h-5 w-5 shrink-0 text-muted-foreground" />,
    },
  };

  const currentVariant = styles[variant];

  return (
    <div
      role="alert"
      className={`p-4 border rounded-md font-sans text-sm flex gap-3 items-start ${currentVariant.container} ${className}`}
    >
      {currentVariant.icon}
      <div className="flex-1 min-w-0">
        {title && <h4 className="font-semibold text-sm sm:text-base mb-1 leading-snug">{title}</h4>}
        <div className="text-xs sm:text-sm leading-relaxed">{children}</div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 p-0.5 opacity-70 hover:opacity-100 transition-opacity focus:outline-none cursor-pointer"
          aria-label="Dismiss alert"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
