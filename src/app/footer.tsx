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
            <img src={lang === "mr" ? "/logos/navbar-dark-mr.svg" : "/logos/navbar-dark.svg"} alt="Bhaagyavedh" className="h-10 w-auto mb-1" />
            <p className="text-sm leading-relaxed mt-2 text-white/50">
              {t(
                "अचूक वैदिक ज्योतिष गणना — कुंडली, गुण मिलान, पंचांग, राशीफल, पूजा, तीर्थयात्रा आणि अधिक.",
                "Accurate Vedic astrology — kundli, matching, panchang, rashifal, pooja, yatra and more."
              )}
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-white/40">
              <span>{t("पुणे, महाराष्ट्र", "Pune, Maharashtra")}</span>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm" style={{ color: "#d4a843" }}>
              {t("ज्योतिष साधने", "Astrology Tools")}
            </h4>
            <div className="space-y-2 text-sm">
              <Link href={L("/")} className="block text-white/50 hover:text-[#d4a843] transition">{t("मुख्यपृष्ठ", "Home")}</Link>
              <Link href={L("/kundli")} className="block text-white/50 hover:text-[#d4a843] transition">{t("कुंडली", "Kundli")}</Link>
              <Link href={L("/matching")} className="block text-white/50 hover:text-[#d4a843] transition">{t("गुण मिलान", "Matching")}</Link>
              <Link href={L("/panchang")} className="block text-white/50 hover:text-[#d4a843] transition">{t("पंचांग", "Panchang")}</Link>
              <Link href={L("/rashifal")} className="block text-white/50 hover:text-[#d4a843] transition">{t("राशीफल", "Rashifal")}</Link>
              <Link href={L("/calendar")} className="block text-white/50 hover:text-[#d4a843] transition">{t("दिनदर्शिका", "Calendar")}</Link>
              <Link href={L("/muhurat")} className="block text-white/50 hover:text-[#d4a843] transition">{t("मुहूर्त", "Muhurat")}</Link>
              <Link href={L("/graha-sthiti")} className="block text-white/50 hover:text-[#d4a843] transition">{t("ग्रह स्थिती", "Planets Now")}</Link>
              <Link href={L("/compare")} className="block text-white/50 hover:text-[#d4a843] transition">{t("कुंडली तुलना", "Compare Kundli")}</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm" style={{ color: "#d4a843" }}>
              {t("सेवा व संग्रह", "Services & Content")}
            </h4>
            <div className="space-y-2 text-sm">
              <Link href={L("/pooja-services")} className="block text-white/50 hover:text-[#d4a843] transition">{t("पूजा सेवा", "Pooja Services")}</Link>
              <Link href={L("/temples")} className="block text-white/50 hover:text-[#d4a843] transition">{t("मंदिरे", "Temples")}</Link>
              <Link href={L("/yatra")} className="block text-white/50 hover:text-[#d4a843] transition">{t("यात्रा सेवा", "Yatra")}</Link>
              <Link href={L("/consultation")} className="block text-white/50 hover:text-[#d4a843] transition">{t("सल्ला सेवा", "Consultation")}</Link>
              <Link href={L("/sangrah")} className="block text-white/50 hover:text-[#d4a843] transition">{t("संग्रह", "Sangrah")}</Link>
              <Link href={L("/blog")} className="block text-white/50 hover:text-[#d4a843] transition">{t("दैनिक लेख", "Daily Blog")}</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-sm" style={{ color: "#d4a843" }}>
              {t("कंपनी", "Company")}
            </h4>
            <div className="space-y-2 text-sm">
              <Link href={L("/about")} className="block text-white/50 hover:text-[#d4a843] transition">{t("आमच्याबद्दल", "About Us")}</Link>
              <Link href={L("/contact")} className="block text-white/50 hover:text-[#d4a843] transition">{t("संपर्क", "Contact")}</Link>
            </div>
            <h4 className="font-semibold mb-3 mt-6 text-sm" style={{ color: "#d4a843" }}>
              {t("कायदेशीर", "Legal")}
            </h4>
            <div className="space-y-2 text-sm">
              <Link href={L("/privacy")} className="block text-white/50 hover:text-[#d4a843] transition">{t("गोपनीयता धोरण", "Privacy Policy")}</Link>
              <Link href={L("/terms")} className="block text-white/50 hover:text-[#d4a843] transition">{t("अटी व शर्ती", "Terms & Conditions")}</Link>
              <Link href={L("/disclaimer")} className="block text-white/50 hover:text-[#d4a843] transition">{t("अस्वीकरण", "Disclaimer")}</Link>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-white/30">
            &copy; {new Date().getFullYear()} {t("भाग्यवेध. सर्व हक्क राखीव.", "Bhaagyavedh. All rights reserved.")}
          </p>
        </div>
      </div>
    </footer>
  );
}
