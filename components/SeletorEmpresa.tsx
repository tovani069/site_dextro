"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, RefreshCw } from "lucide-react";
import { ListaSuspensa } from "@/components/ListaSuspensa";
import { useStore } from "@/lib/store";

/**
 * Lista suspensa + botão "Alternar" do topo da tela inicial: atalho para entrar
 * direto em uma empresa. Lista o que o perfil logado enxerga — todas para o
 * master, apenas as vinculadas para os demais.
 */
export function SeletorEmpresa() {
  const router = useRouter();
  const { empresasVisiveis, selecionarEmpresa } = useStore();

  // começa vazio: o campo é uma busca, não o "cliente atual"
  const [escolhida, setEscolhida] = useState<string[]>([]);

  function alternar() {
    const id = escolhida[0];
    if (!id) return;
    selecionarEmpresa(id);
    router.push(`/empresas/${id}`);
  }

  return (
    <div className="cartao flex items-center gap-3 p-3">
      <div className="min-w-0 flex-1">
        <ListaSuspensa
          opcoes={empresasVisiveis.map((e) => ({ valor: e.id, rotulo: e.nome }))}
          selecionados={escolhida}
          onChange={setEscolhida}
          placeholder="Pesquisar"
          textoVazio="Nenhuma empresa cadastrada"
          rotuloAcessivel="Pesquisar empresa"
          icone={Building2}
        />
      </div>

      <button
        type="button"
        onClick={alternar}
        disabled={escolhida.length === 0}
        className="flex h-[46px] shrink-0 items-center gap-2 rounded-xl bg-tinta-900 px-5 text-[14px] font-bold text-white transition hover:bg-tinta-800 disabled:opacity-45 dark:bg-white dark:text-tinta-900 dark:hover:bg-tinta-200"
      >
        <RefreshCw className="h-4 w-4" strokeWidth={2.5} />
        Alternar
      </button>
    </div>
  );
}
