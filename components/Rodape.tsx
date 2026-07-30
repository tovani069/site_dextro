export function Rodape({ className = "" }: { className?: string }) {
  return (
    <p className={`text-center text-[13px] text-tinta-400 ${className}`}>
      Desenvolvido por{" "}
      <span className="font-semibold text-tinta-500 dark:text-tinta-300">
        Dextro Consultoria
      </span>
    </p>
  );
}
