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
      container: "bg-[#FFF0F0] border-[#EF4444]/30 text-[#EF4444]",
      icon: <AlertCircle className="h-5 w-5 shrink-0 text-[#EF4444]" />,
    },
    success: {
      container: "bg-[#E6F5F0] border-[#2E8F79]/30 text-[#2E8F79]",
      icon: <CheckCircle2 className="h-5 w-5 shrink-0 text-[#2E8F79]" />,
    },
    warning: {
      container: "bg-[#FFF9EB] border-[#DDAA3C]/30 text-[#DDAA3C]",
      icon: <AlertTriangle className="h-5 w-5 shrink-0 text-[#DDAA3C]" />,
    },
    info: {
      container: "bg-[#EEF3FF] border-[#1E5BFF]/30 text-[#1E5BFF]",
      icon: <Info className="h-5 w-5 shrink-0 text-[#1E5BFF]" />,
    },
  };

  const currentVariant = styles[variant] || styles.info;
  const alertRole = variant === "error" || variant === "warning" ? "alert" : "status";

  return (
    <div
      role={alertRole}
      className={`p-4 border rounded-2xl font-sans text-sm flex gap-3 items-start ${currentVariant.container} ${className}`}
    >
      {currentVariant.icon}
      <div className="flex-1 min-w-0">
        {title && (
          <h4 className="font-display font-bold text-sm sm:text-base mb-1 leading-snug">
            {title}
          </h4>
        )}
        <div className="text-xs sm:text-sm leading-relaxed text-[#17131F]">
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
