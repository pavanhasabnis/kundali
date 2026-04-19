"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/astrology/language-context";
import { LangToggle } from "./lang-toggle";
import { useEffect, useRef, useState } from "react";

// ─── Structured nav: 12 top-level items, 3 dropdowns grouping 8 sub-pages ─
type NavItem = {
  href: string;
  labelMr: string;
  labelEn: string;
  labelHi: string;
};
type NavNode =
  | { kind: "link"; item: NavItem }
  | { kind: "group"; key: string; labelMr: string; labelEn: string; labelHi: string; items: NavItem[] };

const navStructure: NavNode[] = [
  { kind: "link", item: { href: "/", labelMr: "मुख्यपृष्ठ", labelEn: "Home", labelHi: "मुख्य पृष्ठ" } },
  {
    kind: "group", key: "kundali", labelMr: "कुंडली", labelEn: "Kundli", labelHi: "कुंडली",
    items: [
      { href: "/kundli", labelMr: "कुंडली", labelEn: "Kundli", labelHi: "कुंडली" },
      { href: "/prashna", labelMr: "प्रश्न कुंडली", labelEn: "Prashna", labelHi: "प्रश्न कुंडली" },
      { href: "/matching", labelMr: "गुण मिलान", labelEn: "Matching", labelHi: "गुण मिलान" },
    ],
  },
  {
    kind: "group", key: "rashifal", labelMr: "राशीफल", labelEn: "Rashifal", labelHi: "राशिफल",
    items: [
      { href: "/rashifal", labelMr: "दैनिक राशीफल", labelEn: "Daily Rashifal", labelHi: "दैनिक राशिफल" },
      { href: "/rashifal/saptahik", labelMr: "साप्ताहिक राशिभविष्य", labelEn: "Weekly Rashifal", labelHi: "साप्ताहिक राशिफल" },
    ],
  },
  {
    kind: "group", key: "panchang", labelMr: "पंचांग", labelEn: "Panchang", labelHi: "पंचांग",
    items: [
      { href: "/panchang", labelMr: "पंचांग", labelEn: "Panchang", labelHi: "पंचांग" },
      { href: "/muhurat", labelMr: "मुहूर्त", labelEn: "Muhurat", labelHi: "मुहूर्त" },
      { href: "/graha-sthiti", labelMr: "ग्रह स्थिती", labelEn: "Planets Now", labelHi: "ग्रह स्थिति" },
    ],
  },
  { kind: "link", item: { href: "/calendar", labelMr: "दिनदर्शिका", labelEn: "Calendar", labelHi: "कैलेंडर" } },
  { kind: "link", item: { href: "/shop", labelMr: "दुकान", labelEn: "Shop", labelHi: "शॉप" } },
  { kind: "link", item: { href: "/pricing", labelMr: "योजना", labelEn: "Plans", labelHi: "योजनाएं" } },
  {
    kind: "group", key: "seva", labelMr: "सेवा", labelEn: "Services", labelHi: "सेवा",
    items: [
      { href: "/pooja-services", labelMr: "पूजा सेवा", labelEn: "Pooja Services", labelHi: "पूजा सेवा" },
      { href: "/consultation", labelMr: "सल्ला सेवा", labelEn: "Consult", labelHi: "परामर्श" },
    ],
  },
  { kind: "link", item: { href: "/temples", labelMr: "मंदिरे", labelEn: "Temples", labelHi: "मंदिर" } },
  { kind: "link", item: { href: "/yatra", labelMr: "यात्रा सेवा", labelEn: "Yatra", labelHi: "यात्रा" } },
  { kind: "link", item: { href: "/sangrah", labelMr: "संग्रह", labelEn: "Sangrah", labelHi: "संग्रह" } },
  { kind: "link", item: { href: "/blog", labelMr: "दैनिक लेख", labelEn: "Daily Blog", labelHi: "दैनिक लेख" } },
  { kind: "link", item: { href: "/about", labelMr: "आमच्याबद्दल", labelEn: "About", labelHi: "हमारे बारे में" } },
  { kind: "link", item: { href: "/contact", labelMr: "संपर्क", labelEn: "Contact", labelHi: "सम्पर्क" } },
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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const langPrefix = `/${lang}`;
  const withLang = (href: string) => (href === "/" ? langPrefix : `${langPrefix}${href}`);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        if (data?.user?.email) { setUser(data.user); return; }
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

  // Close open dropdown when clicking outside or changing route.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);
  useEffect(() => { setOpenDropdown(null); }, [pathname]);

  // Hide navbar on admin/account pages — they have their own sidebar
  if (/^\/(?:mr|en|hi)\/(?:admin|account)(?:\/|$)/.test(pathname) || pathname.startsWith("/admin") || pathname.startsWith("/account")) return null;

  const labelOf = (x: { labelMr: string; labelEn: string; labelHi: string }) => t(x.labelMr, x.labelEn, x.labelHi);
  const isSubActive = (items: NavItem[]) => items.some((it) => pathname === withLang(it.href) || (it.href !== "/" && pathname.startsWith(withLang(it.href))));

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md border-b border-[#d4a843]/20 shadow-sm font-heading" style={{ background: "rgba(61,12,12,0.95)" }}>
      <div className="max-w-[1400px] mx-auto px-3 sm:px-4 py-1.5">
        <div className="flex items-center justify-between gap-2">
          <Link href={langPrefix} className="flex items-center shrink-0">
            <img src={lang === "en" ? "/logos/navbar-dark.svg" : "/logos/navbar-dark-mr.svg"} alt="Bhaagyavedh" className="h-10 w-auto" />
          </Link>

          {/* Desktop: grouped nav with dropdowns */}
          <nav ref={dropdownRef} className="hidden lg:flex items-center gap-0 flex-1 justify-end min-w-0">
            {navStructure.map((node) => {
              if (node.kind === "link") {
                const active = pathname === withLang(node.item.href);
                return (
                  <Link
                    key={node.item.href}
                    href={withLang(node.item.href)}
                    className={`shrink-0 px-2 xl:px-2.5 py-1.5 text-[11px] xl:text-[12px] font-medium transition-colors whitespace-nowrap ${
                      active ? "text-[#d4a843]" : "text-white/75 hover:text-[#d4a843]"
                    }`}
                  >
                    {labelOf(node.item)}
                  </Link>
                );
              }
              const open = openDropdown === node.key;
              const active = isSubActive(node.items);
              return (
                <div key={node.key} className="relative shrink-0">
                  <button
                    onClick={() => setOpenDropdown(open ? null : node.key)}
                    onMouseEnter={() => setOpenDropdown(node.key)}
                    className={`inline-flex items-center gap-0.5 px-2 xl:px-2.5 py-1.5 text-[11px] xl:text-[12px] font-medium transition-colors whitespace-nowrap ${
                      active || open ? "text-[#d4a843]" : "text-white/75 hover:text-[#d4a843]"
                    }`}
                    aria-haspopup="menu"
                    aria-expanded={open}
                  >
                    {labelOf(node)}
                    <svg width="10" height="10" viewBox="0 0 10 10" className={`transition-transform ${open ? "rotate-180" : ""}`}>
                      <path d="M2 3.5 L5 6.5 L8 3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {open && (
                    <div
                      onMouseLeave={() => setOpenDropdown(null)}
                      className="absolute top-full left-0 mt-1 min-w-[200px] rounded-lg shadow-xl border border-[#d4a843]/20 py-1 z-50"
                      style={{ background: "rgba(30,6,6,0.98)", backdropFilter: "blur(8px)" }}
                      role="menu"
                    >
                      {node.items.map((sub) => {
                        const subActive = pathname === withLang(sub.href);
                        return (
                          <Link
                            key={sub.href}
                            href={withLang(sub.href)}
                            onClick={() => setOpenDropdown(null)}
                            className={`block px-4 py-2 text-sm transition whitespace-nowrap ${
                              subActive ? "text-[#d4a843] bg-white/5" : "text-white/85 hover:text-[#d4a843] hover:bg-white/5"
                            }`}
                            role="menuitem"
                          >
                            {labelOf(sub)}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
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
                    aria-label="Account menu"
                    className="flex items-center justify-center gap-2 min-w-[44px] min-h-[44px] p-2 rounded-lg hover:bg-white/10 transition"
                  >
                    {user.image ? (
                      <img src={user.image} alt="" className="w-8 h-8 rounded-full border border-[#d4a843]/40" />
                    ) : (
                      <span className="w-8 h-8 rounded-full bg-[#d4a843]/20 flex items-center justify-center text-[#d4a843] text-sm font-bold">
                        {(user.name || "U")[0].toUpperCase()}
                      </span>
                    )}
                  </button>
                  {showMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#d4a843]/20 py-2 z-50">
                      <p className="px-4 py-1 text-xs text-[#5c1a1a]/60 truncate">{user.email}</p>
                      <hr className="my-1 border-[#d4a843]/10" />
                      <Link href={withLang("/account")} className="block px-4 py-2 text-sm text-[#3d0c0c] hover:bg-[#FFF8E7] transition" onClick={() => setShowMenu(false)}>
                        {t("माझे खाते", "My Account", "मेरा खाता")}
                      </Link>
                      <button
                        onClick={() => {
                          document.cookie = "dev-session=; path=/; max-age=0";
                          window.location.href = "/api/auth/signout?callbackUrl=/";
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                      >
                        {t("लॉग आउट", "Sign Out", "लॉग आउट")}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={withLang("/login")}
                  className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded-lg text-sm font-medium bg-[#d4a843] text-[#3d0c0c] hover:bg-[#e5bc5a] transition"
                >
                  {t("लॉग इन", "Login", "लॉग इन")}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Nav — scrollable row, groups flatten to direct links */}
      <nav className="lg:hidden flex overflow-x-auto border-t border-white/10 px-3 py-2 gap-1 scrollbar-hide">
        {navStructure.flatMap((node) => node.kind === "link" ? [node.item] : node.items).map((link) => (
          <Link
            key={link.href}
            href={withLang(link.href)}
            className="flex-shrink-0 inline-flex items-center min-h-[40px] px-3 py-2 rounded-full text-xs font-medium text-white/70 hover:text-[#d4a843] hover:bg-white/10 transition-all whitespace-nowrap"
          >
            {t(link.labelMr, link.labelEn, link.labelHi)}
          </Link>
        ))}
      </nav>
    </header>
  );
}
