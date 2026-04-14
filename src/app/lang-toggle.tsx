"use client";

import { useLang } from "@/lib/astrology/language-context";

export function LangToggle() {
  const { lang, setLang } = useLang();

  return (
    <button
      onClick={() => setLang(lang === "mr" ? "en" : "mr")}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#d4a843]/30 bg-white/10 hover:bg-white/20 text-sm font-medium transition-all text-white/80"
      title={lang === "mr" ? "Switch to English" : "मराठीत बदला"}
    >
      <span className="text-xs font-semibold">{lang === "mr" ? "EN" : "मरा"}</span>
      <span className="w-px h-3 bg-white/30" />
      <span className="text-[10px] text-white/50">{lang === "mr" ? "English" : "मराठी"}</span>
    </button>
  );
}
