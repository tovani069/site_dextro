"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Tema = "light" | "dark";

const TEMA_KEY = "dextro.tema";

const TemaContext = createContext<{ tema: Tema; alternarTema: () => void }>({
  tema: "light",
  alternarTema: () => {},
});

export function TemaProvider({ children }: { children: React.ReactNode }) {
  const [tema, setTema] = useState<Tema>("light");

  useEffect(() => {
    const salvo = window.localStorage.getItem(TEMA_KEY) as Tema | null;
    const inicial: Tema =
      salvo ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTema(inicial);
    document.documentElement.classList.toggle("dark", inicial === "dark");
  }, []);

  const alternarTema = useCallback(() => {
    setTema((atual) => {
      const proximo: Tema = atual === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", proximo === "dark");
      window.localStorage.setItem(TEMA_KEY, proximo);
      return proximo;
    });
  }, []);

  return (
    <TemaContext.Provider value={{ tema, alternarTema }}>{children}</TemaContext.Provider>
  );
}

export const useTema = () => useContext(TemaContext);

/** Aplica o tema salvo antes da primeira pintura, evitando "flash" de tela clara. */
export const scriptAntiFlash = `
(function(){try{
var t=localStorage.getItem('dextro.tema');
if(!t)t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
if(t==='dark')document.documentElement.classList.add('dark');
}catch(e){}})();
`;
