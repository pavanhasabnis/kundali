"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/astrology/language-context";

interface RashiMeta {
  id: number;
  mr: string;
  en: string;
  hi: string;
  symbol: string;
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
  };
}

const SCENES = [
  { id: "hook", start: 0, end: 2.5 },
  { id: "rashi", start: 2.5, end: 5 },
  { id: "overall", start: 5, end: 8 },
  { id: "career", start: 8, end: 10.5 },
  { id: "lucky", start: 10.5, end: 12.5 },
  { id: "cta", start: 12.5, end: 15 },
];
const TOTAL = 15;

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
  const [data, setData] = useState<Prediction | null>(null);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [voiceOn, setVoiceOn] = useState(false);
  const [audioStatus, setAudioStatus] = useState<string>("idle");
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const spokenSceneRef = useRef<string>("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch(`/api/rashifal?rashi=${rashiId}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => setData(null));
  }, [rashiId]);

  useEffect(() => {
    if (!playing) return;
    startRef.current = performance.now() - time * 1000;
    const tick = (now: number) => {
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

  // Google TTS via proxy — works for Marathi, Hindi, English
  const speakText = (text: string) => {
    if (typeof window === "undefined" || !text) return;
    const ttsLang = lang === "en" ? "en" : lang === "hi" ? "hi" : "mr";
    const trimmed = text.slice(0, 200);
    const url = `/api/tts?text=${encodeURIComponent(trimmed)}&lang=${ttsLang}`;
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

    const overallT = lang === "en" ? data.prediction.overall.en : data.prediction.overall.mr;
    const careerT = lang === "en" ? data.prediction.career.en : data.prediction.career.mr;
    const rashiT = lang === "en" ? data.prediction.rashiEn : data.prediction.rashiMr;
    const luckyC = lang === "en" ? data.prediction.luckyColor.en : data.prediction.luckyColor.mr;
    const luckyN = data.prediction.luckyNumber;

    const script: Record<string, string> = {
      hook: lang === "en" ? "Today's Rashifal" : lang === "hi" ? "आज का राशिफल" : "आजचे राशीभविष्य",
      rashi: rashiT,
      overall: overallT,
      career: careerT,
      lucky:
        lang === "en"
          ? `Lucky color ${luckyC}, lucky number ${luckyN}`
          : lang === "hi"
            ? `शुभ रंग ${luckyC}, शुभ अंक ${luckyN}`
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
  const overall = data ? (lang === "en" ? data.prediction.overall.en : data.prediction.overall.mr) : "";
  const career = data ? (lang === "en" ? data.prediction.career.en : data.prediction.career.mr) : "";
  const luckyColor = data ? (lang === "en" ? data.prediction.luckyColor.en : data.prediction.luckyColor.mr) : "";
  const luckyNum = data?.prediction.luckyNumber ?? 7;
  const rating = data?.prediction.rating ?? 4;

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
              {r.symbol} {pick(r.mr, r.en, r.hi)}
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
              background:
                "radial-gradient(ellipse at 30% 20%, #5c1a1a 0%, #3d0c0c 40%, #1a0505 100%)",
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
                    {pick("आजचे", "Today's", "आज का")}
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
                  <div className="text-[#d4a843] text-[140px] leading-none">
                    {rashiMeta.symbol}
                  </div>
                  <div className="text-white text-4xl font-bold mt-2">{rashiName}</div>
                  <div className="flex gap-1 mt-4">
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
                Engine: <span className="font-mono">Google TTS (मराठी)</span>
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
                Served via <code>/api/tts</code> (Google Translate MP3). Real Marathi voice. Prod: swap to ElevenLabs for natural quality.
              </p>
            </div>

            <div className="bg-[#FFF8E7] rounded-xl border border-[#d4a843]/30 p-4 text-xs text-[#5c1a1a]/80 leading-relaxed">
              <div className="font-bold mb-1 text-[#3d0c0c]">Preview notes</div>
              <ul className="list-disc ml-4 space-y-1">
                <li>Data pulled live from <code>/api/rashifal?rashi={rashiId}</code></li>
                <li>This is HTML preview — final video renders via Remotion at 1080×1920, 30fps</li>
                <li>Add TTS voiceover (ElevenLabs Marathi) in prod pipeline</li>
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
