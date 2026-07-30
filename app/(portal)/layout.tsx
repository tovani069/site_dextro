"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Cabecalho } from "@/components/Cabecalho";
import { Rodape } from "@/components/Rodape";
import { useStore } from "@/lib/store";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { pronto, usuario } = useStore();

  useEffect(() => {
    if (pronto && !usuario) router.replace("/login");
  }, [pronto, usuario, router]);

  if (!pronto || !usuario) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-tinta-300 border-t-tinta-900 dark:border-t-white" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Cabecalho />
      <main className="mx-auto w-full max-w-[1640px] flex-1 px-6 py-10 lg:px-10">{children}</main>
      <Rodape className="pb-8" />
    </div>
  );
}
