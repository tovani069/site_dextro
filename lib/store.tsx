"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { criarCategoriasPadrao, garantirCategoriasPadrao, seedDatabase } from "./seed";
import {
  CATEGORIAS_PADRAO,
  DESCRICAO_CATEGORIA_PADRAO,
  type Categoria,
  type Database,
  type Empresa,
  type Relatorio,
  type Usuario,
} from "./types";

const DB_KEY = "dextro.db.v2";
/** Base anterior, que trazia empresas e relatórios de exemplo. */
const DB_KEY_ANTERIOR = "dextro.db.v1";
const SESSION_KEY = "dextro.session.v1";
const EMPRESA_KEY = "dextro.empresa.v1";

/* -------------------------------------------------------------------------- */
/*  Persistência                                                              */
/* -------------------------------------------------------------------------- */

function ler<T>(chave: string, padrao: T): T {
  if (typeof window === "undefined") return padrao;
  try {
    const cru = window.localStorage.getItem(chave);
    if (!cru) return padrao;
    const valor = JSON.parse(cru) as T;
    // "null" gravado por uma versão anterior não pode virar o estado da aplicação
    return valor === null && padrao !== null ? padrao : valor;
  } catch {
    return padrao;
  }
}

function gravar(chave: string, valor: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    /* quota cheia ou modo privado — ignora */
  }
}

const id = (prefixo: string) =>
  `${prefixo}-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-4)}`;

/**
 * Carrega a base do navegador. Na primeira execução após a limpeza, migra a
 * base antiga preservando apenas os logins — empresas e relatórios são
 * descartados, e os vínculos zerados por já não existirem empresas.
 */
function carregarBase(): Database {
  const atual = ler<Database | null>(DB_KEY, null);
  if (atual) return garantirCategoriasPadrao(atual);

  const anterior = ler<Database | null>(DB_KEY_ANTERIOR, null);
  if (anterior?.usuarios?.length) {
    return {
      ...seedDatabase,
      usuarios: anterior.usuarios.map((u) => ({ ...u, empresaIds: [] })),
    };
  }

  return seedDatabase;
}

/* -------------------------------------------------------------------------- */
/*  Contexto                                                                  */
/* -------------------------------------------------------------------------- */

interface StoreValue {
  /** false até o localStorage ser lido — evita divergência de hidratação. */
  pronto: boolean;
  db: Database;
  usuario: Usuario | null;
  empresaAtualId: string | null;
  empresaAtual: Empresa | null;
  /** Empresas visíveis para o usuário logado (master vê todas). */
  empresasVisiveis: Empresa[];

  entrar: (email: string, senha: string) => { ok: boolean; erro?: string };
  sair: () => void;
  selecionarEmpresa: (empresaId: string) => void;

  categoriasDaEmpresa: (empresaId: string) => Categoria[];
  relatoriosDaCategoria: (categoriaId: string) => Relatorio[];
  buscarEmpresa: (empresaId: string) => Empresa | undefined;
  buscarCategoria: (categoriaId: string) => Categoria | undefined;
  buscarRelatorio: (relatorioId: string) => Relatorio | undefined;
  podeAcessar: (empresaId: string) => boolean;

  criarEmpresa: (dados: { nome: string; cnpj?: string }) => Empresa;
  atualizarEmpresa: (empresaId: string, dados: Partial<Empresa>) => void;
  removerEmpresa: (empresaId: string) => void;

  criarCategoria: (dados: { empresaId: string; nome: string; descricao?: string }) => Categoria;
  removerCategoria: (categoriaId: string) => void;

  criarRelatorio: (dados: Omit<Relatorio, "id" | "ativo">) => Relatorio;
  atualizarRelatorio: (relatorioId: string, dados: Partial<Relatorio>) => void;
  removerRelatorio: (relatorioId: string) => void;

  criarUsuario: (
    dados: Omit<Usuario, "id">
  ) => { ok: boolean; erro?: string; usuario?: Usuario };
  atualizarUsuario: (usuarioId: string, dados: Partial<Usuario>) => void;
  removerUsuario: (usuarioId: string) => void;
  vincularEmpresa: (usuarioId: string, empresaId: string, vincular: boolean) => void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [pronto, setPronto] = useState(false);
  const [db, setDb] = useState<Database>(seedDatabase);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [empresaAtualId, setEmpresaAtualId] = useState<string | null>(null);

  useEffect(() => {
    const dbSalvo = carregarBase();
    const sessao = ler<string | null>(SESSION_KEY, null);
    const empresa = ler<string | null>(EMPRESA_KEY, null);
    setDb(dbSalvo);
    gravar(DB_KEY, dbSalvo);
    setUsuario(dbSalvo.usuarios.find((u) => u.id === sessao) ?? null);
    setEmpresaAtualId(empresa);
    setPronto(true);
  }, []);

  const salvar = useCallback((proximo: Database) => {
    setDb(proximo);
    gravar(DB_KEY, proximo);
  }, []);

  /* ----------------------------- Autenticação ---------------------------- */

  const entrar = useCallback<StoreValue["entrar"]>(
    (email, senha) => {
      const encontrado = db.usuarios.find(
        (u) => u.email.trim().toLowerCase() === email.trim().toLowerCase()
      );
      if (!encontrado) return { ok: false, erro: "E-mail não encontrado." };
      if (!encontrado.ativo) return { ok: false, erro: "Este login está inativo." };
      if (encontrado.senha !== senha) return { ok: false, erro: "Senha incorreta." };

      setUsuario(encontrado);
      gravar(SESSION_KEY, encontrado.id);

      const primeira =
        encontrado.role === "master"
          ? db.empresas[0]?.id ?? null
          : encontrado.empresaIds[0] ?? null;
      setEmpresaAtualId(primeira);
      gravar(EMPRESA_KEY, primeira);
      return { ok: true };
    },
    [db]
  );

  const sair = useCallback(() => {
    setUsuario(null);
    setEmpresaAtualId(null);
    gravar(SESSION_KEY, null);
    gravar(EMPRESA_KEY, null);
  }, []);

  const selecionarEmpresa = useCallback((empresaId: string) => {
    setEmpresaAtualId(empresaId);
    gravar(EMPRESA_KEY, empresaId);
  }, []);

  /* ------------------------------- Leituras ------------------------------ */

  const empresasVisiveis = useMemo(() => {
    if (!usuario) return [];
    if (usuario.role === "master") return db.empresas;
    return db.empresas.filter((e) => usuario.empresaIds.includes(e.id));
  }, [db.empresas, usuario]);

  const podeAcessar = useCallback(
    (empresaId: string) => {
      if (!usuario) return false;
      if (usuario.role === "master") return true;
      return usuario.empresaIds.includes(empresaId);
    },
    [usuario]
  );

  const categoriasDaEmpresa = useCallback(
    (empresaId: string) => db.categorias.filter((c) => c.empresaId === empresaId),
    [db.categorias]
  );

  const relatoriosDaCategoria = useCallback(
    (categoriaId: string) => db.relatorios.filter((r) => r.categoriaId === categoriaId),
    [db.relatorios]
  );

  const buscarEmpresa = useCallback(
    (empresaId: string) => db.empresas.find((e) => e.id === empresaId),
    [db.empresas]
  );
  const buscarCategoria = useCallback(
    (categoriaId: string) => db.categorias.find((c) => c.id === categoriaId),
    [db.categorias]
  );
  const buscarRelatorio = useCallback(
    (relatorioId: string) => db.relatorios.find((r) => r.id === relatorioId),
    [db.relatorios]
  );

  /* ------------------------------- Empresas ------------------------------ */

  const criarEmpresa = useCallback<StoreValue["criarEmpresa"]>(
    ({ nome, cnpj }) => {
      const nova: Empresa = {
        id: id("emp"),
        nome: nome.trim(),
        cnpj,
        ativa: true,
        padroesAplicados: [...CATEGORIAS_PADRAO],
      };
      salvar({
        ...db,
        empresas: [...db.empresas, nova],
        // todo cliente novo já nasce com as 3 pastas padrão
        categorias: [...db.categorias, ...criarCategoriasPadrao(nova.id)],
      });
      return nova;
    },
    [db, salvar]
  );

  const atualizarEmpresa = useCallback<StoreValue["atualizarEmpresa"]>(
    (empresaId, dados) => {
      salvar({
        ...db,
        empresas: db.empresas.map((e) => (e.id === empresaId ? { ...e, ...dados } : e)),
      });
    },
    [db, salvar]
  );

  const removerEmpresa = useCallback<StoreValue["removerEmpresa"]>(
    (empresaId) => {
      salvar({
        empresas: db.empresas.filter((e) => e.id !== empresaId),
        categorias: db.categorias.filter((c) => c.empresaId !== empresaId),
        relatorios: db.relatorios.filter((r) => r.empresaId !== empresaId),
        usuarios: db.usuarios.map((u) => ({
          ...u,
          empresaIds: u.empresaIds.filter((eid) => eid !== empresaId),
        })),
      });
      if (empresaAtualId === empresaId) {
        const proxima = db.empresas.find((e) => e.id !== empresaId)?.id ?? null;
        setEmpresaAtualId(proxima);
        gravar(EMPRESA_KEY, proxima);
      }
    },
    [db, salvar, empresaAtualId]
  );

  /* ------------------------------ Categorias ----------------------------- */

  const criarCategoria = useCallback<StoreValue["criarCategoria"]>(
    ({ empresaId, nome, descricao }) => {
      const nova: Categoria = {
        id: id("cat"),
        empresaId,
        nome: nome.trim(),
        descricao: descricao?.trim() || DESCRICAO_CATEGORIA_PADRAO,
        padrao: false,
      };
      salvar({ ...db, categorias: [...db.categorias, nova] });
      return nova;
    },
    [db, salvar]
  );

  const removerCategoria = useCallback<StoreValue["removerCategoria"]>(
    (categoriaId) => {
      salvar({
        ...db,
        categorias: db.categorias.filter((c) => c.id !== categoriaId),
        relatorios: db.relatorios.filter((r) => r.categoriaId !== categoriaId),
      });
    },
    [db, salvar]
  );

  /* ------------------------------ Relatórios ----------------------------- */

  const criarRelatorio = useCallback<StoreValue["criarRelatorio"]>(
    (dados) => {
      const novo: Relatorio = { ...dados, id: id("rel"), ativo: true };
      salvar({ ...db, relatorios: [...db.relatorios, novo] });
      return novo;
    },
    [db, salvar]
  );

  const atualizarRelatorio = useCallback<StoreValue["atualizarRelatorio"]>(
    (relatorioId, dados) => {
      salvar({
        ...db,
        relatorios: db.relatorios.map((r) => (r.id === relatorioId ? { ...r, ...dados } : r)),
      });
    },
    [db, salvar]
  );

  const removerRelatorio = useCallback<StoreValue["removerRelatorio"]>(
    (relatorioId) => {
      salvar({ ...db, relatorios: db.relatorios.filter((r) => r.id !== relatorioId) });
    },
    [db, salvar]
  );

  /* ------------------------------- Usuários ------------------------------ */

  const criarUsuario = useCallback<StoreValue["criarUsuario"]>(
    (dados) => {
      const jaExiste = db.usuarios.some(
        (u) => u.email.trim().toLowerCase() === dados.email.trim().toLowerCase()
      );
      if (jaExiste) return { ok: false, erro: "Já existe um login com este e-mail." };

      const novo: Usuario = { ...dados, email: dados.email.trim(), id: id("usr") };
      salvar({ ...db, usuarios: [...db.usuarios, novo] });
      return { ok: true, usuario: novo };
    },
    [db, salvar]
  );

  const atualizarUsuario = useCallback<StoreValue["atualizarUsuario"]>(
    (usuarioId, dados) => {
      const usuarios = db.usuarios.map((u) => (u.id === usuarioId ? { ...u, ...dados } : u));
      salvar({ ...db, usuarios });
      if (usuario?.id === usuarioId) {
        setUsuario(usuarios.find((u) => u.id === usuarioId) ?? null);
      }
    },
    [db, salvar, usuario]
  );

  const removerUsuario = useCallback<StoreValue["removerUsuario"]>(
    (usuarioId) => {
      salvar({ ...db, usuarios: db.usuarios.filter((u) => u.id !== usuarioId) });
    },
    [db, salvar]
  );

  const vincularEmpresa = useCallback<StoreValue["vincularEmpresa"]>(
    (usuarioId, empresaId, vincular) => {
      const usuarios = db.usuarios.map((u) => {
        if (u.id !== usuarioId) return u;
        const atual = new Set(u.empresaIds);
        if (vincular) atual.add(empresaId);
        else atual.delete(empresaId);
        return { ...u, empresaIds: [...atual] };
      });
      salvar({ ...db, usuarios });
      if (usuario?.id === usuarioId) {
        setUsuario(usuarios.find((u) => u.id === usuarioId) ?? null);
      }
    },
    [db, salvar, usuario]
  );

  const empresaAtual = useMemo(
    () => (empresaAtualId ? db.empresas.find((e) => e.id === empresaAtualId) ?? null : null),
    [db.empresas, empresaAtualId]
  );

  const value: StoreValue = {
    pronto,
    db,
    usuario,
    empresaAtualId,
    empresaAtual,
    empresasVisiveis,
    entrar,
    sair,
    selecionarEmpresa,
    categoriasDaEmpresa,
    relatoriosDaCategoria,
    buscarEmpresa,
    buscarCategoria,
    buscarRelatorio,
    podeAcessar,
    criarEmpresa,
    atualizarEmpresa,
    removerEmpresa,
    criarCategoria,
    removerCategoria,
    criarRelatorio,
    atualizarRelatorio,
    removerRelatorio,
    criarUsuario,
    atualizarUsuario,
    removerUsuario,
    vincularEmpresa,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore precisa estar dentro de <StoreProvider>");
  return ctx;
}
