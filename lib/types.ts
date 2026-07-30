/**
 * Só o master tem a Administração. Os demais perfis compartilham exatamente a
 * mesma visão — o que muda entre eles é apenas a nomenclatura.
 */
export type Role = "master" | "user" | "analista" | "estrategista";

export const ROTULOS_ROLE: Record<Role, string> = {
  master: "Master",
  user: "Cliente",
  analista: "Consultor Analista",
  estrategista: "Consultor Estrategista",
};

/** Ordem usada nas listas de seleção. */
export const ROLES: Role[] = ["user", "analista", "estrategista", "master"];

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha: string;
  role: Role;
  /** Empresas às quais o login tem acesso. Master enxerga todas. */
  empresaIds: string[];
  ativo: boolean;
}

export interface Empresa {
  id: string;
  nome: string;
  cnpj?: string;
  ativa: boolean;
  /**
   * Pastas padrão já provisionadas para este cliente. Sem isso, uma pasta padrão
   * excluída pelo master voltaria sozinha no próximo carregamento.
   */
  padroesAplicados?: string[];
}

export interface Categoria {
  id: string;
  empresaId: string;
  nome: string;
  descricao: string;
  /** Categorias padrão não podem ser excluídas. */
  padrao: boolean;
}

export interface Relatorio {
  id: string;
  empresaId: string;
  categoriaId: string;
  nome: string;
  /** Link (Power BI, Looker, Metabase...) aberto na página do relatório. */
  url: string;
  /** Selo exibido no canto do card, ex.: "API 54". */
  tag?: string;
  /**
   * Alguns provedores respondem com X-Frame-Options/CSP e não podem ser exibidos
   * dentro do portal. Nesses casos o relatório abre em uma nova aba.
   */
  novaAba?: boolean;
  ativo: boolean;
}

export interface Database {
  empresas: Empresa[];
  categorias: Categoria[];
  relatorios: Relatorio[];
  usuarios: Usuario[];
}

/** Pastas criadas automaticamente para todo cliente novo. */
export const CATEGORIAS_PADRAO = [
  "DRE e Balanço",
  "Painel de Indicadores",
  "Plano de Ação",
  "Organograma",
] as const;

export const DESCRICAO_CATEGORIA_PADRAO = "Acesse os relatórios desta categoria.";
