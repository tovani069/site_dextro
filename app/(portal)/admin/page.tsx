"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  ExternalLink,
  FolderOpen,
  FolderPlus,
  LogIn,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";
import { DialogoExclusao } from "@/components/DialogoExclusao";
import { ListaSuspensa } from "@/components/ListaSuspensa";
import { Modal } from "@/components/Modal";
import { SemAcesso } from "@/components/SemAcesso";
import { useStore } from "@/lib/store";
import {
  CATEGORIAS_PADRAO,
  ROLES,
  ROTULOS_ROLE,
  type Categoria,
  type Empresa,
  type Role,
  type Usuario,
} from "@/lib/types";

type Aba = "empresas" | "logins";

const ABAS: { id: Aba; label: string; icone: React.ElementType }[] = [
  { id: "empresas", label: "Empresas", icone: Building2 },
  { id: "logins", label: "Logins", icone: Users },
];

export default function AdminPage() {
  const { usuario } = useStore();
  const [aba, setAba] = useState<Aba>("empresas");

  if (usuario?.role !== "master") {
    return (
      <SemAcesso
        titulo="Área restrita"
        descricao="Somente o usuário master pode acessar a administração."
      />
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="font-display text-[36px] leading-tight font-extrabold text-tinta-900 dark:text-white">
          Administração
        </h1>
        <p className="mt-1 text-[15px] text-tinta-400">
          Cadastre clientes, crie logins, vincule empresas e publique os links dos relatórios.
        </p>
      </div>

      <div className="mb-7 flex flex-wrap gap-2">
        {ABAS.map(({ id, label, icone: Icone }) => (
          <button
            key={id}
            type="button"
            onClick={() => setAba(id)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-[14px] font-semibold transition ${
              aba === id
                ? "bg-tinta-900 text-white dark:bg-white dark:text-tinta-900"
                : "border border-tinta-200 bg-white text-tinta-600 hover:bg-tinta-100 dark:border-[#2f333c] dark:bg-carvao-claro dark:text-tinta-300 dark:hover:bg-white/5"
            }`}
          >
            <Icone className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {aba === "empresas" && <AbaEmpresas />}
      {aba === "logins" && <AbaLogins />}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Empresas                                                                  */
/* -------------------------------------------------------------------------- */

function AbaEmpresas() {
  const router = useRouter();
  const {
    db,
    criarEmpresa,
    removerEmpresa,
    criarCategoria,
    removerCategoria,
    categoriasDaEmpresa,
    relatoriosDaCategoria,
    selecionarEmpresa,
  } = useStore();

  const [modal, setModal] = useState(false);
  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  // cliente cujas pastas estão sendo editadas
  const [empresaAberta, setEmpresaAberta] = useState<Empresa | null>(null);

  function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) return;
    criarEmpresa({ nome, cnpj: cnpj.trim() || undefined });
    setNome("");
    setCnpj("");
    setModal(false);
  }

  function acessarComo(empresaId: string) {
    selecionarEmpresa(empresaId);
    router.push(`/empresas/${empresaId}`);
  }

  return (
    <>
      <BarraAcao
        titulo={`${db.empresas.length} ${db.empresas.length === 1 ? "empresa" : "empresas"}`}
        botao="Nova empresa"
        onClick={() => setModal(true)}
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {db.empresas.map((empresa) => {
          const categorias = categoriasDaEmpresa(empresa.id);
          const totalRelatorios = categorias.reduce(
            (soma, c) => soma + relatoriosDaCategoria(c.id).length,
            0
          );

          return (
            <section key={empresa.id} className="cartao flex flex-col p-6">
              <div className="mb-5 flex items-start justify-between gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-tinta-100 dark:bg-white/5">
                  <Building2
                    className="h-[19px] w-[19px] text-tinta-900 dark:text-white"
                    strokeWidth={2}
                  />
                </span>
                <BotaoExcluir
                  rotulo={`Excluir ${empresa.nome}`}
                  titulo={`Excluir ${empresa.nome}?`}
                  mensagem="Todas as pastas e relatórios deste cliente serão removidos, e o acesso será retirado dos logins vinculados. Esta ação não pode ser desfeita."
                  onConfirmar={() => removerEmpresa(empresa.id)}
                />
              </div>

              <h3 className="truncate font-display text-[19px] font-bold text-tinta-800 dark:text-white">
                {empresa.nome}
              </h3>
              <p className="mt-0.5 truncate text-[13px] text-tinta-400">
                {empresa.cnpj ? `CNPJ ${empresa.cnpj}` : "CNPJ não informado"}
              </p>

              <p className="mt-3 text-[12px] font-semibold tracking-[0.04em] text-tinta-400 uppercase">
                {categorias.length} {categorias.length === 1 ? "pasta" : "pastas"} ·{" "}
                {totalRelatorios} {totalRelatorios === 1 ? "relatório" : "relatórios"}
              </p>

              <div className="mt-6 flex gap-2">
                <button
                  type="button"
                  onClick={() => acessarComo(empresa.id)}
                  title="Entrar nesta empresa"
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-tinta-200 py-2.5 text-[13px] font-semibold text-tinta-700 transition hover:bg-tinta-100 dark:border-[#2f333c] dark:text-tinta-200 dark:hover:bg-white/5"
                >
                  <LogIn className="h-4 w-4" />
                  Acessar
                </button>
                <button
                  type="button"
                  onClick={() => setEmpresaAberta(empresa)}
                  aria-label={`Editar pastas de ${empresa.nome}`}
                  title="Editar pastas"
                  className="rounded-xl border border-tinta-200 p-2.5 text-tinta-600 transition hover:bg-tinta-100 hover:text-tinta-900 dark:border-[#2f333c] dark:text-tinta-300 dark:hover:bg-white/5 dark:hover:text-white"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
            </section>
          );
        })}
      </div>

      <Modal
        aberto={modal}
        titulo="Nova empresa"
        descricao={`As pastas ${CATEGORIAS_PADRAO.join(", ")} são criadas automaticamente.`}
        onFechar={() => setModal(false)}
      >
        <form onSubmit={salvar} className="space-y-4">
          <div>
            <label className="rotulo" htmlFor="emp-nome">
              Razão social
            </label>
            <input
              id="emp-nome"
              className="campo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Otica One Ltda"
              required
            />
          </div>
          <div>
            <label className="rotulo" htmlFor="emp-cnpj">
              CNPJ (opcional)
            </label>
            <input
              id="emp-cnpj"
              className="campo"
              value={cnpj}
              onChange={(e) => setCnpj(e.target.value)}
              placeholder="00.000.000/0001-00"
            />
          </div>
          <BotaoSalvar>Cadastrar empresa</BotaoSalvar>
        </form>
      </Modal>

      {empresaAberta && (
        <ModalPastas empresa={empresaAberta} onFechar={() => setEmpresaAberta(null)} />
      )}
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Pastas e relatórios de um cliente                                         */
/* -------------------------------------------------------------------------- */

const RELATORIO_VAZIO = { nome: "", url: "", tag: "", novaAba: false };
type FormRelatorio = typeof RELATORIO_VAZIO & { id?: string };

/** Navegação interna do modal: pastas → relatórios da pasta → formulário. */
type Vista =
  | { tela: "pastas" }
  | { tela: "relatorios"; categoria: Categoria }
  | { tela: "form"; categoria: Categoria; dados: FormRelatorio };

function ModalPastas({ empresa, onFechar }: { empresa: Empresa; onFechar: () => void }) {
  const {
    categoriasDaEmpresa,
    relatoriosDaCategoria,
    criarCategoria,
    removerCategoria,
    criarRelatorio,
    atualizarRelatorio,
    removerRelatorio,
  } = useStore();

  const [vista, setVista] = useState<Vista>({ tela: "pastas" });
  const [nomeNovaPasta, setNomeNovaPasta] = useState("");

  const categorias = categoriasDaEmpresa(empresa.id);

  function criarPasta(e: React.FormEvent) {
    e.preventDefault();
    const nome = nomeNovaPasta.trim();
    if (!nome) return;
    criarCategoria({ empresaId: empresa.id, nome });
    setNomeNovaPasta("");
  }

  function salvarRelatorio(e: React.FormEvent) {
    e.preventDefault();
    if (vista.tela !== "form") return;
    const { categoria, dados } = vista;

    const payload = {
      empresaId: empresa.id,
      categoriaId: categoria.id,
      nome: dados.nome.trim(),
      url: dados.url.trim(),
      tag: dados.tag.trim() || undefined,
      novaAba: dados.novaAba,
    };

    if (dados.id) atualizarRelatorio(dados.id, payload);
    else criarRelatorio(payload);

    setVista({ tela: "relatorios", categoria });
  }

  const titulo =
    vista.tela === "pastas"
      ? empresa.nome
      : vista.tela === "relatorios"
        ? vista.categoria.nome
        : vista.dados.id
          ? "Editar relatório"
          : "Novo relatório";

  const descricao =
    vista.tela === "pastas"
      ? "Pastas deste cliente. Clique no lápis para gerenciar os relatórios."
      : vista.tela === "relatorios"
        ? `Relatórios publicados nesta pasta de ${empresa.nome}.`
        : "O link informado é o que abre ao clicar em Acessar Relatório.";

  return (
    <Modal aberto titulo={titulo} descricao={descricao} onFechar={onFechar}>
      {/* ------------------------------ Pastas ------------------------------ */}
      {vista.tela === "pastas" && (
        <>
          <ul className="space-y-2">
            {categorias.length === 0 && (
              <li className="rounded-xl border border-dashed border-tinta-200 px-4 py-8 text-center text-[14px] text-tinta-400 dark:border-[#2f333c]">
                Nenhuma pasta neste cliente.
              </li>
            )}

            {categorias.map((categoria) => (
              <li
                key={categoria.id}
                className="flex items-center gap-2 rounded-xl bg-tinta-50 px-4 py-3 dark:bg-white/[0.03]"
              >
                <span className="min-w-0 flex-1 truncate text-[14px] font-medium text-tinta-700 dark:text-tinta-200">
                  {categoria.nome}
                  <span className="ml-2 text-[12px] font-normal text-tinta-400">
                    {relatoriosDaCategoria(categoria.id).length} relatórios
                  </span>
                </span>

                <span className="flex shrink-0 items-center gap-0.5">
                  <button
                    type="button"
                    aria-label={`Gerenciar relatórios de ${categoria.nome}`}
                    title="Gerenciar relatórios"
                    onClick={() => setVista({ tela: "relatorios", categoria })}
                    className="rounded-lg p-2 text-tinta-400 transition hover:bg-white hover:text-tinta-900 dark:hover:bg-white/5 dark:hover:text-white"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <Link
                    href={`/empresas/${empresa.id}/${categoria.id}`}
                    aria-label={`Abrir ${categoria.nome} no portal`}
                    title="Abrir no portal"
                    className="rounded-lg p-2 text-tinta-400 transition hover:bg-white hover:text-tinta-900 dark:hover:bg-white/5 dark:hover:text-white"
                  >
                    <FolderOpen className="h-4 w-4" />
                  </Link>
                  <BotaoExcluir
                    rotulo={`Excluir ${categoria.nome}`}
                    titulo={`Excluir a pasta ${categoria.nome}?`}
                    mensagem="Os relatórios publicados dentro dela também serão removidos. Esta ação não pode ser desfeita."
                    onConfirmar={() => removerCategoria(categoria.id)}
                  />
                </span>
              </li>
            ))}
          </ul>

          <form onSubmit={criarPasta} className="mt-5 flex gap-2">
            <input
              value={nomeNovaPasta}
              onChange={(e) => setNomeNovaPasta(e.target.value)}
              placeholder="Nova pasta (ex.: Diversos)"
              aria-label="Nome da nova pasta"
              className="campo"
            />
            <button
              type="submit"
              className="flex shrink-0 items-center gap-1.5 rounded-xl border border-tinta-200 px-3.5 text-[13px] font-semibold text-tinta-700 transition hover:bg-tinta-100 dark:border-[#2f333c] dark:text-tinta-200 dark:hover:bg-white/5"
            >
              <FolderPlus className="h-4 w-4" />
              Criar
            </button>
          </form>
        </>
      )}

      {/* --------------------- Relatórios de uma pasta ---------------------- */}
      {vista.tela === "relatorios" && (
        <>
          <ul className="space-y-2">
            {relatoriosDaCategoria(vista.categoria.id).length === 0 && (
              <li className="rounded-xl border border-dashed border-tinta-200 px-4 py-8 text-center text-[14px] text-tinta-400 dark:border-[#2f333c]">
                Nenhum relatório nesta pasta ainda.
              </li>
            )}

            {relatoriosDaCategoria(vista.categoria.id).map((r) => (
              <li
                key={r.id}
                className="flex items-center gap-3 rounded-xl bg-tinta-50 px-4 py-3 dark:bg-white/[0.03]"
              >
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 text-[14px] font-semibold text-tinta-800 dark:text-tinta-100">
                    <span className="truncate">{r.nome}</span>
                    {r.tag && (
                      <span className="shrink-0 rounded bg-tinta-200 px-1.5 py-0.5 text-[10px] font-bold text-tinta-600 dark:bg-white/10 dark:text-tinta-300">
                        {r.tag}
                      </span>
                    )}
                    {r.novaAba && <ExternalLink className="h-3.5 w-3.5 shrink-0 text-tinta-400" />}
                  </p>
                  <p className="mt-0.5 truncate text-[12px] text-tinta-400">{r.url}</p>
                </div>

                <span className="flex shrink-0 items-center gap-0.5">
                  <button
                    type="button"
                    aria-label={`Editar ${r.nome}`}
                    title="Editar"
                    onClick={() =>
                      setVista({
                        tela: "form",
                        categoria: vista.categoria,
                        dados: {
                          id: r.id,
                          nome: r.nome,
                          url: r.url,
                          tag: r.tag ?? "",
                          novaAba: r.novaAba ?? false,
                        },
                      })
                    }
                    className="rounded-lg p-2 text-tinta-400 transition hover:bg-white hover:text-tinta-900 dark:hover:bg-white/5 dark:hover:text-white"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <BotaoExcluir
                    rotulo={`Excluir ${r.nome}`}
                    titulo={`Excluir o relatório ${r.nome}?`}
                    mensagem="O link deixará de aparecer na pasta para os usuários. Esta ação não pode ser desfeita."
                    onConfirmar={() => removerRelatorio(r.id)}
                  />
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex gap-3">
            <BotaoVoltar onClick={() => setVista({ tela: "pastas" })} />
            <button
              type="button"
              onClick={() =>
                setVista({
                  tela: "form",
                  categoria: vista.categoria,
                  dados: { ...RELATORIO_VAZIO },
                })
              }
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-tinta-900 py-3.5 text-[14px] font-bold text-white transition hover:bg-tinta-800 dark:bg-white dark:text-tinta-900 dark:hover:bg-tinta-200"
            >
              <Plus className="h-4 w-4" strokeWidth={2.5} />
              Adicionar relatório
            </button>
          </div>
        </>
      )}

      {/* ------------------------ Formulário do link ------------------------ */}
      {vista.tela === "form" && (
        <form onSubmit={salvarRelatorio} className="space-y-4">
          <div>
            <label className="rotulo" htmlFor="rel-nome">
              Nome do relatório
            </label>
            <input
              id="rel-nome"
              className="campo"
              value={vista.dados.nome}
              onChange={(e) =>
                setVista({ ...vista, dados: { ...vista.dados, nome: e.target.value } })
              }
              placeholder="Orgchart"
              required
            />
          </div>

          <div>
            <label className="rotulo" htmlFor="rel-url">
              Link do relatório
            </label>
            <input
              id="rel-url"
              type="url"
              className="campo"
              value={vista.dados.url}
              onChange={(e) =>
                setVista({ ...vista, dados: { ...vista.dados, url: e.target.value } })
              }
              placeholder="https://app.powerbi.com/view?r=..."
              required
            />
          </div>

          <div>
            <label className="rotulo" htmlFor="rel-tag">
              Selo (opcional)
            </label>
            <input
              id="rel-tag"
              className="campo"
              value={vista.dados.tag}
              onChange={(e) =>
                setVista({ ...vista, dados: { ...vista.dados, tag: e.target.value } })
              }
              placeholder="API 54"
            />
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-tinta-200 p-3.5 transition hover:bg-tinta-50 dark:border-[#2f333c] dark:hover:bg-white/[0.03]">
            <input
              type="checkbox"
              checked={vista.dados.novaAba}
              onChange={(e) =>
                setVista({ ...vista, dados: { ...vista.dados, novaAba: e.target.checked } })
              }
              className="mt-0.5 h-4 w-4 shrink-0 accent-tinta-900 dark:accent-white"
            />
            <span>
              <span className="block text-[14px] font-semibold text-tinta-800 dark:text-tinta-100">
                Abrir em nova aba
              </span>
              <span className="mt-0.5 block text-[12px] leading-relaxed text-tinta-400">
                Marque quando o provedor bloquear a exibição dentro do portal (erro de conexão
                recusada ao acessar o relatório).
              </span>
            </span>
          </label>

          <div className="flex gap-3 pt-1">
            <BotaoVoltar
              onClick={() => setVista({ tela: "relatorios", categoria: vista.categoria })}
            />
            <button
              type="submit"
              className="flex-1 rounded-xl bg-tinta-900 py-3.5 text-[14px] font-bold text-white transition hover:bg-tinta-800 dark:bg-white dark:text-tinta-900 dark:hover:bg-tinta-200"
            >
              {vista.dados.id ? "Salvar alterações" : "Adicionar relatório"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}

/** Indicador de status — só informa. A troca é feita no formulário de edição. */
function FarolStatus({ ativo }: { ativo: boolean }) {
  return (
    <span
      title={ativo ? "Login ativo" : "Login inativo — edite para reativar"}
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-[13px] font-semibold ${
        ativo
          ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
          : "border-tinta-200 text-tinta-400 dark:border-[#2f333c]"
      }`}
    >
      <span className="relative flex h-2 w-2">
        {ativo && (
          <span className="anim-farol absolute inset-0 rounded-full bg-emerald-500" aria-hidden />
        )}
        <span
          className={`relative h-2 w-2 rounded-full ${
            ativo ? "bg-emerald-500" : "bg-tinta-300 dark:bg-tinta-600"
          }`}
        />
      </span>
      {ativo ? "Ativo" : "Inativo"}
    </span>
  );
}

function BotaoVoltar({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-center gap-2 rounded-xl border border-tinta-200 px-4 py-3.5 text-[14px] font-semibold text-tinta-700 transition hover:bg-tinta-100 dark:border-[#2f333c] dark:text-tinta-200 dark:hover:bg-white/5"
    >
      <ArrowLeft className="h-4 w-4" />
      Voltar
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Logins                                                                    */
/* -------------------------------------------------------------------------- */

const LOGIN_VAZIO = {
  nome: "",
  email: "",
  senha: "",
  role: "user" as Role,
  empresaIds: [] as string[],
  ativo: true,
};

function AbaLogins() {
  const { db, usuario, criarUsuario, removerUsuario, atualizarUsuario } = useStore();

  const [modal, setModal] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [form, setForm] = useState(LOGIN_VAZIO);
  const [erro, setErro] = useState<string | null>(null);

  const editandoSiMesmo = editandoId !== null && editandoId === usuario?.id;

  function abrirNovo() {
    setEditandoId(null);
    setForm(LOGIN_VAZIO);
    setErro(null);
    setModal(true);
  }

  function abrirEdicao(u: Usuario) {
    setEditandoId(u.id);
    setForm({
      nome: u.nome,
      email: u.email,
      senha: u.senha,
      role: u.role,
      empresaIds: [...u.empresaIds],
      ativo: u.ativo,
    });
    setErro(null);
    setModal(true);
  }

  function salvar(e: React.FormEvent) {
    e.preventDefault();

    if (editandoId) {
      const emailEmUso = db.usuarios.some(
        (u) =>
          u.id !== editandoId &&
          u.email.trim().toLowerCase() === form.email.trim().toLowerCase()
      );
      if (emailEmUso) {
        setErro("Já existe um login com este e-mail.");
        return;
      }
      atualizarUsuario(editandoId, {
        nome: form.nome.trim(),
        email: form.email.trim(),
        senha: form.senha,
        // não deixa o master rebaixar o próprio acesso e se trancar para fora
        role: editandoSiMesmo ? usuario!.role : form.role,
        empresaIds: form.empresaIds,
        // nem perfil nem status do próprio login podem ser mexidos: evita auto-bloqueio
        ativo: editandoSiMesmo ? true : form.ativo,
      });
    } else {
      const resultado = criarUsuario(form);
      if (!resultado.ok) {
        setErro(resultado.erro ?? "Não foi possível criar o login.");
        return;
      }
    }

    setErro(null);
    setEditandoId(null);
    setForm(LOGIN_VAZIO);
    setModal(false);
  }

  return (
    <>
      <BarraAcao
        titulo={`${db.usuarios.length} ${db.usuarios.length === 1 ? "login" : "logins"}`}
        botao="Novo login"
        onClick={abrirNovo}
      />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {db.usuarios.map((u) => (
          <section key={u.id} className="cartao p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="flex items-center gap-2 font-display text-[18px] font-bold text-tinta-800 dark:text-white">
                  <span className="truncate">{u.nome}</span>
                  <span
                    className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold tracking-wide whitespace-nowrap ${
                      u.role === "master"
                        ? "bg-tinta-900 text-white dark:bg-white dark:text-tinta-900"
                        : "bg-tinta-200 text-tinta-600 dark:bg-white/10 dark:text-tinta-300"
                    }`}
                  >
                    {ROTULOS_ROLE[u.role].toUpperCase()}
                  </span>
                </h3>
                <p className="mt-0.5 truncate text-[13px] text-tinta-400">{u.email}</p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  aria-label={`Editar ${u.nome}`}
                  title="Editar login"
                  onClick={() => abrirEdicao(u)}
                  className="rounded-lg border border-tinta-200 p-2 text-tinta-500 transition hover:bg-tinta-100 hover:text-tinta-900 dark:border-[#2f333c] dark:text-tinta-300 dark:hover:bg-white/5 dark:hover:text-white"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <FarolStatus ativo={u.ativo} />
                {u.id !== usuario?.id && (
                  <BotaoExcluir
                    rotulo={`Excluir ${u.nome}`}
                    titulo={`Excluir o login de ${u.nome}?`}
                    mensagem={`O acesso de ${u.email} será removido imediatamente. Esta ação não pode ser desfeita.`}
                    onConfirmar={() => removerUsuario(u.id)}
                  />
                )}
              </div>
            </div>

            <p className="mt-5 mb-2 text-[12px] font-bold tracking-[0.06em] text-tinta-400 uppercase">
              Empresas vinculadas
            </p>
            {u.role === "master" ? (
              <p className="text-[13px] text-tinta-400 italic">
                Usuário master enxerga todas as empresas cadastradas.
              </p>
            ) : (
              (() => {
                const vinculadas = db.empresas.filter((e) => u.empresaIds.includes(e.id));
                if (vinculadas.length === 0) {
                  return (
                    <p className="text-[13px] text-tinta-400 italic">
                      Nenhuma empresa vinculada.
                    </p>
                  );
                }
                return (
                  <div className="flex flex-wrap gap-2">
                    {vinculadas.map((empresa) => (
                      <span
                        key={empresa.id}
                        className="rounded-lg bg-tinta-900 px-3 py-1.5 text-[13px] font-medium text-white dark:bg-white dark:text-tinta-900"
                      >
                        {empresa.nome}
                      </span>
                    ))}
                  </div>
                );
              })()
            )}
          </section>
        ))}
      </div>

      <Modal
        aberto={modal}
        titulo={editandoId ? "Editar login" : "Novo login"}
        descricao={
          editandoId
            ? "As alterações valem no próximo acesso deste usuário."
            : "Escolha o perfil e as empresas que este login poderá acessar."
        }
        onFechar={() => setModal(false)}
      >
        <form onSubmit={salvar} className="space-y-4">
          <div>
            <label className="rotulo" htmlFor="usr-nome">
              Nome
            </label>
            <input
              id="usr-nome"
              className="campo"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="rotulo" htmlFor="usr-email">
              E-mail
            </label>
            <input
              id="usr-email"
              type="email"
              className="campo"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="rotulo" htmlFor="usr-senha">
              Senha
            </label>
            <input
              id="usr-senha"
              className="campo"
              value={form.senha}
              onChange={(e) => setForm({ ...form, senha: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="rotulo" htmlFor="usr-role">
              Perfil
            </label>
            <ListaSuspensa
              id="usr-role"
              opcoes={ROLES.map((role) => ({ valor: role, rotulo: ROTULOS_ROLE[role] }))}
              selecionados={[form.role]}
              onChange={([role]) => setForm({ ...form, role: (role as Role) ?? form.role })}
              desabilitado={editandoSiMesmo}
              buscavel={false}
              icone={ShieldCheck}
              rotuloAcessivel="Perfil do login"
            />
            {editandoSiMesmo ? (
              <p className="mt-1.5 text-[12px] text-tinta-400">
                Você não pode alterar o próprio perfil.
              </p>
            ) : (
              form.role !== "master" && (
                <p className="mt-1.5 text-[12px] text-tinta-400">
                  Cliente, Consultor Analista e Consultor Estrategista têm a mesma visão do
                  portal — enxergam apenas as empresas vinculadas abaixo.
                </p>
              )
            )}
          </div>

          {form.role !== "master" && (
            <div>
              <label className="rotulo" htmlFor="usr-empresas">
                Empresas vinculadas
              </label>
              <ListaSuspensa
                id="usr-empresas"
                multiplo
                opcoes={db.empresas.map((e) => ({ valor: e.id, rotulo: e.nome }))}
                selecionados={form.empresaIds}
                onChange={(empresaIds) => setForm({ ...form, empresaIds })}
                placeholder="Selecionar empresas"
                textoVazio="Nenhuma empresa cadastrada"
                rotuloAcessivel="Empresas vinculadas a este login"
              />
              <p className="mt-1.5 text-[12px] text-tinta-400">
                Marque quantas quiser. O login só enxerga estas empresas.
              </p>
            </div>
          )}

          {!editandoSiMesmo && (
            <button
              type="button"
              role="switch"
              aria-checked={form.ativo}
              onClick={() => setForm({ ...form, ativo: !form.ativo })}
              className="flex w-full items-center justify-between gap-4 rounded-xl border border-tinta-200 p-3.5 text-left transition hover:bg-tinta-50 dark:border-[#2f333c] dark:hover:bg-white/[0.03]"
            >
              <span>
                <span className="block text-[14px] font-semibold text-tinta-800 dark:text-tinta-100">
                  Login ativo
                </span>
                <span className="mt-0.5 block text-[12px] leading-relaxed text-tinta-400">
                  {form.ativo
                    ? "O usuário consegue entrar no portal."
                    : "Desativado, o usuário é bloqueado na tela de login."}
                </span>
              </span>

              <span
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
                  form.ativo ? "bg-emerald-500" : "bg-tinta-300 dark:bg-[#3a3f48]"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-200 ${
                    form.ativo ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </span>
            </button>
          )}

          {erro && <p className="text-[13px] text-perigo">{erro}</p>}
          <BotaoSalvar>{editandoId ? "Salvar alterações" : "Criar login"}</BotaoSalvar>
        </form>
      </Modal>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/*  Auxiliares                                                                */
/* -------------------------------------------------------------------------- */

function BarraAcao({
  titulo,
  botao,
  onClick,
  desabilitado,
}: {
  titulo: string;
  botao: string;
  onClick: () => void;
  desabilitado?: boolean;
}) {
  return (
    <div className="mb-5 flex items-center justify-between">
      <p className="text-[13px] font-bold tracking-[0.06em] text-tinta-400 uppercase">{titulo}</p>
      <button
        type="button"
        onClick={onClick}
        disabled={desabilitado}
        className="flex items-center gap-2 rounded-xl bg-tinta-900 px-4 py-2.5 text-[14px] font-bold text-white transition hover:bg-tinta-800 disabled:opacity-45 dark:bg-white dark:text-tinta-900 dark:hover:bg-tinta-200"
      >
        <Plus className="h-4 w-4" strokeWidth={2.5} />
        {botao}
      </button>
    </div>
  );
}

function BotaoSalvar({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="submit"
      className="mt-2 w-full rounded-xl bg-tinta-900 py-3.5 text-[14px] font-bold text-white transition hover:bg-tinta-800 dark:bg-white dark:text-tinta-900 dark:hover:bg-tinta-200"
    >
      {children}
    </button>
  );
}

function BotaoExcluir({
  rotulo,
  titulo,
  mensagem,
  onConfirmar,
}: {
  rotulo: string;
  titulo: string;
  mensagem: string;
  onConfirmar: () => void;
}) {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={rotulo}
        title={rotulo}
        onClick={() => setAberto(true)}
        className="rounded-lg border border-transparent p-2 text-tinta-400 transition hover:bg-perigo/10 hover:text-perigo"
      >
        <Trash2 className="h-4 w-4" />
      </button>

      <DialogoExclusao
        aberto={aberto}
        titulo={titulo}
        mensagem={mensagem}
        onCancelar={() => setAberto(false)}
        onConfirmar={onConfirmar}
      />
    </>
  );
}
