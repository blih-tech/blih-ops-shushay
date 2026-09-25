import React from "react";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
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
      size = "md",
      className = "",
      id,
      disabled,
      ...props
    },
    ref,
  ) => {
    const inputId =
      id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    const sizes = {
      sm: "h-8 min-h-[32px] text-xs px-2.5 py-1",
      md: "h-10 min-h-[40px] text-sm px-3 py-2",
      lg: "h-11 min-h-[44px] text-sm px-3.5 py-2.5",
    };

    return (
      <div
        className={`group space-y-1.5 font-sans ${fullWidth ? "w-full" : ""}`}
      >
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
            <div
              className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-all duration-200 ${
                error
                  ? "text-[#EF4444]"
                  : "text-[#6E6678] group-focus-within:text-[#1E5BFF]"
              }`}
            >
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={`
              w-full ${sizes[size]} rounded-md border bg-white text-[#17131F] placeholder:text-[#6E6678]/70
              outline-none focus:outline-none
              transition-colors duration-150
              disabled:cursor-not-allowed disabled:bg-[#F4F1F8] disabled:text-[#6E6678]
              ${leftIcon ? "pl-9" : ""}
              ${rightIcon ? "pr-9" : ""}
              ${
                error
                  ? "border-[#EF4444] bg-[#FFF8F8] focus:border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20"
                  : "border-[#D9CEDF] hover:border-[#1E5BFF]/50 focus:border-[#1E5BFF] focus:ring-2 focus:ring-[#1E5BFF]/20"
              }
              ${className}
            `}
            {...props}
          />
          {rightIcon && (
            <div
              className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors duration-200 ${
                error
                  ? "text-[#EF4444]"
                  : "text-[#6E6678] group-focus-within:text-[#1E5BFF]"
              }`}
            >
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs font-mono text-[#EF4444] mt-1 flex items-center gap-1">
            {error}
          </p>
        ) : helperText ? (
          <p className="text-xs font-mono text-[#6E6678] mt-1">{helperText}</p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
