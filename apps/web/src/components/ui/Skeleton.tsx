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
  surface: "bg-[#F4F1F8] border border-[#D9CEDF]/50",
  lavender: "bg-[#F0EDF5] border border-[#D9CEDF]/60",
  peach: "bg-[#F8F6FA] border border-[#D9CEDF]/40",
  mint: "bg-[#EBE5F0]/70 border border-[#D9CEDF]/50",
};

export const SKELETON_THEME_ORDER: SkeletonColorTheme[] = [
  "surface",
  "lavender",
  "peach",
  "mint",
];

export function getSkeletonThemeClass(
  colorTheme?: SkeletonColorTheme,
  themeIndex?: number,
): string {
  if (colorTheme) return SKELETON_THEME_MAP[colorTheme];
  if (typeof themeIndex === "number") {
    const themeKey =
      SKELETON_THEME_ORDER[themeIndex % SKELETON_THEME_ORDER.length];
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
