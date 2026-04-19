"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useLang } from "@/lib/astrology/language-context";
import { RASHI_LIST } from "@/lib/rashi-data";
import { JsonLd, serviceSchema, breadcrumbSchema, faqSchema } from "@/components/json-ld";
import { ZodiacBadge } from "@/components/zodiac-badge";

const RASHIS = RASHI_LIST;

interface TransitInfo {
  planet: string;
  planetMr: string;
  house: number;
  effect: "good" | "bad" | "neutral";
  dignity?: "exalted" | "own" | "friendly" | "neutral" | "enemy" | "debilitated";
  dignityMr?: string;
  dignityEn?: string;
  isRetrograde?: boolean;
  isCombust?: boolean;
  aspectsHouses?: number[];
}
interface Bilingual { mr: string; en: string }
interface Prediction {
  rashiId: number;
  rashiMr: string;
  rashiEn: string;
  overall: Bilingual;
  career: Bilingual;
  love: Bilingual;
  health: Bilingual;
  advice: Bilingual;
  narrative: Bilingual;
  rating: number;
  transits: TransitInfo[];
  luckyColor: Bilingual;
  luckyNumber: number;
}
interface TransitPlanetLive {
  id: string;
  rashiEn: string;
  rashiIndex: number;
  planetMr?: string;
  rashiMr?: string;
}
interface RashifalData {
  date: string;
  transitPlanets: TransitPlanetLive[];
  predictions: Prediction[];
}

// ─── Element theming (same as saptahik) ─────────────────────────
type Element = "fire" | "earth" | "air" | "water";
const ELEMENT: Record<number, Element> = {
  0: "fire", 1: "earth", 2: "air", 3: "water",
  4: "fire", 5: "earth", 6: "air", 7: "water",
  8: "fire", 9: "earth", 10: "air", 11: "water",
};
const ELEMENT_THEME: Record<Element, { ring: string; soft: string; accent: string; label: Bilingual }> = {
  fire:  { ring: "#dc2626", soft: "#fef2f2", accent: "#991b1b", label: { mr: "अग्नि", en: "Fire" } },
  earth: { ring: "#65a30d", soft: "#f7fee7", accent: "#3f6212", label: { mr: "पृथ्वी", en: "Earth" } },
  air:   { ring: "#0891b2", soft: "#ecfeff", accent: "#155e75", label: { mr: "वायू", en: "Air" } },
  water: { ring: "#4f46e5", soft: "#eef2ff", accent: "#3730a3", label: { mr: "जल", en: "Water" } },
};

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

const DIGNITY_COLORS: Record<string, { bg: string; fg: string; border: string }> = {
  exalted:      { bg: "#dcfce7", fg: "#14532d", border: "#86efac" },
  own:          { bg: "#e0f2fe", fg: "#0c4a6e", border: "#7dd3fc" },
  moolatrikona: { bg: "#ddd6fe", fg: "#4c1d95", border: "#a78bfa" },
  friendly:     { bg: "#fef3c7", fg: "#78350f", border: "#fcd34d" },
  neutral:      { bg: "#f5f5f4", fg: "#44403c", border: "#d6d3d1" },
  enemy:        { bg: "#ffedd5", fg: "#7c2d12", border: "#fdba74" },
  debilitated:  { bg: "#fee2e2", fg: "#7f1d1d", border: "#fca5a5" },
};

function localeCode(lang: string): string {
  if (lang === "mr") return "mr-IN";
  if (lang === "hi") return "hi-IN";
  return "en-IN";
}
function toDev(s: string | number): string {
  const d = "०१२३४५६७८९";
  return String(s).replace(/\d/g, (c) => d[parseInt(c)]);
}
function ratingColor(r: number): string {
  return r >= 4 ? "#10b981" : r === 3 ? "#d4a843" : "#dc2626";
}
function ratingLabel(r: number, lang: string): string {
  if (lang === "en") return r >= 4 ? "Favorable" : r === 3 ? "Mixed" : "Careful";
  return r >= 4 ? "अनुकूल" : r === 3 ? "मिश्र" : "सावध";
}

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


export default function RashifalPageClient() {
  const { t, lang } = useLang();
  const [data, setData] = useState<RashifalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/rashifal?rashi=all");
        if (res.ok) setData(await res.json());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const today = useMemo(() => new Date().toLocaleDateString(localeCode(lang), {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  }), [lang]);

  // Cross-rashi headline — pick a notable global state.
  const headline = useMemo(() => {
    if (!data) return null;
    const tp = data.transitPlanets as { id: string; planetMr?: string; rashiMr?: string; rashiEn: string }[];
    const sun = tp.find((p) => p.id === "Sun");
    const jup = tp.find((p) => p.id === "Jupiter");
    if (!sun || !jup) return null;
    const sunMr = sun.planetMr || "सूर्य";
    const jupMr = jup.planetMr || "गुरु";
    return {
      mr: `${sunMr} ${sun.rashiMr || sun.rashiEn} राशीत · ${jupMr} ${jup.rashiMr || jup.rashiEn} राशीत`,
      en: `Sun in ${sun.rashiEn} · Jupiter in ${jup.rashiEn}`,
    };
  }, [data]);

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #FAF7F0 0%, #FAFAF8 240px)" }}>
      <JsonLd data={serviceSchema({ name: "Daily Rashifal — आजचे राशीफल", description: "Daily horoscope predictions for all 12 zodiac signs based on real Vedic planetary transits.", url: `https://bhaagyavedh.com/${lang}/rashifal` })} />
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: `https://bhaagyavedh.com/${lang}` }, { name: "Rashifal", url: `https://bhaagyavedh.com/${lang}/rashifal` }])} />

      {/* ── Cinematic Hero ── */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(145deg, #1a0505 0%, #3d0c0c 40%, #5c1a1a 100%)" }}>
        <svg aria-hidden className="absolute inset-0 w-full h-full opacity-15" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="stars-daily" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="20" r="0.8" fill="#d4a843" />
              <circle cx="40" cy="55" r="1.2" fill="#d4a843" />
              <circle cx="65" cy="15" r="0.6" fill="#d4a843" />
              <circle cx="70" cy="70" r="0.9" fill="#d4a843" />
              <circle cx="20" cy="65" r="0.5" fill="#d4a843" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#stars-daily)" />
        </svg>

        <div className="relative max-w-6xl mx-auto px-4 py-14 sm:py-20 text-center">
          <div className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] font-semibold mb-5" style={{ color: "#d4a843" }}>
            <span className="h-px w-8" style={{ background: "#d4a843" }} />
            {t("वास्तविक ग्रह गोचर", "Live Transit", "वास्तविक ग्रह गोचर")}
            <span className="h-px w-8" style={{ background: "#d4a843" }} />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-3" style={{ color: "#f5e6c8", fontFamily: "serif", letterSpacing: "-0.01em" }}>
            {t("आजचे राशीफल", "Today's Horoscope", "आज का राशिफल")}
          </h1>
          <p className="text-lg sm:text-xl font-semibold tracking-wide" style={{ color: "#d4a843" }}>
            {today}
          </p>
          <p className="mt-4 text-sm max-w-2xl mx-auto" style={{ color: "rgba(245,230,200,0.7)" }}>
            {t("मेष ते मीन — १२ राशींसाठी आजचे अचूक भविष्य, लाहिरी अयनांशावर आधारित.",
               "Aries to Pisces — precise daily forecasts grounded in Lahiri-ayanamsa transits.",
               "मेष से मीन — १२ राशियों के लिए आज का सटीक भविष्य.")}
          </p>

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

        <div className="flex flex-wrap gap-3 justify-center pt-12">
          <Link href={`/${lang}/rashifal/saptahik`} className="px-5 py-2.5 text-sm font-bold rounded-full bg-white border-2 transition hover:scale-105" style={{ borderColor: "#d4a843", color: "#5c1a1a" }}>
            {t("साप्ताहिक राशीभविष्य →", "Weekly Rashifal →", "साप्ताहिक राशिफल →")}
          </Link>
          <Link href={`/${lang}/panchang`} className="px-5 py-2.5 text-sm font-bold rounded-full bg-white border-2 transition hover:scale-105" style={{ borderColor: "#d4a843", color: "#5c1a1a" }}>
            {t("पंचांग पहा", "View Panchang", "पंचांग देखें")}
          </Link>
        </div>

        {/* FAQ */}
        <FAQSection />
      </div>
    </div>
  );
}

// ─── Landing view ────────────────────────────────────────────────
function LandingView({ data, lang }: { data: RashifalData; lang: string }) {
  const { t } = useLang();
  return (
    <div className="pt-10 space-y-10">
      {/* Transit planets bar */}
      <div className="rounded-2xl p-5" style={{ background: "white", border: "1px solid #f0ead8" }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-bold" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
              {t("आजची ग्रह स्थिती", "Today's Planetary Positions", "आज की ग्रह स्थिति")}
            </h2>
            <p className="text-[11px] text-stone-500 mt-0.5">{t("वास्तविक गोचर — लाहिरी अयनांश", "Live transits — Lahiri ayanamsa", "वास्तविक गोचर")}</p>
          </div>
          <span className="text-2xl" style={{ color: "#d4a843" }}>✦</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {(data.transitPlanets as { id: string; planetMr?: string; rashiMr?: string; rashiEn: string }[]).map((tp) => (
            <span
              key={tp.id}
              className="text-xs rounded-full px-3 py-1.5 font-semibold"
              style={{ background: "#FFF8E7", color: "#5c1a1a", border: "1px solid rgba(212,168,67,0.2)" }}
            >
              <span style={{ color: "#8b6914" }}>{t(tp.planetMr || tp.id, tp.id, tp.planetMr || tp.id)}</span>
              <span className="mx-1.5 text-stone-400">·</span>
              <span>{t(tp.rashiMr || tp.rashiEn, tp.rashiEn, tp.rashiMr || tp.rashiEn)}</span>
            </span>
          ))}
        </div>
      </div>

      {/* 12 rashi premium grid */}
      <div>
        <div className="flex items-end justify-between mb-5">
          <h2 className="text-2xl font-bold" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
            {t("बारा राशींचे आजचे भविष्य", "Today's Forecast — All 12 Signs", "बारह राशियों का आज का भविष्य")}
          </h2>
          <span className="text-xs uppercase tracking-wider text-stone-500 hidden sm:inline">{t("राशी निवडा", "Select a sign", "राशि चुनें")}</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {RASHIS.map((rashi) => {
            const pred = data.predictions[rashi.id];
            if (!pred) return null;
            const el = ELEMENT[rashi.id];
            const theme = ELEMENT_THEME[el];
            return (
              <Link
                key={rashi.id}
                href={`/${lang}/rashifal/${rashi.slug}`}
                className="group relative text-left rounded-2xl p-5 bg-white transition-all duration-300 hover:-translate-y-1 block"
                style={{
                  border: "1px solid #f0ead8",
                  boxShadow: "0 2px 6px -2px rgba(92,26,26,0.08)",
                }}
              >
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

                <p className="text-xs leading-relaxed line-clamp-3 mb-3" style={{ color: "#5c1a1a" }}>
                  {t(pred.overall.mr, pred.overall.en, pred.overall.mr)}
                </p>

                <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px dashed #f0ead8" }}>
                  <RatingDots rating={pred.rating} />
                  <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: ratingColor(pred.rating) }}>
                    {ratingLabel(pred.rating, lang)}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px]" style={{ color: "#5c1a1a" }}>
                    <span className="w-4 h-4 rounded-full border border-stone-300" style={{ background: colorHex(t(pred.luckyColor.mr, pred.luckyColor.en, pred.luckyColor.mr)) }} />
                    <span className="font-semibold">#{lang === "mr" || lang === "hi" ? toDev(pred.luckyNumber) : pred.luckyNumber}</span>
                  </div>
                  {/* Compact transit badge count */}
                  {(() => {
                    const goodCount = pred.transits.filter((tr) => tr.effect === "good").length;
                    const badCount = pred.transits.filter((tr) => tr.effect === "bad").length;
                    return (
                      <span className="text-[10px] font-semibold" style={{ color: "#8b6914" }}>
                        <span style={{ color: "#10b981" }}>{lang === "mr" || lang === "hi" ? toDev(goodCount) : goodCount}↑</span>
                        <span className="mx-1 text-stone-400">/</span>
                        <span style={{ color: "#dc2626" }}>{lang === "mr" || lang === "hi" ? toDev(badCount) : badCount}↓</span>
                      </span>
                    );
                  })()}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Daily detail (editorial) ────────────────────────────────────
function DailyDetail({ rashi, pred, allPreds, lang, onClose, onChange }: {
  rashi: typeof RASHIS[number];
  pred: Prediction;
  allPreds: Prediction[];
  lang: string;
  onClose: () => void;
  onChange: (id: number) => void;
}) {
  const { t } = useLang();
  const el = ELEMENT[rashi.id];
  const theme = ELEMENT_THEME[el];
  const text = (b: Bilingual) => t(b.mr, b.en, b.mr);

  const prevId = (rashi.id + 11) % 12;
  const nextId = (rashi.id + 1) % 12;

  // Pure narrative — paragraph-separated flowing prose (no planet/house jargon).
  const paragraphs = text(pred.narrative).split("\n\n").map((p) => p.trim()).filter(Boolean);

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
          <button onClick={() => onChange(prevId)} className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-full bg-white transition hover:bg-[#FFF8E7]" style={{ border: "1px solid #f0ead8", color: "#5c1a1a" }}>
            ←<span className="hidden sm:inline">{t(RASHIS[prevId].mr, RASHIS[prevId].en, RASHIS[prevId].mr)}</span>
          </button>
          <button onClick={() => onChange(nextId)} className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-full bg-white transition hover:bg-[#FFF8E7]" style={{ border: "1px solid #f0ead8", color: "#5c1a1a" }}>
            <span className="hidden sm:inline">{t(RASHIS[nextId].mr, RASHIS[nextId].en, RASHIS[nextId].mr)}</span>→
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
            <p className="text-sm mt-1" style={{ color: "#8b6914" }}>
              {new Date().toLocaleDateString(localeCode(lang), { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
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

      {/* 2-column */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr,320px] gap-8 mt-8">
        {/* LEFT */}
        <article className="space-y-6">
          {/* Pure narrative with drop cap on first paragraph */}
          <div>
            <h2 className="text-[11px] uppercase tracking-wider font-bold mb-3" style={{ color: "#8b6914" }}>
              {t(`${rashi.mr} राशीचे आजचे भविष्य`, `${rashi.en} — Today's Horoscope`, `${rashi.mr} राशि का आज का भविष्य`)}
            </h2>
            <div className="space-y-5">
              {paragraphs.map((para, i) => (
                <p
                  key={i}
                  className={`text-[17px] leading-[1.85] ${i === 0 ? "first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-[0.9]" : ""}`}
                  style={{ color: "#3d0c0c", fontFamily: "serif" }}
                >
                  {para}
                </p>
              ))}
            </div>
          </div>

          {/* Advice callout */}
          <div className="rounded-2xl p-5 flex items-start gap-4" style={{ background: "linear-gradient(135deg, #FFF8E7, #FFFDF5)", border: "1px solid rgba(212,168,67,0.3)" }}>
            <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: "linear-gradient(135deg, #d4a843, #b38a2d)" }}>
              !
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider font-bold mb-1" style={{ color: "#8b6914" }}>
                {t("आजचा सल्ला", "Today's Advice", "आज की सलाह")}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "#3d0c0c" }}>{text(pred.advice)}</p>
            </div>
          </div>

          {/* Transit detail cards */}
          <div className="pt-4" style={{ borderTop: "1px solid #f0ead8" }}>
            <h3 className="text-sm font-bold mb-3" style={{ color: "#5c1a1a" }}>
              {t("आजचे गोचर (ग्रह संचार)", "Today's Transits", "आज का गोचर")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {pred.transits.map((tr) => {
                const dKey = tr.dignity || "neutral";
                const colors = DIGNITY_COLORS[dKey] || DIGNITY_COLORS.neutral;
                const effectIcon = tr.effect === "good" ? "✓" : tr.effect === "bad" ? "⚠" : "·";
                const effectColor = tr.effect === "good" ? "#059669" : tr.effect === "bad" ? "#dc2626" : "#6b7280";
                return (
                  <div key={tr.planet} className="p-3 rounded-lg text-xs flex items-start gap-3"
                    style={{ background: colors.bg, border: `1px solid ${colors.border}`, color: colors.fg }}>
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 font-bold text-sm" style={{ background: "white", color: effectColor, border: `1.5px solid ${effectColor}` }}>
                      {effectIcon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm">{t(tr.planetMr, tr.planet, tr.planetMr)}</span>
                        <span className="text-[10px]" style={{ opacity: 0.7 }}>
                          {t(`${tr.house}वा भाव`, `H${tr.house}`, `${tr.house}वाँ भाव`)}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: colors.border, color: colors.fg }}>
                          {t(tr.dignityMr || "सम", tr.dignityEn || "Neutral", tr.dignityMr || "सम")}
                        </span>
                        {tr.isRetrograde && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: "#f3e8ff", color: "#6b21a8", border: "1px solid #d8b4fe" }}>
                            {t("वक्री", "Retro", "वक्री")}
                          </span>
                        )}
                        {tr.isCombust && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: "#fef3c7", color: "#92400e", border: "1px solid #fcd34d" }}>
                            {t("अस्त", "Combust", "अस्त")}
                          </span>
                        )}
                      </div>
                      {tr.aspectsHouses && tr.aspectsHouses.length > 0 && (
                        <p className="text-[10px] mt-1 opacity-75">
                          {t("दृष्टी:", "Aspects:", "दृष्टि:")} {tr.aspectsHouses.map((h) => t(`${h}वा`, `${h}`, `${h}वाँ`)).join(", ")} {t("भाव", "", "भाव")}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] mt-3 text-stone-500">
              {t("वरील भविष्य वास्तविक ग्रह गोचर + उच्च/नीच/वक्री/अस्त/दृष्टी गणनेवर आधारित",
                 "Computed from real transits + dignity + retrograde + combustion + aspect calculations",
                 "ग्रह गोचर + उच्च/नीच/वक्री/अस्त/दृष्टि गणना")}
            </p>
          </div>

          {/* Per-rashi deep-page CTA */}
          <div className="text-center pt-4">
            <Link
              href={`/${lang}/rashifal/${rashi.slug}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm transition hover:scale-105"
              style={{ background: "linear-gradient(135deg, #d4a843, #e5bc5a)", color: "#3d0c0c" }}
            >
              {t(`${rashi.mr} राशीचे संपूर्ण विश्लेषण`, `Full ${rashi.en} Analysis`, `${rashi.mr} राशि का पूर्ण विश्लेषण`)} →
            </Link>
          </div>
        </article>

        {/* RIGHT sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-4 self-start">
          {/* Lucky at-a-glance */}
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #f0ead8", background: "white" }}>
            <div className="px-5 py-3" style={{ background: "linear-gradient(90deg, #FFF8E7, #FFFDF5)" }}>
              <p className="text-[11px] uppercase tracking-wider font-bold" style={{ color: "#8b6914" }}>
                {t("भाग्यशाली", "Lucky", "भाग्यशाली")}
              </p>
            </div>
            <div className="p-5 grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="mx-auto mb-2 rounded-full" style={{
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

          {/* Rating meter */}
          <div className="rounded-2xl p-5 bg-white" style={{ border: "1px solid #f0ead8" }}>
            <p className="text-[11px] uppercase tracking-wider font-bold mb-3" style={{ color: "#8b6914" }}>
              {t("आजचे रेटिंग", "Today's Rating", "आज की रेटिंग")}
            </p>
            <div className="flex items-end gap-3 mb-3">
              <span className="text-5xl font-bold leading-none" style={{ color: ratingColor(pred.rating), fontFamily: "serif" }}>
                {lang === "mr" || lang === "hi" ? toDev(pred.rating) : pred.rating}
              </span>
              <span className="text-xl text-stone-400 pb-1">/{lang === "mr" || lang === "hi" ? toDev(5) : 5}</span>
            </div>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex-1 h-2 rounded-full" style={{ background: i <= pred.rating ? ratingColor(pred.rating) : "#f0ead8" }} />
              ))}
            </div>
            <p className="text-xs mt-3 font-semibold uppercase tracking-wider" style={{ color: ratingColor(pred.rating) }}>
              {ratingLabel(pred.rating, lang)}
            </p>
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

// ─── FAQ (SEO) ───────────────────────────────────────────────────
function FAQSection() {
  const { t } = useLang();
  return (
    <section className="max-w-4xl mx-auto pt-12">
      <JsonLd data={faqSchema([
        { question: "What is Rashifal (Horoscope)?", answer: "Rashifal is a daily horoscope prediction based on your zodiac sign (Rashi) in Vedic astrology. It analyzes current planetary transits (Gochar) and their effects on each of the 12 zodiac signs." },
        { question: "राशीफल म्हणजे काय?", answer: "राशीफल हे वैदिक ज्योतिषशास्त्रातील तुमच्या राशीवर आधारित दैनिक भविष्य आहे. सध्याच्या ग्रह गोचराचे विश्लेषण करून १२ राशींसाठी करिअर, प्रेम, आरोग्य आणि आर्थिक भविष्य सांगितले जाते." },
        { question: "राशिफल क्या है?", answer: "राशिफल वैदिक ज्योतिष में आपकी राशि पर आधारित दैनिक भविष्य है. वर्तमान ग्रह गोचर का विश्लेषण करके १२ राशियों के लिए करियर, प्रेम, स्वास्थ्य और वित्त की भविष्यवाणी की जाती है." },
        { question: "How is Vedic Rashifal different from Western Horoscope?", answer: "Vedic Rashifal uses the sidereal zodiac (actual star positions) while Western horoscope uses the tropical zodiac. Vedic astrology also uses Moon sign as the primary reference, not Sun sign." },
        { question: "How often is the Rashifal updated?", answer: "Our Rashifal is generated daily based on real-time planetary transit calculations including dignity, retrograde, combustion and aspect factors." },
      ])} />
      <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: "#3d0c0c", fontFamily: "serif" }}>
        {t("राशीफल बद्दल सामान्य प्रश्न", "Frequently Asked Questions", "राशिफल के बारे में सामान्य प्रश्न")}
      </h2>
      <div className="space-y-3">
        {[
          { q: t("राशीफल म्हणजे काय?", "What is Rashifal?", "राशिफल क्या है?"), a: t("राशीफल हे तुमच्या राशीवर आधारित दैनिक भविष्य आहे. ग्रह गोचराचे विश्लेषण करून १२ राशींसाठी करिअर, प्रेम, आरोग्य आणि आर्थिक भविष्य सांगितले जाते.", "Daily horoscope based on your zodiac sign — analyzes planetary transits for career, love, health, and finances.", "आपकी राशि पर आधारित दैनिक भविष्य.") },
          { q: t("वैदिक राशीफल वि. पाश्चात्य राशिभविष्य?", "Vedic vs Western horoscope?", "वैदिक बनाम पाश्चात्य?"), a: t("वैदिक नक्षत्र-आधारित (सायडरियल) राशिचक्र वापरते; पाश्चात्य ट्रॉपिकल. वैदिकात चंद्र राशी प्रमुख.", "Vedic uses sidereal zodiac; Western uses tropical. Vedic anchors on Moon sign.", "वैदिक साइडरियल; पाश्चात्य ट्रॉपिकल.") },
          { q: t("अपडेट किती वेळा?", "Update frequency?", "अपडेट कितनी बार?"), a: t("दररोज रिअल-टाइम ग्रह गोचर गणनेवर आधारित.", "Daily, from real-time transit computations.", "प्रतिदिन, रियल-टाइम ग्रह गणना.") },
          { q: t("गणना कशावर आधारित?", "What powers the calculation?", "गणना का आधार?"), a: t("स्विस एफेमेरिस + लाहिरी अयनांश + उच्च/नीच/वक्री/अस्त/दृष्टी हे सर्व शास्त्रीय घटक.", "Swiss Ephemeris + Lahiri ayanamsa + classical dignity/retrograde/combustion/aspect factors.", "स्विस एफेमेरिस + लाहिरी अयनांश + शास्त्रीय नियम.") },
        ].map((faq, i) => (
          <details key={i} className="bg-white rounded-xl overflow-hidden group" style={{ border: "1px solid #f0ead8" }}>
            <summary className="px-5 py-4 cursor-pointer font-semibold text-sm flex items-center justify-between hover:bg-[#FFF8E7] transition" style={{ color: "#5c1a1a" }}>
              <span>{faq.q}</span>
              <span className="text-lg text-stone-400 group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="px-5 pb-4 text-sm leading-relaxed" style={{ color: "#5c1a1a", opacity: 0.85 }}>{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
