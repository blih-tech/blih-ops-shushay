import React from "react";

export interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: React.ReactNode;
  description?: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { label, description, error, disabled, className = "", id, ...props },
    ref,
  ) => {
    const generatedId = React.useId();
    const checkboxId = id || generatedId;

    return (
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            disabled={disabled}
            aria-invalid={!!error}
            className={`h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary/20 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
              error ? "border-destructive" : ""
            } ${className}`}
            {...props}
          />
        </div>
        {(label || description) && (
          <div className="ml-2.5 text-xs xl:text-sm leading-none font-sans">
            {label && (
              <label
                htmlFor={checkboxId}
                className={`font-medium text-foreground cursor-pointer select-none ${
                  disabled ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                {label}
              </label>
            )}
            {description && (
              <p className="text-muted-foreground mt-1 text-xs">
                {description}
              </p>
            )}
            {error && <p className="text-destructive mt-1 text-xs">{error}</p>}
          </div>
        )}
      </div>
    );
  },
);

Checkbox.displayName = "Checkbox";
