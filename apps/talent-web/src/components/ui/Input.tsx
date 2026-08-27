import React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = "",
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className={`group space-y-1.5 font-sans ${fullWidth ? "w-full" : ""}`}>
        {label && (
          <label
            htmlFor={inputId}
            className={`block text-xs font-mono uppercase tracking-wider transition-colors duration-200 ${
              error
                ? "text-[#EF4444]"
                : "text-[#6E6678] group-focus-within:text-[#1E5BFF] group-focus-within:font-semibold"
            }`}
          >
            {label}
          </label>
        )}
        <div className="relative w-full">
          {leftIcon && (
            <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-all duration-200 ${
              error
                ? "text-[#EF4444]"
                : "text-[#6E6678] group-focus-within:text-[#1E5BFF]"
            }`}>
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`
              w-full h-12 rounded-xl border bg-white px-4 py-3 text-sm sm:text-base text-[#17131F] placeholder:text-[#6E6678]/50
              outline-none focus:outline-none focus:ring-0
              transition-all duration-200
              disabled:cursor-not-allowed disabled:bg-[#EEF3FF]/70 disabled:text-[#6E6678]
              ${leftIcon ? "pl-10" : ""}
              ${rightIcon ? "pr-10" : ""}
              ${
                error
                  ? "border-[#EF4444] bg-[#FFF8F8] focus:border-[#EF4444] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]"
                  : "border-[#D9CEDF] hover:border-[#1E5BFF]/50 focus:border-[#1E5BFF] focus:shadow-[0_0_0_3px_rgba(30,91,255,0.15)]"
              }
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <div className={`absolute inset-y-0 right-0 pr-3.5 flex items-center transition-colors duration-200 ${
              error ? "text-[#EF4444]" : "text-[#6E6678] group-focus-within:text-[#1E5BFF]"
            }`}>
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs font-mono text-[#EF4444] mt-1 flex items-center gap-1">{error}</p>
        ) : helperText ? (
          <p className="text-xs font-mono text-[#6E6678] mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
