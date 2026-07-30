"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

export interface Opcao {
  valor: string;
  rotulo: string;
}

/**
 * Lista suspensa padrão do portal: painel animado, busca por digitação e
 * navegação por teclado. Serve para seleção única ou múltipla.
 */
export function ListaSuspensa({
  opcoes,
  selecionados,
  onChange,
  multiplo = false,
  placeholder = "Selecionar",
  buscavel = true,
  desabilitado = false,
  textoVazio = "Nenhuma opção disponível",
  rotuloAcessivel,
  icone: Icone,
  id,
}: {
  opcoes: Opcao[];
  /** Sempre um array — na seleção única, com zero ou um item. */
  selecionados: string[];
  onChange: (valores: string[]) => void;
  multiplo?: boolean;
  placeholder?: string;
  buscavel?: boolean;
  desabilitado?: boolean;
  textoVazio?: string;
  rotuloAcessivel?: string;
  icone?: React.ElementType;
  id?: string;
}) {
  const [aberto, setAberto] = useState(false);
  const [busca, setBusca] = useState("");
  const [destaque, setDestaque] = useState(0);

  const caixaRef = useRef<HTMLDivElement>(null);
  const buscaRef = useRef<HTMLInputElement>(null);

  const semOpcoes = opcoes.length === 0;
  const bloqueado = desabilitado || semOpcoes;

  const filtradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return opcoes;
    return opcoes.filter((o) => o.rotulo.toLowerCase().includes(termo));
  }, [opcoes, busca]);

  const resumo = useMemo(() => {
    const escolhidas = opcoes.filter((o) => selecionados.includes(o.valor));
    if (escolhidas.length === 0) return null;
    if (!multiplo) return escolhidas[0].rotulo;
    if (escolhidas.length <= 2) return escolhidas.map((o) => o.rotulo).join(", ");
    return `${escolhidas.length} selecionadas`;
  }, [opcoes, selecionados, multiplo]);

  // fecha ao clicar fora
  useEffect(() => {
    if (!aberto) return;
    const onClique = (e: MouseEvent) => {
      if (!caixaRef.current?.contains(e.target as Node)) setAberto(false);
    };
    document.addEventListener("mousedown", onClique);
    return () => document.removeEventListener("mousedown", onClique);
  }, [aberto]);

  // ao abrir, foca a busca e reinicia o filtro
  useEffect(() => {
    if (!aberto) return;
    setBusca("");
    setDestaque(0);
    if (!buscavel) return;
    const t = setTimeout(() => buscaRef.current?.focus(), 30);
    return () => clearTimeout(t);
  }, [aberto, buscavel]);

  function escolher(valor: string) {
    if (multiplo) {
      onChange(
        selecionados.includes(valor)
          ? selecionados.filter((v) => v !== valor)
          : [...selecionados, valor]
      );
      return;
    }
    onChange([valor]);
    setAberto(false);
  }

  function onTecla(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setAberto(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setDestaque((i) => Math.min(i + 1, filtradas.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setDestaque((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const alvo = filtradas[destaque];
      if (alvo) escolher(alvo.valor);
    }
  }

  return (
    <div ref={caixaRef} className="relative">
      <button
        type="button"
        id={id}
        disabled={bloqueado}
        aria-haspopup="listbox"
        aria-expanded={aberto}
        aria-label={rotuloAcessivel}
        onClick={() => setAberto((v) => !v)}
        className={`flex h-[46px] w-full items-center justify-between gap-2 rounded-xl border bg-white px-4 text-left text-[14px] transition disabled:opacity-60 dark:bg-carvao ${
          aberto
            ? "border-tinta-900 shadow-[0_0_0_3px_rgba(15,23,42,0.08)] dark:border-tinta-400"
            : "border-tinta-300 hover:border-tinta-400 dark:border-[#3a3f48]"
        }`}
      >
        <span
          className={`truncate ${
            resumo ? "font-medium text-tinta-800 dark:text-tinta-100" : "text-tinta-400"
          }`}
        >
          {semOpcoes ? textoVazio : (resumo ?? placeholder)}
        </span>
        <ChevronDown
          className={`h-[18px] w-[18px] shrink-0 text-tinta-400 transition-transform duration-200 ${
            aberto ? "rotate-180" : ""
          }`}
        />
      </button>

      {aberto && !bloqueado && (
        <div className="anim-lista absolute top-[calc(100%+8px)] right-0 left-0 z-30 overflow-hidden rounded-xl border border-tinta-200 bg-white shadow-[0_20px_50px_-20px_rgba(15,23,42,0.4)] dark:border-[#2f333c] dark:bg-carvao-claro">
          {buscavel && (
            <div className="relative border-b border-tinta-100 p-2 dark:border-[#2a2e36]">
              <Search className="pointer-events-none absolute top-1/2 left-5 h-4 w-4 -translate-y-1/2 text-tinta-400" />
              <input
                ref={buscaRef}
                value={busca}
                onChange={(e) => {
                  setBusca(e.target.value);
                  setDestaque(0);
                }}
                onKeyDown={onTecla}
                placeholder="Pesquisar..."
                aria-label="Pesquisar na lista"
                className="h-[38px] w-full rounded-lg bg-tinta-50 pr-3 pl-9 text-[14px] text-tinta-800 placeholder:text-tinta-400 focus:outline-none dark:bg-white/5 dark:text-tinta-100"
              />
            </div>
          )}

          <ul role="listbox" aria-multiselectable={multiplo} className="max-h-[240px] overflow-y-auto p-1.5">
            {filtradas.length === 0 && (
              <li className="px-3 py-6 text-center text-[13px] text-tinta-400">
                Nada encontrado.
              </li>
            )}

            {filtradas.map((opcao, i) => {
              const marcada = selecionados.includes(opcao.valor);
              return (
                <li
                  key={opcao.valor}
                  className="anim-item"
                  style={{ animationDelay: `${Math.min(i, 6) * 22}ms` }}
                >
                  <button
                    type="button"
                    role="option"
                    aria-selected={marcada}
                    onMouseEnter={() => setDestaque(i)}
                    onClick={() => escolher(opcao.valor)}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-[14px] transition ${
                      i === destaque
                        ? "bg-tinta-100 dark:bg-white/[0.07]"
                        : "hover:bg-tinta-50 dark:hover:bg-white/[0.04]"
                    }`}
                  >
                    {multiplo ? (
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${
                          marcada
                            ? "border-tinta-900 bg-tinta-900 dark:border-white dark:bg-white"
                            : "border-tinta-300 dark:border-[#3a3f48]"
                        }`}
                      >
                        {marcada && (
                          <Check
                            className="h-3 w-3 text-white dark:text-tinta-900"
                            strokeWidth={3.5}
                          />
                        )}
                      </span>
                    ) : (
                      Icone && <Icone className="h-4 w-4 shrink-0 text-tinta-400" />
                    )}

                    <span
                      className={`min-w-0 flex-1 truncate ${
                        marcada
                          ? "font-semibold text-tinta-900 dark:text-white"
                          : "text-tinta-700 dark:text-tinta-200"
                      }`}
                    >
                      {opcao.rotulo}
                    </span>

                    {!multiplo && marcada && (
                      <Check
                        className="h-4 w-4 shrink-0 text-tinta-900 dark:text-white"
                        strokeWidth={3}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
