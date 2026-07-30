"use client";

import Image from "next/image";

/**
 * O logo tem duas artes: traço preto (fundo claro) e traço branco (fundo escuro).
 * Trocamos por CSS para não depender do estado do tema na hidratação.
 */
export function Logo({
  className = "",
  width = 150,
  height = 48,
  priority = false,
}: {
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}) {
  return (
    <span className={`relative inline-block ${className}`} style={{ width, height }}>
      <Image
        src="/logo_dextro_light.png"
        alt="Dextro"
        fill
        sizes={`${width}px`}
        priority={priority}
        className="object-contain dark:hidden"
      />
      <Image
        src="/logo_dextro_dark.png"
        alt="Dextro"
        fill
        sizes={`${width}px`}
        priority={priority}
        className="hidden object-contain dark:block"
      />
    </span>
  );
}

/** Versão fixa em branco — usada no card escuro do login. */
export function LogoBranco({ width = 170, height = 56 }: { width?: number; height?: number }) {
  return (
    <span className="relative inline-block" style={{ width, height }}>
      <Image
        src="/logo_dextro_dark.png"
        alt="Dextro"
        fill
        sizes={`${width}px`}
        priority
        className="object-contain"
      />
    </span>
  );
}
