"use client";

import Image from "next/image";
import { useBrand } from "./BrandProvider";

interface BrandLogoProps {
  className?: string;
  width?: number;
  height?: number;
  alt?: string;
  priority?: boolean;
}

export function BrandLogo({
  className = "w-10 h-10 object-contain",
  width = 48,
  height = 48,
  alt = "Logo Perusahaan",
  priority = false,
}: BrandLogoProps) {
  const { brand } = useBrand();
  const logoSrc = brand.logoUrl || "/assets/images/logo-perusahaan.jpeg";

  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${className}`}>
      <Image
        src={logoSrc}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-full object-contain"
        priority={priority}
      />
    </div>
  );
}
