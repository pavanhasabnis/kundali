"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useLang } from "@/lib/astrology/language-context";
import { JsonLd, localBusinessSchema, siteNavigationSchema } from "@/components/json-ld";

/* ─── Data ────────────────────────────────────────────────── */

const zodiacSigns = [
  { name: "मेष", nameEn: "Aries", icon: "♈" },
  { name: "वृषभ", nameEn: "Taurus", icon: "♉" },
  { name: "मिथुन", nameEn: "Gemini", icon: "♊" },
  { name: "कर्क", nameEn: "Cancer", icon: "♋" },
  { name: "सिंह", nameEn: "Leo", icon: "♌" },
  { name: "कन्या", nameEn: "Virgo", icon: "♍" },
  { name: "तुला", nameEn: "Libra", icon: "♎" },
  { name: "वृश्चिक", nameEn: "Scorpio", icon: "♏" },
  { name: "धनु", nameEn: "Sagittarius", icon: "♐" },
  { name: "मकर", nameEn: "Capricorn", icon: "♑" },
  { name: "कुंभ", nameEn: "Aquarius", icon: "♒" },
  { name: "मीन", nameEn: "Pisces", icon: "♓" },
];

interface TravelPkg {
  id: string;
  titleMr: string;
  titleEn: string;
  category: string;
  imageUrl?: string;
  priceFrom?: number;
  duration?: string;
  featured: boolean;
}

/* ─── Counter ─────────────────────────────────────────────── */

function Counter({ target }: { target: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.ceil(target / 40);
    const id = setInterval(() => { start += step; if (start >= target) { setVal(target); clearInterval(id); } else setVal(start); }, 30);
    return () => clearInterval(id);
  }, [target]);
  return <>{val.toLocaleString()}</>;
}

/* ─── 3D Open Book ────────────────────────────────────────── */

function OpenBook({ leftContent, rightContent, dark, pageNum }: { leftContent: React.ReactNode; rightContent: React.ReactNode; dark?: boolean; pageNum?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const scale = useTransform(scrollYProgress, [0, 0.6], [0.9, 1]);

  const bg = dark ? "linear-gradient(135deg, #2a0808, #3d0c0c)" : "linear-gradient(135deg, #FFF8E7, #f5efe0)";
  const borderCol = dark ? "rgba(212,168,67,0.25)" : "rgba(212,168,67,0.2)";
  const spineShadow = dark ? "rgba(0,0,0,0.5)" : "rgba(139,44,44,0.12)";
  const headerColor = dark ? "rgba(212,168,67,0.35)" : "rgba(139,44,44,0.3)";
  const footerColor = dark ? "rgba(212,168,67,0.25)" : "rgba(139,44,44,0.2)";
  const dividerBg = dark ? "linear-gradient(90deg, transparent, rgba(212,168,67,0.25), transparent)" : "linear-gradient(90deg, transparent, rgba(139,44,44,0.15), transparent)";

  const pageHeader = (
    <div className="text-center mb-4 pb-3" style={{ borderBottom: `1px solid ${borderCol}` }}>
      <p className="text-xs tracking-wider" style={{ color: headerColor }}>॥ श्री गणेशाय नमः ॥</p>
    </div>
  );

  const pageFooter = (side: "left" | "right") => (
    <div className="text-center mt-4 pt-3" style={{ borderTop: `1px solid ${borderCol}` }}>
      <div className="flex items-center justify-center gap-3">
        <div className="flex-1 h-px" style={{ background: dividerBg }} />
        <p className="text-[10px] tracking-wider shrink-0" style={{ color: footerColor }}>
          {side === "left" ? "भाग्यवेध पत्रिका" : `॥ ${pageNum || "१"} ॥`}
        </p>
        <div className="flex-1 h-px" style={{ background: dividerBg }} />
      </div>
    </div>
  );

  const leftOpen = useTransform(scrollYProgress, [0, 0.5], [85, 0]);
  const rightOpen = useTransform(scrollYProgress, [0, 0.5], [-85, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);

  return (
    <motion.div ref={ref} style={{ scale }} className="max-w-5xl mx-auto px-4">
      <div style={{ perspective: "1800px" }}>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <motion.div style={{ rotateY: leftOpen, transformOrigin: "right center" }}
            className="rounded-l-xl md:rounded-l-2xl overflow-hidden relative p-6 sm:p-8">
            <div className="absolute inset-0" style={{ background: bg, border: `2px solid ${borderCol}`, borderRight: "none", borderRadius: "inherit" }} />
            <div className="absolute right-0 top-0 bottom-0 w-4 z-10" style={{ background: `linear-gradient(270deg, ${spineShadow}, transparent)` }} />
            <div className="absolute right-0 top-4 bottom-4 w-px z-10" style={{ background: borderCol }} />
            <motion.div style={{ opacity: contentOpacity }} className="relative z-10 flex flex-col h-full">
              {pageHeader}
              <div className="flex-1">{leftContent}</div>
              {pageFooter("left")}
            </motion.div>
          </motion.div>

          <motion.div style={{ rotateY: rightOpen, transformOrigin: "left center" }}
            className="rounded-r-xl md:rounded-r-2xl overflow-hidden relative p-6 sm:p-8">
            <div className="absolute inset-0" style={{ background: bg, border: `2px solid ${borderCol}`, borderLeft: "none", borderRadius: "inherit" }} />
            <div className="absolute left-0 top-0 bottom-0 w-4 z-10" style={{ background: `linear-gradient(90deg, ${spineShadow}, transparent)` }} />
            <div className="absolute left-0 top-4 bottom-4 w-px z-10" style={{ background: borderCol }} />
            <motion.div style={{ opacity: contentOpacity }} className="relative z-10 flex flex-col h-full">
              {pageHeader}
              <div className="flex-1">{rightContent}</div>
              {pageFooter("right")}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Section Heading ─────────────────────────────────────── */

function SectionHead({ pageMr, pageEn, pageHi, titleMr, titleEn, titleHi, t }: { pageMr: string; pageEn: string; pageHi?: string; titleMr: string; titleEn: string; titleHi?: string; t: (mr: string, en: string, hi?: string) => string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
      <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "rgba(212,168,67,0.4)" }}>{t(pageMr, pageEn, pageHi)}</p>
      <h2 className="text-2xl sm:text-3xl font-bold text-white">{t(titleMr, titleEn, titleHi)}</h2>
      <div className="w-16 h-0.5 mx-auto mt-3" style={{ background: "linear-gradient(90deg, transparent, #d4a843, transparent)" }} />
    </motion.div>
  );
}

/* ─── 3D OM Loader ────────────────────────────────────────── */

function OmLoader({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: "#1a0505" }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute w-[300px] h-[300px] rounded-full" style={{ border: "1px solid rgba(212,168,67,0.08)" }} />
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute w-[220px] h-[220px] rounded-full" style={{ border: "1px solid rgba(212,168,67,0.06)" }} />
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute w-[140px] h-[140px] rounded-full" style={{ border: "1px solid rgba(212,168,67,0.1)" }} />
      </div>

      <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: [0, 1.2, 1], opacity: [0, 0.4, 0.2] }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute w-[200px] h-[200px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(212,168,67,0.3) 0%, transparent 70%)" }} />

      <motion.div initial={{ scale: 0.3, rotateY: -90, rotateX: 20, opacity: 0 }}
        animate={{ scale: 1, rotateY: 0, rotateX: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ perspective: "800px", transformStyle: "preserve-3d" }}>
        <motion.div animate={{ rotateY: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-8xl sm:text-9xl font-bold select-none"
          style={{ color: "#d4a843", textShadow: "0 0 40px rgba(212,168,67,0.4), 0 0 80px rgba(212,168,67,0.2), 0 4px 20px rgba(0,0,0,0.5)", transformStyle: "preserve-3d" }}>
          ॐ
        </motion.div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }} className="mt-6 text-center">
        <motion.div initial={{ width: 0 }} animate={{ width: 60 }} transition={{ delay: 0.6, duration: 0.8 }}
          className="h-px mx-auto mb-4" style={{ background: "linear-gradient(90deg, transparent, #d4a843, transparent)" }} />
        <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: "#d4a843" }}>भाग्यवेध</h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.6 }}
          className="text-xs mt-2 tracking-[0.2em] uppercase" style={{ color: "rgba(212,168,67,0.3)" }}>
          Vedic Astrology &bull; Pilgrimage &bull; Pooja
        </motion.p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="mt-8 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div key={i} animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            className="w-1.5 h-1.5 rounded-full" style={{ background: "#d4a843" }} />
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PREVIEW HOMEPAGE
   ═══════════════════════════════════════════════════════════ */

export default function PreviewHomeClient() {
  const { t, lang } = useLang();
  const [showLoader, setShowLoader] = useState(true);
  const [featuredPkgs, setFeaturedPkgs] = useState<TravelPkg[]>([]);

  useEffect(() => {
    fetch("/api/travel")
      .then((r) => r.json())
      .then((d) => setFeaturedPkgs((d.packages || []).filter((p: TravelPkg) => p.featured).slice(0, 6)))
      .catch(() => {});
  }, []);

  return (
    <>
      <JsonLd data={localBusinessSchema} />
      <JsonLd data={siteNavigationSchema} />
      <AnimatePresence>
        {showLoader && <OmLoader onComplete={() => setShowLoader(false)} />}
      </AnimatePresence>

      <div style={{ background: "#1a0505" }}>

      {/* ══════ HERO ══════ */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden -mt-8"
        style={{ background: "linear-gradient(135deg, #1a0505 0%, #3d0c0c 30%, #5c1a1a 60%, #2a0808 100%)" }}>

        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Ccircle cx='40' cy='40' r='35' fill='none' stroke='%23d4a843' stroke-width='0.5'/%3E%3Ccircle cx='40' cy='40' r='25' fill='none' stroke='%23d4a843' stroke-width='0.5'/%3E%3Ccircle cx='40' cy='40' r='15' fill='none' stroke='%23d4a843' stroke-width='0.5'/%3E%3Cline x1='40' y1='5' x2='40' y2='75' stroke='%23d4a843' stroke-width='0.3'/%3E%3Cline x1='5' y1='40' x2='75' y2='40' stroke='%23d4a843' stroke-width='0.3'/%3E%3C/svg%3E")`, backgroundSize: "80px 80px" }} />

        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(212,168,67,0.15) 0%, transparent 70%)" }} />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center py-10">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>

            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl mb-4" style={{ color: "#d4a843" }}>ॐ</motion.div>

            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8"
              style={{ background: "rgba(212,168,67,0.1)", border: "1px solid rgba(212,168,67,0.25)" }}>
              <span className="text-sm font-medium" style={{ color: "#d4a843" }}>
                {t("श्री गणेशाय नमः | संपूर्ण धार्मिक सेवा", "Shri Ganeshay Namah | Complete Spiritual Services", "श्री गणेशाय नमः | सम्पूर्ण धार्मिक सेवा")}
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 leading-tight">
              <span style={{ background: "linear-gradient(135deg, #f0c040, #d4a843, #c49535)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {t("भाग्यवेध", "Bhaagyavedh", "भाग्यवेध")}
              </span>
              <br />
              <span className="text-white/90 text-4xl sm:text-5xl md:text-6xl">
                {t("ज्योतिष व धार्मिक सेवा", "Astrology & Spiritual Services", "ज्योतिष और धार्मिक सेवा")}
              </span>
            </h1>

            <p className="text-base sm:text-lg mb-3 max-w-2xl mx-auto leading-relaxed" style={{ color: "rgba(255,248,231,0.6)" }}>
              {t(
                "कुंडली, राशीफल, गुण मिलान, पंचांग, मुहूर्त, धार्मिक यात्रा, पूजा सेवा, मंदिर माहिती — सर्व एकाच ठिकाणी",
                "Kundli, Horoscope, Matching, Panchang, Muhurat, Pilgrimage Travel, Pooja Services, Temple Info — all in one place",
                "कुंडली, राशिफल, गुण मिलान, पंचांग, मुहूर्त, धार्मिक यात्रा, पूजा सेवा, मंदिर जानकारी — सब एक ही जगह"
              )}
            </p>

            <p className="text-sm mb-6" style={{ color: "rgba(212,168,67,0.4)" }}>
              {t("मराठी व इंग्रजी | वैदिक ज्ञान + आधुनिक सेवा", "Marathi & English | Vedic Wisdom + Modern Services", "हिन्दी, मराठी व अंग्रेज़ी | वैदिक ज्ञान + आधुनिक सेवा")}
            </p>

            {/* CTAs — 3 buttons covering all major services */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
              <Link href={`/${lang}/kundli`}
                className="px-8 py-4 rounded-full font-semibold text-base transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #d4a843, #c49535)", color: "#1a0505", boxShadow: "0 8px 32px rgba(212,168,67,0.3)" }}>
                {t("कुंडली बनवा", "Generate Kundli", "कुंडली बनाएँ")}
              </Link>
              <Link href={`/${lang}/yatra`}
                className="px-8 py-4 rounded-full font-semibold text-base transition-all hover:-translate-y-0.5 hover:bg-white/5"
                style={{ border: "1px solid rgba(212,168,67,0.3)", color: "#d4a843" }}>
                {t("यात्रा पॅकेजेस", "Travel Packages", "यात्रा पैकेज")}
              </Link>
              <Link href={`/${lang}/rashifal`}
                className="px-8 py-4 rounded-full font-semibold text-base transition-all hover:-translate-y-0.5 hover:bg-white/5"
                style={{ border: "1px solid rgba(212,168,67,0.3)", color: "#d4a843" }}>
                {t("आजचे राशीफल", "Today's Horoscope", "आज का राशिफल")}
              </Link>
            </div>

            {/* Stats — expanded to cover all services */}
            <div className="grid grid-cols-5 gap-4 max-w-2xl mx-auto">
              {[
                { v: 9, l: t("ग्रह", "Planets", "ग्रह") },
                { v: 12, l: t("राशी", "Rashis", "राशि") },
                { v: 14, l: t("यात्रा", "Yatras", "यात्राएँ") },
                { v: 170, l: t("ठिकाणे", "Places", "स्थान") },
                { v: 50, l: t("मंदिरे", "Temples", "मंदिर") },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold" style={{ color: "#d4a843" }}><Counter target={s.v} />+</div>
                  <div className="text-[10px] mt-1 uppercase tracking-widest" style={{ color: "rgba(212,168,67,0.35)" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #d4a843, transparent)" }} />
      </section>

      {/* ══════ BOOK 1: ASTROLOGY SERVICES ══════ */}
      <section className="py-16" style={{ background: "linear-gradient(180deg, #1a0505, #2a0808)" }}>
        <SectionHead pageMr="पृष्ठ १" pageEn="Page 1" pageHi="पृष्ठ १" titleMr="ज्योतिष सेवा" titleEn="Astrology Services" titleHi="ज्योतिष सेवाएँ" t={t} />
        <OpenBook pageNum="१"
          leftContent={
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: "#3d0c0c" }}>{t("कुंडली व भविष्य", "Kundli & Predictions", "कुंडली और भविष्य")}</h3>
              <div className="space-y-3">
                {[
                  { sym: "☉", title: t("कुंडली निर्मिती", "Kundli Generation", "कुंडली निर्माण"), desc: t("९ चार्ट, ग्रह बल, योग, दोष, दशा, उपाय", "9 charts, strength, yogas, doshas, dasha, remedies", "९ चार्ट, ग्रह बल, योग, दोष, दशा, उपाय"), href: `/${lang}/kundli` },
                  { sym: "☯", title: t("गुण मिलान", "Kundli Matching", "गुण मिलान"), desc: t("अष्टकूट ३६ गुण मिलान", "Ashtakoot 36 Guna Milan", "अष्टकूट ३६ गुण मिलान"), href: `/${lang}/matching` },
                  { sym: "✦", title: t("दैनिक राशीफल", "Daily Horoscope", "दैनिक राशिफल"), desc: t("वास्तविक गोचरावर आधारित भविष्य", "Predictions based on real transits", "वास्तविक गोचर पर आधारित भविष्य"), href: `/${lang}/rashifal` },
                  { sym: "⌂", title: t("मुहूर्त शोधक", "Muhurat Finder", "मुहूर्त खोजक"), desc: t("वास्तुशांती, गृहप्रवेश, विवाह मुहूर्त", "Vastushanti, Gruhapravesh, Vivah muhurat", "वास्तुशांति, गृहप्रवेश, विवाह मुहूर्त"), href: `/${lang}/muhurat` },
                ].map((s, i) => (
                  <Link key={i} href={s.href} className="group flex gap-3 items-start p-3 rounded-xl hover:bg-white/50 transition-all" style={{ border: "1px solid rgba(212,168,67,0.1)" }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0" style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)", color: "#d4a843" }}>{s.sym}</div>
                    <div>
                      <h4 className="text-sm font-bold group-hover:text-[#8b2c2c]" style={{ color: "#3d0c0c" }}>{s.title}</h4>
                      <p className="text-xs leading-relaxed mt-0.5" style={{ color: "#6b5b3e" }}>{s.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          }
          rightContent={
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: "#3d0c0c" }}>{t("पंचांग व ग्रह", "Panchang & Planets", "पंचांग और ग्रह")}</h3>
              <div className="space-y-3">
                {[
                  { sym: "☽", title: t("दैनिक पंचांग", "Daily Panchang", "दैनिक पंचांग"), desc: t("तिथी, नक्षत्र, योग, करण, राहुकाळ", "Tithi, Nakshatra, Yoga, Karana, Rahu Kaal", "तिथि, नक्षत्र, योग, करण, राहुकाल"), href: `/${lang}/panchang` },
                  { sym: "⊛", title: t("वैदिक दिनदर्शिका", "Vedic Calendar", "वैदिक पंचांग कैलेंडर"), desc: t("सण, मुहूर्त, शुभ-अशुभ दिवस", "Festivals, muhurat, auspicious days", "त्यौहार, मुहूर्त, शुभ-अशुभ दिन"), href: `/${lang}/calendar` },
                  { sym: "♄", title: t("ग्रह स्थिती (Live)", "Planet Positions (Live)", "ग्रह स्थिति (लाइव)"), desc: t("सध्याची वास्तविक ग्रह स्थिती — दर मिनिटाला अपडेट", "Real-time planet positions — updates every minute", "वर्तमान वास्तविक ग्रह स्थिति — हर मिनट अपडेट"), href: `/${lang}/graha-sthiti` },
                  { sym: "₹", title: t("ज्योतिष सल्ला", "Consultation", "ज्योतिष परामर्श"), desc: t("अनुभवी ज्योतिषांकडून वैयक्तिक सल्ला", "Personal consultation by experienced astrologers", "अनुभवी ज्योतिषियों से व्यक्तिगत परामर्श"), href: `/${lang}/consultation` },
                ].map((s, i) => (
                  <Link key={i} href={s.href} className="group flex gap-3 items-start p-3 rounded-xl hover:bg-white/50 transition-all" style={{ border: "1px solid rgba(212,168,67,0.1)" }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0" style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)", color: "#d4a843" }}>{s.sym}</div>
                    <div>
                      <h4 className="text-sm font-bold group-hover:text-[#8b2c2c]" style={{ color: "#3d0c0c" }}>{s.title}</h4>
                      <p className="text-xs leading-relaxed mt-0.5" style={{ color: "#6b5b3e" }}>{s.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          }
        />
      </section>

      {/* ══════ BOOK 2: YATRA / TRAVEL ══════ */}
      <section className="py-16" style={{ background: "#1a0505" }}>
        <SectionHead pageMr="पृष्ठ २" pageEn="Page 2" pageHi="पृष्ठ २" titleMr="धार्मिक यात्रा सेवा" titleEn="Pilgrimage Travel Services" titleHi="धार्मिक यात्रा सेवाएँ" t={t} />
        <OpenBook dark pageNum="२"
          leftContent={
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: "#d4a843" }}>{t("लोकप्रिय यात्रा", "Popular Pilgrimages", "लोकप्रिय यात्राएँ")}</h3>
              <div className="space-y-3">
                {[
                  { icon: "🔱", title: t("ज्योतिर्लिंग यात्रा", "Jyotirlinga Yatra", "ज्योतिर्लिंग यात्रा"), desc: t("१२ ज्योतिर्लिंग — संपूर्ण भारत दर्शन", "12 Jyotirlingas — Pan India darshan", "१२ ज्योतिर्लिंग — सम्पूर्ण भारत दर्शन"), href: `/${lang}/yatra/jyotirlinga` },
                  { icon: "🏔️", title: t("चार धाम यात्रा", "Char Dham Yatra", "चार धाम यात्रा"), desc: t("बद्रीनाथ, केदारनाथ, गंगोत्री, यमुनोत्री", "Badrinath, Kedarnath, Gangotri, Yamunotri", "बद्रीनाथ, केदारनाथ, गंगोत्री, यमुनोत्री"), href: `/${lang}/yatra/char-dham` },
                  { icon: "🙏", title: t("अष्टविनायक दर्शन", "Ashtavinayak Tour", "अष्टविनायक दर्शन"), desc: t("महाराष्ट्रातील ८ पवित्र गणपती मंदिरे", "8 sacred Ganapati temples in Maharashtra", "महाराष्ट्र के ८ पवित्र गणपति मंदिर"), href: `/${lang}/yatra/ashtavinayak` },
                  { icon: "🪷", title: t("शक्तिपीठ दर्शन", "Shakti Peeth Tour", "शक्तिपीठ दर्शन"), desc: t("साडेतीन शक्तिपीठे — कोल्हापूर, तुळजापूर, माहूर", "3.5 Shakti Peethas — Kolhapur, Tuljapur, Mahur", "साढ़े तीन शक्तिपीठ — कोल्हापुर, तुलजापुर, माहूर"), href: `/${lang}/yatra/shakti-peeth` },
                ].map((s, i) => (
                  <Link key={i} href={s.href} className="group flex gap-3 items-start p-3 rounded-xl hover:bg-white/10 transition-all" style={{ border: "1px solid rgba(212,168,67,0.15)" }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0">{s.icon}</div>
                    <div>
                      <h4 className="text-sm font-bold text-white/90 group-hover:text-[#d4a843]">{s.title}</h4>
                      <p className="text-xs leading-relaxed mt-0.5 text-white/40">{s.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          }
          rightContent={
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: "#d4a843" }}>{t("अधिक यात्रा", "More Pilgrimages", "और यात्राएँ")}</h3>
              <div className="space-y-3">
                {[
                  { icon: "🪔", title: t("काशी-प्रयागराज-अयोध्या", "Kashi-Prayagraj-Ayodhya", "काशी-प्रयागराज-अयोध्या"), desc: t("गंगा आरती, संगम स्नान, राम मंदिर दर्शन", "Ganga Aarti, Sangam, Ram Mandir darshan", "गंगा आरती, संगम स्नान, राम मंदिर दर्शन"), href: `/${lang}/yatra/varanasi` },
                  { icon: "🙏", title: t("शिर्डी-शनि शिंगणापूर", "Shirdi-Shani Shingnapur", "शिरडी-शनि शिंगणापुर"), desc: t("साईबाबा दर्शन, त्र्यंबकेश्वर, पंचवटी", "Sai Baba darshan, Trimbakeshwar, Panchavati", "साईबाबा दर्शन, त्र्यंबकेश्वर, पंचवटी"), href: `/${lang}/yatra/shirdi` },
                  { icon: "🏛️", title: t("द्वारका-सोमनाथ", "Dwarka-Somnath", "द्वारका-सोमनाथ"), desc: t("श्रीकृष्ण नगरी, सोमनाथ ज्योतिर्लिंग, गिरनार", "Krishna's city, Somnath Jyotirlinga, Girnar", "श्रीकृष्ण नगरी, सोमनाथ ज्योतिर्लिंग, गिरनार"), href: `/${lang}/yatra/dwarka` },
                  { icon: "⛩️", title: t("तिरुपती दर्शन", "Tirupati Darshan", "तिरुपति दर्शन"), desc: t("बालाजी VIP दर्शन — कल्याणम, लड्डू प्रसादम", "Balaji VIP darshan — Kalyanam, Laddu Prasadam", "बालाजी VIP दर्शन — कल्याणम, लड्डू प्रसादम"), href: `/${lang}/yatra/tirupati` },
                ].map((s, i) => (
                  <Link key={i} href={s.href} className="group flex gap-3 items-start p-3 rounded-xl hover:bg-white/10 transition-all" style={{ border: "1px solid rgba(212,168,67,0.15)" }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0">{s.icon}</div>
                    <div>
                      <h4 className="text-sm font-bold text-white/90 group-hover:text-[#d4a843]">{s.title}</h4>
                      <p className="text-xs leading-relaxed mt-0.5 text-white/40">{s.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-4 pt-3 text-center" style={{ borderTop: "1px dashed rgba(212,168,67,0.15)" }}>
                <Link href={`/${lang}/yatra`} className="text-sm font-semibold px-8 py-2.5 rounded-full inline-block"
                  style={{ border: "1px solid rgba(212,168,67,0.3)", color: "#d4a843" }}>
                  {t("सर्व यात्रा पहा →", "View All Pilgrimages →", "सभी यात्राएँ देखें →")}
                </Link>
              </div>
            </div>
          }
        />
      </section>

      {/* ══════ FEATURED YATRA PACKAGES (with images) ══════ */}
      {featuredPkgs.length > 0 && (
        <section className="py-16" style={{ background: "linear-gradient(180deg, #1a0505, #2a0808)" }}>
          <SectionHead pageMr="पृष्ठ ३" pageEn="Page 3" pageHi="पृष्ठ ३" titleMr="विशेष यात्रा पॅकेजेस" titleEn="Featured Travel Packages" titleHi="विशेष यात्रा पैकेज" t={t} />
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredPkgs.map((pkg, i) => (
                <motion.div key={pkg.id}
                  initial={{ opacity: 0, y: 30, rotateX: 15 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  style={{ perspective: "800px" }}>
                  <Link href={`/${lang}/yatra/${pkg.category.replace(/_/g, "-")}`}
                    className="block rounded-xl overflow-hidden group transition-all hover:-translate-y-1"
                    style={{ border: "2px solid rgba(212,168,67,0.2)", background: "rgba(61,12,12,0.5)" }}>
                    <div className="h-28 flex items-center justify-center relative px-4" style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)" }}>
                      <h4 className="text-sm font-bold text-[#d4a843] text-center leading-tight">{t(pkg.titleMr, pkg.titleEn)}</h4>
                      {pkg.priceFrom && (
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold"
                          style={{ background: "rgba(212,168,67,0.9)", color: "#1a0505" }}>
                          ₹{pkg.priceFrom.toLocaleString()}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-white/90 text-sm mb-1">{t(pkg.titleMr, pkg.titleEn)}</h3>
                      <div className="flex items-center justify-between">
                        {pkg.duration && <span className="text-[10px] text-white/30">{pkg.duration}</span>}
                        <span className="text-xs font-medium" style={{ color: "#d4a843" }}>{t("पहा", "View", "देखें")} &rarr;</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══════ BOOK 3: POOJA & TEMPLES ══════ */}
      <section className="py-16" style={{ background: "#1a0505" }}>
        <SectionHead pageMr="पृष्ठ ४" pageEn="Page 4" pageHi="पृष्ठ ४" titleMr="पूजा सेवा व मंदिरे" titleEn="Pooja Services & Temples" titleHi="पूजा सेवाएँ और मंदिर" t={t} />
        <OpenBook pageNum="४"
          leftContent={
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: "#3d0c0c" }}>{t("पूजा व कर्मकांड", "Pooja & Rituals", "पूजा और कर्मकांड")}</h3>
              <div className="space-y-3">
                {[
                  { sym: "🔥", title: t("हवन / होम", "Havan / Hom", "हवन / होम"), desc: t("गणेश हवन, नवग्रह हवन, शांती हवन", "Ganesh Havan, Navagraha Havan, Shanti Havan", "गणेश हवन, नवग्रह हवन, शांति हवन") },
                  { sym: "🙏", title: t("सत्यनारायण पूजा", "Satyanarayan Pooja", "सत्यनारायण पूजा"), desc: t("घरी किंवा मंदिरात — अनुभवी गुरुजींसह", "At home or temple — with experienced Guruji", "घर या मंदिर में — अनुभवी गुरुजी के साथ") },
                  { sym: "🏠", title: t("वास्तुशांती / गृहप्रवेश", "Vastushanti / Gruhapravesh", "वास्तुशांति / गृहप्रवेश"), desc: t("नवीन घर किंवा कार्यालय — शास्त्रोक्त विधी", "New home or office — traditional rituals", "नए घर या कार्यालय — शास्त्रोक्त विधि") },
                  { sym: "💍", title: t("लग्नविधी", "Wedding Rituals", "विवाह विधि"), desc: t("संपूर्ण लग्न विधी — मंगलाष्टक, सप्तपदी", "Complete wedding rituals — Mangalashtak, Saptapadi", "सम्पूर्ण विवाह विधि — मंगलाष्टक, सप्तपदी") },
                ].map((s, i) => (
                  <div key={i} className="flex gap-3 items-start p-3 rounded-xl" style={{ border: "1px solid rgba(212,168,67,0.1)" }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0">{s.sym}</div>
                    <div>
                      <h4 className="text-sm font-bold" style={{ color: "#3d0c0c" }}>{s.title}</h4>
                      <p className="text-xs leading-relaxed mt-0.5" style={{ color: "#6b5b3e" }}>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 text-center" style={{ borderTop: "1px dashed rgba(212,168,67,0.15)" }}>
                <Link href={`/${lang}/pooja-services`} className="text-sm font-semibold px-6 py-2 rounded-full inline-block"
                  style={{ background: "linear-gradient(135deg, #d4a843, #c49535)", color: "#1a0505" }}>
                  {t("सर्व पूजा सेवा →", "All Pooja Services →", "सभी पूजा सेवाएँ →")}
                </Link>
              </div>
            </div>
          }
          rightContent={
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: "#3d0c0c" }}>{t("प्रसिद्ध मंदिरे", "Famous Temples", "प्रसिद्ध मंदिर")}</h3>
              <div className="space-y-3">
                {[
                  { sym: "🛕", title: t("ज्योतिर्लिंग मंदिरे", "Jyotirlinga Temples", "ज्योतिर्लिंग मंदिर"), desc: t("१२ ज्योतिर्लिंगांची संपूर्ण माहिती", "Complete info on 12 Jyotirlingas", "१२ ज्योतिर्लिंगों की सम्पूर्ण जानकारी") },
                  { sym: "🙏", title: t("अष्टविनायक मंदिरे", "Ashtavinayak Temples", "अष्टविनायक मंदिर"), desc: t("महाराष्ट्रातील ८ गणपती मंदिरे", "8 Ganapati temples in Maharashtra", "महाराष्ट्र के ८ गणपति मंदिर") },
                  { sym: "🪷", title: t("शक्तिपीठ मंदिरे", "Shakti Peeth Temples", "शक्तिपीठ मंदिर"), desc: t("देवी शक्तीची पवित्र स्थाने", "Sacred sites of Goddess Shakti", "देवी शक्ति के पवित्र स्थान") },
                  { sym: "📿", title: t("दत्तक्षेत्र मंदिरे", "Datta Kshetra Temples", "दत्तक्षेत्र मंदिर"), desc: t("दत्तात्रेयांची प्रमुख स्थाने", "Major Dattatreya shrines", "दत्तात्रेय के प्रमुख स्थान") },
                ].map((s, i) => (
                  <div key={i} className="flex gap-3 items-start p-3 rounded-xl" style={{ border: "1px solid rgba(212,168,67,0.1)" }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0">{s.sym}</div>
                    <div>
                      <h4 className="text-sm font-bold" style={{ color: "#3d0c0c" }}>{s.title}</h4>
                      <p className="text-xs leading-relaxed mt-0.5" style={{ color: "#6b5b3e" }}>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 text-center" style={{ borderTop: "1px dashed rgba(212,168,67,0.15)" }}>
                <Link href={`/${lang}/temples`} className="text-sm font-semibold px-6 py-2 rounded-full inline-block"
                  style={{ border: "1px solid rgba(212,168,67,0.2)", color: "#3d0c0c" }}>
                  {t("सर्व मंदिरे पहा →", "Explore All Temples →", "सभी मंदिर देखें →")}
                </Link>
              </div>
            </div>
          }
        />
      </section>

      {/* ══════ BOOK 4: ZODIAC ══════ */}
      <section className="py-16" style={{ background: "linear-gradient(180deg, #2a0808, #1a0505)" }}>
        <SectionHead pageMr="पृष्ठ ५" pageEn="Page 5" pageHi="पृष्ठ ५" titleMr="१२ राशी — राशीचक्र" titleEn="12 Zodiac Signs" titleHi="१२ राशियाँ — राशिचक्र" t={t} />
        <OpenBook dark pageNum="५"
          leftContent={
            <div className="flex flex-col items-center justify-center h-full">
              <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                {zodiacSigns.slice(0, 6).map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl sm:text-3xl" style={{ color: "#d4a843" }}>{s.icon}</div>
                    <div className="text-sm font-semibold text-white/70 mt-1">{s.name}</div>
                    <div className="text-xs text-white/30">{s.nameEn}</div>
                  </div>
                ))}
              </div>
            </div>
          }
          rightContent={
            <div className="flex flex-col items-center justify-center h-full">
              <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                {zodiacSigns.slice(6, 12).map((s, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl sm:text-3xl" style={{ color: "#d4a843" }}>{s.icon}</div>
                    <div className="text-sm font-semibold text-white/70 mt-1">{s.name}</div>
                    <div className="text-xs text-white/30">{s.nameEn}</div>
                  </div>
                ))}
              </div>
            </div>
          }
        />
        <div className="text-center mt-8">
          <Link href={`/${lang}/rashifal`} className="text-sm font-semibold px-8 py-3 rounded-full inline-block"
            style={{ border: "1px solid rgba(212,168,67,0.3)", color: "#d4a843" }}>
            {t("आजचे राशीफल पहा →", "Check Today's Horoscope →", "आज का राशिफल देखें →")}
          </Link>
        </div>
      </section>

      {/* ══════ BOOK 5: WHY US + BLOG ══════ */}
      <section className="py-16" style={{ background: "#1a0505" }}>
        <SectionHead pageMr="पृष्ठ ६" pageEn="Page 6" pageHi="पृष्ठ ६" titleMr="आम्ही वेगळे का?" titleEn="Why Choose Us?" titleHi="हमें क्यों चुनें?" t={t} />
        <OpenBook pageNum="६"
          leftContent={
            <div>
              <h3 className="text-base font-bold mb-5" style={{ color: "#8b2c2c" }}>{t("अचूक गणना", "Accurate Calculations", "सटीक गणना")}</h3>
              <div className="space-y-4">
                {[
                  { t: t("वास्तविक ग्रह गणना", "Real Planetary Calculations", "वास्तविक ग्रह गणना"), d: t("९ ग्रहांची अचूक स्थिती — लाहिरी अयनांश", "Accurate positions of 9 planets — Lahiri Ayanamsa", "९ ग्रहों की सटीक स्थिति — लाहिरी अयनांश") },
                  { t: t("९ कुंडली चार्ट", "9 Kundli Charts", "९ कुंडली चार्ट"), d: t("लग्न, चंद्र, नवमांश, भाव चलित, दशमांश आणि अधिक", "Lagna, Chandra, Navamsha, Bhav Chalit, D10 and more", "लग्न, चंद्र, नवमांश, भाव चलित, दशमांश और अधिक") },
                  { t: t("मराठी + English", "Bilingual", "त्रिभाषीय"), d: t("संपूर्ण कुंडली, राशीफल, पंचांग — एका क्लिकवर भाषा बदला", "Full kundli, horoscope, panchang — switch language in one click", "सम्पूर्ण कुंडली, राशिफल, पंचांग — एक क्लिक में भाषा बदलें") },
                ].map((f, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: "#d4a843" }} />
                    <div>
                      <p className="text-sm font-bold" style={{ color: "#3d0c0c" }}>{f.t}</p>
                      <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "#6b5b3e" }}>{f.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          }
          rightContent={
            <div>
              <h3 className="text-base font-bold mb-5" style={{ color: "#8b2c2c" }}>{t("संपूर्ण धार्मिक सेवा", "Complete Spiritual Services", "सम्पूर्ण धार्मिक सेवाएँ")}</h3>
              <div className="space-y-4">
                {[
                  { t: t("१४+ यात्रा श्रेणी", "14+ Travel Categories", "१४+ यात्रा श्रेणियाँ"), d: t("ज्योतिर्लिंग, चार धाम, अष्टविनायक ते सानुकूल यात्रा", "Jyotirlinga, Char Dham, Ashtavinayak to custom pilgrimages", "ज्योतिर्लिंग, चार धाम, अष्टविनायक से कस्टम यात्रा तक") },
                  { t: t("५०+ मंदिर माहिती", "50+ Temple Info", "५०+ मंदिर जानकारी"), d: t("इतिहास, स्थान, वेळा, दर्शन माहिती — सर्व एकत्र", "History, location, timings, darshan info — all in one place", "इतिहास, स्थान, समय, दर्शन जानकारी — सब एक जगह") },
                  { t: t("पूजा व कर्मकांड", "Pooja & Rituals", "पूजा और कर्मकांड"), d: t("अनुभवी गुरुजींसह सर्व विधी — हवन, पूजा, लग्नविधी", "All rituals with experienced priests — Havan, Pooja, Wedding", "अनुभवी गुरुजियों के साथ सभी विधियाँ — हवन, पूजा, विवाह") },
                ].map((f, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" style={{ background: "#d4a843" }} />
                    <div>
                      <p className="text-sm font-bold" style={{ color: "#3d0c0c" }}>{f.t}</p>
                      <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "#6b5b3e" }}>{f.d}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 text-center" style={{ borderTop: "1px dashed rgba(212,168,67,0.15)" }}>
                <Link href={`/${lang}/blog`} className="text-sm font-semibold px-6 py-2 rounded-full inline-block"
                  style={{ border: "1px solid rgba(212,168,67,0.2)", color: "#3d0c0c" }}>
                  {t("दैनिक लेख वाचा →", "Read Daily Blog →", "दैनिक लेख पढ़ें →")}
                </Link>
              </div>
            </div>
          }
        />
      </section>

      {/* ══════ FINAL CTA ══════ */}
      <section className="py-20 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a0505, #3d0c0c, #5c1a1a, #3d0c0c)" }}>

        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Ccircle cx='30' cy='30' r='25' fill='none' stroke='%23d4a843' stroke-width='0.5'/%3E%3Ccircle cx='30' cy='30' r='15' fill='none' stroke='%23d4a843' stroke-width='0.5'/%3E%3C/svg%3E")`, backgroundSize: "60px 60px" }} />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(212,168,67,0.1) 0%, transparent 70%)" }} />

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative max-w-3xl mx-auto px-6 text-center">
          <div className="text-4xl mb-6" style={{ color: "#d4a843" }}>ॐ</div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {t("तुमचा आध्यात्मिक प्रवास सुरू करा", "Begin Your Spiritual Journey", "अपनी आध्यात्मिक यात्रा शुरू करें")}
          </h2>
          <p className="mb-8 text-lg leading-relaxed" style={{ color: "rgba(255,248,231,0.5)" }}>
            {t(
              "कुंडली बनवा, यात्रा नियोजन करा, पूजा बुक करा — सर्व एकाच ठिकाणी",
              "Generate Kundli, plan pilgrimages, book pooja — all in one place",
              "कुंडली बनाएँ, यात्रा की योजना बनाएँ, पूजा बुक करें — सब एक ही जगह"
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={`/${lang}/kundli`}
              className="px-10 py-4 rounded-full font-semibold text-base transition-all hover:-translate-y-0.5"
              style={{ background: "linear-gradient(135deg, #d4a843, #c49535)", color: "#1a0505", boxShadow: "0 8px 32px rgba(212,168,67,0.3)" }}>
              {t("कुंडली बनवा", "Generate Kundli", "कुंडली बनाएँ")}
            </Link>
            <Link href={`/${lang}/yatra`}
              className="px-10 py-4 rounded-full font-semibold text-base transition-all hover:-translate-y-0.5 hover:bg-white/5"
              style={{ border: "1px solid rgba(212,168,67,0.3)", color: "#d4a843" }}>
              {t("यात्रा पॅकेजेस", "Travel Packages", "यात्रा पैकेज")}
            </Link>
            <Link href={`/${lang}/contact`}
              className="px-10 py-4 rounded-full font-semibold text-base transition-all hover:-translate-y-0.5 hover:bg-white/5"
              style={{ border: "1px solid rgba(212,168,67,0.3)", color: "#d4a843" }}>
              {t("संपर्क करा", "Contact Us", "सम्पर्क करें")}
            </Link>
          </div>
        </motion.div>
      </section>

      </div>
    </>
  );
}
