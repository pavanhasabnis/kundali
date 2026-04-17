"use client";

import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";

export type Lang = "mr" | "en" | "hi";

interface LangContextType {
  lang: Lang;
  t: (mr: string, en: string, hi?: string) => string;
}

const LangContext = createContext<LangContextType>({
  lang: "mr",
  t: (mr) => mr,
});

function langFromPath(pathname: string | null): Lang | null {
  if (!pathname) return null;
  const seg = pathname.split("/")[1];
  if (seg === "en") return "en";
  if (seg === "mr") return "mr";
  if (seg === "hi") return "hi";
  return null;
}

export function LangProvider({ children, lang: initial }: { children: ReactNode; lang: Lang }) {
  const pathname = usePathname();
  const fromPath = langFromPath(pathname);
  const lang: Lang = fromPath ?? initial;
  const t = useCallback(
    (mr: string, en: string, hi?: string) => {
      if (lang === "mr") return mr;
      if (lang === "en") return en;
      return hi ?? mr;
    },
    [lang]
  );
  const value = useMemo(() => ({ lang, t }), [lang, t]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
