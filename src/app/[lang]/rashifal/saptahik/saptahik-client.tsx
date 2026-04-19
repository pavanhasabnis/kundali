"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useLang } from "@/lib/astrology/language-context";
import { RASHI_LIST } from "@/lib/rashi-data";
import { JsonLd, serviceSchema, breadcrumbSchema } from "@/components/json-ld";
import { ZodiacBadge } from "@/components/zodiac-badge";

const RASHIS = RASHI_LIST;

interface WeekEvent {
  date: string;
  type: "rashi-change" | "retrograde-start" | "retrograde-end" | "combust-start" | "combust-end";
  planet: string;
  planetMr: string;
  descriptionMr: string;
  descriptionEn: string;
}
interface Bilingual { mr: string; en: string }
interface PlanetPos {
  planet: string; planetMr: string;
  rashiMr: string; rashiEn: string;
  house: number;
  dignity: string; dignityMr: string;
  isRetrograde: boolean; isCombust: boolean;
}
interface WeeklyPrediction {
  rashiId: number;
  rashiMr: string;
  rashiEn: string;
  rating: number;
  bestDay: { date: string; rating: number };
  worstDay: { date: string; rating: number };
  summary: Bilingual;
  narrative: Bilingual;
  careerPoints: Bilingual[];
  lovePoints: Bilingual[];
  healthPoints: Bilingual[];
  advice: Bilingual;
  dailyRatings: { date: string; rating: number }[];
  luckyColor: Bilingual;
  luckyNumber: number;
  planetPositions: PlanetPos[];
}
interface WeeklyData {
  weekStart: string;
  weekEnd: string;
  events: WeekEvent[];
  predictions: WeeklyPrediction[];
}

// ─── Element theming per rashi (fire / earth / air / water) ─────────
type Element = "fire" | "earth" | "air" | "water";
const ELEMENT: Record<number, Element> = {
  0: "fire", 1: "earth", 2: "air", 3: "water",
  4: "fire", 5: "earth", 6: "air", 7: "water",
  8: "fire", 9: "earth", 10: "air", 11: "water",
};
const ELEMENT_THEME: Record<Element, { ring: string; soft: string; accent: string; label: { mr: string; en: string } }> = {
  fire:  { ring: "#dc2626", soft: "#fef2f2", accent: "#991b1b", label: { mr: "अग्नि", en: "Fire" } },
  earth: { ring: "#65a30d", soft: "#f7fee7", accent: "#3f6212", label: { mr: "पृथ्वी", en: "Earth" } },
  air:   { ring: "#0891b2", soft: "#ecfeff", accent: "#155e75", label: { mr: "वायू", en: "Air" } },
  water: { ring: "#4f46e5", soft: "#eef2ff", accent: "#3730a3", label: { mr: "जल", en: "Water" } },
};

// Approximate hex for lucky color swatch (matches engine's naming).
const COLOR_HEX: Record<string, string> = {
  "सोनेरी / केशरी": "#f59e0b", "Gold / Saffron": "#f59e0b",
  "पांढरा / चांदी": "#e5e7eb", "White / Silver": "#e5e7eb",
  "लाल": "#dc2626", "Red": "#dc2626",
  "हिरवा": "#16a34a", "Green": "#16a34a",
  "पिवळा": "#eab308", "Yellow": "#eab308",
  "गुलाबी / पांढरा": "#ec4899", "Pink / White": "#ec4899",
  "निळा / काळा": "#1e3a8a", "Blue / Black": "#1e3a8a",
  "धूम्र": "#6b7280", "Smoky Grey": "#6b7280",
  "तपकिरी": "#78350f", "Brown": "#78350f",
};
function colorHex(label: string): string {
  return COLOR_HEX[label] || "#d4a843";
}

const EVENT_THEME: Record<WeekEvent["type"], { chip: string; bg: string; fg: string; icon: string }> = {
  "rashi-change":     { chip: "#0ea5e9", bg: "#e0f2fe", fg: "#0c4a6e", icon: "⇆" },
  "retrograde-start": { chip: "#a855f7", bg: "#f3e8ff", fg: "#6b21a8", icon: "⟲" },
  "retrograde-end":   { chip: "#16a34a", bg: "#dcfce7", fg: "#14532d", icon: "⟳" },
  "combust-start":    { chip: "#f59e0b", bg: "#fef3c7", fg: "#92400e", icon: "☀" },
  "combust-end":      { chip: "#6366f1", bg: "#e0e7ff", fg: "#3730a3", icon: "✦" },
};
const EVENT_LABELS_MR: Record<WeekEvent["type"], string> = {
  "rashi-change": "राशी बदल",
  "retrograde-start": "वक्री प्रारंभ",
  "retrograde-end": "वक्री समाप्त",
  "combust-start": "अस्त प्रारंभ",
  "combust-end": "अस्त समाप्त",
};
const EVENT_LABELS_EN: Record<WeekEvent["type"], string> = {
  "rashi-change": "Sign Change",
  "retrograde-start": "Retro Start",
  "retrograde-end": "Retro End",
  "combust-start": "Combust Start",
  "combust-end": "Combust End",
};

const DIGNITY_COLORS: Record<string, { bg: string; fg: string }> = {
  exalted:     { bg: "#dcfce7", fg: "#14532d" },
  own:         { bg: "#e0f2fe", fg: "#0c4a6e" },
  friendly:    { bg: "#fef3c7", fg: "#78350f" },
  neutral:     { bg: "#f5f5f4", fg: "#44403c" },
  enemy:       { bg: "#ffedd5", fg: "#7c2d12" },
  debilitated: { bg: "#fee2e2", fg: "#7f1d1d" },
};

function toDev(s: string | number): string {
  const d = "०१२३४५६७८९";
  return String(s).replace(/\d/g, (c) => d[parseInt(c)]);
}

function fmtDateRange(startISO: string, endISO: string, lang: string): string {
  const s = new Date(startISO); const e = new Date(endISO);
  const locale = lang === "mr" ? "mr-IN" : lang === "hi" ? "hi-IN" : "en-IN";
  const sStr = s.toLocaleDateString(locale, { day: "numeric", month: "short" });
  const eStr = e.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });
  return `${sStr} – ${eStr}`;
}

function ratingColor(r: number): string {
  return r >= 4 ? "#10b981" : r === 3 ? "#d4a843" : "#dc2626";
}
function ratingLabel(r: number, lang: string): string {
  if (lang === "en") return r >= 4 ? "Favorable" : r === 3 ? "Mixed" : "Careful";
  return r >= 4 ? "अनुकूल" : r === 3 ? "मिश्र" : "सावध";
}

// Decorative dot rating (instead of stars — more editorial feel).
function RatingDots({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 items-center">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className="rounded-full"
          style={{
            width: i <= rating ? 8 : 6,
            height: i <= rating ? 8 : 6,
            background: i <= rating ? ratingColor(rating) : "#e7e5e4",
          }}
        />
      ))}
    </div>
  );
}

// Daily rating trend line (SVG).
function DailyTrend({ data, lang }: { data: { date: string; rating: number }[]; lang: string }) {
  const W = 280, H = 80, P = 8;
  const step = (W - P * 2) / (data.length - 1);
  const pts = data.map((d, i) => ({
    x: P + i * step,
    y: H - P - ((d.rating - 1) / 4) * (H - P * 2),
    r: d.rating,
    date: d.date,
  }));
  const path = pts.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
  const area = `${path} L ${pts[pts.length - 1].x} ${H - P} L ${pts[0].x} ${H - P} Z`;
  const locale = lang === "mr" ? "mr-IN" : lang === "hi" ? "hi-IN" : "en-IN";
  return (
    <svg width="100%" height={H + 24} viewBox={`0 0 ${W} ${H + 24}`}>
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d4a843" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#d4a843" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#trendFill)" />
      <path d={path} stroke="#5c1a1a" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill={ratingColor(p.r)} stroke="white" strokeWidth="2" />
          <text x={p.x} y={H + 18} textAnchor="middle" fontSize="9" fill="#8b6914" fontWeight="600">
            {new Date(p.date).toLocaleDateString(locale, { weekday: "narrow" })}
          </text>
        </g>
      ))}
    </svg>
  );
}


export default function SaptahikClient() {
  const { t, lang } = useLang();
  const [data, setData] = useState<WeeklyData | null>(null);
  const [loading, setLoading] = useState(true);
  // Single-rashi detail is now its own route (/rashifal/saptahik/<slug>). No inline toggle.

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/rashifal/weekly");
        if (res.ok) setData(await res.json());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Weekly headline — picks most important event.
  const headline = useMemo(() => {
    if (!data) return null;
    const rashi = data.events.find((e) => e.type === "rashi-change" && (e.planet === "Sun" || e.planet === "Jupiter" || e.planet === "Saturn"));
    if (rashi) return { mr: rashi.descriptionMr, en: rashi.descriptionEn };
    const retro = data.events.find((e) => e.type === "retrograde-start" || e.type === "retrograde-end");
    if (retro) return { mr: retro.descriptionMr, en: retro.descriptionEn };
    return null;
  }, [data]);

  const locale = lang === "mr" ? "mr-IN" : lang === "hi" ? "hi-IN" : "en-IN";

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #FAF7F0 0%, #FAFAF8 240px)" }}>
      <JsonLd data={serviceSchema({ name: "Weekly Rashifal — साप्ताहिक राशिभविष्य", description: "Weekly horoscope for all 12 zodiac signs based on real planetary transits.", url: `https://bhaagyavedh.com/${lang}/rashifal/saptahik` })} />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: `https://bhaagyavedh.com/${lang}` },
        { name: "Rashifal", url: `https://bhaagyavedh.com/${lang}/rashifal` },
        { name: "Saptahik", url: `https://bhaagyavedh.com/${lang}/rashifal/saptahik` },
      ])} />

      {/* ── Cinematic Hero ── */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(145deg, #1a0505 0%, #3d0c0c 40%, #5c1a1a 100%)" }}>
        {/* Constellation pattern */}
        <svg aria-hidden className="absolute inset-0 w-full h-full opacity-15" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="stars" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="20" r="0.8" fill="#d4a843" />
              <circle cx="40" cy="55" r="1.2" fill="#d4a843" />
              <circle cx="65" cy="15" r="0.6" fill="#d4a843" />
              <circle cx="70" cy="70" r="0.9" fill="#d4a843" />
              <circle cx="20" cy="65" r="0.5" fill="#d4a843" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#stars)" />
        </svg>

        <div className="relative max-w-6xl mx-auto px-4 py-14 sm:py-20 text-center">
          <div className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] font-semibold mb-5" style={{ color: "#d4a843" }}>
            <span className="h-px w-8" style={{ background: "#d4a843" }} />
            {t("ग्रह-गोचर आधारित", "Transit-Based", "ग्रह-गोचर आधारित")}
            <span className="h-px w-8" style={{ background: "#d4a843" }} />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-3" style={{ color: "#f5e6c8", fontFamily: "serif", letterSpacing: "-0.01em" }}>
            {t("साप्ताहिक राशिभविष्य", "Weekly Rashifal", "साप्ताहिक राशिफल")}
          </h1>
          {data && (
            <p className="text-lg sm:text-xl font-semibold tracking-wide" style={{ color: "#d4a843" }}>
              {fmtDateRange(data.weekStart, data.weekEnd, lang)}
            </p>
          )}
          <p className="mt-4 text-sm max-w-2xl mx-auto" style={{ color: "rgba(245,230,200,0.7)" }}>
            {t("मेष ते मीन — १२ राशींसाठी व्यक्तिगत साप्ताहिक फलादेश, वैदिक ग्रहगोचरावर आधारित.",
               "Aries to Pisces — personalized weekly forecasts grounded in live Vedic transits.",
               "मेष से मीन — १२ राशियों के लिए साप्ताहिक भविष्य.")}
          </p>

          {/* Weekly headline strip */}
          {headline && (
            <div className="mt-8 max-w-2xl mx-auto px-5 py-3 rounded-full inline-flex items-center gap-3" style={{ background: "rgba(212,168,67,0.12)", border: "1px solid rgba(212,168,67,0.25)" }}>
              <span className="text-base" style={{ color: "#d4a843" }}>✦</span>
              <span className="text-sm text-left" style={{ color: "#f5e6c8" }}>
                {t(headline.mr, headline.en, headline.mr)}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ── Content ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        {loading || !data ? (
          <div className="text-center py-20">
            <div className="inline-block w-10 h-10 border-4 border-[#d4a843]/30 border-t-[#5c1a1a] rounded-full animate-spin" />
            <p className="mt-4 text-stone-500 text-sm">{t("गणना चालू...", "Calculating...", "गणना चल रही...")}</p>
          </div>
        ) : (
          <LandingView data={data} lang={lang} />
        )}

        {/* Bottom cross-nav */}
        <div className="flex flex-wrap gap-3 justify-center pt-12">
          <Link href={`/${lang}/rashifal`} className="px-5 py-2.5 text-sm font-bold rounded-full bg-white border-2 transition hover:scale-105" style={{ borderColor: "#d4a843", color: "#5c1a1a" }}>
            {t("← दैनिक राशीफल", "← Daily Rashifal", "← दैनिक राशिफल")}
          </Link>
          <Link href={`/${lang}/panchang`} className="px-5 py-2.5 text-sm font-bold rounded-full bg-white border-2 transition hover:scale-105" style={{ borderColor: "#d4a843", color: "#5c1a1a" }}>
            {t("पंचांग पहा", "View Panchang", "पंचांग देखें")}
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Landing (rashi grid) ────────────────────────────────────────
function LandingView({ data, lang }: { data: WeeklyData; lang: string }) {
  const { t } = useLang();
  const locale = lang === "mr" ? "mr-IN" : lang === "hi" ? "hi-IN" : "en-IN";
  return (
    <div className="pt-10 space-y-10">
      {/* ── 12 rashi premium cards ── */}
      <div>
        <div className="flex items-end justify-between mb-5">
          <h2 className="text-2xl font-bold" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
            {t("बारा राशींचे साप्ताहिक भविष्य", "Weekly Forecast — All 12 Signs", "बारह राशियों का साप्ताहिक भविष्य")}
          </h2>
          <span className="text-xs uppercase tracking-wider text-stone-500 hidden sm:inline">{t("राशी निवडा", "Select a sign", "राशि चुनें")}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {RASHIS.map((rashi) => {
            const pred = data.predictions[rashi.id];
            if (!pred) return null;
            const el = ELEMENT[rashi.id];
            const theme = ELEMENT_THEME[el];
            const bestDate = new Date(pred.bestDay.date).toLocaleDateString(locale, { weekday: "short" });
            return (
              <Link
                key={rashi.id}
                href={`/${lang}/rashifal/saptahik/${rashi.slug}`}
                className="group relative text-left rounded-2xl p-5 bg-white transition-all duration-300 hover:-translate-y-1 block"
                style={{
                  border: "1px solid #f0ead8",
                  boxShadow: "0 2px 6px -2px rgba(92,26,26,0.08)",
                }}
              >
                {/* Accent corner */}
                <div className="absolute top-0 right-0 w-20 h-20 rounded-bl-full rounded-tr-2xl opacity-40 group-hover:opacity-80 transition-opacity" style={{ background: `radial-gradient(circle at top right, ${theme.ring}22, transparent 70%)` }} />

                <div className="relative flex items-start gap-3 mb-3">
                  <ZodiacBadge slug={rashi.slug} size={52} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.15em] font-bold" style={{ color: theme.accent }}>
                      {t(theme.label.mr, theme.label.en, theme.label.mr)}
                    </p>
                    <p className="font-bold text-lg leading-tight" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
                      {t(rashi.mr, rashi.en, rashi.mr)}
                    </p>
                    <p className="text-[11px] text-stone-500 mt-0.5">{lang === "en" ? rashi.datesEn : rashi.dates}</p>
                  </div>
                </div>

                <p className="text-xs leading-relaxed line-clamp-2 mb-3" style={{ color: "#5c1a1a" }}>
                  {t(pred.summary.mr, pred.summary.en, pred.summary.mr)}
                </p>

                {/* Rating + metadata row */}
                <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px dashed #f0ead8" }}>
                  <RatingDots rating={pred.rating} />
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: ratingColor(pred.rating) }}>
                    {ratingLabel(pred.rating, lang)}
                  </span>
                </div>

                {/* Best-day pill + lucky color swatch */}
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-1 rounded-full" style={{ background: "#FFF8E7", color: "#5c1a1a" }}>
                    <span style={{ color: "#d4a843" }}>★</span>
                    {t("सर्वोत्तम:", "Best:", "सर्वोत्तम:")} {bestDate}
                  </span>
                  <span className="flex items-center gap-1.5 text-[10px] text-stone-600" title={t(pred.luckyColor.mr, pred.luckyColor.en, pred.luckyColor.mr)}>
                    <span className="w-4 h-4 rounded-full border border-stone-300" style={{ background: colorHex(t(pred.luckyColor.mr, pred.luckyColor.en, pred.luckyColor.mr)) }} />
                    #{lang === "mr" || lang === "hi" ? toDev(pred.luckyNumber) : pred.luckyNumber}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Week events — editorial timeline ── */}
      {data.events.length > 0 && (
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #f0ead8", background: "white" }}>
          <div className="px-6 py-4 flex items-center justify-between" style={{ background: "linear-gradient(90deg, #FFF8E7, #FFFDF5)", borderBottom: "1px solid #f0ead8" }}>
            <div>
              <h2 className="text-base font-bold" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
                {t("या आठवड्यातील आकाश", "This Week's Sky", "इस सप्ताह का आकाश")}
              </h2>
              <p className="text-[11px] text-stone-500 mt-0.5">
                {t("प्रमुख ग्रहगोचर बदल", "Key planetary shifts", "प्रमुख ग्रह गोचर")}
              </p>
            </div>
            <span className="text-2xl" style={{ color: "#d4a843" }}>✦</span>
          </div>
          <div className="p-6 space-y-0">
            {data.events.map((e, i) => {
              const theme = EVENT_THEME[e.type];
              const label = lang === "en" ? EVENT_LABELS_EN[e.type] : EVENT_LABELS_MR[e.type];
              const dateObj = new Date(e.date);
              const locale2 = lang === "mr" ? "mr-IN" : lang === "hi" ? "hi-IN" : "en-IN";
              const dateStr = dateObj.toLocaleDateString(locale2, { weekday: "short", day: "numeric", month: "short" });
              return (
                <div key={i} className="relative flex gap-4 pb-4" style={{ borderLeft: i < data.events.length - 1 ? "2px dashed #f0ead8" : "2px solid transparent", marginLeft: "10px", paddingLeft: "20px" }}>
                  <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold" style={{ background: theme.chip, color: "white" }}>
                    {theme.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider" style={{ background: theme.bg, color: theme.fg }}>
                        {label}
                      </span>
                      <span className="text-xs font-semibold text-stone-500">{dateStr}</span>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "#3d0c0c" }}>
                      {t(e.descriptionMr, e.descriptionEn, e.descriptionMr)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Detail (editorial) ──────────────────────────────────────────
function WeeklyDetail({ rashi, pred, allPreds, lang, onClose, onChange }: {
  rashi: typeof RASHIS[number];
  pred: WeeklyPrediction;
  allPreds: WeeklyPrediction[];
  lang: string;
  onClose: () => void;
  onChange: (id: number) => void;
}) {
  const { t } = useLang();
  const [tab, setTab] = useState<"forecast" | "planets">("forecast");
  const el = ELEMENT[rashi.id];
  const theme = ELEMENT_THEME[el];
  const locale = lang === "mr" ? "mr-IN" : lang === "hi" ? "hi-IN" : "en-IN";
  const fmtDay = (iso: string) => new Date(iso).toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" });
  const text = (b: Bilingual) => t(b.mr, b.en, b.mr);

  // Split narrative into paragraphs (blank-line separated); first para gets drop cap.
  const paragraphs = text(pred.narrative).split("\n\n").map((p) => p.trim()).filter(Boolean);

  const prevId = (rashi.id + 11) % 12;
  const nextId = (rashi.id + 1) % 12;
  const prevRashi = RASHIS[prevId];
  const nextRashi = RASHIS[nextId];

  return (
    <div className="pt-6">
      {/* Top control bar */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 text-sm font-bold px-4 py-2 rounded-full transition hover:scale-105"
          style={{ color: "#5c1a1a", border: "1px solid #f0ead8", background: "white" }}
        >
          ← {t("सर्व राशी", "All signs", "सभी राशि")}
        </button>
        <div className="flex gap-2">
          <button onClick={() => onChange(prevId)} className="group inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-full bg-white transition hover:bg-[#FFF8E7]" style={{ border: "1px solid #f0ead8", color: "#5c1a1a" }}>
            ←<span className="hidden sm:inline">{t(prevRashi.mr, prevRashi.en, prevRashi.mr)}</span>
          </button>
          <button onClick={() => onChange(nextId)} className="group inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-full bg-white transition hover:bg-[#FFF8E7]" style={{ border: "1px solid #f0ead8", color: "#5c1a1a" }}>
            <span className="hidden sm:inline">{t(nextRashi.mr, nextRashi.en, nextRashi.mr)}</span>→
          </button>
        </div>
      </div>

      {/* Editorial header */}
      <div className="relative rounded-3xl overflow-hidden" style={{ background: `linear-gradient(135deg, ${theme.soft}, #ffffff 80%)`, border: `1px solid ${theme.ring}22` }}>
        <div className="absolute top-0 right-0 w-72 h-72 opacity-20 -mr-16 -mt-16 rounded-full" style={{ background: `radial-gradient(circle, ${theme.ring}, transparent 70%)` }} />
        <div className="relative p-6 sm:p-10 flex flex-col md:flex-row items-start gap-6">
          <ZodiacBadge slug={rashi.slug} size={96} />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] uppercase tracking-[0.3em] font-bold mb-2" style={{ color: theme.accent }}>
              {t(theme.label.mr, theme.label.en, theme.label.mr)} · {lang === "en" ? rashi.datesEn : rashi.dates}
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold" style={{ color: "#3d0c0c", fontFamily: "serif", letterSpacing: "-0.01em" }}>
              {t(rashi.mr, rashi.en, rashi.mr)}
            </h1>
            <p className="mt-2 text-base" style={{ color: "#5c1a1a" }}>
              {text(pred.summary)}
            </p>
            <div className="mt-4 flex items-center gap-4">
              <RatingDots rating={pred.rating} />
              <span className="text-sm font-bold uppercase tracking-wider" style={{ color: ratingColor(pred.rating) }}>
                {ratingLabel(pred.rating, lang)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-8 mt-8">
        {/* ── LEFT: Editorial content ── */}
        <article>
          {/* Tabs */}
          <div className="flex gap-1 mb-6 border-b" style={{ borderColor: "#f0ead8" }}>
            {[
              { id: "forecast" as const, label: t("भविष्य", "Forecast", "भविष्य") },
              { id: "planets" as const, label: t("ग्रह स्थिती", "Planet Positions", "ग्रह स्थिति") },
            ].map((x) => (
              <button
                key={x.id}
                onClick={() => setTab(x.id)}
                className="relative px-4 py-3 text-sm font-bold transition"
                style={{ color: tab === x.id ? "#5c1a1a" : "#a8a29e" }}
              >
                {x.label}
                {tab === x.id && <span className="absolute bottom-0 left-4 right-4 h-0.5" style={{ background: "#5c1a1a" }} />}
              </button>
            ))}
          </div>

          {tab === "forecast" ? (
            <div className="space-y-6">
              {paragraphs.map((para, i) => (
                <p
                  key={i}
                  className={`text-[17px] leading-[1.85] ${i === 0 ? "first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-[0.9]" : ""}`}
                  style={{
                    color: "#3d0c0c",
                    fontFamily: "serif",
                  }}
                >
                  {para}
                </p>
              ))}

              <div className="rounded-2xl p-5 flex items-start gap-4" style={{ background: "linear-gradient(135deg, #FFF8E7, #FFFDF5)", border: "1px solid rgba(212,168,67,0.3)" }}>
                <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: "linear-gradient(135deg, #d4a843, #b38a2d)" }}>
                  !
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider font-bold mb-1" style={{ color: "#8b6914" }}>
                    {t("आठवड्याचा सल्ला", "Advice of the Week", "सप्ताह की सलाह")}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "#3d0c0c" }}>{text(pred.advice)}</p>
                </div>
              </div>
            </div>
          ) : (
            <PlanetPositionsTable positions={pred.planetPositions} lang={lang} />
          )}
        </article>

        {/* ── RIGHT: Sticky sidebar ── */}
        <aside className="space-y-5 lg:sticky lg:top-4 self-start">
          {/* Daily trend chart */}
          <div className="rounded-2xl p-5 bg-white" style={{ border: "1px solid #f0ead8" }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] uppercase tracking-wider font-bold" style={{ color: "#8b6914" }}>
                {t("आठवड्याचा कल", "Weekly Trend", "साप्ताहिक प्रवृत्ति")}
              </p>
              <span className="text-xs font-bold" style={{ color: ratingColor(pred.rating) }}>
                {pred.rating}/5
              </span>
            </div>
            <DailyTrend data={pred.dailyRatings} lang={lang} />
            <div className="flex items-center justify-between pt-3 mt-1" style={{ borderTop: "1px dashed #f0ead8" }}>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-stone-500">{t("सर्वोत्तम", "Best", "सर्वोत्तम")}</p>
                <p className="text-sm font-bold" style={{ color: "#10b981" }}>{fmtDay(pred.bestDay.date)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wider text-stone-500">{t("सावध", "Careful", "सावधान")}</p>
                <p className="text-sm font-bold" style={{ color: "#dc2626" }}>{fmtDay(pred.worstDay.date)}</p>
              </div>
            </div>
          </div>

          {/* Lucky at-a-glance */}
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #f0ead8", background: "white" }}>
            <div className="px-5 py-3" style={{ background: "linear-gradient(90deg, #FFF8E7, #FFFDF5)" }}>
              <p className="text-[11px] uppercase tracking-wider font-bold" style={{ color: "#8b6914" }}>
                {t("भाग्यशाली", "Lucky", "भाग्यशाली")}
              </p>
            </div>
            <div className="p-5 grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="mx-auto mb-2 rounded-full relative" style={{
                  width: 56, height: 56,
                  background: colorHex(text(pred.luckyColor)),
                  boxShadow: `0 4px 14px -4px ${colorHex(text(pred.luckyColor))}88, inset 0 2px 4px rgba(255,255,255,0.4)`,
                }} />
                <p className="text-xs font-semibold" style={{ color: "#3d0c0c" }}>{text(pred.luckyColor)}</p>
                <p className="text-[10px] text-stone-500 mt-0.5">{t("रंग", "Color", "रंग")}</p>
              </div>
              <div className="text-center">
                <div className="mx-auto mb-2 w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold text-white" style={{ background: "linear-gradient(135deg, #5c1a1a, #3d0c0c)", fontFamily: "serif" }}>
                  {lang === "mr" || lang === "hi" ? toDev(pred.luckyNumber) : pred.luckyNumber}
                </div>
                <p className="text-xs font-semibold" style={{ color: "#3d0c0c" }}>#{lang === "mr" || lang === "hi" ? toDev(pred.luckyNumber) : pred.luckyNumber}</p>
                <p className="text-[10px] text-stone-500 mt-0.5">{t("अंक", "Number", "अंक")}</p>
              </div>
            </div>
          </div>

          {/* Other rashis quick nav */}
          <div className="rounded-2xl p-4 bg-white" style={{ border: "1px solid #f0ead8" }}>
            <p className="text-[11px] uppercase tracking-wider font-bold mb-3" style={{ color: "#8b6914" }}>
              {t("इतर राशी", "Other Signs", "अन्य राशि")}
            </p>
            <div className="grid grid-cols-4 gap-2">
              {RASHIS.filter((r) => r.id !== rashi.id).map((r) => {
                const p = allPreds[r.id];
                return (
                  <button
                    key={r.id}
                    onClick={() => onChange(r.id)}
                    className="p-2 rounded-lg text-center hover:bg-[#FFF8E7] transition"
                    title={t(r.mr, r.en, r.mr)}
                  >
                    <div className="flex justify-center"><ZodiacBadge slug={r.slug} size={32} /></div>
                    <div className="text-[9px] font-bold mt-0.5" style={{ color: ratingColor(p?.rating ?? 3) }}>
                      {p?.rating ?? "-"}★
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ─── Planet positions table (inside tab) ─────────────────────────
function PlanetPositionsTable({ positions, lang }: { positions: PlanetPos[]; lang: string }) {
  const { t } = useLang();
  return (
    <div>
      <p className="text-xs text-stone-500 mb-4">
        {t("आठवड्याच्या मध्यबिंदूला ग्रहांची स्थिती. तुमच्या राशीपासून मोजलेली भावे.",
           "Planet positions at week midpoint — houses counted from your sign.",
           "सप्ताह मध्य में ग्रह स्थिति.")}
      </p>
      <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid #f0ead8" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "linear-gradient(90deg, #FFF8E7, #FFFDF5)", color: "#5c1a1a" }}>
              <th className="px-4 py-3 text-left font-bold">{t("ग्रह", "Planet", "ग्रह")}</th>
              <th className="px-4 py-3 text-left font-bold">{t("राशी", "Sign", "राशि")}</th>
              <th className="px-4 py-3 text-left font-bold">{t("भाव", "House", "भाव")}</th>
              <th className="px-4 py-3 text-left font-bold">{t("स्थिती", "Status", "स्थिति")}</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((p, i) => {
              const colors = DIGNITY_COLORS[p.dignity] || DIGNITY_COLORS.neutral;
              return (
                <tr key={p.planet} style={{ background: i % 2 ? "#FFFDF5" : "white" }}>
                  <td className="px-4 py-3 font-bold" style={{ color: "#3d0c0c" }}>{t(p.planetMr, p.planet, p.planetMr)}</td>
                  <td className="px-4 py-3">{t(p.rashiMr, p.rashiEn, p.rashiMr)}</td>
                  <td className="px-4 py-3 font-bold" style={{ color: "#8b6914" }}>{lang === "mr" || lang === "hi" ? toDev(p.house) : p.house}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ background: colors.bg, color: colors.fg }}>
                        {t(p.dignityMr, p.dignity, p.dignityMr)}
                      </span>
                      {p.isRetrograde && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ background: "#f3e8ff", color: "#6b21a8" }}>
                          {t("वक्री", "Retro", "वक्री")}
                        </span>
                      )}
                      {p.isCombust && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ background: "#fef3c7", color: "#92400e" }}>
                          {t("अस्त", "Combust", "अस्त")}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
