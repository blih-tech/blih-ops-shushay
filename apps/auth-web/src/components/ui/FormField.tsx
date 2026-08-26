import React from "react";

export interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  htmlFor,
  error,
  helperText,
  required,
  children,
  className = "",
}) => {
  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-xs sm:text-sm font-medium text-foreground uppercase tracking-wider mb-1.5"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-xs text-destructive font-sans">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-muted-foreground font-sans">{helperText}</p>
      ) : null}
    </div>
  );
};
