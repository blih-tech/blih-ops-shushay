import React from "react";

export type SkeletonColorTheme = "surface" | "lavender" | "peach" | "mint";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
  colorTheme?: SkeletonColorTheme;
  themeIndex?: number;
  width?: string | number;
  height?: string | number;
}

export const SKELETON_THEME_MAP: Record<SkeletonColorTheme, string> = {
  surface: "bg-[#EEF3FF] border border-[#D9CEDF]/40",
  lavender: "bg-[#DDE7FF]/80 border border-[#1E5BFF]/15",
  peach: "bg-[#FFF4EC] border border-[#FF8A5B]/20",
  mint: "bg-[#EAFBF6] border border-[#2E8F79]/20",
};

export const SKELETON_THEME_ORDER: SkeletonColorTheme[] = [
  "surface",
  "lavender",
  "peach",
  "mint",
];

export function getSkeletonThemeClass(
  colorTheme?: SkeletonColorTheme,
  themeIndex?: number
): string {
  if (colorTheme) return SKELETON_THEME_MAP[colorTheme];
  if (typeof themeIndex === "number") {
    const themeKey = SKELETON_THEME_ORDER[themeIndex % SKELETON_THEME_ORDER.length];
    return SKELETON_THEME_MAP[themeKey];
  }
  return SKELETON_THEME_MAP.surface;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = "rectangular",
  colorTheme,
  themeIndex,
  width,
  height,
  className = "",
  style,
  ...props
}) => {
  const variantStyles = {
    text: "h-4 w-full rounded",
    circular: "rounded-full",
    rectangular: "rounded-md",
  };

  const themeClass = getSkeletonThemeClass(colorTheme, themeIndex);

  const customStyle: React.CSSProperties = {
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
    ...style,
  };

  return (
    <div
      className={`animate-pulse ${themeClass} ${variantStyles[variant]} ${className}`}
      style={customStyle}
      aria-hidden="true"
      {...props}
    />
  );
};
