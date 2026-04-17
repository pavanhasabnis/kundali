"use client";

import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";

export type Lang = "mr" | "en";

interface LangContextType {
  lang: Lang;
  t: (mr: string, en: string) => string;
}

const LangContext = createContext<LangContextType>({
  lang: "mr",
  t: (mr) => mr,
});

export function LangProvider({ children, lang }: { children: ReactNode; lang: Lang }) {
  const t = useCallback((mr: string, en: string) => (lang === "mr" ? mr : en), [lang]);
  const value = useMemo(() => ({ lang, t }), [lang, t]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
