"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

export type Lang = "mr" | "en";

interface LangContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (mr: string, en: string) => string;
}

const LangContext = createContext<LangContextType>({
  lang: "mr",
  setLang: () => {},
  t: (mr) => mr,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("mr");
  const t = (mr: string, en: string) => (lang === "mr" ? mr : en);

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
