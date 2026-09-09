import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "surface" | "interactive";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = "default", className = "", ...props }, ref) => {
    const variantStyles = {
      default:
        "bg-white border border-[#D9CEDF] shadow-[0_4px_24px_rgba(23,19,31,0.04)] hover:shadow-[0_8px_32px_rgba(23,19,31,0.08)] transition-all duration-300",
      surface: "bg-gradient-to-br from-[#FDFBFD] via-[#F8FAFF] to-[#EEF3FF]/60 border border-[#D9CEDF]/80 shadow-xs",
      interactive:
        "bg-white border border-[#D9CEDF] hover:border-[#1E5BFF]/50 hover:-translate-y-1 hover:shadow-[0_12px_36px_rgba(30,91,255,0.1)] transition-all duration-300 cursor-pointer group",
    };

    return (
      <div
        ref={ref}
        className={`rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 text-[#17131F] ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  },
);
Card.displayName = "Card";

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex flex-col space-y-2 pb-4 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  },
);
CardHeader.displayName = "CardHeader";

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, as: Tag = "h3", className = "", ...props }, ref) => {
    return (
      <Tag
        ref={ref}
        className={`font-display text-xl sm:text-2xl font-bold tracking-tight text-[#17131F] ${className}`}
        {...props}
      >
        {children}
      </Tag>
    );
  },
);
CardTitle.displayName = "CardTitle";

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ children, className = "", ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={`text-sm sm:text-base text-[#6E6678] font-sans leading-relaxed ${className}`}
      {...props}
    >
      {children}
    </p>
  );
});
CardDescription.displayName = "CardDescription";

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div ref={ref} className={`space-y-4 ${className}`} {...props}>
        {children}
      </div>
    );
  },
);
CardContent.displayName = "CardContent";

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className = "", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`flex items-center pt-4 border-t border-[#D9CEDF]/50 mt-4 ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  },
);
CardFooter.displayName = "CardFooter";
