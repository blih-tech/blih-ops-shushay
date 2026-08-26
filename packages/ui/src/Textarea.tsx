import React from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = true,
      disabled,
      className = "",
      id,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;

    const baseStyles =
      "appearance-none block w-full px-4 py-3 sm:py-2.5 min-h-[120px] bg-background text-foreground border rounded-md text-base sm:text-sm font-sans placeholder:text-muted-foreground transition-colors duration-interactive focus:outline-none focus:ring-2 disabled:bg-muted disabled:opacity-60 disabled:cursor-not-allowed resize-none";

    const stateStyles = error
      ? "border-destructive focus:border-destructive focus:ring-destructive/20"
      : "border-border focus:border-primary focus:ring-primary/20";

    const currentValueLength = String(props.value || props.defaultValue || "").length;

    return (
      <div className={`${fullWidth ? "w-full" : "inline-block"}`}>
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs sm:text-sm font-medium text-foreground uppercase tracking-wider mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined}
          className={`${baseStyles} ${stateStyles} ${className}`}
          {...props}
        />
        <div className="flex justify-between items-start mt-1.5">
          {error ? (
            <p id={`${textareaId}-error`} className="text-xs text-destructive font-sans">
              {error}
            </p>
          ) : helperText ? (
            <p id={`${textareaId}-helper`} className="text-xs text-muted-foreground font-sans">
              {helperText}
            </p>
          ) : (
            <div />
          )}
          {props.maxLength && (
            <p className="text-xs text-muted-foreground font-mono shrink-0 ml-auto">
              {currentValueLength} / {props.maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
