import { Inbox } from "lucide-react";

export function EstadoVazio({
  titulo,
  descricao,
  acao,
}: {
  titulo: string;
  descricao: string;
  acao?: React.ReactNode;
}) {
  return (
    <div className="cartao flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-tinta-100 dark:bg-white/5">
        <Inbox className="h-6 w-6 text-tinta-400" />
      </span>
      <h3 className="font-display text-[18px] font-bold text-tinta-800 dark:text-white">{titulo}</h3>
      <p className="mt-1.5 max-w-md text-[14px] text-tinta-400">{descricao}</p>
      {acao && <div className="mt-5">{acao}</div>}
    </div>
  );
}
