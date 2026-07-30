import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";

export function SemAcesso({ titulo, descricao }: { titulo: string; descricao: string }) {
  return (
    <div className="cartao mx-auto flex max-w-lg flex-col items-center px-6 py-16 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-perigo/10">
        <ShieldAlert className="h-6 w-6 text-perigo" />
      </span>
      <h2 className="font-display text-[20px] font-bold text-tinta-800 dark:text-white">{titulo}</h2>
      <p className="mt-1.5 text-[14px] text-tinta-400">{descricao}</p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-tinta-900 px-5 py-3 text-[14px] font-bold text-white dark:bg-white dark:text-tinta-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar ao início
      </Link>
    </div>
  );
}
