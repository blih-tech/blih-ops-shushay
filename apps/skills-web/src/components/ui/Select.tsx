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

    const triggerStyles = `w-full h-12 flex items-center justify-between px-4 py-3 bg-white border rounded-xl text-sm sm:text-base font-sans outline-none focus:outline-none focus:ring-0 transition-all duration-200 ${
      error
        ? "border-[#EF4444] bg-[#FFF8F8] text-[#EF4444] focus:border-[#EF4444] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]"
        : "border-[#D9CEDF] text-[#17131F] hover:border-[#1E5BFF]/50 focus:border-[#1E5BFF] focus:shadow-[0_0_0_3px_rgba(30,91,255,0.15)]"
    } ${disabled ? "bg-[#EEF3FF]/70 text-[#6E6678] cursor-not-allowed" : "cursor-pointer"} ${
      isOpen ? "border-[#1E5BFF] shadow-[0_0_0_3px_rgba(30,91,255,0.15)]" : ""
    }`;

    return (
      <div
        ref={containerRef}
        className={`group relative font-sans space-y-1.5 ${fullWidth ? "w-full" : "inline-block"}`}
      >
        {label && (
          <label
            htmlFor={selectId}
            className={`block text-xs font-mono uppercase tracking-wider transition-colors duration-200 ${
              error
                ? "text-[#EF4444]"
                : isOpen
                ? "text-[#1E5BFF] font-semibold"
                : "text-[#6E6678] group-focus-within:text-[#1E5BFF] group-focus-within:font-semibold"
            }`}
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
            <span className={isPlaceholderActive ? "text-[#6E6678]/60 font-normal" : "text-[#17131F] font-medium"}>
              {displayLabel}
            </span>
            <ChevronDown className={`h-4 w-4 transition-all duration-200 ${
              isOpen ? "rotate-180 text-[#1E5BFF]" : "text-[#6E6678] group-hover:text-[#1E5BFF]"
            }`} />
          </button>
        </div>

        {/* Floating Custom Dropdown Options Menu */}
        {isOpen && (
          <div className="absolute left-0 mt-2 w-full rounded-xl border border-[#D9CEDF] bg-white shadow-[0_16px_48px_rgba(23,19,31,0.12)] z-50 overflow-hidden p-1.5 max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            {placeholder && (
              <button
                type="button"
                onClick={() => handleSelectOption("")}
                className="w-full text-left px-3.5 py-2.5 text-xs font-mono text-[#6E6678] hover:bg-[#EEF3FF] rounded-lg transition-colors cursor-pointer"
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
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm text-left rounded-lg transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#EEF3FF] text-[#1E5BFF] font-semibold shadow-xs"
                      : opt.disabled
                      ? "opacity-40 cursor-not-allowed"
                      : "text-[#17131F] hover:bg-[#EEF3FF]/70"
                  }`}
                >
                  <span>{opt.label}</span>
                  {isSelected && <Check className="h-4 w-4 text-[#1E5BFF] shrink-0" />}
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
          <p className="text-xs font-mono text-[#EF4444] mt-1">
            {error}
          </p>
        ) : helperText ? (
          <p className="text-xs font-mono text-[#6E6678] mt-1">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = "Select";
