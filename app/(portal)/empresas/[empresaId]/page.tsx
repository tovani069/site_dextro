"use client";

import { useParams } from "next/navigation";
import { Layers } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CartaoCategoria } from "@/components/CartaoCategoria";
import { EstadoVazio } from "@/components/EstadoVazio";
import { SemAcesso } from "@/components/SemAcesso";
import { useStore } from "@/lib/store";

export default function EmpresaPage() {
  const { empresaId } = useParams<{ empresaId: string }>();
  const { usuario, buscarEmpresa, categoriasDaEmpresa, relatoriosDaCategoria, podeAcessar } =
    useStore();

  const empresa = buscarEmpresa(empresaId);

  if (!empresa) {
    return <SemAcesso titulo="Empresa não encontrada" descricao="Este cliente não existe ou foi removido." />;
  }
  if (!podeAcessar(empresa.id)) {
    return <SemAcesso titulo="Acesso negado" descricao="Seu login não tem permissão para esta empresa." />;
  }

  const categorias = categoriasDaEmpresa(empresa.id);

  return (
    <>
      <Breadcrumbs itens={[{ label: "Empresas", href: "/" }, { label: empresa.nome }]} />

      <div className="mb-11">
        <h1 className="font-display text-[40px] leading-tight font-extrabold text-tinta-900 dark:text-white">
          <span className="text-tinta-400">Olá,</span> {usuario?.nome}
        </h1>
        <p className="mt-1 text-[16px] text-tinta-400">
          Bem-vindo ao painel de indicadores de{" "}
          <span className="font-semibold text-tinta-600 dark:text-tinta-200">{empresa.nome}</span>.
        </p>
      </div>

      <section>
        <h2 className="mb-6 flex items-center gap-2.5 font-display text-[24px] font-bold text-tinta-800 dark:text-white">
          <Layers className="h-5.5 w-5.5 text-acento" strokeWidth={2.5} />
          Categorias
        </h2>

        {categorias.length === 0 ? (
          <EstadoVazio
            titulo="Nenhuma categoria"
            descricao="Ainda não há pastas configuradas para esta empresa."
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {categorias.map((categoria) => (
              <CartaoCategoria
                key={categoria.id}
                nome={categoria.nome}
                descricao={categoria.descricao}
                quantidade={relatoriosDaCategoria(categoria.id).length}
                href={`/empresas/${empresa.id}/${categoria.id}`}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
