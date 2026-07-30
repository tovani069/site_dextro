"use client";

import Link from "next/link";
import { Building2 } from "lucide-react";
import { CartaoEmpresa } from "@/components/CartaoEmpresa";
import { EstadoVazio } from "@/components/EstadoVazio";
import { SeletorEmpresa } from "@/components/SeletorEmpresa";
import { useStore } from "@/lib/store";

export default function HomePage() {
  const { usuario, empresasVisiveis, categoriasDaEmpresa } = useStore();
  const ehMaster = usuario?.role === "master";

  return (
    <>
      {/* Saudação + (master) atalho para alternar de cliente */}
      <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="font-display text-[40px] leading-tight font-extrabold text-tinta-900 dark:text-white">
            <span className="text-tinta-400">Olá,</span> {usuario?.nome}
          </h1>
          <p className="mt-1 text-[16px] text-tinta-400">
            {ehMaster
              ? "Selecione um cliente para ver os indicadores."
              : "Selecione uma empresa para ver os indicadores."}
          </p>
        </div>

        {empresasVisiveis.length > 0 && (
          <div className="w-full lg:w-[400px]">
            <SeletorEmpresa />
          </div>
        )}
      </div>

      <section>
        <h2 className="mb-6 flex items-center gap-2.5 font-display text-[24px] font-bold text-tinta-800 dark:text-white">
          <Building2 className="h-5.5 w-5.5 text-acento" strokeWidth={2.5} />
          Empresas
        </h2>

        {empresasVisiveis.length === 0 ? (
          ehMaster ? (
            <EstadoVazio
              titulo="Nenhuma empresa cadastrada"
              descricao="Cadastre o primeiro cliente para começar a publicar relatórios."
              acao={
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 rounded-xl bg-tinta-900 px-5 py-3 text-[14px] font-bold text-white dark:bg-white dark:text-tinta-900"
                >
                  <Building2 className="h-4 w-4" />
                  Cadastrar empresa
                </Link>
              }
            />
          ) : (
            <EstadoVazio
              titulo="Nenhuma empresa vinculada"
              descricao="Seu login ainda não possui empresas liberadas. Fale com a Dextro Consultoria."
            />
          )
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {empresasVisiveis.map((empresa) => (
              <CartaoEmpresa
                key={empresa.id}
                nome={empresa.nome}
                quantidade={categoriasDaEmpresa(empresa.id).length}
                href={`/empresas/${empresa.id}`}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
