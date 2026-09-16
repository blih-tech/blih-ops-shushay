"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  showCharCount?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = true,
      showCharCount,
      disabled,
      className = "",
      id,
      rows = 4,
      maxLength,
      value,
      defaultValue,
      onChange,
      onInput,
      ...props
    },
    forwardedRef,
  ) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;
    const innerRef = useRef<HTMLTextAreaElement | null>(null);

    // Initial character count
    const [charCount, setCharCount] = useState<number>(() => {
      if (value !== undefined) return String(value || "").length;
      if (defaultValue !== undefined) return String(defaultValue || "").length;
      return 0;
    });

    const updateCount = useCallback(() => {
      if (value !== undefined) {
        setCharCount(String(value || "").length);
      } else if (innerRef.current) {
        setCharCount(innerRef.current.value.length);
      }
    }, [value]);

    useEffect(() => {
      updateCount();
    }, [value, defaultValue, updateCount]);

    useLayoutEffect(() => {
      if (innerRef.current) {
        setCharCount(innerRef.current.value.length);
      }
    });

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
      setCharCount((e.target as HTMLTextAreaElement).value.length);
      onInput?.(e as any);
    };

    const setMergedRefs = useCallback(
      (node: HTMLTextAreaElement | null) => {
        innerRef.current = node;
        if (typeof forwardedRef === "function") {
          forwardedRef(node);
        } else if (forwardedRef) {
          (
            forwardedRef as React.MutableRefObject<HTMLTextAreaElement | null>
          ).current = node;
        }
        if (node) {
          setCharCount(node.value.length);
        }
      },
      [forwardedRef],
    );

    const baseStyles =
      "appearance-none block w-full px-4 py-3 bg-white text-[#17131F] border rounded-xl text-sm sm:text-base font-sans placeholder:text-[#6E6678]/50 outline-none focus:outline-none focus:ring-0 transition-all duration-200 disabled:bg-[#EEF3FF]/70 disabled:text-[#6E6678] disabled:cursor-not-allowed resize-none";

    const stateStyles = error
      ? "border-[#EF4444] bg-[#FFF8F8] focus:border-[#EF4444] focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]"
      : "border-[#D9CEDF] hover:border-[#1E5BFF]/50 focus:border-[#1E5BFF] focus:shadow-[0_0_0_3px_rgba(30,91,255,0.15)]";

    const isNearLimit = maxLength ? charCount > maxLength * 0.9 : false;
    const isAtLimit = maxLength ? charCount >= maxLength : false;

    return (
      <div
        className={`group space-y-1.5 font-sans ${fullWidth ? "w-full" : "inline-block"}`}
      >
        {label && (
          <label
            htmlFor={textareaId}
            className={`block text-xs font-mono uppercase tracking-wider transition-colors duration-200 ${
              error
                ? "text-[#EF4444]"
                : "text-[#6E6678] group-focus-within:text-[#1E5BFF] group-focus-within:font-semibold"
            }`}
          >
            {label}
          </label>
        )}
        <textarea
          ref={setMergedRefs}
          id={textareaId}
          rows={rows}
          value={value}
          defaultValue={defaultValue}
          maxLength={maxLength}
          onChange={handleChange}
          onInput={handleInput}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${textareaId}-error`
              : helperText
                ? `${textareaId}-helper`
                : undefined
          }
          className={`${baseStyles} ${stateStyles} ${className}`}
          {...props}
        />
        <div className="flex justify-between items-start mt-1 gap-2">
          {error ? (
            <p
              id={`${textareaId}-error`}
              className="text-xs font-mono text-[#EF4444]"
            >
              {error}
            </p>
          ) : helperText ? (
            <p
              id={`${textareaId}-helper`}
              className="text-xs font-mono text-[#6E6678]"
            >
              {helperText}
            </p>
          ) : (
            <div />
          )}
          {(showCharCount || maxLength) && (
            <p
              className={`text-xs font-mono shrink-0 ml-auto transition-colors ${
                isAtLimit
                  ? "text-[#EF4444] font-bold"
                  : isNearLimit
                    ? "text-[#FF8A5B] font-semibold"
                    : "text-[#6E6678]"
              }`}
            >
              {charCount}
              {maxLength ? ` / ${maxLength}` : " chars"}
            </p>
          )}
        </div>
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
