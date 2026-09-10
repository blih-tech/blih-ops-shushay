"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";

export interface UniversalSearchProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  shortcut?: string;
  actionText?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const UniversalSearch: React.FC<UniversalSearchProps> = ({
  placeholder = "What do you want to learn, do, or hire for?",
  onSearch,
  actionText = "Search",
  className = "",
  value,
  onChange,
}) => {
  const [internalValue, setInternalValue] = useState("");
  const inputValue = value !== undefined ? value : internalValue;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(inputValue);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full flex items-center gap-2.5 sm:gap-3 ${className}`}
    >
      <div className="flex-1 h-12 bg-white rounded-xl sm:rounded-2xl border border-[#D9CEDF] shadow-[0_8px_30px_rgba(23,19,31,0.04)] px-4 sm:px-6 flex items-center gap-3 transition-all duration-300 focus-within:border-[#1E5BFF] focus-within:ring-4 focus-within:ring-[#1E5BFF]/10 focus-within:shadow-[0_12px_40px_rgba(30,91,255,0.12)]">
        <Search className="h-5 w-5 text-[#6E6678] shrink-0" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            if (onChange) onChange(e);
            else setInternalValue(e.target.value);
          }}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm sm:text-base text-[#17131F] placeholder:text-[#6E6678]/60 focus:outline-none font-sans"
        />
      </div>

      {actionText && (
        <button
          type="submit"
          className="h-12 flex items-center justify-center font-mono text-xs sm:text-sm font-semibold text-white bg-[#1E5BFF] hover:bg-[#1546CC] px-5 sm:px-6 rounded-xl sm:rounded-2xl transition-all shadow-[0_4px_14px_rgba(30,91,255,0.25)] hover:shadow-[0_6px_20px_rgba(30,91,255,0.35)] cursor-pointer select-none active:scale-[0.98] shrink-0"
        >
          {actionText}
        </button>
      )}
    </form>
  );
};
