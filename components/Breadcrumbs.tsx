import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface Trilha {
  label: string;
  href?: string;
}

export function Breadcrumbs({ itens }: { itens: Trilha[] }) {
  return (
    <nav aria-label="Você está aqui" className="mb-6 flex flex-wrap items-center gap-1.5 text-[14px]">
      <Link
        href="/"
        className="flex items-center gap-1.5 text-tinta-500 transition hover:text-tinta-900 dark:text-tinta-400 dark:hover:text-white"
      >
        <Home className="h-4 w-4" />
        Início
      </Link>
      {itens.map((item, i) => {
        const ultimo = i === itens.length - 1;
        return (
          <span key={`${item.label}-${i}`} className="flex items-center gap-1.5">
            <ChevronRight className="h-4 w-4 text-tinta-300 dark:text-tinta-600" />
            {item.href && !ultimo ? (
              <Link
                href={item.href}
                className="text-tinta-500 transition hover:text-tinta-900 dark:text-tinta-400 dark:hover:text-white"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-semibold text-tinta-900 dark:text-white">{item.label}</span>
            )}
          </span>
        );
      })}
    </nav>
  );
}
