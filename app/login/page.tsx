"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { LogoBranco } from "@/components/Logo";
import { useStore } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const { entrar, usuario, pronto } = useStore();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [verSenha, setVerSenha] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  // já autenticado? vai direto para o portal
  useEffect(() => {
    if (pronto && usuario) router.replace("/");
  }, [pronto, usuario, router]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);

    const resultado = entrar(email, senha);
    if (!resultado.ok) {
      setErro(resultado.erro ?? "Não foi possível entrar.");
      setEnviando(false);
      return;
    }

    setErro(null);
    router.replace("/");
  }

  return (
    <main className="flex min-h-screen bg-noite">
      {/* Coluna do formulário */}
      <section className="flex w-full items-center justify-center px-6 py-12 lg:w-[46%] lg:px-10">
        <div className="w-full max-w-[420px] rounded-[22px] bg-[#232323] p-8 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)] sm:p-10">
          <div className="mb-9 flex justify-center">
            <LogoBranco width={170} height={62} />
          </div>

          <form onSubmit={onSubmit} noValidate>
            <label htmlFor="email" className="mb-1.5 block text-[13px] font-medium text-white/85">
              Seu E-mail
            </label>
            <div className="relative mb-5">
              <Mail
                className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-tinta-500"
                strokeWidth={2}
              />
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@empresa.com.br"
                className="h-[52px] w-full rounded-xl border border-transparent bg-[#eef2f9] pl-12 pr-4 text-[15px] text-tinta-900 placeholder:text-tinta-400 focus:border-white/40 focus:outline-none"
                required
              />
            </div>

            <label htmlFor="senha" className="mb-1.5 block text-[13px] font-medium text-white/85">
              Sua Senha
            </label>
            <div className="relative mb-6">
              <Lock
                className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-tinta-500"
                strokeWidth={2}
              />
              <input
                id="senha"
                type={verSenha ? "text" : "password"}
                autoComplete="current-password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••••"
                className="h-[52px] w-full rounded-xl border border-transparent bg-[#eef2f9] pl-12 pr-12 text-[15px] text-tinta-900 placeholder:text-tinta-400 focus:border-white/40 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setVerSenha((v) => !v)}
                aria-label={verSenha ? "Ocultar senha" : "Mostrar senha"}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-tinta-500 transition hover:text-tinta-800"
              >
                {verSenha ? (
                  <EyeOff className="h-[18px] w-[18px]" />
                ) : (
                  <Eye className="h-[18px] w-[18px]" />
                )}
              </button>
            </div>

            {erro && (
              <p className="mb-4 rounded-lg bg-perigo/10 px-3 py-2 text-[13px] text-red-400">
                {erro}
              </p>
            )}

            <button
              type="submit"
              disabled={enviando}
              className="h-[54px] w-full rounded-xl bg-white text-[15px] font-bold text-tinta-900 transition hover:bg-tinta-100 disabled:opacity-60"
            >
              {enviando ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="mt-8 text-center text-[13px] text-white/45">
            Desenvolvido por <span className="font-semibold text-white/70">Dextro Consultoria</span>
          </p>
        </div>
      </section>

      {/* Coluna da imagem — a foto já vem com o escurecimento aplicado. */}
      <section
        aria-hidden
        className="relative hidden flex-1 bg-noite bg-cover bg-center lg:block"
        style={{ backgroundImage: "url('/login-bg.png')" }}
      />
    </main>
  );
}
