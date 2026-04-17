"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/astrology/language-context";

export function Footer() {
  const { t, lang } = useLang();
  const pathname = usePathname();

  if (pathname.startsWith("/admin") || pathname.startsWith("/account")) return null;

  return (
    <footer className="text-white/60" style={{ background: "#1a0505", marginTop: "-2px", paddingTop: "2px" }}>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <img src={lang === "mr" ? "/logos/navbar-dark-mr.svg" : "/logos/navbar-dark.svg"} alt="Bhaagyavedh" className="h-10 w-auto mb-1" />
            <p className="text-sm leading-relaxed mt-2 text-white/50">
              {t(
                "अचूक वैदिक ज्योतिष गणना — कुंडली, गुण मिलान, पंचांग आणि राशीफल.",
                "Accurate Vedic astrology calculations for kundli, matching, panchang and rashifal."
              )}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm" style={{ color: "#d4a843" }}>
              {t("सेवा", "Services")}
            </h4>
            <div className="space-y-2 text-sm">
              <Link href="/" className="block text-white/50 hover:text-[#d4a843] transition">{t("मुख्यपृष्ठ", "Home")}</Link>
              <Link href="/kundli" className="block text-white/50 hover:text-[#d4a843] transition">{t("कुंडली", "Kundli")}</Link>
              <Link href="/matching" className="block text-white/50 hover:text-[#d4a843] transition">{t("गुण मिलान", "Guna Matching")}</Link>
              <Link href="/panchang" className="block text-white/50 hover:text-[#d4a843] transition">{t("पंचांग", "Panchang")}</Link>
              <Link href="/rashifal" className="block text-white/50 hover:text-[#d4a843] transition">{t("राशीफल", "Rashifal")}</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm" style={{ color: "#d4a843" }}>
              {t("अधिक", "More")}
            </h4>
            <div className="space-y-2 text-sm">
              <Link href="/calendar" className="block text-white/50 hover:text-[#d4a843] transition">{t("दिनदर्शिका", "Calendar")}</Link>
              <Link href="/muhurat" className="block text-white/50 hover:text-[#d4a843] transition">{t("मुहूर्त", "Muhurat")}</Link>
              <Link href="/graha-sthiti" className="block text-white/50 hover:text-[#d4a843] transition">{t("ग्रह स्थिती", "Graha Sthiti")}</Link>
              <Link href="/sangrah" className="block text-white/50 hover:text-[#d4a843] transition">{t("संग्रह", "Sangrah")}</Link>
              <Link href="/blog" className="block text-white/50 hover:text-[#d4a843] transition">{t("दैनिक लेख", "Daily Blog")}</Link>
              <Link href="/consultation" className="block text-white/50 hover:text-[#d4a843] transition">{t("सल्ला सेवा", "Consultation")}</Link>
              <Link href="/about" className="block text-white/50 hover:text-[#d4a843] transition">{t("आमच्याबद्दल", "About Us")}</Link>
              <Link href="/contact" className="block text-white/50 hover:text-[#d4a843] transition">{t("संपर्क", "Contact Us")}</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm" style={{ color: "#d4a843" }}>
              {t("कायदेशीर", "Legal")}
            </h4>
            <div className="space-y-2 text-sm">
              <Link href="/privacy" className="block text-white/50 hover:text-[#d4a843] transition">{t("गोपनीयता धोरण", "Privacy Policy")}</Link>
              <Link href="/disclaimer" className="block text-white/50 hover:text-[#d4a843] transition">{t("अस्वीकरण", "Disclaimer")}</Link>
              <Link href="/terms" className="block text-white/50 hover:text-[#d4a843] transition">{t("अटी व शर्ती", "Terms & Conditions")}</Link>
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
