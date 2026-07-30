"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

export function Modal({
  aberto,
  titulo,
  descricao,
  onFechar,
  children,
}: {
  aberto: boolean;
  titulo: string;
  descricao?: string;
  onFechar: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!aberto) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onFechar();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [aberto, onFechar]);

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-tinta-950/50 backdrop-blur-[2px]"
        onClick={onFechar}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={titulo}
        className="cartao relative z-10 max-h-[88vh] w-full max-w-lg overflow-y-auto p-7"
      >
        <button
          type="button"
          onClick={onFechar}
          aria-label="Fechar"
          className="absolute top-5 right-5 rounded-lg p-1.5 text-tinta-400 transition hover:bg-tinta-100 hover:text-tinta-800 dark:hover:bg-white/5"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        <h2 className="font-display text-[20px] font-bold text-tinta-900 dark:text-white">{titulo}</h2>
        {descricao && <p className="mt-1 mb-5 text-[14px] text-tinta-400">{descricao}</p>}
        <div className={descricao ? "" : "mt-5"}>{children}</div>
      </div>
    </div>
  );
}
