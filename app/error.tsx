"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCw, Trash2 } from "lucide-react";

/**
 * Sem isto, um erro de renderização deixa a página totalmente em branco.
 * Aqui o erro aparece na tela, com a opção de zerar os dados do navegador.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  function limparDados() {
    Object.keys(window.localStorage)
      .filter((chave) => chave.startsWith("dextro."))
      .forEach((chave) => window.localStorage.removeItem(chave));
    window.location.href = "/login";
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="cartao w-full max-w-lg p-8 text-center">
        <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-perigo/10">
          <AlertTriangle className="h-7 w-7 text-perigo" />
        </span>

        <h1 className="font-display text-[22px] font-bold text-tinta-900 dark:text-white">
          Algo deu errado
        </h1>
        <p className="mt-2 text-[14px] text-tinta-500 dark:text-tinta-400">
          A tela não pôde ser carregada. Tente novamente — se persistir, limpe os dados salvos
          neste navegador.
        </p>

        <pre className="mt-5 max-h-40 overflow-auto rounded-xl bg-tinta-100 p-4 text-left text-[12px] break-words whitespace-pre-wrap text-tinta-600 dark:bg-white/5 dark:text-tinta-300">
          {error.message}
        </pre>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={reset}
            className="flex items-center justify-center gap-2 rounded-xl bg-tinta-900 py-3 text-[14px] font-bold text-white transition hover:bg-tinta-800 dark:bg-white dark:text-tinta-900"
          >
            <RotateCw className="h-4 w-4" />
            Tentar de novo
          </button>
          <button
            type="button"
            onClick={limparDados}
            className="flex items-center justify-center gap-2 rounded-xl border border-tinta-200 py-3 text-[14px] font-semibold text-tinta-700 transition hover:bg-tinta-100 dark:border-[#2f333c] dark:text-tinta-200 dark:hover:bg-white/5"
          >
            <Trash2 className="h-4 w-4" />
            Limpar dados
          </button>
        </div>
      </div>
    </main>
  );
}
