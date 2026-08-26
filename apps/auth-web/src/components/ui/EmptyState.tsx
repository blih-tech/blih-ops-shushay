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
    <div className={`flex flex-col items-center justify-center p-8 md:p-12 text-center border border-dashed border-border rounded-xl bg-card/50 ${className}`}>
      {icon ? (
        <div className="mb-4 text-muted-foreground p-3 bg-muted rounded-full">{icon}</div>
      ) : (
        <div className="mb-4 text-muted-foreground p-3 bg-muted rounded-full">
          <Inbox className="w-8 h-8" />
        </div>
      )}
      <h3 className="font-serif text-lg font-semibold text-foreground mb-1">{title}</h3>
      {description && <p className="text-xs xl:text-sm text-muted-foreground font-sans max-w-sm mb-6">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
};
