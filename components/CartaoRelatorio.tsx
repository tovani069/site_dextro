import Link from "next/link";
import { ArrowRight, BarChart3, Check, ExternalLink } from "lucide-react";

export function CartaoRelatorio({
  nome,
  empresaNome,
  tag,
  href,
  url,
  novaAba = false,
}: {
  nome: string;
  empresaNome: string;
  tag?: string;
  /** Página do relatório dentro do portal. */
  href: string;
  /** Link cadastrado — usado direto quando o provedor bloqueia a exibição incorporada. */
  url: string;
  novaAba?: boolean;
}) {
  const classeBotao =
    "mt-auto flex items-center justify-center gap-2 rounded-xl bg-tinta-900 py-3.5 text-[14px] font-bold text-white transition hover:bg-tinta-800 dark:bg-white dark:text-tinta-900 dark:hover:bg-tinta-200";

  return (
    <article className="cartao group flex flex-col overflow-hidden transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(15,23,42,0.35)]">
      {/* Capa */}
      <div className="relative flex h-[190px] items-center justify-center bg-linear-to-br from-tinta-100 to-tinta-50 dark:from-white/[0.06] dark:to-transparent">
        {tag && (
          <span className="absolute top-4 left-4 rounded-md bg-white px-2 py-1 text-[10px] font-bold tracking-[0.06em] text-tinta-700 uppercase shadow-sm dark:bg-carvao dark:text-tinta-200">
            {tag}
          </span>
        )}

        <span className="flex h-[84px] w-[84px] items-center justify-center rounded-2xl bg-white shadow-[0_10px_24px_-14px_rgba(15,23,42,0.5)] dark:bg-carvao">
          <BarChart3 className="h-9 w-9 text-tinta-800 dark:text-white" strokeWidth={2.5} />
        </span>

        <span className="absolute right-4 bottom-4 flex h-6 w-6 items-center justify-center rounded-full bg-tinta-900 dark:bg-white">
          <Check className="h-3.5 w-3.5 text-white dark:text-tinta-900" strokeWidth={3} />
        </span>
      </div>

      {/* Conteúdo */}
      <div className="flex flex-1 flex-col p-6">
        <span className="flex items-center gap-1.5 text-[11px] font-bold tracking-[0.06em] text-tinta-500 uppercase dark:text-tinta-400">
          <span className="h-1.5 w-1.5 rounded-full bg-tinta-900 dark:bg-white" />
          {empresaNome}
        </span>

        <h3 className="mt-2.5 font-display text-[19px] leading-snug font-bold text-tinta-800 dark:text-white">
          {nome}
        </h3>

        <hr className="mt-5 mb-5 border-tinta-200 dark:border-[#2f333c]" />

        {novaAba ? (
          <a href={url} target="_blank" rel="noopener noreferrer" className={classeBotao}>
            Acessar Relatório
            <ExternalLink className="h-4 w-4" />
          </a>
        ) : (
          <Link href={href} className={classeBotao}>
            Acessar Relatório
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
    </article>
  );
}
