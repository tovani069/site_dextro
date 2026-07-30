import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";

export function CartaoEmpresa({
  nome,
  quantidade,
  href,
}: {
  nome: string;
  quantidade: number;
  href: string;
}) {
  return (
    <article className="cartao group flex flex-col p-6 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(15,23,42,0.35)]">
      <div className="mb-7 flex items-start justify-between">
        <span className="flex h-[52px] w-[52px] items-center justify-center rounded-2xl bg-tinta-100 dark:bg-white/5">
          <Building2 className="h-[22px] w-[22px] text-tinta-900 dark:text-white" strokeWidth={2} />
        </span>
        <span className="rounded-full bg-tinta-100 px-2.5 py-1 text-[10px] font-bold tracking-[0.08em] text-tinta-400 uppercase dark:bg-white/5">
          {quantidade} {quantidade === 1 ? "pasta" : "pastas"}
        </span>
      </div>

      <h3 className="font-display text-[21px] leading-tight font-bold text-tinta-800 dark:text-white">
        {nome}
      </h3>
      <p className="mt-2 text-[14px] text-tinta-400 italic">
        Acesse os relatórios desta empresa.
      </p>

      <Link
        href={href}
        className="mt-7 flex items-center justify-center gap-2 rounded-xl border border-tinta-200 bg-tinta-50 py-3.5 text-[14px] font-semibold text-tinta-800 transition group-hover:border-tinta-300 hover:bg-tinta-100 dark:border-[#2f333c] dark:bg-white/[0.03] dark:text-tinta-100 dark:hover:bg-white/[0.07]"
      >
        Acessar Empresa
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </Link>
    </article>
  );
}
