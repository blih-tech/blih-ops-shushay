import React from "react";
import { Inbox } from "lucide-react";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 md:p-12 text-center border border-dashed border-[#D9CEDF] rounded-xl bg-[#F8F6FA] ${className}`}
    >
      {icon ? (
        <div className="mb-4 text-[#6E6678] p-3 bg-[#EEF3FF] rounded-full">
          {icon}
        </div>
      ) : (
        <div className="mb-4 text-[#6E6678] p-3 bg-[#EEF3FF] rounded-full">
          <Inbox className="w-8 h-8" />
        </div>
      )}
      <h3 className="font-display text-lg font-semibold text-[#17131F] mb-1">
        {title}
      </h3>
      {description && (
        <p className="text-xs xl:text-sm text-[#6E6678] font-sans max-w-sm mb-6">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};
