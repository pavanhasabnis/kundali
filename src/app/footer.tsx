"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/astrology/language-context";

export function Footer() {
  const { t, lang } = useLang();
  const pathname = usePathname();
  const langPrefix = `/${lang}`;
  const L = (href: string) => (href === "/" ? langPrefix : `${langPrefix}${href}`);

  if (pathname.includes("/admin") || pathname.includes("/account")) return null;

  return (
    <footer className="text-white/60" style={{ background: "#1a0505", marginTop: "-2px", paddingTop: "2px" }}>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <img src={lang === "en" ? "/logos/navbar-dark.svg" : "/logos/navbar-dark-mr.svg"} alt="Bhaagyavedh" className="h-10 w-auto mb-1" />
            <p className="text-sm leading-relaxed mt-2 text-white/50">
              {t(
                "अचूक वैदिक ज्योतिष गणना — कुंडली, गुण मिलान, पंचांग, राशीफल, पूजा, तीर्थयात्रा आणि अधिक.",
                "Accurate Vedic astrology — kundli, matching, panchang, rashifal, pooja, yatra and more.",
                "सटीक वैदिक ज्योतिष गणना — कुंडली, गुण मिलान, पंचांग, राशिफल, पूजा, तीर्थयात्रा और अधिक."
              )}
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-white/40">
              <span>{t("पुणे, महाराष्ट्र", "Pune, Maharashtra", "पुणे, महाराष्ट्र")}</span>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <a href="https://wa.me/919146189837" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"
                className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 hover:bg-[#d4a843]/20 hover:text-[#d4a843] text-white/60 transition">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
              <a href="https://www.facebook.com/bhaagyavedh" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 hover:bg-[#d4a843]/20 hover:text-[#d4a843] text-white/60 transition">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://www.instagram.com/bhaagyavedh" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 hover:bg-[#d4a843]/20 hover:text-[#d4a843] text-white/60 transition">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="https://www.youtube.com/@bhaagyavedh" target="_blank" rel="noopener noreferrer" aria-label="YouTube"
                className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 hover:bg-[#d4a843]/20 hover:text-[#d4a843] text-white/60 transition">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://x.com/bhaagyavedh" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)"
                className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 hover:bg-[#d4a843]/20 hover:text-[#d4a843] text-white/60 transition">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm" style={{ color: "#d4a843" }}>
              {t("ज्योतिष साधने", "Astrology Tools", "ज्योतिष साधन")}
            </h4>
            <div className="space-y-2 text-sm">
              <Link href={L("/")} className="block text-white/50 hover:text-[#d4a843] transition">{t("मुख्यपृष्ठ", "Home", "मुख्य पृष्ठ")}</Link>
              <Link href={L("/kundli")} className="block text-white/50 hover:text-[#d4a843] transition">{t("कुंडली", "Kundli", "कुंडली")}</Link>
              <Link href={L("/matching")} className="block text-white/50 hover:text-[#d4a843] transition">{t("गुण मिलान", "Matching", "गुण मिलान")}</Link>
              <Link href={L("/panchang")} className="block text-white/50 hover:text-[#d4a843] transition">{t("पंचांग", "Panchang", "पंचांग")}</Link>
              <Link href={L("/rashifal")} className="block text-white/50 hover:text-[#d4a843] transition">{t("राशीफल", "Rashifal", "राशिफल")}</Link>
              <Link href={L("/calendar")} className="block text-white/50 hover:text-[#d4a843] transition">{t("दिनदर्शिका", "Calendar", "कैलेंडर")}</Link>
              <Link href={L("/muhurat")} className="block text-white/50 hover:text-[#d4a843] transition">{t("मुहूर्त", "Muhurat", "मुहूर्त")}</Link>
              <Link href={L("/graha-sthiti")} className="block text-white/50 hover:text-[#d4a843] transition">{t("ग्रह स्थिती", "Planets Now", "ग्रह स्थिति")}</Link>
              <Link href={L("/compare")} className="block text-white/50 hover:text-[#d4a843] transition">{t("कुंडली तुलना", "Compare Kundli", "कुंडली तुलना")}</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm" style={{ color: "#d4a843" }}>
              {t("सेवा व संग्रह", "Services & Content", "सेवाएँ और संग्रह")}
            </h4>
            <div className="space-y-2 text-sm">
              <Link href={L("/pooja-services")} className="block text-white/50 hover:text-[#d4a843] transition">{t("पूजा सेवा", "Pooja Services", "पूजा सेवा")}</Link>
              <Link href={L("/temples")} className="block text-white/50 hover:text-[#d4a843] transition">{t("मंदिरे", "Temples", "मंदिर")}</Link>
              <Link href={L("/yatra")} className="block text-white/50 hover:text-[#d4a843] transition">{t("यात्रा सेवा", "Yatra", "यात्रा")}</Link>
              <Link href={L("/consultation")} className="block text-white/50 hover:text-[#d4a843] transition">{t("सल्ला सेवा", "Consultation", "परामर्श")}</Link>
              <Link href={L("/sangrah")} className="block text-white/50 hover:text-[#d4a843] transition">{t("संग्रह", "Sangrah", "संग्रह")}</Link>
              <Link href={L("/blog")} className="block text-white/50 hover:text-[#d4a843] transition">{t("दैनिक लेख", "Daily Blog", "दैनिक लेख")}</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm" style={{ color: "#d4a843" }}>
              {t("कंपनी", "Company", "कम्पनी")}
            </h4>
            <div className="space-y-2 text-sm">
              <Link href={L("/about")} className="block text-white/50 hover:text-[#d4a843] transition">{t("आमच्याबद्दल", "About Us", "हमारे बारे में")}</Link>
              <Link href={L("/contact")} className="block text-white/50 hover:text-[#d4a843] transition">{t("संपर्क", "Contact", "सम्पर्क")}</Link>
            </div>
            <h4 className="font-semibold mb-3 mt-6 text-sm" style={{ color: "#d4a843" }}>
              {t("कायदेशीर", "Legal", "कानूनी")}
            </h4>
            <div className="space-y-2 text-sm">
              <Link href={L("/privacy")} className="block text-white/50 hover:text-[#d4a843] transition">{t("गोपनीयता धोरण", "Privacy Policy", "गोपनीयता नीति")}</Link>
              <Link href={L("/terms")} className="block text-white/50 hover:text-[#d4a843] transition">{t("अटी व शर्ती", "Terms & Conditions", "नियम व शर्तें")}</Link>
              <Link href={L("/disclaimer")} className="block text-white/50 hover:text-[#d4a843] transition">{t("अस्वीकरण", "Disclaimer", "अस्वीकरण")}</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} {t("भाग्यवेध. सर्व हक्क राखीव.", "Bhaagyavedh. All rights reserved.", "भाग्यवेध. सर्वाधिकार सुरक्षित.")}
          </p>
        </div>
      </div>
    </footer>
  );
}
