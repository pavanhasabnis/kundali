"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useLang } from "@/lib/astrology/language-context";

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

// ─── Open Book Section ───────────────────────────────────────
// Reusable component: each section displayed as an open patrika

function OpenBook({ leftContent, rightContent, dark, pageNum }: { leftContent: React.ReactNode; rightContent: React.ReactNode; dark?: boolean; pageNum?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const openAngle = useTransform(scrollYProgress, [0, 0.6], [70, 0]);
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
          {side === "left" ? "वेंकटेश ज्योतिष पत्रिका" : `॥ ${pageNum || "१"} ॥`}
        </p>
        <div className="flex-1 h-px" style={{ background: dividerBg }} />
      </div>
    </div>
  );

  // Each page opens outward from the center spine
  const leftOpen = useTransform(scrollYProgress, [0, 0.5], [85, 0]);
  const rightOpen = useTransform(scrollYProgress, [0, 0.5], [-85, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);

  return (
    <motion.div ref={ref} style={{ scale }} className="max-w-5xl mx-auto px-4">
      <div style={{ perspective: "1800px" }}>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left page — opens from right edge (spine) outward to the left */}
          <motion.div
            style={{ rotateY: leftOpen, transformOrigin: "right center" }}
            className="rounded-l-xl md:rounded-l-2xl overflow-hidden relative p-6 sm:p-8"
          >
            <div className="absolute inset-0" style={{ background: bg, border: `2px solid ${borderCol}`, borderRight: "none", borderRadius: "inherit" }} />
            <div className="absolute right-0 top-0 bottom-0 w-4 z-10" style={{ background: `linear-gradient(270deg, ${spineShadow}, transparent)` }} />
            <div className="absolute right-0 top-4 bottom-4 w-px z-10" style={{ background: borderCol }} />
            <motion.div style={{ opacity: contentOpacity }} className="relative z-10 flex flex-col h-full">
              {pageHeader}
              <div className="flex-1">{leftContent}</div>
              {pageFooter("left")}
            </motion.div>
          </motion.div>

          {/* Right page — opens from left edge (spine) outward to the right */}
          <motion.div
            style={{ rotateY: rightOpen, transformOrigin: "left center" }}
            className="rounded-r-xl md:rounded-r-2xl overflow-hidden relative p-6 sm:p-8"
          >
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

// ─── 3D OM Loader ────────────────────────────────────────────
function OmLoader({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: "#1a0505" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Rotating mandala rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute w-[300px] h-[300px] rounded-full"
          style={{ border: "1px solid rgba(212,168,67,0.08)" }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute w-[220px] h-[220px] rounded-full"
          style={{ border: "1px solid rgba(212,168,67,0.06)" }}
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute w-[140px] h-[140px] rounded-full"
          style={{ border: "1px solid rgba(212,168,67,0.1)" }}
        />
      </div>

      {/* Golden glow behind OM */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], opacity: [0, 0.4, 0.2] }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute w-[200px] h-[200px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(212,168,67,0.3) 0%, transparent 70%)" }}
      />

      {/* 3D OM Symbol */}
      <motion.div
        initial={{ scale: 0.3, rotateY: -90, rotateX: 20, opacity: 0 }}
        animate={{ scale: 1, rotateY: 0, rotateX: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        style={{ perspective: "800px", transformStyle: "preserve-3d" }}
      >
        <motion.div
          animate={{ rotateY: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-8xl sm:text-9xl font-bold select-none"
          style={{
            color: "#d4a843",
            textShadow: "0 0 40px rgba(212,168,67,0.4), 0 0 80px rgba(212,168,67,0.2), 0 4px 20px rgba(0,0,0,0.5)",
            transformStyle: "preserve-3d",
          }}
        >
          ॐ
        </motion.div>
      </motion.div>

      {/* Brand text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="mt-6 text-center"
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 60 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="h-px mx-auto mb-4"
          style={{ background: "linear-gradient(90deg, transparent, #d4a843, transparent)" }}
        />
        <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: "#d4a843" }}>
          वेंकटेश ज्योतिष
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="text-xs mt-2 tracking-[0.2em] uppercase"
          style={{ color: "rgba(212,168,67,0.3)" }}
        >
          Vedic Astrology
        </motion.p>
      </motion.div>

      {/* Loading dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="mt-8 flex gap-1.5"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#d4a843" }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

export default function AstrologyHome() {
  const { t, lang } = useLang();
  const [showLoader, setShowLoader] = useState(true);

  return (
    <>
      {/* 3D OM Loader */}
      <AnimatePresence>
        {showLoader && <OmLoader onComplete={() => setShowLoader(false)} />}
      </AnimatePresence>

      <div style={{ background: "#1a0505" }}>

      {/* ══════ HERO ══════ */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden -mt-8"
        style={{ background: "linear-gradient(135deg, #1a0505 0%, #3d0c0c 30%, #5c1a1a 60%, #2a0808 100%)" }}>

        {/* Mandala pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Ccircle cx='40' cy='40' r='35' fill='none' stroke='%23d4a843' stroke-width='0.5'/%3E%3Ccircle cx='40' cy='40' r='25' fill='none' stroke='%23d4a843' stroke-width='0.5'/%3E%3Ccircle cx='40' cy='40' r='15' fill='none' stroke='%23d4a843' stroke-width='0.5'/%3E%3Cline x1='40' y1='5' x2='40' y2='75' stroke='%23d4a843' stroke-width='0.3'/%3E%3Cline x1='5' y1='40' x2='75' y2='40' stroke='%23d4a843' stroke-width='0.3'/%3E%3C/svg%3E")`, backgroundSize: "80px 80px" }} />

        {/* Warm glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(212,168,67,0.15) 0%, transparent 70%)" }} />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-6 text-center py-10">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>

            {/* OM symbol */}
            <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl mb-4" style={{ color: "#d4a843" }}>
              ॐ
            </motion.div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-8"
              style={{ background: "rgba(212,168,67,0.1)", border: "1px solid rgba(212,168,67,0.25)" }}>
              <span className="text-sm font-medium" style={{ color: "#d4a843" }}>
                {t("श्री गणेशाय नमः | अचूक वैदिक ज्योतिष", "Shri Ganeshay Namah | Accurate Vedic Astrology")}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 leading-tight">
              <span style={{ background: "linear-gradient(135deg, #f0c040, #d4a843, #c49535)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {t("वेंकटेश", "Venkatesh")}
              </span>
              <br />
              <span className="text-white/90 text-4xl sm:text-5xl md:text-6xl">
                {t("ज्योतिष", "Astrology")}
              </span>
            </h1>

            <p className="text-base sm:text-lg mb-3 max-w-2xl mx-auto leading-relaxed" style={{ color: "rgba(255,248,231,0.6)" }}>
              {t(
                "प्राचीन वैदिक ज्ञानावर आधारित अचूक कुंडली, राशीफल, गुण मिलान आणि पंचांग",
                "Accurate Kundli, Horoscope, Matching & Panchang based on ancient Vedic wisdom"
              )}
            </p>

            <p className="text-sm mb-6" style={{ color: "rgba(212,168,67,0.4)" }}>
              {t("मराठी व इंग्रजी | व्यावसायिक दर्जाची अचूकता", "Marathi & English | Professional-grade accuracy")}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Link href="/kundli"
                className="px-10 py-4 rounded-full font-semibold text-base transition-all hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #d4a843, #c49535)", color: "#1a0505", boxShadow: "0 8px 32px rgba(212,168,67,0.3)" }}>
                {t("कुंडली बनवा", "Generate Kundli")}
              </Link>
              <Link href="/rashifal"
                className="px-10 py-4 rounded-full font-semibold text-base transition-all hover:-translate-y-0.5 hover:bg-white/5"
                style={{ border: "1px solid rgba(212,168,67,0.3)", color: "#d4a843" }}>
                {t("आजचे राशीफल", "Today's Horoscope")}
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-6 max-w-xl mx-auto">
              {[
                { v: 9, l: t("ग्रह", "Planets") },
                { v: 27, l: t("नक्षत्र", "Nakshatras") },
                { v: 12, l: t("भाव", "Houses") },
                { v: 170, l: t("ठिकाणे", "Places") },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold" style={{ color: "#d4a843" }}><Counter target={s.v} />+</div>
                  <div className="text-[10px] mt-1 uppercase tracking-widest" style={{ color: "rgba(212,168,67,0.35)" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Gold border bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, #d4a843, transparent)" }} />
      </section>

      {/* ══════ BOOK: SERVICES ══════ */}
      <section className="py-16" style={{ background: "linear-gradient(180deg, #1a0505, #2a0808)" }}>
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "rgba(212,168,67,0.4)" }}>{t("पृष्ठ १", "Page 1")}</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">{t("आमच्या ज्योतिष सेवा", "Our Astrology Services")}</h2>
          <div className="w-16 h-0.5 mx-auto mt-3" style={{ background: "linear-gradient(90deg, transparent, #d4a843, transparent)" }} />
        </div>
        <OpenBook pageNum="१"
          leftContent={
            <div>
              <h3 className="text-lg font-bold mb-4" style={{ color: "#3d0c0c" }}>{t("मोफत सेवा", "Free Services")}</h3>
              <div className="space-y-3">
                {[
                  { sym: "☉", title: t("कुंडली निर्मिती", "Kundli Generation"), desc: t("९ चार्ट, ग्रह बल, योग, दोष, दशा, उपाय", "9 charts, strength, yogas, doshas, dasha, remedies"), href: "/kundli" },
                  { sym: "☯", title: t("गुण मिलान", "Kundli Matching"), desc: t("अष्टकूट ३६ गुण मिलान", "Ashtakoot 36 Guna Milan"), href: "/matching" },
                  { sym: "☽", title: t("दैनिक पंचांग", "Daily Panchang"), desc: t("तिथी, नक्षत्र, योग, करण, राहुकाळ", "Tithi, Nakshatra, Yoga, Karana, Rahu Kaal"), href: "/panchang" },
                  { sym: "✦", title: t("राशीफल", "Daily Horoscope"), desc: t("वास्तविक गोचरावर आधारित भविष्य", "Predictions based on real transits"), href: "/rashifal" },
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
              <h3 className="text-lg font-bold mb-4" style={{ color: "#3d0c0c" }}>{t("अधिक सेवा", "More Services")}</h3>
              <div className="space-y-3">
                {[
                  { sym: "⊛", title: t("वैदिक दिनदर्शिका", "Vedic Calendar"), desc: t("सण, मुहूर्त, शुभ-अशुभ दिवस", "Festivals, muhurat, auspicious days"), href: "/calendar" },
                  { sym: "⌂", title: t("मुहूर्त शोधक", "Muhurat Finder"), desc: t("वास्तुशांती, गृहप्रवेश, विवाह मुहूर्त शोधा", "Find Vastushanti, Gruhapravesh, Vivah muhurat"), href: "/muhurat" },
                  { sym: "♄", title: t("ग्रह स्थिती (Live)", "Planet Positions (Live)"), desc: t("सध्याची वास्तविक ग्रह स्थिती — दर मिनिटाला अपडेट", "Real-time planet positions — updates every minute"), href: "/graha-sthiti" },
                  { sym: "₹", title: t("ज्योतिष सल्ला सेवा", "Consultation Services"), desc: t("अनुभवी ज्योतिषांकडून वैयक्तिक सल्ला", "Personal consultation by experienced astrologers"), href: "/consultation" },
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

      {/* ══════ BOOK: ZODIAC ══════ */}
      <section className="py-16" style={{ background: "#1a0505" }}>
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "rgba(212,168,67,0.4)" }}>{t("पृष्ठ २", "Page 2")}</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">{t("१२ राशी — राशीचक्र", "12 Zodiac Signs")}</h2>
          <div className="w-16 h-0.5 mx-auto mt-3" style={{ background: "linear-gradient(90deg, transparent, #d4a843, transparent)" }} />
        </div>
        <OpenBook dark pageNum="२"
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
          <Link href="/rashifal" className="text-sm font-semibold px-8 py-3 rounded-full inline-block"
            style={{ border: "1px solid rgba(212,168,67,0.3)", color: "#d4a843" }}>
            {t("आजचे राशीफल पहा →", "Check Today's Horoscope →")}
          </Link>
        </div>
      </section>

      {/* ══════ BOOK: FEATURES ══════ */}
      <section className="py-16" style={{ background: "linear-gradient(180deg, #2a0808, #1a0505)" }}>
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "rgba(212,168,67,0.4)" }}>{t("पृष्ठ ३", "Page 3")}</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">{t("आम्ही वेगळे का?", "What Makes Us Different?")}</h2>
          <div className="w-16 h-0.5 mx-auto mt-3" style={{ background: "linear-gradient(90deg, transparent, #d4a843, transparent)" }} />
        </div>
        <OpenBook pageNum="३"
          leftContent={
            <div>
              <h3 className="text-base font-bold mb-5" style={{ color: "#8b2c2c" }}>{t("गणना आणि चार्ट", "Calculations & Charts")}</h3>
              <div className="space-y-4">
                {[
                  { t: t("वास्तविक ग्रह गणना", "Real Planetary Calculations"), d: t("९ ग्रहांची अचूक स्थिती — लाहिरी अयनांश. हार्डकोडेड नाही.", "Accurate positions of 9 planets — Lahiri Ayanamsa. Not hardcoded.") },
                  { t: t("९ कुंडली चार्ट", "9 Kundli Charts"), d: t("लग्न, चंद्र, नवमांश, भाव चलित, दशमांश, सप्तांश, द्वादशांश, षोडशांश, त्रिंशांश", "Lagna, Chandra, Navamsha, Bhav Chalit, D10, D7, D12, D16, D30") },
                  { t: t("गोचर राशीफल", "Transit Horoscope"), d: t("फलदीपिकानुसार गोचर नियम — वास्तविक ग्रह स्थिती", "Phaladeepika gochar rules — real planet positions") },
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
              <h3 className="text-base font-bold mb-5" style={{ color: "#8b2c2c" }}>{t("उपाय आणि सुविधा", "Remedies & Features")}</h3>
              <div className="space-y-4">
                {[
                  { t: t("वैयक्तिक उपाय", "Personalized Remedies"), d: t("दुर्बल ग्रहानुसार — देवता पूजा, रत्न, मंत्र, दान", "Per weak planets — deity worship, gemstones, mantras, donations") },
                  { t: t("मराठी + English", "Bilingual"), d: t("संपूर्ण कुंडली, राशीफल, पंचांग — एका क्लिकवर भाषा बदला", "Full kundli, horoscope, panchang — switch language in one click") },
                  { t: t("१७०+ ठिकाणे", "170+ Places"), d: t("कोल्हापूर, सांगली, सातारा, पुणे, मुंबई, नाशिक, विदर्भ — शहरे ते गावे", "Kolhapur, Sangli, Satara, Pune, Mumbai, Nashik, Vidarbha — cities to villages") },
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
              <div className="mt-5 pt-4 text-center" style={{ borderTop: "1px dashed rgba(212,168,67,0.15)" }}>
                <Link href="/kundli" className="text-sm font-semibold px-8 py-2.5 rounded-full inline-block"
                  style={{ background: "linear-gradient(135deg, #d4a843, #c49535)", color: "#1a0505" }}>
                  {t("कुंडली बनवा →", "Create Kundli →")}
                </Link>
              </div>
            </div>
          }
        />
      </section>

      {/* ══════ CTA ══════ */}
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
            {t("तुमची कुंडली आत्ताच बनवा", "Generate Your Kundli Now")}
          </h2>
          <p className="mb-8 text-lg leading-relaxed" style={{ color: "rgba(255,248,231,0.5)" }}>
            {t("ग्रह स्थिती, योग, दोष, भविष्यकथन आणि उपाय — सर्व एकाच ठिकाणी", "Planet positions, Yogas, Doshas, Predictions & Remedies — all in one place")}
          </p>
          <Link href="/kundli"
            className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-semibold text-base transition-all hover:-translate-y-0.5"
            style={{ background: "linear-gradient(135deg, #d4a843, #c49535)", color: "#1a0505", boxShadow: "0 8px 32px rgba(212,168,67,0.3)" }}>
            {t("आता सुरू करा", "Get Started Now")} →
          </Link>
        </motion.div>
      </section>


    </div>
    </>
  );
}
