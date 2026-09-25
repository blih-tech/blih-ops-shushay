import React from "react";
import {
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

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
  const styles: Record<
    "error" | "success" | "warning" | "info",
    { container: string; icon: React.ReactNode }
  > = {
    error: {
      container: "bg-red-50 border-red-200 text-red-900",
      icon: <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />,
    },
    success: {
      container: "bg-emerald-50 border-emerald-200 text-emerald-900",
      icon: <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />,
    },
    warning: {
      container: "bg-amber-50 border-amber-200 text-amber-900",
      icon: <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />,
    },
    info: {
      container: "bg-[#EEF3FF] border-[#1E5BFF]/30 text-[#1E5BFF]",
      icon: <Info className="h-4 w-4 shrink-0 text-[#1E5BFF] mt-0.5" />,
    },
  };

  const currentVariant = styles[variant] || styles.info;
  const alertRole = variant === "error" || variant === "warning" ? "alert" : "status";

  return (
    <div
      role={alertRole}
      className={`p-3.5 border rounded-md font-sans text-xs flex gap-2.5 items-start ${currentVariant.container} ${className}`}
    >
      {currentVariant.icon}
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="font-serif font-semibold text-sm mb-0.5 leading-snug">
            {title}
          </h4>
        )}
        <div className="text-xs leading-relaxed text-[#17131F]">
          {children}
        </div>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 p-1 opacity-70 hover:opacity-100 transition-opacity focus:outline-none cursor-pointer"
          aria-label="Dismiss alert"
        >
          <X className="h-4 w-4 text-current" />
        </button>
      )}
    </div>
  );
};
