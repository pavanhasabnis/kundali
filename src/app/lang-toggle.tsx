"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LANGS = ["mr", "en"] as const;

function currentLangFromPath(pathname: string): "mr" | "en" {
  const seg = pathname.split("/")[1];
  return seg === "en" ? "en" : "mr";
}

export function LangToggle() {
  const pathname = usePathname() || "/mr";
  const lang = currentLangFromPath(pathname);
  const otherLang = lang === "mr" ? "en" : "mr";

  // Replace first segment if it's a lang, else prefix.
  const firstSeg = pathname.split("/")[1];
  const target = LANGS.includes(firstSeg as "mr" | "en")
    ? "/" + otherLang + pathname.slice(firstSeg.length + 1)
    : "/" + otherLang + pathname;

  return (
    <Link
      href={target || `/${otherLang}`}
      prefetch={false}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#d4a843]/30 bg-white/10 hover:bg-white/20 text-sm font-medium transition-all text-white/80"
      title={lang === "mr" ? "Switch to English" : "मराठीत बदला"}
    >
      <span className="text-xs font-semibold">{lang === "mr" ? "EN" : "मरा"}</span>
      <span className="w-px h-3 bg-white/30" />
      <span className="text-[10px] text-white/50">{lang === "mr" ? "English" : "मराठी"}</span>
    </Link>
  );
}
