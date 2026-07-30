"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, Loader2, Trash2 } from "lucide-react";

type Etapa = "pergunta" | "excluindo" | "concluido";

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function DialogoExclusao({
  aberto,
  titulo,
  mensagem,
  rotuloConfirmar = "Sim, excluir",
  onCancelar,
  onConfirmar,
}: {
  aberto: boolean;
  titulo: string;
  mensagem: string;
  rotuloConfirmar?: string;
  onCancelar: () => void;
  /**
   * Executado só depois das animações — quem chama normalmente remove o item
   * (e este componente junto), então rodar antes cortaria o "concluído".
   */
  onConfirmar: () => void;
}) {
  const [etapa, setEtapa] = useState<Etapa>("pergunta");
  const [montado, setMontado] = useState(false);
  const vivoRef = useRef(true);

  useEffect(() => {
    // precisa ser reativado aqui: em desenvolvimento o StrictMode monta,
    // desmonta e monta de novo — sem isto a exclusão trava no "Excluindo..."
    vivoRef.current = true;
    setMontado(true);
    return () => {
      vivoRef.current = false;
    };
  }, []);

  // reabriu? volta para a pergunta
  useEffect(() => {
    if (aberto) setEtapa("pergunta");
  }, [aberto]);

  useEffect(() => {
    if (!aberto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && etapa === "pergunta") onCancelar();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [aberto, etapa, onCancelar]);

  if (!aberto || !montado) return null;

  async function confirmar() {
    // a exclusão em si é instantânea; as pausas existem só para as animações
    // serem percebidas — curtas o bastante para não parecer travamento
    setEtapa("excluindo");
    await esperar(280);
    if (!vivoRef.current) return;
    setEtapa("concluido");
    await esperar(550);
    if (!vivoRef.current) return;
    onConfirmar();
  }

  const ocupado = etapa !== "pergunta";

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Fundo embaçado */}
      <div
        aria-hidden
        onClick={() => !ocupado && onCancelar()}
        className="anim-fundo absolute inset-0 bg-tinta-950/45 backdrop-blur-[6px]"
      />

      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={titulo}
        aria-busy={ocupado}
        className="anim-cartao relative z-10 w-full max-w-[420px] rounded-2xl border border-tinta-200 bg-white p-8 text-center shadow-[0_30px_70px_-25px_rgba(15,23,42,0.55)] dark:border-[#2f333c] dark:bg-carvao-claro"
      >
        {etapa === "pergunta" && (
          <>
            <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-perigo/10">
              <Trash2 className="h-7 w-7 text-perigo" strokeWidth={2} />
            </span>

            <h2 className="font-display text-[20px] font-bold text-tinta-900 dark:text-white">
              {titulo}
            </h2>
            <p className="mt-2 text-[14px] leading-relaxed text-tinta-500 dark:text-tinta-400">
              {mensagem}
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onCancelar}
                className="rounded-xl border border-tinta-200 py-3 text-[14px] font-semibold text-tinta-700 transition hover:bg-tinta-100 dark:border-[#2f333c] dark:text-tinta-200 dark:hover:bg-white/5"
              >
                Cancelar
              </button>
              <button
                type="button"
                autoFocus
                onClick={confirmar}
                className="rounded-xl bg-perigo py-3 text-[14px] font-bold text-white transition hover:bg-red-600"
              >
                {rotuloConfirmar}
              </button>
            </div>
          </>
        )}

        {etapa === "excluindo" && (
          <div className="py-4">
            <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center">
              <Loader2 className="h-9 w-9 animate-spin text-perigo" strokeWidth={2.5} />
            </span>
            <h2 className="font-display text-[19px] font-bold text-tinta-900 dark:text-white">
              Excluindo...
            </h2>
            <p className="mt-1.5 text-[14px] text-tinta-400">Aguarde um instante.</p>
          </div>
        )}

        {etapa === "concluido" && (
          <div className="py-4">
            <span className="anim-selo mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500">
              <Check className="h-8 w-8 text-white" strokeWidth={3} />
            </span>
            <h2 className="font-display text-[19px] font-bold text-tinta-900 dark:text-white">
              Excluído com sucesso
            </h2>
            <p className="mt-1.5 text-[14px] text-tinta-400">Voltando...</p>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
