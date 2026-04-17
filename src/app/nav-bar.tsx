"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/astrology/language-context";
import { LangToggle } from "./lang-toggle";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/", labelMr: "मुख्यपृष्ठ", labelEn: "Home" },
  { href: "/kundli", labelMr: "कुंडली", labelEn: "Kundli" },
  { href: "/matching", labelMr: "गुण मिलान", labelEn: "Matching" },
  { href: "/panchang", labelMr: "पंचांग", labelEn: "Panchang" },
  { href: "/rashifal", labelMr: "राशीफल", labelEn: "Rashifal" },
  { href: "/calendar", labelMr: "दिनदर्शिका", labelEn: "Calendar" },
  { href: "/pooja-services", labelMr: "पूजा सेवा", labelEn: "Pooja Services" },
  { href: "/temples", labelMr: "मंदिरे", labelEn: "Temples" },
  { href: "/yatra", labelMr: "यात्रा सेवा", labelEn: "Yatra" },
  { href: "/consultation", labelMr: "सल्ला सेवा", labelEn: "Consult" },
  { href: "/muhurat", labelMr: "मुहूर्त", labelEn: "Muhurat" },
  { href: "/graha-sthiti", labelMr: "ग्रह स्थिती", labelEn: "Planets Now" },
  { href: "/sangrah", labelMr: "संग्रह", labelEn: "Sangrah" },
  { href: "/blog", labelMr: "दैनिक लेख", labelEn: "Daily Blog" },
  { href: "/about", labelMr: "आमच्याबद्दल", labelEn: "About" },
  { href: "/contact", labelMr: "संपर्क", labelEn: "Contact" },
];

interface UserSession {
  name?: string;
  email?: string;
  image?: string;
}

export function NavBar() {
  const { t, lang } = useLang();
  const pathname = usePathname();
  const [user, setUser] = useState<UserSession | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const langPrefix = `/${lang}`;
  const withLang = (href: string) => (href === "/" ? langPrefix : `${langPrefix}${href}`);

  useEffect(() => {
    // Check NextAuth session
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        if (data?.user?.email) { setUser(data.user); return; }
        // Fall back to dev cookie
        const match = document.cookie.match(/dev-session=([^;]+)/);
        if (match) {
          try {
            const dev = JSON.parse(decodeURIComponent(match[1]));
            if (dev?.email) setUser(dev);
          } catch { /* ignore */ }
        }
      })
      .catch(() => {});
  }, []);

  // Hide navbar on admin/account pages — they have their own sidebar
  if (pathname.startsWith("/admin") || pathname.startsWith("/account")) return null;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md border-b border-[#d4a843]/20 shadow-sm" style={{ background: "rgba(61,12,12,0.95)" }}>
      {/* Top row: Logo left, lang toggle + auth right */}
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 py-1.5">
        <div className="flex items-center justify-between">
          <Link href={langPrefix} className="flex items-center shrink-0">
            <img src={lang === "mr" ? "/logos/navbar-dark-mr.svg" : "/logos/navbar-dark.svg"} alt="Bhaagyavedh" className="h-10 w-auto" />
          </Link>

          {/* Desktop: nav links in one line */}
          <nav className="hidden lg:flex items-center gap-0 flex-1 justify-end mx-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={withLang(link.href)}
                className="px-1.5 xl:px-2 py-1 text-[11px] xl:text-[12px] font-medium text-white/70 hover:text-[#d4a843] transition-colors whitespace-nowrap"
              >
                {t(link.labelMr, link.labelEn)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 shrink-0">
            <div>
              <LangToggle />
            </div>
            <div className="relative">
              {user ? (
                <>
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex items-center gap-2 px-1.5 py-1 rounded-lg hover:bg-white/10 transition"
                  >
                    {user.image ? (
                      <img src={user.image} alt="" className="w-7 h-7 rounded-full border border-[#d4a843]/40" />
                    ) : (
                      <span className="w-7 h-7 rounded-full bg-[#d4a843]/20 flex items-center justify-center text-[#d4a843] text-xs font-bold">
                        {(user.name || "U")[0].toUpperCase()}
                      </span>
                    )}
                  </button>
                  {showMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#d4a843]/20 py-2 z-50">
                      <p className="px-4 py-1 text-xs text-[#5c1a1a]/60 truncate">{user.email}</p>
                      <hr className="my-1 border-[#d4a843]/10" />
                      <Link href={withLang("/account")} className="block px-4 py-2 text-sm text-[#3d0c0c] hover:bg-[#FFF8E7] transition" onClick={() => setShowMenu(false)}>
                        {t("माझे खाते", "My Account")}
                      </Link>
                      <button
                        onClick={() => {
                          document.cookie = "dev-session=; path=/; max-age=0";
                          window.location.href = "/api/auth/signout?callbackUrl=/";
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                      >
                        {t("लॉग आउट", "Sign Out")}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={withLang("/login")}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#d4a843] text-[#3d0c0c] hover:bg-[#e5bc5a] transition"
                >
                  {t("लॉग इन", "Login")}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Mobile / Tablet Nav — scrollable row */}
      <nav className="lg:hidden flex overflow-x-auto border-t border-white/10 px-3 py-1.5 gap-0.5 scrollbar-hide">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={withLang(link.href)}
            className="flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium text-white/60 hover:text-[#d4a843] hover:bg-white/10 transition-all whitespace-nowrap"
          >
            {t(link.labelMr, link.labelEn)}
          </Link>
        ))}
      </nav>
    </header>
  );
}
