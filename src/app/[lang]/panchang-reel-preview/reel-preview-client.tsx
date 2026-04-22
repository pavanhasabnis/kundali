"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/astrology/language-context";
import { formatTimeMarathi } from "@/lib/astrology/time-format";
import { BACKGROUNDS, getWeekBackground } from "@/lib/reel-backgrounds";

interface Festival { name: string; nameMr: string; type: string; }
interface PanchangData {
  date: string; day: string; tithi: string; paksha: string;
  nakshatra: string; nakshatraEn: string; nakshatraLord: string;
  yoga: string; karana: string; rahuKaal: string; gulikaKaal: string; yamaganda: string;
  moonRashi: string; sunRashi: string;
  sunrise: string; sunset: string;
  festivals: Festival[];
}

// ─── Scene timeline (seconds) ───────────────────────────────────
// 3s prologue to trim via ffmpeg -ss 3; 30s content after.
const SCENES = [
  { id: "prologue",  start: 0,  end: 3 },
  { id: "hook",      start: 3,  end: 7 },
  { id: "nakshatra", start: 7,  end: 11 },
  { id: "shubh",     start: 11, end: 16 },
  { id: "rahu",      start: 16, end: 21 },
  { id: "disha",     start: 21, end: 25 },
  { id: "festival",  start: 25, end: 29 },
  { id: "tip",       start: 29, end: 33 },
  { id: "cta",       start: 33, end: 37 },
];
const TOTAL = 37;

// ─── Constants ──────────────────────────────────────────────────
const DISHA_SHOOL_MR = ["पश्चिम", "पूर्व", "उत्तर", "उत्तर", "दक्षिण", "पश्चिम", "पूर्व"];
const DISHA_SHOOL_EN = ["West", "East", "North", "North", "South", "West", "East"];
const WEEKDAY_MR = ["रविवार", "सोमवार", "मंगळवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];
const WEEKDAY_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const WEEKDAY_HI = ["रविवार", "सोमवार", "मंगलवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];

const RASHI_TIPS_MR: Record<string, string> = {
  "मेष": "लाल रंग परिधान करा", "वृषभ": "गायीला चारा द्या",
  "मिथुन": "हिरवे कपडे शुभ", "कर्क": "दुधाचा नैवेद्य अर्पण करा",
  "सिंह": "सूर्याला अर्घ्य द्या", "कन्या": "हिरव्या वस्तूचे दान",
  "तुला": "पांढरे फूल अर्पण करा", "वृश्चिक": "हनुमान चालीसा वाचा",
  "धनु": "पिवळे वस्त्र परिधान करा", "मकर": "तिळाचे दान करा",
  "कुंभ": "काळी वस्तू दान करा", "मीन": "विष्णू सहस्रनाम वाचा",
};

// ─── Utils ──────────────────────────────────────────────────────
function toDev(s: string | number) {
  const d = "०१२३४५६७८९";
  return String(s).replace(/\d/g, (c) => d[parseInt(c)]);
}
function hhmmToMin(s: string) { const [h, m] = s.split(":").map(Number); return h * 60 + m; }
function minToHHMM(t: number) {
  t = Math.round(t);
  const h = Math.floor(t / 60) % 24;
  const m = ((t % 60) + 60) % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
function abhijitRange(sunrise: string, sunset: string) {
  const noon = (hhmmToMin(sunrise) + hhmmToMin(sunset)) / 2;
  return `${minToHHMM(noon - 24)} - ${minToHHMM(noon + 24)}`;
}
// Parse "HH:MM" 24h or "HH:MM AM/PM" 12h → { h, m } 24h.
function parseTime(s: string): { h: number; m: number } {
  const trimmed = s.trim();
  const ampm = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (ampm) {
    let h = parseInt(ampm[1], 10);
    const m = parseInt(ampm[2], 10);
    const p = ampm[3].toUpperCase();
    if (p === "PM" && h !== 12) h += 12;
    if (p === "AM" && h === 12) h = 0;
    return { h, m };
  }
  const [hStr, mStr] = trimmed.split(":");
  return { h: parseInt(hStr, 10), m: parseInt(mStr, 10) };
}

function fmtTime(hhmm: string, lang: string): string {
  const { h, m } = parseTime(hhmm);
  if (Number.isNaN(h) || Number.isNaN(m)) return hhmm;
  if (lang === "mr") return formatTimeMarathi(h % 24, m, "mr");
  if (lang === "en") {
    const ampm = h >= 12 ? "PM" : "AM";
    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm}`;
  }
  return toDev(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
}
function fmtRange(r: string, lang: string) {
  const [a, b] = r.split(/\s*[-–]\s*/);
  return `${fmtTime(a, lang)} – ${fmtTime(b, lang)}`;
}

// ─── Decorative divider ─────────────────────────────────────────
function GoldDivider() {
  return (
    <div className="flex items-center gap-2 my-3">
      <div className="h-px w-10 bg-gradient-to-r from-transparent to-[#d4a843]/60" />
      <div className="w-1 h-1 rounded-full bg-[#d4a843]" />
      <div className="h-px w-10 bg-gradient-to-l from-transparent to-[#d4a843]/60" />
    </div>
  );
}

// ─── Scene stage component (the actual 360×640 reel frame) ──────
function ReelStage({
  panchang,
  lang,
  today,
  currentScene,
  stars,
  bg,
}: {
  panchang: PanchangData;
  lang: string;
  today: Date;
  currentScene: string;
  stars: { size: number; x: number; y: number; opacity: number; dur: number }[];
  bg: { gradient: string; starColor: string; starOpacity: number; accentGold: string };
}) {
  const weekday = lang === "mr" ? WEEKDAY_MR[today.getDay()] : lang === "hi" ? WEEKDAY_HI[today.getDay()] : WEEKDAY_EN[today.getDay()];
  const dd = lang === "en" ? today.getDate() : toDev(today.getDate());
  const disha = lang === "mr" ? DISHA_SHOOL_MR[today.getDay()] : DISHA_SHOOL_EN[today.getDay()];
  const tip = RASHI_TIPS_MR[panchang.moonRashi] || "मंत्र जाप करा";
  const festival = panchang.festivals?.[0];

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width: 360,
        height: 640,
        background: bg.gradient,
      }}
    >
      {/* Cosmic bg stars — twinkle via keyframe animation (opacity + scale).
          Inline opacity removed so keyframe isn't overridden at runtime. */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: Math.max(bg.starOpacity, 0.8) }}>
        {stars.map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: s.size + 1,
              height: s.size + 1,
              left: `${s.x}%`,
              top: `${s.y}%`,
              background: bg.starColor,
              boxShadow: `0 0 ${s.size * 2}px ${bg.starColor}`,
              animation: `panchang-twinkle ${s.dur}s ease-in-out infinite`,
              animationDelay: `${(i % 10) * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Brand top-left */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-1.5">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-[#3d0c0c] font-bold text-sm"
          style={{ background: "linear-gradient(135deg, #f5c543, #d4a843)" }}
        >
          भा
        </div>
        <span className="text-[#d4a843] text-xs font-semibold">भाग्यवेध</span>
      </div>

      <AnimatePresence mode="wait">
        {currentScene === "hook" && (
          <motion.div
            key="hook"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-10"
          >
            <div className="text-[#d4a843] text-[11px] tracking-[0.3em] uppercase">
              {lang === "mr" ? "आजचे पंचांग" : lang === "hi" ? "आज का पंचांग" : "Today's Panchang"}
            </div>
            <GoldDivider />
            <div className="text-3xl font-bold text-[#d4a843] tracking-wide mt-1">{weekday}</div>
            <div className="text-[110px] font-black text-white leading-none my-4 drop-shadow-[0_2px_16px_rgba(245,197,67,0.2)]">{dd}</div>
            <div className="text-2xl text-white/95 font-semibold">{panchang.tithi}</div>
            <div className="text-sm text-[#d4a843]/80 mt-1 tracking-wider">{panchang.paksha}</div>
          </motion.div>
        )}

        {currentScene === "nakshatra" && (
          <motion.div
            key="nakshatra"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.08 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-10"
          >
            <div className="text-[11px] text-[#d4a843] uppercase tracking-[0.3em]">
              {lang === "mr" ? "नक्षत्र" : "Nakshatra"}
            </div>
            <GoldDivider />
            <div className="text-5xl font-black text-white mt-2">{panchang.nakshatra}</div>
            <div className="text-sm text-[#d4a843]/70 mt-2 tracking-widest uppercase">{panchang.nakshatraEn}</div>
            <div className="h-px w-20 bg-[#d4a843]/30 my-8" />
            <div className="text-[11px] text-[#d4a843] uppercase tracking-[0.3em]">
              {lang === "mr" ? "चंद्र राशी" : "Moon Sign"}
            </div>
            <div className="text-4xl font-bold text-[#d4a843] mt-3">{panchang.moonRashi}</div>
          </motion.div>
        )}

        {currentScene === "shubh" && (
          <motion.div
            key="shubh"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-10"
          >
            <div className="text-[11px] text-emerald-300 uppercase tracking-[0.3em] font-semibold">
              {lang === "mr" ? "शुभ मुहूर्त" : "Auspicious Time"}
            </div>
            <GoldDivider />
            <div className="text-2xl text-white font-semibold mt-3">
              {lang === "mr" ? "अभिजित मुहूर्त" : "Abhijit Muhurat"}
            </div>
            <div className="text-[44px] font-black text-emerald-300 mt-6 leading-none tracking-tight">
              {fmtRange(abhijitRange(panchang.sunrise, panchang.sunset), lang)}
            </div>
            <div className="h-px w-16 bg-emerald-400/40 my-6" />
            <div className="text-sm text-white/70 max-w-[280px] leading-relaxed">
              {lang === "mr" ? "नवीन काम, प्रवास, खरेदीसाठी सर्वोत्तम" : "Best for new work, travel, purchases"}
            </div>
          </motion.div>
        )}

        {currentScene === "rahu" && (
          <motion.div
            key="rahu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-10"
          >
            <div className="text-[11px] text-red-300 uppercase tracking-[0.3em] font-semibold">
              {lang === "mr" ? "टाळा" : "Avoid"}
            </div>
            <GoldDivider />
            <div className="text-2xl text-white font-semibold mt-3">
              {lang === "mr" ? "राहू काळ" : "Rahu Kaal"}
            </div>
            <div className="text-[44px] font-black text-red-300 mt-6 leading-none tracking-tight">
              {fmtRange(panchang.rahuKaal, lang)}
            </div>
            <div className="h-px w-16 bg-red-400/40 my-6" />
            <div className="text-sm text-white/70 max-w-[280px] leading-relaxed">
              {lang === "mr" ? "या वेळेत नवीन कार्य सुरू करू नका" : "Don't start new work in this window"}
            </div>
          </motion.div>
        )}

        {currentScene === "disha" && (
          <motion.div
            key="disha"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.08 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-10"
          >
            <div className="text-[11px] text-[#d4a843] uppercase tracking-[0.3em]">
              {lang === "mr" ? "दिशाशूळ" : "Disha Shool"}
            </div>
            <GoldDivider />
            <div className="text-sm text-white/70 mt-4 max-w-[240px] leading-relaxed">
              {lang === "mr" ? "या दिशेला आज प्रवास टाळा" : "Avoid travel in this direction today"}
            </div>
            <div className="text-[72px] font-black text-[#d4a843] mt-6 tracking-wide leading-none">{disha}</div>
          </motion.div>
        )}

        {currentScene === "festival" && (
          <motion.div
            key="festival"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-10"
          >
            {festival ? (
              <>
                <div className="text-[11px] text-[#d4a843] uppercase tracking-[0.3em]">
                  {lang === "mr" ? "आजचा सण" : "Today's Festival"}
                </div>
                <GoldDivider />
                <div className="text-[40px] font-black text-[#d4a843] mt-3 leading-tight max-w-[300px] tracking-tight">
                  {lang === "mr" ? festival.nameMr : festival.name}
                </div>
              </>
            ) : (
              <>
                <div className="text-[11px] text-[#d4a843] uppercase tracking-[0.3em]">
                  {lang === "mr" ? "योग" : "Yoga"}
                </div>
                <GoldDivider />
                <div className="text-4xl font-black text-white mt-3">{panchang.yoga}</div>
                <div className="h-px w-16 bg-[#d4a843]/30 my-6" />
                <div className="text-[11px] text-[#d4a843] uppercase tracking-[0.3em]">
                  {lang === "mr" ? "करण" : "Karana"}
                </div>
                <div className="text-3xl font-bold text-[#d4a843] mt-3">{panchang.karana}</div>
              </>
            )}
          </motion.div>
        )}

        {currentScene === "tip" && (
          <motion.div
            key="tip"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-10"
          >
            <div className="text-[11px] text-[#d4a843] uppercase tracking-[0.3em]">
              {lang === "mr" ? "आजचा उपाय" : "Today's Remedy"}
            </div>
            <GoldDivider />
            <div className="text-sm text-white/70 mt-3 tracking-wider">
              {lang === "mr" ? `चंद्र राशी · ${panchang.moonRashi}` : `Moon · ${panchang.moonRashi}`}
            </div>
            <div className="text-[32px] font-black text-[#d4a843] mt-6 leading-tight max-w-[280px] tracking-tight">
              {tip}
            </div>
          </motion.div>
        )}

        {currentScene === "cta" && (
          <motion.div
            key="cta"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center z-10"
          >
            <div className="text-[11px] text-[#d4a843] uppercase tracking-[0.3em]">
              {lang === "mr" ? "अधिक जाणून घ्या" : "Know More"}
            </div>
            <GoldDivider />
            <div className="text-[36px] font-black text-white leading-tight mt-2">
              {lang === "mr" ? "संपूर्ण पंचांग" : "Full Panchang"}
            </div>
            <div className="text-lg text-[#d4a843]/85 mt-2 tracking-wide">
              {lang === "mr" ? "आपल्या शहरासाठी" : "For your city"}
            </div>
            <div
              className="mt-10 px-8 py-3.5 rounded-full text-[#3d0c0c] font-black text-xl tracking-wide"
              style={{ background: "linear-gradient(135deg, #f5c543, #d4a843)" }}
            >
              भाग्यवेध
            </div>
            <div className="mt-5 text-[10px] text-white/55 uppercase tracking-[0.3em]">
              {lang === "mr" ? "लिंक बायो मध्ये" : "Link in bio"}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main client ────────────────────────────────────────────────
export default function ReelPreviewClient() {
  const { lang } = useLang();
  const searchParams = useSearchParams();
  const isRaw = searchParams.get("raw") === "1";

  // Weekly-rotating cosmic theme — same mechanism rashifal video uses.
  // ?bg=<id> forces a specific theme; ?week=<n> picks Nth theme; else rotates by ISO week.
  const forcedBgId = searchParams.get("bg");
  const forcedWeek = searchParams.get("week");
  const bg = forcedBgId
    ? BACKGROUNDS.find((b) => b.id === forcedBgId) ?? getWeekBackground()
    : forcedWeek
      ? BACKGROUNDS[(Math.max(1, parseInt(forcedWeek, 10) || 1) - 1) % BACKGROUNDS.length]
      : getWeekBackground();

  const [panchang, setPanchang] = useState<PanchangData | null>(null);
  const [today, setToday] = useState<Date>(() => new Date());
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(true);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  const stars = useMemo(
    () =>
      Array.from({ length: 40 }, () => ({
        size: Math.random() * 3 + 1,
        x: Math.random() * 100,
        y: Math.random() * 100,
        opacity: Math.random() * 0.8 + 0.2,
        dur: 0.8 + Math.random() * 1.2,
      })),
    []
  );

  useEffect(() => {
    const now = new Date();
    setToday(now);
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    fetch(`/api/panchang?date=${dateStr}&lat=18.5204&lng=73.8567&tz=5.5`)
      .then(r => r.json())
      .then((d: PanchangData) => setPanchang(d))
      .catch(() => setPanchang(null));
  }, []);

  // ?wait=1 pauses the timeline until recorder calls window.__startPanchangReel().
  // Without ?wait, timeline auto-starts once panchang data loads.
  const waitForSignal = searchParams.get("wait") === "1";
  const [started, setStarted] = useState(!waitForSignal);

  useEffect(() => {
    if (!waitForSignal) return;
    (window as unknown as { __startPanchangReel?: () => void }).__startPanchangReel = () => setStarted(true);
    return () => {
      delete (window as unknown as { __startPanchangReel?: () => void }).__startPanchangReel;
    };
  }, [waitForSignal]);

  useEffect(() => {
    // Only start timeline AFTER panchang data is loaded AND start signal given.
    if (!playing || !panchang || !started) return;
    startRef.current = performance.now();
    setTime(0);
    const tick = (now: number) => {
      const t = (now - startRef.current) / 1000;
      if (t >= TOTAL) {
        setTime(TOTAL);
      } else {
        setTime(t);
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, panchang, started]);

  const currentScene = SCENES.find((s) => time >= s.start && time < s.end)?.id || "cta";

  const caption = useMemo(() => {
    if (!panchang) return "";
    const d = today;
    const weekday = lang === "mr" ? WEEKDAY_MR[d.getDay()] : WEEKDAY_EN[d.getDay()];
    const disha = lang === "mr" ? DISHA_SHOOL_MR[d.getDay()] : DISHA_SHOOL_EN[d.getDay()];
    const abhijit = fmtRange(abhijitRange(panchang.sunrise, panchang.sunset), lang);
    const rahu = fmtRange(panchang.rahuKaal, lang);
    if (lang === "mr") {
      return `${weekday} · ${panchang.tithi} · ${panchang.paksha}
🌙 ${panchang.nakshatra} नक्षत्र · चंद्र ${panchang.moonRashi}
✅ अभिजित मुहूर्त: ${abhijit}
❌ राहू काळ: ${rahu}
🧭 दिशाशूळ: ${disha} — उधर जाऊ नका

आपल्या शहराचे संपूर्ण पंचांग पहा → लिंक बायो मध्ये

#पंचांग #आजचेपंचांग #${WEEKDAY_MR[d.getDay()]} #मुहूर्त #राहूकाळ #bhagyavedh`;
    }
    return `${weekday} · ${panchang.tithi}
🌙 ${panchang.nakshatra} nakshatra · Moon in ${panchang.moonRashi}
✅ Abhijit Muhurat: ${abhijit}
❌ Rahu Kaal: ${rahu}
🧭 Disha Shool: ${disha} — avoid travel

Full panchang for your city → link in bio

#panchang #hindupanchang #${WEEKDAY_EN[d.getDay()].toLowerCase()} #muhurat #vedicastrology #bhagyavedh`;
  }, [panchang, lang, today]);

  // Plain <style> (not styled-jsx) guarantees global scope in dev-overlay-stripped
  // playwright recording. More dramatic twinkle (0→1) + transform scale so motion
  // is visible at reel capture quality.
  const twinkleStyle = (
    <style dangerouslySetInnerHTML={{ __html: `
      @keyframes panchang-twinkle {
        0%, 100% { opacity: 0; transform: scale(0.6); }
        50% { opacity: 1; transform: scale(1.2); }
      }
    ` }} />
  );

  if (!panchang) {
    if (isRaw) return <div style={{ width: 1080, height: 1920, background: "#000" }} />;
    return <div className="p-8 text-white/60">Loading...</div>;
  }

  // Raw mode: 1080×1920 zoom-3 — Playwright captures exactly this viewport.
  if (isRaw) {
    return (
      <div
        style={{
          width: 1080,
          height: 1920,
          margin: 0,
          padding: 0,
          overflow: "hidden",
          background: "#000",
        }}
      >
        {twinkleStyle}
        <div style={{ width: 360, height: 640, zoom: 3, position: "relative" }}>
          <ReelStage
            panchang={panchang}
            lang={lang}
            today={today}
            currentScene={currentScene}
            stars={stars}
            bg={bg}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-4 md:p-8">
      {twinkleStyle}
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-1">Panchang Reel Preview</h1>
        <p className="text-sm text-white/50 mb-6">
          9:16 · {today.toDateString()} · lang={lang} · {time.toFixed(1)}s / {TOTAL}s · {currentScene}
        </p>

        <div className="grid md:grid-cols-[auto_1fr] gap-8 items-start">
          <div className="flex flex-col items-center">
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-[6px] border-neutral-800">
              <ReelStage
                panchang={panchang}
                lang={lang}
                today={today}
                currentScene={currentScene}
                stars={stars}
                bg={bg}
              />
            </div>
            {/* timeline bar BELOW phone frame — dev only */}
            <div className="mt-3 flex gap-1 w-[320px]">
              {SCENES.slice(1).map((s) => (
                <div key={s.id} className="flex-1 h-[3px] rounded-full bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full bg-[#d4a843] transition-all"
                    style={{
                      width: `${Math.max(0, Math.min(1, (time - s.start) / (s.end - s.start))) * 100}%`,
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => { setTime(0); setPlaying(true); }}
                className="px-3 py-1.5 rounded bg-amber-500 text-black text-sm font-semibold"
              >▶ Restart</button>
              <button
                onClick={() => setPlaying(p => !p)}
                className="px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-sm"
              >{playing ? "Pause" : "Play"}</button>
            </div>
            <a
              href="?raw=1"
              target="_blank"
              className="mt-3 text-xs text-[#d4a843] underline"
            >Open raw 1080×1920 (for recorder) →</a>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl bg-neutral-900 border border-neutral-800 p-4">
              <div className="text-xs text-white/50 uppercase tracking-widest mb-2">Scenes</div>
              <div className="space-y-1">
                {SCENES.map(s => (
                  <div
                    key={s.id}
                    className={`text-xs font-mono px-2 py-1 rounded ${
                      currentScene === s.id ? "bg-amber-400/20 text-amber-300" : "text-white/50"
                    }`}
                  >{s.start}s – {s.end}s · {s.id}</div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-neutral-900 border border-neutral-800 p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs text-white/50 uppercase tracking-widest">Caption</div>
                <button
                  onClick={() => navigator.clipboard.writeText(caption)}
                  className="text-xs px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700"
                >Copy</button>
              </div>
              <pre className="text-xs text-white/80 whitespace-pre-wrap font-mono leading-relaxed">{caption}</pre>
            </div>

            <div className="rounded-xl bg-neutral-900 border border-neutral-800 p-4 text-xs text-white/70 leading-relaxed">
              <div className="text-white/50 uppercase tracking-widest mb-2">Record to MP4</div>
              <pre className="font-mono text-[11px] whitespace-pre-wrap">
npx tsx scripts/record-panchang-reel.ts
{"\n"}# outputs /tmp/reels/panchang-YYYY-MM-DD.webm
{"\n"}# convert to mp4:
{"\n"}ffmpeg -i panchang-*.webm -ss 3 -c:v libx264 -pix_fmt yuv420p -movflags +faststart panchang.mp4
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
