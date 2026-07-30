"use client";

import { useRef, useState } from "react";
import { useParams } from "next/navigation";
import { ExternalLink, Maximize2, RotateCw, SquareArrowOutUpRight } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SemAcesso } from "@/components/SemAcesso";
import { useStore } from "@/lib/store";

export default function RelatorioPage() {
  const { empresaId, categoriaId, relatorioId } = useParams<{
    empresaId: string;
    categoriaId: string;
    relatorioId: string;
  }>();
  const { buscarEmpresa, buscarCategoria, buscarRelatorio, podeAcessar } = useStore();

  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [chave, setChave] = useState(0);

  const empresa = buscarEmpresa(empresaId);
  const categoria = buscarCategoria(categoriaId);
  const relatorio = buscarRelatorio(relatorioId);

  if (!empresa || !categoria || !relatorio || relatorio.categoriaId !== categoria.id) {
    return (
      <SemAcesso titulo="Relatório não encontrado" descricao="Este relatório não existe ou foi removido." />
    );
  }
  if (!podeAcessar(empresa.id)) {
    return <SemAcesso titulo="Acesso negado" descricao="Seu login não tem permissão para esta empresa." />;
  }

  function telaCheia() {
    containerRef.current?.requestFullscreen?.();
  }

  return (
    <>
      <Breadcrumbs
        itens={[
          { label: "Relatórios", href: `/empresas/${empresa.id}` },
          { label: categoria.nome, href: `/empresas/${empresa.id}/${categoria.id}` },
          { label: relatorio.nome },
        ]}
      />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <span className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.06em] text-tinta-500 uppercase dark:text-tinta-400">
            <span className="h-1.5 w-1.5 rounded-full bg-tinta-900 dark:bg-white" />
            {empresa.nome} · {categoria.nome}
          </span>
          <h1 className="mt-2 font-display text-[32px] leading-tight font-extrabold text-tinta-900 dark:text-white">
            {relatorio.nome}
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {!relatorio.novaAba && (
            <>
              <button
                type="button"
                onClick={() => setChave((k) => k + 1)}
                className="flex items-center gap-2 rounded-xl border border-tinta-200 bg-white px-4 py-2.5 text-[13px] font-semibold text-tinta-700 transition hover:bg-tinta-100 dark:border-[#2f333c] dark:bg-carvao-claro dark:text-tinta-200 dark:hover:bg-white/5"
              >
                <RotateCw className="h-4 w-4" />
                Atualizar
              </button>
              <button
                type="button"
                onClick={telaCheia}
                className="flex items-center gap-2 rounded-xl border border-tinta-200 bg-white px-4 py-2.5 text-[13px] font-semibold text-tinta-700 transition hover:bg-tinta-100 dark:border-[#2f333c] dark:bg-carvao-claro dark:text-tinta-200 dark:hover:bg-white/5"
              >
                <Maximize2 className="h-4 w-4" />
                Tela cheia
              </button>
            </>
          )}
          <a
            href={relatorio.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl bg-tinta-900 px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-tinta-800 dark:bg-white dark:text-tinta-900 dark:hover:bg-tinta-200"
          >
            <ExternalLink className="h-4 w-4" />
            Abrir em nova aba
          </a>
        </div>
      </div>

      {relatorio.novaAba ? (
        <div className="cartao flex min-h-[420px] flex-col items-center justify-center px-6 py-16 text-center">
          <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-tinta-100 dark:bg-white/5">
            <SquareArrowOutUpRight
              className="h-7 w-7 text-tinta-800 dark:text-white"
              strokeWidth={2}
            />
          </span>

          <h2 className="font-display text-[20px] font-bold text-tinta-900 dark:text-white">
            Este relatório abre em uma nova aba
          </h2>
          <p className="mt-2 max-w-md text-[14px] leading-relaxed text-tinta-400">
            O provedor deste relatório não permite exibi-lo dentro do portal. Clique abaixo para
            visualizá-lo.
          </p>

          <a
            href={relatorio.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 flex items-center gap-2 rounded-xl bg-tinta-900 px-6 py-3.5 text-[14px] font-bold text-white transition hover:bg-tinta-800 dark:bg-white dark:text-tinta-900 dark:hover:bg-tinta-200"
          >
            <ExternalLink className="h-4 w-4" />
            Abrir {relatorio.nome}
          </a>
        </div>
      ) : (
        <>
          <div
            ref={containerRef}
            className="cartao relative overflow-hidden bg-white p-0 dark:bg-carvao-claro"
          >
            <iframe
              key={chave}
              ref={iframeRef}
              src={relatorio.url}
              title={relatorio.nome}
              allowFullScreen
              className="h-[calc(100vh-330px)] min-h-[520px] w-full border-0 bg-white"
            />
          </div>

          <p className="mt-3 text-center text-[13px] text-tinta-400">
            Não carregou? Alguns provedores bloqueiam a exibição incorporada — marque{" "}
            <span className="font-semibold text-tinta-600 dark:text-tinta-200">
              &ldquo;Abrir em nova aba&rdquo;
            </span>{" "}
            no cadastro deste relatório.
          </p>
        </>
      )}
    </>
  );
}
