import React from "react";
import Image from "next/image";
import Link from "next/link";

export interface LogoProps {
  className?: string;
  priority?: boolean;
  href?: string;
}

export function Logo({
  className = "h-5 w-auto",
  priority = false,
  href,
}: LogoProps) {
  const logoImage = (
    <Image
      src="/logo-blihops.png"
      alt="Blih Ops"
      width={110}
      height={20}
      priority={priority}
      className={`h-5 w-auto object-contain ${className}`}
    />
  );

  if (href) {
    return (
      <Link href={href} aria-label="Blih Ops Home" className="flex shrink-0 items-center">
        {logoImage}
      </Link>
    );
  }

  return logoImage;
}
