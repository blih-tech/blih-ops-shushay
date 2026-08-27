import React, { useEffect } from "react";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        className={`w-full max-h-[90vh] flex flex-col bg-white border border-[#D9CEDF] rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_rgba(23,19,31,0.2)] font-sans transform transition-all animate-in zoom-in-95 duration-200 overflow-hidden ${sizes[size]}`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || description) && (
          <div className="p-5 sm:p-6 pb-3 flex justify-between items-start gap-4 border-b border-[#D9CEDF]/60">
            <div>
              {title && (
                <h3 id="modal-title" className="font-display text-lg sm:text-xl font-bold tracking-tight text-[#17131F]">
                  {title}
                </h3>
              )}
              {description && <p className="text-xs sm:text-sm text-[#6E6678] mt-1 leading-relaxed">{description}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-[#6E6678] hover:bg-[#EEF3FF] hover:text-[#17131F] p-1.5 rounded-full transition-colors cursor-pointer shrink-0"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        {children && <div className="p-5 sm:p-6 overflow-y-auto flex-1">{children}</div>}
        {footer && <div className="p-4 sm:p-6 pt-3 flex flex-col sm:flex-row justify-end gap-3 border-t border-[#D9CEDF]/60 bg-[#EEF3FF]/30">{footer}</div>}
      </div>
    </div>
  );
};
