import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) => {
  if (totalPages <= 1) return null;

  return (
    <nav
      className={`flex items-center justify-between gap-4 font-sans text-sm ${className}`}
      aria-label="Pagination"
    >
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        leftIcon={<ChevronLeft className="h-4 w-4" />}
      >
        Previous
      </Button>
      <span className="text-xs text-[#6E6678]">
        Page{" "}
        <strong className="text-[#17131F] font-semibold">{currentPage}</strong>{" "}
        of{" "}
        <strong className="text-[#17131F] font-semibold">{totalPages}</strong>
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        rightIcon={<ChevronRight className="h-4 w-4" />}
      >
        Next
      </Button>
    </nav>
  );
};
