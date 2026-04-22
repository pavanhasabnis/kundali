"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/astrology/language-context";
import { getCuratedPrediction } from "@/lib/curated-rashifal";
import { BACKGROUNDS, getWeekBackground } from "@/lib/reel-backgrounds";

interface RashiMeta {
  id: number;
  mr: string;
  en: string;
  hi: string;
  symbol: string;   // unicode emoji fallback
  icon: string;     // SVG path for site-consistent branding
}

interface Prediction {
  date: string;
  prediction: {
    rashiMr: string;
    rashiEn: string;
    overall: { mr: string; en: string };
    career: { mr: string; en: string };
    love: { mr: string; en: string };
    health: { mr: string; en: string };
    advice: { mr: string; en: string };
    rating: number;
    luckyColor: { mr: string; en: string };
    luckyNumber: number;
    narrative?: { mr: string; en: string };
  };
}

// Scene timing. hook + rashi = 2s, overall/career = 8s, love/health/advice/lucky = 4s, cta = 1s. Total 37s.
const SCENES = [
  { id: "hook",     start: 0,    end: 2 },
  { id: "rashi",    start: 2,    end: 4 },
  { id: "overall",  start: 4,    end: 12 },
  { id: "career",   start: 12,   end: 20 },
  { id: "love",     start: 20,   end: 24 },
  { id: "health",   start: 24,   end: 28 },
  { id: "advice",   start: 28,   end: 32 },
  { id: "lucky",    start: 32,   end: 36 },
  { id: "cta",      start: 36,   end: 37 },
];
const TOTAL = 37;

export default function VideoPreviewClient({
  rashiId,
  rashiMeta,
  rashiList,
}: {
  rashiId: number;
  rashiMeta: RashiMeta;
  rashiList: RashiMeta[];
}) {
  const { lang } = useLang();
  const searchParams = useSearchParams();
  // ?raw=1 strips all preview chrome (navbar, rashi pills, controls panel)
  // so the Playwright recorder captures only the 360×640 reel frame. Used
  // by scripts/record-reels.ts for auto-generating daily Instagram reels.
  const isRaw = searchParams.get("raw") === "1";
  // Weekly background — auto rotates by ISO week across 52 themes.
  // ?bg=<id> forces a theme by id. ?week=<n> picks theme at (week-1) % 52.
  // bg wins over week when both present.
  const forcedBgId = searchParams.get("bg");
  const forcedWeek = searchParams.get("week");
  // ?date=YYYY-MM-DD or ?date=tomorrow forwards to API. resolvedDate = passed
  // date. isFutureDate = only true when the date is strictly after today IST
  // (drives "उद्याचे/Tomorrow's" label + curated-override bypass). A date that
  // equals today stays "आजचे" and uses LLM/curated like any normal today run.
  const dateParam = searchParams.get("date");
  const resolvedDate = dateParam === "tomorrow"
    ? new Date(Date.now() + 5.5 * 3600 * 1000 + 86400 * 1000).toISOString().slice(0, 10)
    : dateParam;
  const todayIST = new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 10);
  const isFutureDate = !!resolvedDate && resolvedDate > todayIST;
  const bg = forcedBgId
    ? BACKGROUNDS.find((b) => b.id === forcedBgId) ?? getWeekBackground()
    : forcedWeek
      ? BACKGROUNDS[(Math.max(1, parseInt(forcedWeek, 10) || 1) - 1) % BACKGROUNDS.length]
      : getWeekBackground();
  const [data, setData] = useState<Prediction | null>(null);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [voiceOn, setVoiceOn] = useState(false);
  const [audioStatus, setAudioStatus] = useState<string>("idle");
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const spokenSceneRef = useRef<string>("");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // voiceOnRef mirrors voiceOn state — lets the RAF tick read it without
  // forcing the timeline effect to re-subscribe when voice toggles, which
  // breaks HMR's hook-size invariant.
  const voiceOnRef = useRef(false);

  useEffect(() => {
    const url = resolvedDate
      ? `/api/rashifal?rashi=${rashiId}&date=${resolvedDate}`
      : `/api/rashifal?rashi=${rashiId}`;
    fetch(url)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, [rashiId, resolvedDate]);

  // Icon is a pre-tinted SVG (/images/rashi-gold/*.svg) with hardcoded
  // gold fill. Plain <img> works — no async fetch, no state, no races.

  useEffect(() => {
    if (!playing) return;
    startRef.current = performance.now() - time * 1000;
    const tick = (now: number) => {
      // When voice is on, freeze the timeline while TTS is actively playing
      // so the narration can finish before the next scene animates in.
      // Resume ticking once audio ends or voice is toggled off.
      const a = audioRef.current;
      const audioActive = voiceOnRef.current && a && !a.paused && !a.ended;
      if (audioActive) {
        startRef.current = now - time * 1000;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const t = (now - startRef.current) / 1000;
      if (t >= TOTAL) {
        setTime(0);
        startRef.current = now;
      } else {
        setTime(t);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing]);

  const pick = (mr: string, en: string, hi?: string) =>
    lang === "en" ? en : lang === "hi" ? (hi ?? mr) : mr;

  const currentScene = SCENES.find((s) => time >= s.start && time < s.end)?.id || "cta";

  // Azure Neural TTS via /api/tts — mr-IN-AarohiNeural / hi-IN-SwaraNeural
  // / en-IN-NeerjaNeural. Google Translate fallback if Azure creds missing.
  const speakText = (text: string) => {
    if (typeof window === "undefined" || !text) return;
    const ttsLang = lang === "en" ? "en" : lang === "hi" ? "hi" : "mr";
    // Allow full sentences for the new Azure endpoint (caps at 600 chars).
    const trimmed = text.slice(0, 600);
    // Version the URL so the Azure swap invalidates any Google-era cache.
    const url = `/api/tts?text=${encodeURIComponent(trimmed)}&lang=${ttsLang}&v=el1`;
    if (!audioRef.current) audioRef.current = new Audio();
    audioRef.current.pause();
    audioRef.current.src = url;
    audioRef.current.volume = 1;
    audioRef.current
      .play()
      .then(() => setAudioStatus("playing"))
      .catch((e) => {
        console.warn("audio play failed:", e);
        setAudioStatus("blocked — click Test");
      });
  };

  const handleVoiceToggle = () => {
    const next = !voiceOn;
    setVoiceOn(next);
    voiceOnRef.current = next;
    if (next) {
      const test = lang === "en" ? "Voice enabled" : lang === "hi" ? "आवाज़ चालू" : "आवाज सुरू";
      speakText(test);
      spokenSceneRef.current = "";
    } else {
      audioRef.current?.pause();
      setAudioStatus("off");
    }
  };

  useEffect(() => {
    if (!voiceOn || !playing || !data) return;
    if (spokenSceneRef.current === currentScene + "-" + rashiId) return;
    spokenSceneRef.current = currentScene + "-" + rashiId;

    const pickField = (f: { mr: string; en: string }) =>
      lang === "en" ? f.en : f.mr;

    // Prefer curated prose so the voice matches the on-screen text. Falls
    // back to live API output for fields without curated copy (advice,
    // lucky, etc).
    // Client-side curated override disabled — API now returns DB-cached LLM
    // prose (generate-daily-rashifal.ts cron) which is authoritative.
    const curatedForSpeech = null as ReturnType<typeof getCuratedPrediction> | null;
    const narrativeRawT = data.prediction.narrative ? pickField(data.prediction.narrative) : "";
    const narrativeForDateT = isFutureDate
      ? narrativeRawT.replace(/आज/g, "उद्या").replace(/आजच्या/g, "उद्याच्या").replace(/Today's/g, "Tomorrow's").replace(/Today/g, "Tomorrow")
      : narrativeRawT;
    const narrParasT = narrativeForDateT.split(/\n{2,}/).map((s) => s.trim()).filter(Boolean);
    const overallT = curatedForSpeech ? pickField(curatedForSpeech.overall) : (narrParasT[0] || pickField(data.prediction.overall));
    const careerT  = curatedForSpeech ? pickField(curatedForSpeech.career)  : (narrParasT[1] || pickField(data.prediction.career));
    const loveT    = curatedForSpeech ? pickField(curatedForSpeech.love)    : (narrParasT[2] || pickField(data.prediction.love));
    const healthT  = curatedForSpeech ? pickField(curatedForSpeech.health)  : (narrParasT[3] || pickField(data.prediction.health));
    const adviceT = pickField(data.prediction.advice);
    const rashiT = lang === "en" ? data.prediction.rashiEn : data.prediction.rashiMr;
    const luckyC = pickField(data.prediction.luckyColor);
    const luckyN = data.prediction.luckyNumber;

    const script: Record<string, string> = {
      hook: isFutureDate
        ? (lang === "en" ? "Tomorrow's Rashifal" : lang === "hi" ? "कल का राशिफल" : "उद्याचे राशीभविष्य")
        : (lang === "en" ? "Today's Rashifal" : lang === "hi" ? "आज का राशिफल" : "आजचे राशीभविष्य"),
      rashi: rashiT,
      overall: overallT,
      career: careerT,
      love: loveT,
      health: healthT,
      advice: adviceT,
      lucky:
        lang === "en"
          ? `Lucky color ${luckyC}, lucky number ${luckyN}`
          : `शुभ रंग ${luckyC}, शुभ अंक ${luckyN}`,
      cta:
        lang === "en"
          ? "Read full prediction on bhaagyavedh dot com"
          : lang === "hi"
            ? "पूरा भविष्य पढ़ें भाग्यवेध डॉट कॉम पर"
            : "पूर्ण भविष्य भाग्यवेध डॉट कॉम वर पहा",
    };
    speakText(script[currentScene] || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScene, voiceOn, playing, data, rashiId, lang]);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const dateStr = data?.date || new Date().toISOString().slice(0, 10);
  const formatDate = (d: string) => {
    const [y, m, day] = d.split("-").map(Number);
    const monthsMr = ["जानेवारी","फेब्रुवारी","मार्च","एप्रिल","मे","जून","जुलै","ऑगस्ट","सप्टेंबर","ऑक्टोबर","नोव्हेंबर","डिसेंबर"];
    const monthsHi = ["जनवरी","फ़रवरी","मार्च","अप्रैल","मई","जून","जुलाई","अगस्त","सितम्बर","अक्टूबर","नवम्बर","दिसम्बर"];
    const monthsEn = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const months = lang === "en" ? monthsEn : lang === "hi" ? monthsHi : monthsMr;
    return `${day} ${months[m - 1]} ${y}`;
  };

  const rashiName = pick(rashiMeta.mr, rashiMeta.en, rashiMeta.hi);
  const pickField = (f?: { mr: string; en: string }) =>
    f ? (lang === "en" ? f.en : f.mr) : "";

  // Curated prose overrides the algorithmic text when available for this
  // rashi. Falls back to gochar `narrative` (flowing paragraph prose,
  // 4 paragraphs split by \n\n) when curated missing — matches curated
  // style. Lucky color/number + advice still come from API.
  // Client-side curated override disabled — API is source of truth.
  const curated = null as ReturnType<typeof getCuratedPrediction> | null;
  const narrativeRaw = data?.prediction.narrative ? pickField(data.prediction.narrative) : "";
  // When rendering tomorrow, swap "आज/Today" → "उद्या/Tomorrow" so voice+screen match the date.
  const narrativeForDate = isFutureDate
    ? narrativeRaw.replace(/आज/g, "उद्या").replace(/आजच्या/g, "उद्याच्या").replace(/Today's/g, "Tomorrow's").replace(/Today/g, "Tomorrow")
    : narrativeRaw;
  const narrativeParas = narrativeForDate.split(/\n{2,}/).map((s) => s.trim()).filter(Boolean);
  const [narrOverall, narrCareer, narrLove, narrHealth] = [0, 1, 2, 3].map((i) => narrativeParas[i] ?? "");
  const overall = curated ? pickField(curated.overall) : (narrOverall || pickField(data?.prediction.overall));
  const career = curated ? pickField(curated.career) : (narrCareer || pickField(data?.prediction.career));
  const love = curated ? pickField(curated.love) : (narrLove || pickField(data?.prediction.love));
  const health = curated ? pickField(curated.health) : (narrHealth || pickField(data?.prediction.health));
  const advice = pickField(data?.prediction.advice);
  const luckyColor = pickField(data?.prediction.luckyColor);
  const luckyNum = data?.prediction.luckyNumber ?? 7;
  const rating = data?.prediction.rating ?? 4;

  // Raw mode: render at 1080×1920 — same pixel size as Playwright's capture
  // viewport. We also CSS-scale the inner 360×640 layout up 3× so the text
  // sizes and icons look right at the output resolution. This is simpler
  // than re-laying the page out for 1080×1920 and keeps all the scene JSX
  // identical between preview and recording modes.
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
        {/* zoom re-renders each element at the target resolution rather
         *  than rasterizing-then-upscaling like `transform: scale`. Result:
         *  gradient, stars, text, SVG icon all crisp at 1080×1920. Chromium
         *  supports zoom natively; Playwright uses Chromium, so this works
         *  for the recorder even though zoom is a non-standard CSS property. */}
        <div
          style={{
            width: 360,
            height: 640,
            zoom: 3,
            position: "relative",
          }}
        >
        <div
          className="relative rounded-none overflow-hidden"
          style={{
            width: 360,
            height: 640,
            background: bg.gradient,
          }}
        >
          {/* Cosmic bg stars */}
          <div className="absolute inset-0 opacity-40">
            {[...Array(40)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full"
                style={{
                  width: Math.random() * 3 + 1,
                  height: Math.random() * 3 + 1,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.8 + 0.2,
                  animation: `twinkle ${2 + Math.random() * 3}s infinite`,
                }}
              />
            ))}
          </div>

          {/* Brand top-left */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[#3d0c0c] font-bold text-sm"
              style={{ background: "linear-gradient(135deg, #f5c543, #d4a843)" }}
            >
              भा
            </div>
            <span className="text-[#d4a843] text-xs font-semibold">भाग्यवेध</span>
          </div>

          {/* Scene content — reuse same AnimatePresence structure */}
          <RawScenes
            currentScene={currentScene}
            rashiMeta={rashiMeta}
            rashiName={rashiName}
            rating={rating}
            overall={overall}
            career={career}
            love={love}
            health={health}
            advice={advice}
            luckyColor={luckyColor}
            luckyNum={luckyNum}
            dateStr={dateStr}
            formatDate={formatDate}
            pick={pick}
            isTomorrow={isFutureDate}
          />

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
            <div
              className="h-full bg-[#d4a843] transition-all"
              style={{ width: `${(time / TOTAL) * 100}%` }}
            />
          </div>

          <style jsx global>{`
            @keyframes twinkle {
              0%, 100% { opacity: 0.3; }
              50% { opacity: 0.9; }
            }
          `}</style>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-[#3d0c0c]">
              Rashifal Video Preview — {rashiName}
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              1080×1920 (9:16 Reel/Short) — 15s loop — {lang.toUpperCase()}
            </p>
          </div>
          <Link href="/rashifal" className="text-xs text-[#d4a843] hover:underline">
            ← back to rashifal
          </Link>
        </div>

        {/* Rashi selector */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {rashiList.map((r) => (
            <Link
              key={r.id}
              href={`/preview/rashifal-video/${r.id}`}
              className={`px-2.5 py-1 rounded-full text-xs border ${
                r.id === rashiId
                  ? "bg-[#3d0c0c] text-white border-[#3d0c0c]"
                  : "bg-white text-stone-600 border-stone-200 hover:border-[#d4a843]"
              }`}
            >
              {/* Keep emoji in the nav-pill for compactness; real SVG only on the reel itself. */}
              <span className="mr-1">{r.symbol}</span>
              {pick(r.mr, r.en, r.hi)}
            </Link>
          ))}
        </div>

        <div className="grid md:grid-cols-[auto_1fr] gap-6">
          {/* Video frame — 9:16 */}
          <div
            className="relative mx-auto rounded-3xl overflow-hidden shadow-2xl"
            style={{
              width: 360,
              height: 640,
              background: bg.gradient,
            }}
          >
            {/* Cosmic bg stars */}
            <div className="absolute inset-0 opacity-40">
              {[...Array(40)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bg-white rounded-full"
                  style={{
                    width: Math.random() * 3 + 1,
                    height: Math.random() * 3 + 1,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.8 + 0.2,
                    animation: `twinkle ${2 + Math.random() * 3}s infinite`,
                  }}
                />
              ))}
            </div>

            {/* Brand top-left */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#3d0c0c] font-bold text-sm"
                style={{
                  background: "linear-gradient(135deg, #f5c543, #d4a843)",
                }}
              >
                भा
              </div>
              <span className="text-[#d4a843] text-xs font-semibold">भाग्यवेध</span>
            </div>

            {/* Scene content */}
            <AnimatePresence mode="wait">
              {currentScene === "hook" && (
                <motion.div
                  key="hook"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center z-10"
                >
                  <div className="text-[#d4a843] text-xs tracking-widest mb-2 uppercase">
                    {isFutureDate
                      ? pick("उद्याचे", "Tomorrow's", "कल का")
                      : pick("आजचे", "Today's", "आज का")}
                  </div>
                  <div className="text-white text-3xl font-bold mb-2">
                    {pick("राशीभविष्य", "Rashifal", "राशिफल")}
                  </div>
                  <div className="text-[#d4a843]/80 text-base mt-3">
                    {formatDate(dateStr)}
                  </div>
                </motion.div>
              )}

              {currentScene === "rashi" && (
                <motion.div
                  key="rashi"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 flex flex-col items-center justify-center z-10"
                >
                  {/* Inline-SVG render so the site-standard icons paint in
                      brand gold. <img src> drops CSS context (currentColor
                      resolves to black-on-black). CSS mask worked in some
                      browsers but had layout issues. Fetch + inline wins. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={rashiMeta.icon}
                    alt={rashiName}
                    width={140}
                    height={140}
                    style={{
                      width: 140,
                      height: 140,
                      objectFit: "contain",
                      filter: "drop-shadow(0 0 14px rgba(245,197,67,0.55))",
                    }}
                  />
                  <div className="text-white text-4xl font-bold mt-4">{rashiName}</div>
                  <div className="flex gap-1 mt-3">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={i < rating ? "text-[#d4a843]" : "text-white/20"}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentScene === "overall" && (
                <motion.div
                  key="overall"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 flex flex-col justify-center px-8 z-10"
                >
                  <div className="text-[#d4a843] text-xs tracking-widest mb-3 uppercase">
                    {pick("एकंदर", "Overall", "कुल मिलाकर")}
                  </div>
                  <div className="text-white text-lg leading-relaxed font-medium">
                    {overall || "…"}
                  </div>
                </motion.div>
              )}

              {currentScene === "career" && (
                <motion.div
                  key="career"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 flex flex-col justify-center px-8 z-10"
                >
                  <div className="text-[#d4a843] text-xs tracking-widest mb-3 uppercase">
                    {pick("करिअर", "Career", "करियर")}
                  </div>
                  <div className="text-white text-lg leading-relaxed font-medium">
                    {career || "…"}
                  </div>
                </motion.div>
              )}

              {currentScene === "love" && (
                <motion.div
                  key="love"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 flex flex-col justify-center px-8 z-10"
                >
                  <div className="text-[#d4a843] text-xs tracking-widest mb-3 uppercase">
                    {pick("प्रेम / कुटुंब", "Love / Family", "प्रेम / परिवार")}
                  </div>
                  <div className="text-white text-base leading-relaxed font-medium">
                    {love || "…"}
                  </div>
                </motion.div>
              )}

              {currentScene === "health" && (
                <motion.div
                  key="health"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 flex flex-col justify-center px-8 z-10"
                >
                  <div className="text-[#d4a843] text-xs tracking-widest mb-3 uppercase">
                    {pick("आरोग्य", "Health", "स्वास्थ्य")}
                  </div>
                  <div className="text-white text-base leading-relaxed font-medium">
                    {health || "…"}
                  </div>
                </motion.div>
              )}

              {currentScene === "advice" && (
                <motion.div
                  key="advice"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 flex flex-col justify-center px-8 z-10"
                >
                  <div className="text-[#d4a843] text-xs tracking-widest mb-3 uppercase">
                    {pick("आजचा सल्ला", "Today's Advice", "आज की सलाह")}
                  </div>
                  <div className="text-white text-lg leading-relaxed font-semibold">
                    {advice || "…"}
                  </div>
                </motion.div>
              )}

              {currentScene === "lucky" && (
                <motion.div
                  key="lucky"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 flex flex-col items-center justify-center px-8 z-10 gap-6"
                >
                  <div className="text-center">
                    <div className="text-[#d4a843] text-xs tracking-widest mb-2 uppercase">
                      {pick("शुभ रंग", "Lucky Color", "शुभ रंग")}
                    </div>
                    <div className="text-white text-2xl font-bold">{luckyColor}</div>
                  </div>
                  <div className="w-full h-px bg-white/10" />
                  <div className="text-center">
                    <div className="text-[#d4a843] text-xs tracking-widest mb-2 uppercase">
                      {pick("शुभ अंक", "Lucky Number", "शुभ अंक")}
                    </div>
                    <div className="text-white text-6xl font-bold">{luckyNum}</div>
                  </div>
                </motion.div>
              )}

              {currentScene === "cta" && (
                <motion.div
                  key="cta"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center z-10"
                >
                  <div className="text-white text-xl mb-4">
                    {pick("पूर्ण भविष्य पहा", "Read full prediction", "पूरा भविष्य पढ़ें")}
                  </div>
                  <div
                    className="px-6 py-3 rounded-full text-[#3d0c0c] font-bold text-sm"
                    style={{
                      background: "linear-gradient(135deg, #f5c543, #d4a843)",
                    }}
                  >
                    bhaagyavedh.com
                  </div>
                  <div className="text-[#d4a843]/60 text-xs mt-6">
                    @bhaagyavedh
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20">
              <div
                className="h-full bg-[#d4a843] transition-all"
                style={{ width: `${(time / TOTAL) * 100}%` }}
              />
            </div>
          </div>

          {/* Controls + script */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-[#3d0c0c]">
                  {time.toFixed(1)}s / {TOTAL}s
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPlaying(!playing)}
                    className="px-3 py-1.5 rounded-lg bg-[#3d0c0c] text-white text-xs font-medium"
                  >
                    {playing ? "⏸ Pause" : "▶ Play"}
                  </button>
                  <button
                    onClick={() => {
                      setTime(0);
                      startRef.current = performance.now();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-stone-200 text-stone-700 text-xs font-medium"
                  >
                    ↻ Restart
                  </button>
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={TOTAL}
                step={0.1}
                value={time}
                onChange={(e) => {
                  const t = parseFloat(e.target.value);
                  setTime(t);
                  startRef.current = performance.now() - t * 1000;
                }}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-[10px] text-stone-500">
                {SCENES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setTime(s.start);
                      startRef.current = performance.now() - s.start * 1000;
                    }}
                    className={`px-1.5 py-0.5 rounded ${
                      currentScene === s.id
                        ? "bg-[#d4a843] text-[#3d0c0c] font-bold"
                        : "hover:bg-stone-100"
                    }`}
                  >
                    {s.id}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <h3 className="text-sm font-bold text-[#3d0c0c] mb-3">Scene script</h3>
              <div className="space-y-2 text-xs">
                {SCENES.map((s) => (
                  <div
                    key={s.id}
                    className={`p-2 rounded ${
                      currentScene === s.id ? "bg-[#FFF8E7] border border-[#d4a843]/40" : "bg-stone-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="font-semibold text-[#5c1a1a]">{s.id}</span>
                      <span className="text-stone-400">
                        {s.start}s – {s.end}s
                      </span>
                    </div>
                    <div className="text-stone-600">
                      {s.id === "hook" && pick("आजचे राशीभविष्य + तारीख", "Today's Rashifal + date", "आज का राशिफल + तारीख")}
                      {s.id === "rashi" && `${rashiMeta.symbol} ${rashiName} + ${rating}★`}
                      {s.id === "overall" && (overall.slice(0, 80) + (overall.length > 80 ? "…" : ""))}
                      {s.id === "career" && (career.slice(0, 80) + (career.length > 80 ? "…" : ""))}
                      {s.id === "lucky" && `${luckyColor} · ${luckyNum}`}
                      {s.id === "cta" && pick("bhaagyavedh.com CTA", "bhaagyavedh.com CTA", "bhaagyavedh.com CTA")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-[#3d0c0c]">🎤 Voice-over</h3>
                <button
                  onClick={handleVoiceToggle}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                    voiceOn ? "bg-[#d4a843] text-[#3d0c0c]" : "bg-stone-200 text-stone-600"
                  }`}
                >
                  {voiceOn ? "🔊 ON" : "🔇 OFF"}
                </button>
              </div>
              <div className="text-xs text-stone-600 mb-2">
                Engine: <span className="font-mono">ElevenLabs · Multilingual v2</span>
              </div>
              <div className="text-xs text-stone-500 mb-2">
                Status: <span className="font-semibold text-[#5c1a1a]">{audioStatus}</span>
              </div>
              <button
                onClick={() => {
                  const test = lang === "en" ? "Hello, this is a test" : lang === "hi" ? "नमस्ते यह एक परीक्षण है" : "नमस्कार ही चाचणी आहे";
                  speakText(test);
                }}
                className="w-full text-xs bg-[#3d0c0c] text-white py-1.5 rounded-lg"
              >
                🔊 Test voice
              </button>
              <p className="text-[10px] text-stone-400 mt-2">
                Served via <code>/api/tts</code> → ElevenLabs Multilingual v2 · 44.1 kHz · 128 kbps MP3.
              </p>
            </div>

            <div className="bg-[#FFF8E7] rounded-xl border border-[#d4a843]/30 p-4 text-xs text-[#5c1a1a]/80 leading-relaxed">
              <div className="font-bold mb-1 text-[#3d0c0c]">Preview notes</div>
              <ul className="list-disc ml-4 space-y-1">
                <li>Data pulled live from <code>/api/rashifal?rashi={rashiId}</code></li>
                <li>This is HTML preview — final video renders via Remotion at 1080×1920, 30fps</li>
                <li>TTS voiceover: ElevenLabs Multilingual v2 — live</li>
                <li>Background audio: cosmic ambient loop</li>
                <li>Duration: 15s — fits IG Reels / YT Shorts / WhatsApp status</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ─── Scene renderer shared by the normal preview and raw mode.
 *     Kept simple: same scene structure, just passed in props.
 *     Duplicates some JSX logic from the main component for clarity. */
function RawScenes(props: {
  currentScene: string;
  rashiMeta: RashiMeta;
  rashiName: string;
  rating: number;
  overall: string;
  career: string;
  love: string;
  health: string;
  advice: string;
  luckyColor: string;
  luckyNum: number;
  dateStr: string;
  formatDate: (d: string) => string;
  pick: (mr: string, en: string, hi?: string) => string;
  isTomorrow?: boolean;
}) {
  const { currentScene, rashiMeta, rashiName, rating, overall, career, love, health, advice, luckyColor, luckyNum, dateStr, formatDate, pick, isTomorrow } = props;

  return (
    <AnimatePresence mode="wait">
      {currentScene === "hook" && (
        <motion.div
          key="hook"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center z-10"
        >
          <div className="text-[#d4a843] text-xs tracking-widest mb-2 uppercase">
            {isTomorrow
              ? pick("उद्याचे", "Tomorrow's", "कल का")
              : pick("आजचे", "Today's", "आज का")}
          </div>
          <div className="text-white text-3xl font-bold mb-2">
            {pick("राशीभविष्य", "Rashifal", "राशिफल")}
          </div>
          <div className="text-[#d4a843]/80 text-base mt-3">{formatDate(dateStr)}</div>
        </motion.div>
      )}

      {currentScene === "rashi" && (
        <motion.div
          key="rashi"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex flex-col items-center justify-center z-10"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={rashiMeta.icon}
            alt={rashiName}
            width={140}
            height={140}
            style={{
              width: 140,
              height: 140,
              objectFit: "contain",
              filter: "drop-shadow(0 0 14px rgba(245,197,67,0.55))",
            }}
          />
          <div className="text-white text-4xl font-bold mt-4">{rashiName}</div>
          <div className="flex gap-1 mt-3">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < rating ? "text-[#d4a843]" : "text-white/20"}>★</span>
            ))}
          </div>
        </motion.div>
      )}

      {currentScene === "overall" && (
        <motion.div
          key="overall"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 flex flex-col justify-center px-8 z-10"
        >
          <div className="text-[#d4a843] text-xs tracking-widest mb-3 uppercase">
            {pick("एकंदर", "Overall", "कुल मिलाकर")}
          </div>
          <div className="text-white text-lg leading-relaxed font-medium">{overall || "…"}</div>
        </motion.div>
      )}

      {currentScene === "career" && (
        <motion.div
          key="career"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 flex flex-col justify-center px-8 z-10"
        >
          <div className="text-[#d4a843] text-xs tracking-widest mb-3 uppercase">
            {pick("करिअर", "Career", "करियर")}
          </div>
          <div className="text-white text-lg leading-relaxed font-medium">{career || "…"}</div>
        </motion.div>
      )}

      {currentScene === "love" && (
        <motion.div
          key="love"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 flex flex-col justify-center px-8 z-10"
        >
          <div className="text-[#d4a843] text-xs tracking-widest mb-3 uppercase">
            {pick("प्रेम / कुटुंब", "Love / Family", "प्रेम / परिवार")}
          </div>
          <div className="text-white text-base leading-relaxed font-medium">{love || "…"}</div>
        </motion.div>
      )}

      {currentScene === "health" && (
        <motion.div
          key="health"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 flex flex-col justify-center px-8 z-10"
        >
          <div className="text-[#d4a843] text-xs tracking-widest mb-3 uppercase">
            {pick("आरोग्य", "Health", "स्वास्थ्य")}
          </div>
          <div className="text-white text-base leading-relaxed font-medium">{health || "…"}</div>
        </motion.div>
      )}

      {currentScene === "advice" && (
        <motion.div
          key="advice"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 flex flex-col justify-center px-8 z-10"
        >
          <div className="text-[#d4a843] text-xs tracking-widest mb-3 uppercase">
            {pick("आजचा सल्ला", "Today's Advice", "आज की सलाह")}
          </div>
          <div className="text-white text-lg leading-relaxed font-semibold">{advice || "…"}</div>
        </motion.div>
      )}

      {currentScene === "lucky" && (
        <motion.div
          key="lucky"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 flex flex-col items-center justify-center px-8 z-10 gap-6"
        >
          <div className="text-center">
            <div className="text-[#d4a843] text-xs tracking-widest mb-2 uppercase">
              {pick("शुभ रंग", "Lucky Color", "शुभ रंग")}
            </div>
            <div className="text-white text-2xl font-bold">{luckyColor}</div>
          </div>
          <div className="w-full h-px bg-white/10" />
          <div className="text-center">
            <div className="text-[#d4a843] text-xs tracking-widest mb-2 uppercase">
              {pick("शुभ अंक", "Lucky Number", "शुभ अंक")}
            </div>
            <div className="text-white text-6xl font-bold">{luckyNum}</div>
          </div>
        </motion.div>
      )}

      {currentScene === "cta" && (
        <motion.div
          key="cta"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center z-10"
        >
          <div className="text-white text-xl mb-4">
            {pick("पूर्ण भविष्य पहा", "Read full prediction", "पूरा भविष्य पढ़ें")}
          </div>
          <div
            className="px-6 py-3 rounded-full text-[#3d0c0c] font-bold text-sm"
            style={{ background: "linear-gradient(135deg, #f5c543, #d4a843)" }}
          >
            bhaagyavedh.com
          </div>
          <div className="text-[#d4a843]/60 text-xs mt-6">@bhaagyavedh</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

