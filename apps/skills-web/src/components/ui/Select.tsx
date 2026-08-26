import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  fullWidth?: boolean;
  placeholder?: string;
  onChange?: (e: { target: { value: string; name?: string } }) => void;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options,
      fullWidth = true,
      placeholder,
      disabled,
      className = "",
      id,
      value,
      name,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const generatedId = React.useId();
    const selectId = id || generatedId;

    // Find the currently selected option label
    const selectedOption = options.find((opt) => opt.value === value);
    const displayLabel = selectedOption ? selectedOption.label : (placeholder || "Select option");
    const isPlaceholderActive = !selectedOption;

    // Handle click outside to close dropdown
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectOption = (optValue: string) => {
      if (disabled) return;
      if (props.onChange) {
        props.onChange({
          target: {
            value: optValue,
            name,
          },
        });
      }
      setIsOpen(false);
    };

    const triggerStyles = `w-full flex items-center justify-between px-4 py-3 sm:py-2.5 min-h-[44px] bg-background border rounded-md text-base sm:text-sm font-sans transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${error ? "border-destructive text-destructive" : "border-border text-foreground focus:border-primary"
      } ${disabled ? "bg-muted opacity-60 cursor-not-allowed" : "cursor-pointer"}`;

    return (
      <div
        ref={containerRef}
        className={`relative font-sans ${fullWidth ? "w-full" : "inline-block"}`}
      >
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs sm:text-sm font-medium text-foreground uppercase tracking-wider mb-1.5"
          >
            {label}
          </label>
        )}

        {/* Trigger Button */}
        <div className="relative">
          <button
            type="button"
            id={selectId}
            disabled={disabled}
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className={`${triggerStyles} ${className}`}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
          >
            <span className={isPlaceholderActive ? "text-muted-foreground" : "text-foreground"}>
              {displayLabel}
            </span>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Floating Custom Dropdown Options Menu */}
        {isOpen && (
          <div className="absolute left-0 mt-1 w-full rounded-md border border-border bg-card shadow-lg z-50 overflow-hidden py-1 max-h-60 overflow-y-auto animate-in fade-in duration-100">
            {placeholder && (
              <button
                type="button"
                onClick={() => handleSelectOption("")}
                className="w-full text-left px-4 py-2 text-sm text-muted-foreground hover:bg-muted font-medium transition-colors"
              >
                {placeholder}
              </button>
            )}
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  disabled={opt.disabled}
                  onClick={() => !opt.disabled && handleSelectOption(opt.value)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-sm text-left transition-colors ${isSelected
                      ? "bg-primary/10 text-primary font-semibold"
                      : opt.disabled
                        ? "opacity-40 cursor-not-allowed"
                        : "text-foreground hover:bg-muted"
                    }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
                </button>
              );
            })}
          </div>
        )}

        {/* Hidden select field for native compatibility */}
        <select
          ref={ref}
          name={name}
          value={value}
          onChange={(e) => props.onChange && props.onChange({ target: { value: e.target.value, name } })}
          className="hidden"
          disabled={disabled}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>

        {error ? (
          <p className="mt-1.5 text-xs text-destructive">
            {error}
          </p>
        ) : helperText ? (
          <p className="mt-1.5 text-xs text-muted-foreground">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";
