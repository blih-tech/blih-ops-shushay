"use client";

import React, { useEffect, useRef } from "react";
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
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      const remainingModals = document.querySelectorAll(
        '[role="dialog"][aria-modal="true"]',
      );
      if (remainingModals.length <= 1) {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
      }
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
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        className={`w-full max-h-[85vh] flex flex-col bg-white border border-[#D9CEDF] rounded-3xl shadow-[0_24px_70px_rgba(23,19,31,0.12)] font-sans transform transition-all animate-in zoom-in-95 duration-300 overflow-hidden ${sizes[size]}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8 pb-4 flex justify-between items-start gap-4">
          <div>
            {title && (
              <h3
                id="modal-title"
                className="font-display text-2xl font-bold tracking-tight text-[#17131F] leading-snug"
              >
                {title}
              </h3>
            )}
            {description && (
              <p className="text-xs sm:text-sm text-[#6E6678] mt-1.5 leading-relaxed font-sans">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#6E6678] hover:bg-[#EEF3FF] hover:text-[#1E5BFF] p-2 rounded-xl transition-all cursor-pointer shrink-0 border border-[#D9CEDF]/40 hover:border-[#1E5BFF]/20 active:scale-95 shadow-xs"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {children && (
          <div className="px-6 sm:px-8 py-2 overflow-y-auto flex-1 text-[#17131F] font-sans">
            {children}
          </div>
        )}

        {footer ? (
          <div className="p-6 sm:p-8 pt-4 flex flex-col sm:flex-row justify-end gap-3 bg-white border-t border-[#D9CEDF]/50">
            {footer}
          </div>
        ) : (
          <div className="h-4 sm:h-6 shrink-0" />
        )}
      </div>
    </div>
  );
};
