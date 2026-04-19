"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useLang } from "@/lib/astrology/language-context";
import { RASHI_LIST } from "@/lib/rashi-data";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/json-ld";
import { ZodiacBadge } from "@/components/zodiac-badge";

const RASHIS = RASHI_LIST;

interface Bilingual { mr: string; en: string }
interface PlanetPos {
  planet: string; planetMr: string; rashiMr: string; rashiEn: string;
  house: number; dignity: string; dignityMr: string;
  isRetrograde: boolean; isCombust: boolean;
}
interface WeeklyPrediction {
  rashiId: number; rashiMr: string; rashiEn: string; rating: number;
  bestDay: { date: string; rating: number };
  worstDay: { date: string; rating: number };
  summary: Bilingual; narrative: Bilingual;
  careerPoints: Bilingual[]; lovePoints: Bilingual[]; healthPoints: Bilingual[];
  advice: Bilingual; dailyRatings: { date: string; rating: number }[];
  luckyColor: Bilingual; luckyNumber: number;
  planetPositions: PlanetPos[];
}
interface WeeklyData {
  weekStart: string; weekEnd: string;
  events: { date: string; type: string; descriptionMr: string; descriptionEn: string; planet: string; planetMr: string }[];
  predictions: WeeklyPrediction[];
}

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
function colorHex(label: string): string { return COLOR_HEX[label] || "#d4a843"; }
const DIGNITY_COLORS: Record<string, { bg: string; fg: string }> = {
  exalted:     { bg: "#dcfce7", fg: "#14532d" },
  own:         { bg: "#e0f2fe", fg: "#0c4a6e" },
  friendly:    { bg: "#fef3c7", fg: "#78350f" },
  neutral:     { bg: "#f5f5f4", fg: "#44403c" },
  enemy:       { bg: "#ffedd5", fg: "#7c2d12" },
  debilitated: { bg: "#fee2e2", fg: "#7f1d1d" },
};

function toDev(s: string | number): string { const d = "०१२३४५६७८९"; return String(s).replace(/\d/g, (c) => d[parseInt(c)]); }
function ratingColor(r: number): string { return r >= 4 ? "#10b981" : r === 3 ? "#d4a843" : "#dc2626"; }
function ratingLabel(r: number, lang: string): string {
  if (lang === "en") return r >= 4 ? "Favorable" : r === 3 ? "Mixed" : "Careful";
  return r >= 4 ? "अनुकूल" : r === 3 ? "मिश्र" : "सावध";
}

function RatingDots({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1 items-center">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className="rounded-full" style={{
          width: i <= rating ? 8 : 6, height: i <= rating ? 8 : 6,
          background: i <= rating ? ratingColor(rating) : "#e7e5e4",
        }} />
      ))}
    </div>
  );
}


function DailyTrend({ data, lang, bestDate, worstDate }: { data: { date: string; rating: number }[]; lang: string; bestDate: string; worstDate: string }) {
  const W = 300, H = 120, PL = 18, PR = 8, PT = 10, PB = 26;
  const plotW = W - PL - PR;
  const plotH = H - PT - PB;
  const step = plotW / (data.length - 1);
  const pts = data.map((d, i) => ({
    x: PL + i * step,
    y: PT + plotH - ((d.rating - 1) / 4) * plotH,
    r: d.rating, date: d.date,
    isBest: d.date === bestDate,
    isWorst: d.date === worstDate,
  }));
  const path = pts.map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`)).join(" ");
  const area = `${path} L ${pts[pts.length - 1].x} ${PT + plotH} L ${pts[0].x} ${PT + plotH} Z`;
  const locale = lang === "mr" ? "mr-IN" : lang === "hi" ? "hi-IN" : "en-IN";
  const yTicks = [5, 4, 3, 2, 1];
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} aria-label="Weekly rating trend">
      <defs>
        <linearGradient id="rashiTrendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d4a843" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#d4a843" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Gridlines + Y-axis labels */}
      {yTicks.map((v) => {
        const y = PT + plotH - ((v - 1) / 4) * plotH;
        return (
          <g key={v}>
            <line x1={PL} y1={y} x2={W - PR} y2={y} stroke="#f0ead8" strokeWidth="1" strokeDasharray={v === 3 ? "2,3" : "0"} />
            <text x={PL - 4} y={y + 3} textAnchor="end" fontSize="8" fill="#a8a29e" fontWeight="600">{v}</text>
          </g>
        );
      })}
      <path d={area} fill="url(#rashiTrendFill)" />
      <path d={path} stroke="#5c1a1a" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round" />
      {pts.map((p, i) => (
        <g key={i}>
          {(p.isBest || p.isWorst) && (
            <circle cx={p.x} cy={p.y} r="9" fill="none" stroke={p.isBest ? "#10b981" : "#dc2626"} strokeWidth="1.5" strokeOpacity="0.5" />
          )}
          <circle cx={p.x} cy={p.y} r="4" fill={ratingColor(p.r)} stroke="white" strokeWidth="2" />
          <text x={p.x} y={p.y - 10} textAnchor="middle" fontSize="9" fill="#3d0c0c" fontWeight="700">{p.r}</text>
          <text x={p.x} y={PT + plotH + 14} textAnchor="middle" fontSize="9" fill="#8b6914" fontWeight="600">
            {new Date(p.date).toLocaleDateString(locale, { weekday: "narrow" })}
          </text>
          <text x={p.x} y={PT + plotH + 24} textAnchor="middle" fontSize="8" fill="#a8a29e">
            {lang === "mr" || lang === "hi" ? String(new Date(p.date).getDate()).replace(/\d/g, (c) => "०१२३४५६७८९"[parseInt(c)]) : new Date(p.date).getDate()}
          </text>
        </g>
      ))}
    </svg>
  );
}

function fmtDateRange(startISO: string, endISO: string, lang: string): string {
  const s = new Date(startISO); const e = new Date(endISO);
  const locale = lang === "mr" ? "mr-IN" : lang === "hi" ? "hi-IN" : "en-IN";
  const sStr = s.toLocaleDateString(locale, { day: "numeric", month: "short" });
  const eStr = e.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });
  return `${sStr} – ${eStr}`;
}

export default function SaptahikRashiClient({ rashiId, rashiSlug }: { rashiId: number; rashiSlug: string }) {
  const { t, lang } = useLang();
  const rashi = RASHIS[rashiId];
  const [data, setData] = useState<WeeklyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"forecast" | "planets">("forecast");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/rashifal/weekly`);
        if (res.ok) setData(await res.json());
      } finally { setLoading(false); }
    })();
  }, []);

  const pred = data?.predictions[rashiId];
  const el = ELEMENT[rashiId];
  const theme = ELEMENT_THEME[el];
  const locale = lang === "mr" ? "mr-IN" : lang === "hi" ? "hi-IN" : "en-IN";
  const fmtDay = (iso: string) => new Date(iso).toLocaleDateString(locale, { weekday: "short", day: "numeric", month: "short" });

  const prevId = (rashiId + 11) % 12;
  const nextId = (rashiId + 1) % 12;

  const paragraphs = useMemo(() => {
    if (!pred) return [];
    return t(pred.narrative.mr, pred.narrative.en, pred.narrative.mr).split("\n\n").map((p) => p.trim()).filter(Boolean);
  }, [pred, lang, t]);

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #FAF7F0 0%, #FAFAF8 240px)" }}>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: `https://bhaagyavedh.com/${lang}` },
        { name: "Rashifal", url: `https://bhaagyavedh.com/${lang}/rashifal` },
        { name: "Saptahik", url: `https://bhaagyavedh.com/${lang}/rashifal/saptahik` },
        { name: t(rashi.mr, rashi.en, rashi.mr), url: `https://bhaagyavedh.com/${lang}/rashifal/saptahik/${rashiSlug}` },
      ])} />
      <JsonLd data={faqSchema([
        { question: `${rashi.en} (${rashi.mr}) राशीचे या आठवड्याचे भविष्य काय आहे?`, answer: `या आठवड्याचे ${rashi.mr} साप्ताहिक भविष्य वास्तविक ग्रह गोचरावर आधारित आहे.` },
        { question: `What is this week's horoscope for ${rashi.en}?`, answer: `This week's ${rashi.en} weekly horoscope is based on real Vedic planetary transits.` },
      ])} />

      {/* Cinematic Hero — matches main rashifal size */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(145deg, #1a0505 0%, #3d0c0c 40%, #5c1a1a 100%)" }}>
        <svg aria-hidden className="absolute inset-0 w-full h-full opacity-15" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="stars-rashi" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="20" r="0.8" fill="#d4a843" />
              <circle cx="40" cy="55" r="1.2" fill="#d4a843" />
              <circle cx="65" cy="15" r="0.6" fill="#d4a843" />
              <circle cx="70" cy="70" r="0.9" fill="#d4a843" />
              <circle cx="20" cy="65" r="0.5" fill="#d4a843" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#stars-rashi)" />
        </svg>
        <div className="relative max-w-6xl mx-auto px-4 py-14 sm:py-20 text-center">
          <Link href={`/${lang}/rashifal/saptahik`} className="inline-flex items-center gap-2 text-xs uppercase tracking-widest mb-4 font-semibold" style={{ color: "#d4a843" }}>
            ← {t("सर्व राशी", "All signs", "सभी राशि")}
          </Link>
          <div className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] font-semibold mb-5" style={{ color: "#d4a843" }}>
            <span className="h-px w-8" style={{ background: "#d4a843" }} />
            {t("साप्ताहिक गोचर", "Weekly Transit", "साप्ताहिक गोचर")}
            <span className="h-px w-8" style={{ background: "#d4a843" }} />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-3" style={{ color: "#f5e6c8", fontFamily: "var(--font-heading)", letterSpacing: "-0.01em" }}>
            {t(`${rashi.mr} साप्ताहिक राशिभविष्य`, `${rashi.en} — Weekly Horoscope`, `${rashi.mr} साप्ताहिक राशिफल`)}
          </h1>
          {data && (
            <p className="text-lg sm:text-xl font-semibold tracking-wide" style={{ color: "#d4a843" }}>
              {fmtDateRange(data.weekStart, data.weekEnd, lang)}
            </p>
          )}
          <p className="mt-4 text-sm max-w-2xl mx-auto" style={{ color: "rgba(245,230,200,0.7)" }}>
            {t(`${rashi.mr} राशीचे या आठवड्याचे भविष्य — दररोजच्या रेटिंग व प्रमुख दिवसांसह.`,
               `${rashi.en} week ahead — with daily ratings and standout days.`,
               `${rashi.mr} राशि का इस सप्ताह का भविष्य.`)}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        {loading || !pred || !data ? (
          <div className="text-center py-20">
            <div className="inline-block w-10 h-10 border-4 border-[#d4a843]/30 border-t-[#5c1a1a] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="pt-6">
            {/* Nav: prev/next rashi */}
            <div className="flex justify-between mb-5">
              <Link href={`/${lang}/rashifal/saptahik/${RASHIS[prevId].slug}`} className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-full bg-white transition hover:bg-[#FFF8E7]" style={{ border: "1px solid #f0ead8", color: "#5c1a1a" }}>
                ← {t(RASHIS[prevId].mr, RASHIS[prevId].en, RASHIS[prevId].mr)}
              </Link>
              <Link href={`/${lang}/rashifal/saptahik/${RASHIS[nextId].slug}`} className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-full bg-white transition hover:bg-[#FFF8E7]" style={{ border: "1px solid #f0ead8", color: "#5c1a1a" }}>
                {t(RASHIS[nextId].mr, RASHIS[nextId].en, RASHIS[nextId].mr)} →
              </Link>
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
                  <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: "#3d0c0c", fontFamily: "serif", letterSpacing: "-0.01em" }}>
                    {t(rashi.mr, rashi.en, rashi.mr)}
                  </h2>
                  <p className="mt-2 text-base" style={{ color: "#5c1a1a" }}>
                    {t(pred.summary.mr, pred.summary.en, pred.summary.mr)}
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
                        style={{ color: "#3d0c0c", fontFamily: "serif" }}
                      >
                        {para}
                      </p>
                    ))}

                    <div className="rounded-2xl p-5 flex items-start gap-4" style={{ background: "linear-gradient(135deg, #FFF8E7, #FFFDF5)", border: "1px solid rgba(212,168,67,0.3)" }}>
                      <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: "linear-gradient(135deg, #d4a843, #b38a2d)" }}>!</div>
                      <div>
                        <p className="text-[11px] uppercase tracking-wider font-bold mb-1" style={{ color: "#8b6914" }}>
                          {t("आठवड्याचा सल्ला", "Advice of the Week", "सप्ताह की सलाह")}
                        </p>
                        <p className="text-sm leading-relaxed" style={{ color: "#3d0c0c" }}>{t(pred.advice.mr, pred.advice.en, pred.advice.mr)}</p>
                      </div>
                    </div>
                  </div>
                ) : (
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
                          {pred.planetPositions.map((p, i) => {
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
                                    {p.isRetrograde && <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ background: "#f3e8ff", color: "#6b21a8" }}>{t("वक्री", "Retro", "वक्री")}</span>}
                                    {p.isCombust && <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ background: "#fef3c7", color: "#92400e" }}>{t("अस्त", "Combust", "अस्त")}</span>}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </article>

              <aside className="space-y-5 lg:sticky lg:top-4 self-start">
                {/* Card — Lucky combined in one unified flow */}
                <div className="rounded-2xl overflow-hidden bg-white" style={{ border: "1px solid #f0ead8" }}>
                  <div className="px-5 py-4" style={{ background: "linear-gradient(135deg, #FFF8E7, #FFFDF5)", borderBottom: "1px solid #f0ead8" }}>
                    <div className="flex items-center gap-2">
                      <span className="text-base" style={{ color: "#d4a843" }}>✦</span>
                      <p className="text-[11px] uppercase tracking-wider font-bold" style={{ color: "#8b6914" }}>
                        {t("या आठवड्याचे भाग्य", "Lucky this Week", "इस सप्ताह का भाग्य")}
                      </p>
                    </div>
                    <p className="text-[10px] text-stone-500 mt-1 pl-6">
                      {t("कपडे, व्यवहार, प्रारंभ यासाठी मार्गदर्शन",
                         "For attire, dealings, new beginnings",
                         "कपड़े, व्यवहार, आरंभ हेतु")}
                    </p>
                  </div>
                  <div className="p-5 space-y-4">
                    {/* Lucky color row */}
                    <div className="flex items-center gap-4">
                      <div className="shrink-0 relative" style={{
                        width: 56, height: 56, borderRadius: "50%",
                        background: colorHex(t(pred.luckyColor.mr, pred.luckyColor.en, pred.luckyColor.mr)),
                        boxShadow: `0 8px 20px -6px ${colorHex(t(pred.luckyColor.mr, pred.luckyColor.en, pred.luckyColor.mr))}99, inset 0 2px 6px rgba(255,255,255,0.45)`,
                      }}>
                        <span className="absolute -top-1 -right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow" style={{ color: "#8b6914" }}>🎨</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">{t("शुभ रंग", "Auspicious Color", "शुभ रंग")}</p>
                        <p className="font-bold text-lg leading-tight" style={{ color: "#3d0c0c", fontFamily: "serif" }}>{t(pred.luckyColor.mr, pred.luckyColor.en, pred.luckyColor.mr)}</p>
                        <p className="text-[11px] text-stone-600 mt-0.5">{t("महत्त्वाच्या भेटी-मुलाखतीत परिधान करा", "Wear for key meetings", "मुख्य मुलाकातों में पहनें")}</p>
                      </div>
                    </div>
                    <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, #f0ead8, transparent)" }} />
                    {/* Lucky number row */}
                    <div className="flex items-center gap-4">
                      <div className="shrink-0 relative w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold text-white" style={{ background: "linear-gradient(135deg, #5c1a1a, #3d0c0c)", fontFamily: "serif", boxShadow: "0 6px 16px -6px rgba(60,12,12,0.6)" }}>
                        {lang === "mr" || lang === "hi" ? toDev(pred.luckyNumber) : pred.luckyNumber}
                        <span className="absolute -top-1 -right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow" style={{ color: "#8b6914" }}>#</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">{t("शुभ अंक", "Lucky Number", "शुभ अंक")}</p>
                        <p className="font-bold text-lg leading-tight" style={{ color: "#3d0c0c", fontFamily: "serif" }}>#{lang === "mr" || lang === "hi" ? toDev(pred.luckyNumber) : pred.luckyNumber}</p>
                        <p className="text-[11px] text-stone-600 mt-0.5">{t("व्यवहार, तारीख निवडीसाठी शुभ", "Helpful for deals & dates", "व्यवहार व तिथि चयन हेतु")}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card 3 — Other rashis quick switch, with names + ratings */}
                <div className="rounded-2xl overflow-hidden bg-white" style={{ border: "1px solid #f0ead8" }}>
                  <div className="px-5 py-4" style={{ background: "linear-gradient(90deg, #FFF8E7, #FFFDF5)", borderBottom: "1px solid #f0ead8" }}>
                    <p className="text-[11px] uppercase tracking-wider font-bold" style={{ color: "#8b6914" }}>
                      {t("इतर राशींचे साप्ताहिक", "Other Signs · Weekly", "अन्य राशि · साप्ताहिक")}
                    </p>
                    <p className="text-[10px] text-stone-500 mt-0.5">
                      {t("क्लिक करून त्या राशीचे भविष्य पहा", "Tap to jump to that sign", "क्लिक करें")}
                    </p>
                  </div>
                  <div className="p-3 grid grid-cols-2 gap-2">
                    {RASHIS.filter((r) => r.id !== rashi.id).map((r) => {
                      const p = data.predictions[r.id];
                      const re = ELEMENT[r.id];
                      const rt = ELEMENT_THEME[re];
                      return (
                        <Link
                          key={r.id}
                          href={`/${lang}/rashifal/saptahik/${r.slug}`}
                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#FFF8E7] transition group"
                          title={t(r.mr, r.en, r.mr)}
                        >
                          <ZodiacBadge slug={r.slug} size={32} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold truncate" style={{ color: "#3d0c0c" }}>{t(r.mr, r.en, r.mr)}</p>
                            <p className="text-[9px] font-bold" style={{ color: ratingColor(p?.rating ?? 3) }}>
                              {"★".repeat(p?.rating ?? 0)}{"☆".repeat(5 - (p?.rating ?? 0))}
                            </p>
                          </div>
                          <span className="text-stone-400 group-hover:text-[#5c1a1a] transition text-sm">→</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        )}

        {/* Bottom cross-nav */}
        <div className="flex flex-wrap gap-3 justify-center pt-12">
          <Link href={`/${lang}/rashifal/${rashiSlug}`} className="px-5 py-2.5 text-sm font-bold rounded-full bg-white border-2 transition hover:scale-105" style={{ borderColor: "#d4a843", color: "#5c1a1a" }}>
            {t(`${rashi.mr} दैनिक राशीफल`, `${rashi.en} Daily Horoscope`, `${rashi.mr} दैनिक राशिफल`)}
          </Link>
          <Link href={`/${lang}/rashifal/saptahik`} className="px-5 py-2.5 text-sm font-bold rounded-full bg-white border-2 transition hover:scale-105" style={{ borderColor: "#d4a843", color: "#5c1a1a" }}>
            {t("सर्व राशी साप्ताहिक", "All weekly signs", "सभी साप्ताहिक राशि")}
          </Link>
        </div>
      </div>
    </div>
  );
}
