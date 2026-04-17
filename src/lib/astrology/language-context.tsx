"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

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
  const t = useCallback((mr: string, en: string) => (lang === "mr" ? mr : en), [lang]);
  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return (
    <LangContext.Provider value={value}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
