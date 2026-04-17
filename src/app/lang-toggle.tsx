"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

type Lang = "mr" | "en" | "hi";
const LANGS: Lang[] = ["mr", "en", "hi"];

const LABEL: Record<Lang, { short: string; long: string }> = {
  mr: { short: "मरा", long: "मराठी" },
  en: { short: "EN", long: "English" },
  hi: { short: "हिं", long: "हिन्दी" },
};

function currentLangFromPath(pathname: string): Lang {
  const seg = pathname.split("/")[1];
  if (seg === "en") return "en";
  if (seg === "hi") return "hi";
  return "mr";
}

function pathFor(pathname: string, target: Lang): string {
  const firstSeg = pathname.split("/")[1];
  const rest = (LANGS as string[]).includes(firstSeg) ? pathname.slice(firstSeg.length + 1) : pathname;
  return "/" + target + rest;
}

export function LangToggle() {
  const pathname = usePathname() || "/mr";
  const lang = currentLangFromPath(pathname);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#d4a843]/30 bg-white/10 hover:bg-white/20 text-sm font-medium transition-all text-white/80"
        title="Switch language"
      >
        <span className="text-xs font-semibold">{LABEL[lang].short}</span>
        <span className="w-px h-3 bg-white/30" />
        <span className="text-[10px] text-white/50">{LABEL[lang].long}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" className="ml-0.5 opacity-60">
          <path d="M2 4l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 min-w-[140px] rounded-lg border border-[#d4a843]/30 bg-[#1a0505] shadow-lg overflow-hidden z-50">
          {LANGS.map((L) => (
            <Link
              key={L}
              href={pathFor(pathname, L)}
              prefetch={false}
              onClick={() => setOpen(false)}
              className={`block px-3 py-2 text-sm transition ${
                L === lang
                  ? "bg-[#d4a843]/20 text-[#d4a843]"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="font-semibold mr-2">{LABEL[L].short}</span>
              <span className="text-xs opacity-70">{LABEL[L].long}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
