"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { FolderOpen, LineChart } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CartaoRelatorio } from "@/components/CartaoRelatorio";
import { EstadoVazio } from "@/components/EstadoVazio";
import { SemAcesso } from "@/components/SemAcesso";
import { useStore } from "@/lib/store";

export default function CategoriaPage() {
  const { empresaId, categoriaId } = useParams<{ empresaId: string; categoriaId: string }>();
  const { buscarEmpresa, buscarCategoria, relatoriosDaCategoria, podeAcessar } = useStore();

  const empresa = buscarEmpresa(empresaId);
  const categoria = buscarCategoria(categoriaId);
  const relatorios = useMemo(
    () => (categoria ? relatoriosDaCategoria(categoria.id) : []),
    [categoria, relatoriosDaCategoria]
  );

  if (!empresa || !categoria || categoria.empresaId !== empresa.id) {
    return (
      <SemAcesso titulo="Categoria não encontrada" descricao="Esta pasta não existe ou foi removida." />
    );
  }
  if (!podeAcessar(empresa.id)) {
    return <SemAcesso titulo="Acesso negado" descricao="Seu login não tem permissão para esta empresa." />;
  }

  return (
    <>
      <Breadcrumbs
        itens={[
          { label: "Relatórios", href: `/empresas/${empresa.id}` },
          { label: categoria.nome },
        ]}
      />

      <div className="mb-9 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-2 rounded-full bg-tinta-200/70 px-3.5 py-1.5 text-[11px] font-bold tracking-[0.08em] text-tinta-700 uppercase dark:bg-white/8 dark:text-tinta-200">
            <FolderOpen className="h-3.5 w-3.5" />
            Categoria
          </span>

          <h1 className="mt-4 font-display text-[46px] leading-none font-extrabold tracking-tight text-tinta-900 uppercase dark:text-white">
            {categoria.nome}
          </h1>
        </div>

        <div className="cartao flex shrink-0 items-center gap-3.5 px-5 py-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-tinta-900 dark:bg-white">
            <LineChart className="h-5 w-5 text-white dark:text-tinta-900" strokeWidth={2.5} />
          </span>
          <span className="leading-none">
            <span className="block font-display text-[22px] font-bold text-tinta-900 dark:text-white">
              {relatorios.length}
            </span>
            <span className="mt-0.5 block text-[11px] font-bold tracking-[0.06em] text-tinta-500 uppercase dark:text-tinta-400">
              Relatórios
            </span>
          </span>
        </div>
      </div>

      {relatorios.length === 0 ? (
        <EstadoVazio
          titulo="Nenhum relatório publicado"
          descricao="Assim que um link for cadastrado nesta pasta, ele aparecerá aqui."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {relatorios.map((relatorio) => (
            <CartaoRelatorio
              key={relatorio.id}
              nome={relatorio.nome}
              empresaNome={empresa.nome}
              tag={relatorio.tag}
              href={`/empresas/${empresa.id}/${categoria.id}/${relatorio.id}`}
              url={relatorio.url}
              novaAba={relatorio.novaAba}
            />
          ))}
        </div>
      )}
    </>
  );
}
