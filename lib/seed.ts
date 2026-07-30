import {
  CATEGORIAS_PADRAO,
  DESCRICAO_CATEGORIA_PADRAO,
  type Categoria,
  type Database,
} from "./types";

function categoriaPadrao(empresaId: string, nome: string): Categoria {
  return {
    id: `${empresaId}-cat-${CATEGORIAS_PADRAO.indexOf(nome as never) + 1}`,
    empresaId,
    nome,
    descricao: DESCRICAO_CATEGORIA_PADRAO,
    padrao: true,
  };
}

/** Cria as pastas padrão de um cliente novo. */
export function criarCategoriasPadrao(empresaId: string): Categoria[] {
  return CATEGORIAS_PADRAO.map((nome) => categoriaPadrao(empresaId, nome));
}

/**
 * Provisiona as pastas padrão que ainda não foram entregues a cada cliente —
 * inclusive as incluídas em versões posteriores ao cadastro dele.
 *
 * O controle é por `empresa.padroesAplicados`, e não pela existência da pasta:
 * assim uma pasta padrão excluída de propósito não é recriada na próxima carga.
 */
export function garantirCategoriasPadrao(db: Database): Database {
  // base salva por uma versão anterior pode estar incompleta — nunca deixar quebrar a tela
  if (!db?.empresas || !db?.categorias) return seedDatabase;

  const categorias = [...db.categorias];
  let mudou = false;

  const empresas = db.empresas.map((empresa) => {
    const aplicados = empresa.padroesAplicados ?? [];
    const pendentes = CATEGORIAS_PADRAO.filter((nome) => !aplicados.includes(nome));
    if (pendentes.length === 0) return empresa;

    mudou = true;
    for (const nome of pendentes) {
      const jaExiste = categorias.some((c) => c.empresaId === empresa.id && c.nome === nome);
      if (!jaExiste) categorias.push(categoriaPadrao(empresa.id, nome));
    }
    return { ...empresa, padroesAplicados: [...CATEGORIAS_PADRAO] };
  });

  return mudou ? { ...db, empresas, categorias } : db;
}

/**
 * Base inicial limpa: sem empresas e sem relatórios de exemplo — tudo é
 * cadastrado pela Administração. Só os logins de acesso vêm prontos.
 */
export const seedDatabase: Database = {
  empresas: [],
  categorias: [],
  relatorios: [],
  usuarios: [
    {
      id: "user-master",
      nome: "Mateus Tovani",
      email: "tovani@dextro.com.br",
      senha: "dextro123",
      role: "master",
      empresaIds: [],
      ativo: true,
    },
    {
      id: "user-cliente",
      nome: "Cliente",
      email: "cliente@dextro.com.br",
      senha: "cliente123",
      role: "user",
      empresaIds: [],
      ativo: true,
    },
  ],
};
