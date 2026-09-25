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
      <div className="flex-1 h-10 min-h-[40px] bg-white rounded-md border border-[#D9CEDF] shadow-xs px-3 sm:px-4 flex items-center gap-2.5 transition-colors focus-within:border-[#1E5BFF] focus-within:ring-2 focus-within:ring-[#1E5BFF]/20">
        <Search className="h-4 w-4 text-[#6E6678] shrink-0" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            if (onChange) onChange(e);
            else setInternalValue(e.target.value);
          }}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-[#17131F] placeholder:text-[#6E6678]/70 focus:outline-none font-sans"
        />
      </div>

      {actionText && (
        <button
          type="submit"
          className="h-10 min-h-[40px] flex items-center justify-center font-sans text-xs sm:text-sm font-medium text-white bg-[#1E5BFF] hover:bg-[#1E5BFF]/90 px-4 rounded-md transition-colors shadow-xs cursor-pointer select-none active:translate-y-px shrink-0"
        >
          {actionText}
        </button>
      )}
    </form>
  );
};
