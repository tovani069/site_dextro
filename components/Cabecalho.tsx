"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Moon, Power, Settings, Sun, UserRound } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useStore } from "@/lib/store";
import { useTema } from "@/lib/tema";

export function Cabecalho() {
  const router = useRouter();
  const { usuario, sair } = useStore();
  const { tema, alternarTema } = useTema();

  function onSair() {
    sair();
    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-40 border-b border-tinta-200 bg-white/90 backdrop-blur dark:border-[#2a2e36] dark:bg-carvao/90">
      <div className="mx-auto flex h-[84px] max-w-[1640px] items-center justify-between px-6 lg:px-10">
        <Link href="/" aria-label="Início" className="shrink-0">
          <Logo width={148} height={52} priority />
        </Link>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={alternarTema}
            aria-label="Alternar tema"
            className="rounded-xl p-2.5 text-tinta-600 transition hover:bg-tinta-100 dark:text-tinta-300 dark:hover:bg-white/5"
          >
            {tema === "dark" ? (
              <Sun className="h-[20px] w-[20px]" />
            ) : (
              <Moon className="h-[20px] w-[20px]" />
            )}
          </button>

          <div className="flex items-center gap-2 rounded-xl border border-tinta-200 bg-white px-3.5 py-2.5 dark:border-[#2f333c] dark:bg-carvao-claro">
            <UserRound className="h-[20px] w-[20px] text-tinta-800 dark:text-tinta-200" />
            <span className="max-w-[180px] truncate text-[14px] font-semibold text-tinta-800 dark:text-tinta-100">
              {usuario?.nome ?? "Visitante"}
            </span>
          </div>

          {usuario?.role === "master" && (
            <Link
              href="/admin"
              aria-label="Administração"
              title="Administração"
              className="rounded-xl border border-tinta-200 p-2.5 text-tinta-600 transition hover:bg-tinta-100 dark:border-[#2f333c] dark:text-tinta-300 dark:hover:bg-white/5"
            >
              <Settings className="h-[20px] w-[20px]" />
            </Link>
          )}

          <button
            type="button"
            onClick={onSair}
            aria-label="Sair"
            title="Sair"
            className="rounded-xl border border-tinta-200 p-2.5 text-perigo transition hover:bg-perigo/10 dark:border-[#2f333c]"
          >
            <Power className="h-[20px] w-[20px]" />
          </button>
        </div>
      </div>
    </header>
  );
}
