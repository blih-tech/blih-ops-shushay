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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div
        className={`w-full max-h-[90vh] overflow-y-auto bg-card border border-border/60 rounded-2xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.2)] font-sans transform transition-all animate-in zoom-in-95 duration-200 ${sizes[size]}`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || description) && (
          <div className="p-6 pb-2 flex justify-between items-start gap-4">
            <div>
              {title && (
                <h3 id="modal-title" className="font-serif text-xl font-semibold tracking-tight text-foreground">
                  {title}
                </h3>
              )}
              {description && <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{description}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-muted-foreground hover:bg-muted/60 hover:text-foreground p-1.5 rounded-full transition-colors cursor-pointer shrink-0"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
        {children && <div className="p-6 pt-4">{children}</div>}
        {footer && <div className="p-6 pt-2 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
};
