# Dextro — Portal de Relatórios

Frontend em **Next.js 15 (App Router) + Tailwind CSS v4 + TypeScript**.

## Rodar

```bash
npm install
npm run dev     # http://localhost:3000
```

## Logins de teste

| Perfil  | E-mail                   | Senha        |
| ------- | ------------------------ | ------------ |
| Master  | `tovani@dextro.com.br`   | `dextro123`  |
| Cliente | `cliente@dextro.com.br`  | `cliente123` |

A base inicial não traz empresas nem relatórios — tudo é cadastrado pela
Administração. Perfis disponíveis: **Master**, **Cliente**, **Consultor Analista** e
**Consultor Estrategista**; os três últimos compartilham a mesma visão do portal.

## Navegação

A tela inicial é a mesma para todos os perfis: lista suspensa **Pesquisar** + botão
**Alternar** no topo, e o grid de **Empresas** abaixo. O master vê todas as empresas; os
demais perfis, apenas as vinculadas ao login.

Ao clicar em uma empresa, abre a tela de **Categorias**; em **Ver Relatórios**, a pasta com
os cards; em **Acessar Relatório**, a página com o link cadastrado (iframe + botões de
atualizar, tela cheia e abrir em nova aba). Relatórios marcados como *Abrir em nova aba*
pulam essa página e abrem o link direto.

Só o master vê a **engrenagem** no cabeçalho, que leva à Administração: cadastrar empresas,
gerenciar pastas e links de cada uma, criar logins e vincular acessos.

Rotas:

```
/login
/                                                  home (master ou cliente)
/empresas/[empresaId]                              categorias da empresa
/empresas/[empresaId]/[categoriaId]                relatórios da pasta
/empresas/[empresaId]/[categoriaId]/[relatorioId]  visualização do relatório
/admin                                             administração (somente master)
```

## Pastas padrão

Todo cliente novo nasce com **DRE e Balanço**, **Painel de Indicadores**, **Plano de Ação** e
**Organograma** (marcadas como `padrao` e não removíveis). Pastas extras podem ser criadas em
Administração → Empresas.

A lista fica em `CATEGORIAS_PADRAO` (`lib/types.ts`). Ao incluir uma nova pasta padrão ali,
`garantirCategoriasPadrao` (`lib/seed.ts`) completa automaticamente as empresas já cadastradas
na próxima carga da página.

## Dados

Não há backend. Tudo vive em `lib/`:

- `lib/types.ts` — modelos (`Empresa`, `Categoria`, `Relatorio`, `Usuario`).
- `lib/seed.ts` — dados iniciais.
- `lib/store.tsx` — contexto React + persistência em `localStorage`.

Para plugar uma API depois, basta trocar as funções do `store.tsx` por chamadas HTTP —
a assinatura consumida pelas telas continua a mesma. Para resetar a base, limpe as chaves
`dextro.*` do `localStorage`.

## Assets

- `public/logo_dextro_light.png` — logo de traço preto (fundo claro).
- `public/logo_dextro_dark.png` — logo de traço branco (fundo escuro / card do login).
- `public/login-bg.png` — foto do lado direito da tela de login (já vem com o escurecimento
  aplicado na própria imagem).
- `design/` — screenshots de referência do layout.
