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
    <div className={`space-y-1.5 w-full font-sans ${className}`}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-xs font-mono uppercase tracking-wider text-[#6E6678] mb-1.5"
        >
          {label}
          {required && <span className="text-[#EF4444] ml-1">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-xs font-mono text-[#EF4444] mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-xs font-mono text-[#6E6678] mt-1">{helperText}</p>
      ) : null}
    </div>
  );
};
