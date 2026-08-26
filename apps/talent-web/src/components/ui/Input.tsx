import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
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
      fullWidth = true,
      type = "text",
      disabled,
      className = "",
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const isPasswordType = type === "password";
    const actualType = isPasswordType ? (showPassword ? "text" : "password") : type;

    const baseInputStyles =
      "appearance-none block w-full px-4 py-3 sm:py-2.5 min-h-[48px] bg-background text-foreground border rounded-md text-base sm:text-sm font-sans placeholder:text-muted-foreground transition-colors duration-interactive focus:outline-none focus:ring-2 disabled:bg-muted disabled:opacity-60 disabled:cursor-not-allowed";

    const stateStyles = error
      ? "border-destructive focus:border-destructive focus:ring-destructive/20"
      : "border-border focus:border-primary focus:ring-primary/20";

    const paddingLeftClass = leftIcon ? "pl-11" : "";
    const paddingRightClass = rightIcon || isPasswordType ? "pr-11" : "";

    return (
      <div className={`${fullWidth ? "w-full" : "inline-block"}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs sm:text-sm font-medium text-foreground uppercase tracking-wider mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute top-1/2 -translate-y-1/2 left-3.5 z-10 flex items-center pointer-events-none text-muted-foreground">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={actualType}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            className={`${baseInputStyles} ${stateStyles} ${paddingLeftClass} ${paddingRightClass} ${className}`}
            {...props}
          />
          {isPasswordType ? (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 -translate-y-1/2 right-3.5 z-10 flex items-center justify-center p-1 text-muted-foreground hover:text-foreground focus:outline-none cursor-pointer rounded"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 shrink-0 stroke-[1.75]" />
              ) : (
                <Eye className="w-5 h-5 shrink-0 stroke-[1.75]" />
              )}
            </button>
          ) : rightIcon ? (
            <div className="absolute top-1/2 -translate-y-1/2 right-3.5 z-10 flex items-center pointer-events-none text-muted-foreground">
              {rightIcon}
            </div>
          ) : null}
        </div>
        {error ? (
          <p id={`${inputId}-error`} className="mt-1.5 text-xs text-destructive font-sans">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${inputId}-helper`} className="mt-1.5 text-xs text-muted-foreground font-sans">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
