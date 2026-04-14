"use client";

import Link from "next/link";
import { useLang } from "@/lib/astrology/language-context";
import { LangToggle } from "./lang-toggle";

const navLinks = [
  { href: "/", labelMr: "मुख्यपृष्ठ", labelEn: "Home" },
  { href: "/kundli", labelMr: "कुंडली", labelEn: "Kundli" },
  { href: "/matching", labelMr: "गुण मिलान", labelEn: "Matching" },
  { href: "/panchang", labelMr: "पंचांग", labelEn: "Panchang" },
  { href: "/rashifal", labelMr: "राशीफल", labelEn: "Rashifal" },
  { href: "/calendar", labelMr: "दिनदर्शिका", labelEn: "Calendar" },
  { href: "/consultation", labelMr: "सल्ला सेवा", labelEn: "Consult" },
  { href: "/muhurat", labelMr: "मुहूर्त", labelEn: "Muhurat" },
  { href: "/graha-sthiti", labelMr: "ग्रह स्थिती", labelEn: "Planets Now" },
  { href: "/contact", labelMr: "संपर्क", labelEn: "Contact" },
];

export function NavBar() {
  const { t } = useLang();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md border-b border-[#d4a843]/20 shadow-sm" style={{ background: "rgba(61,12,12,0.95)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div>
              <h1 className="text-base font-bold tracking-wide" style={{ color: "#d4a843" }}>
                {t("वेंकटेश ज्योतिष", "Venkatesh Astrology")}
              </h1>
              <p className="text-[10px] tracking-wider text-white/40">
                {t("Venkatesh Vedic Astrology", "वैदिक ज्योतिष सेवा")}
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <nav className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-white/70 hover:text-[#d4a843] hover:bg-white/10 transition-all"
                >
                  {t(link.labelMr, link.labelEn)}
                </Link>
              ))}
            </nav>
            <div className="ml-1">
              <LangToggle />
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Nav */}
      <nav className="md:hidden flex overflow-x-auto border-t border-white/10 px-3 py-2 gap-1 scrollbar-hide">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium text-white/60 hover:text-[#d4a843] hover:bg-white/10 transition-all whitespace-nowrap"
          >
            {t(link.labelMr, link.labelEn)}
          </Link>
        ))}
      </nav>
    </header>
  );
}
