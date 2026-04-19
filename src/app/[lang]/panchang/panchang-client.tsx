"use client";

import { useState, useEffect, useMemo } from "react";
import { useLang } from "@/lib/astrology/language-context";
import { formatTimeMarathi, formatTimeRangeMarathi } from "@/lib/astrology/time-format";

// ─── Data types (mirrors /api/panchang response) ────────────────
interface Festival { name: string; nameMr: string; type: string; }
interface PanchangData {
  date: string; day: string; tithi: string; tithiIndex: number; paksha: string;
  nakshatra: string; nakshatraEn: string; nakshatraLord: string;
  yoga: string; karana: string; rahuKaal: string; masa: string;
  moonRashi: string; sunRashi: string;
  sunrise: string; sunset: string;
  tithiEnd: string | null; karanaEnd: string | null; yogaEnd: string | null; moonRashiEnd: string | null;
  nakshatras: { name: string; nameEn: string; end: string | null }[];
  karanas: { name: string; end: string | null }[];
  festivals: Festival[];
}

// ─── Locations (city + coords + tz) ─────────────────────────────
const LOCATIONS = [
  { key: "pune", nameMr: "पुणे", nameEn: "Pune", lat: 18.5204, lng: 73.8567, tz: 5.5 },
  { key: "mumbai", nameMr: "मुंबई", nameEn: "Mumbai", lat: 19.076, lng: 72.8777, tz: 5.5 },
  { key: "nashik", nameMr: "नाशिक", nameEn: "Nashik", lat: 19.9975, lng: 73.7898, tz: 5.5 },
  { key: "nagpur", nameMr: "नागपूर", nameEn: "Nagpur", lat: 21.1458, lng: 79.0882, tz: 5.5 },
  { key: "kolhapur", nameMr: "कोल्हापूर", nameEn: "Kolhapur", lat: 16.705, lng: 74.2433, tz: 5.5 },
  { key: "aurangabad", nameMr: "छत्रपती संभाजीनगर", nameEn: "Chhatrapati Sambhaji Nagar", lat: 19.8762, lng: 75.3433, tz: 5.5 },
  { key: "solapur", nameMr: "सोलापूर", nameEn: "Solapur", lat: 17.6599, lng: 75.9064, tz: 5.5 },
  { key: "delhi", nameMr: "दिल्ली", nameEn: "Delhi", lat: 28.6139, lng: 77.209, tz: 5.5 },
];

// ─── Saka civil calendar ────────────────────────────────────────
const SAKA_MONTHS_MR = ["चैत्र", "वैशाख", "ज्येष्ठ", "आषाढ", "श्रावण", "भाद्रपद", "आश्विन", "कार्तिक", "अग्रहायण", "पौष", "माघ", "फाल्गुन"];
const SAKA_MONTHS_EN = ["Chaitra", "Vaisakha", "Jyaistha", "Asadha", "Sravana", "Bhadra", "Asvina", "Kartika", "Agrahayana", "Pausa", "Magha", "Phalguna"];
const SAKA_MONTHS_HI = ["चैत्र", "वैशाख", "ज्येष्ठ", "आषाढ़", "श्रावण", "भाद्रपद", "आश्विन", "कार्तिक", "अग्रहायण", "पौष", "माघ", "फाल्गुन"];

function isLeap(y: number) { return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0; }
function sakaCivilDate(gy: number, gm: number, gd: number) {
  const c1Day = (y: number) => (isLeap(y) ? 21 : 22);
  let sy: number, ay: number;
  if (gm > 3 || (gm === 3 && gd >= c1Day(gy))) { sy = gy - 78; ay = gy; }
  else { sy = gy - 79; ay = gy - 1; }
  const anchor = Date.UTC(ay, 2, c1Day(ay));
  const current = Date.UTC(gy, gm - 1, gd);
  const diff = Math.round((current - anchor) / 86400000);
  const lengths = [isLeap(sy + 78) ? 31 : 30, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30];
  let mi = 0, r = diff;
  while (mi < 11 && r >= lengths[mi]) { r -= lengths[mi]; mi++; }
  return { sakaYear: sy, monthIdx: mi, day: r + 1 };
}

// ─── Digit / time utils ─────────────────────────────────────────
function toDev(s: string | number) {
  const d = "०१२३४५६७८९";
  return String(s).replace(/\d/g, (c) => d[parseInt(c)]);
}
function fmt(hhmm: string | null, lang: string) {
  if (!hhmm) return "";
  return (lang === "mr" || lang === "hi") ? toDev(hhmm) : hhmm;
}
// Language-aware time formatter. mr → "दुपारी २:३०", en → "2:30 PM", hi → Devanagari 24h.
// Values ≥24:00 fold into next-day equivalents.
function fmtMr(hhmm: string | null, lang: string): string {
  if (!hhmm) return "";
  const [hStr, mStr] = hhmm.split(":");
  let h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  if (h >= 24) h -= 24;
  if (lang === "mr") return formatTimeMarathi(h, m, "mr");
  if (lang === "en") {
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
  }
  return fmt(hhmm, lang);
}
function fmtRangeMr(range: string, lang: string): string {
  const parts = range.split(/\s*-\s*/);
  if (parts.length !== 2) return range;
  return `${fmtMr(parts[0], lang)} – ${fmtMr(parts[1], lang)}`;
}
function hhmmToMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}
function minutesToHHMM(totalMin: number) {
  totalMin = Math.round(totalMin);
  const h = Math.floor(totalMin / 60) % 24;
  const m = ((totalMin % 60) + 60) % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// ─── Day-of-week based slot computations ────────────────────────
// Slot indices 1-8 (1/8th of day-length each). Day 0 = Sunday.
const RAHU_SLOT = [8, 2, 7, 5, 6, 4, 3];
const GULIKA_SLOT = [7, 6, 5, 4, 3, 2, 1];
const YAMAGANDA_SLOT = [5, 4, 3, 2, 1, 7, 6];

function dayRangeMin(sunrise: string, sunset: string, slot: number) {
  const sr = hhmmToMinutes(sunrise);
  const len = (hhmmToMinutes(sunset) - sr) / 8;
  return { start: sr + (slot - 1) * len, end: sr + slot * len };
}
function dayRange(sunrise: string, sunset: string, slot: number) {
  const r = dayRangeMin(sunrise, sunset, slot);
  return `${minutesToHHMM(r.start)} - ${minutesToHHMM(r.end)}`;
}
function abhijitRangeMin(sunrise: string, sunset: string) {
  const noon = (hhmmToMinutes(sunrise) + hhmmToMinutes(sunset)) / 2;
  return { start: noon - 24, end: noon + 24 };
}
function abhijitRange(sunrise: string, sunset: string) {
  const r = abhijitRangeMin(sunrise, sunset);
  return `${minutesToHHMM(r.start)} - ${minutesToHHMM(r.end)}`;
}
function parseRangeToMin(range: string): { start: number; end: number } {
  // Accepts "HH:MM - HH:MM" (24h) or "HH:MM AM - HH:MM PM"
  const ampmMatch = range.match(/(\d{1,2}):(\d{2})\s*(AM|PM).*?(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (ampmMatch) {
    const conv = (h: string, m: string, p: string) => {
      let hh = parseInt(h, 10);
      if (p.toUpperCase() === "PM" && hh !== 12) hh += 12;
      if (p.toUpperCase() === "AM" && hh === 12) hh = 0;
      return hh * 60 + parseInt(m, 10);
    };
    return { start: conv(ampmMatch[1], ampmMatch[2], ampmMatch[3]), end: conv(ampmMatch[4], ampmMatch[5], ampmMatch[6]) };
  }
  const [a, b] = range.split(/\s*[-–]\s*/);
  return { start: hhmmToMinutes(a), end: hhmmToMinutes(b) };
}

// ─── Choghadiya ─────────────────────────────────────────────────
// Each day has 8 day slots + 8 night slots of 1/8 day/night length.
// Slot names cycle per weekday starting slot.
type ChoghadiyaKind = "shubh" | "labh" | "amrit" | "chal" | "rog" | "kaal" | "udveg";
const CHOGHADIYA_MR: Record<ChoghadiyaKind, string> = {
  shubh: "शुभ", labh: "लाभ", amrit: "अमृत", chal: "चल", rog: "रोग", kaal: "काळ", udveg: "उद्वेग",
};
const CHOGHADIYA_COLOR: Record<ChoghadiyaKind, string> = {
  shubh: "#d4a843", labh: "#2d6b2d", amrit: "#10b981", chal: "#6b7280", rog: "#dc2626", kaal: "#111827", udveg: "#b45309",
};
// Day sequences starting at sunrise by weekday
const DAY_SEQ: Record<number, ChoghadiyaKind[]> = {
  0: ["udveg", "chal", "labh", "amrit", "kaal", "shubh", "rog", "udveg"],          // Sun
  1: ["amrit", "kaal", "shubh", "rog", "udveg", "chal", "labh", "amrit"],          // Mon
  2: ["rog", "udveg", "chal", "labh", "amrit", "kaal", "shubh", "rog"],            // Tue
  3: ["labh", "amrit", "kaal", "shubh", "rog", "udveg", "chal", "labh"],           // Wed
  4: ["shubh", "rog", "udveg", "chal", "labh", "amrit", "kaal", "shubh"],          // Thu
  5: ["chal", "labh", "amrit", "kaal", "shubh", "rog", "udveg", "chal"],           // Fri
  6: ["kaal", "shubh", "rog", "udveg", "chal", "labh", "amrit", "kaal"],           // Sat
};
// Night sequences starting at sunset by weekday
const NIGHT_SEQ: Record<number, ChoghadiyaKind[]> = {
  0: ["shubh", "amrit", "chal", "rog", "kaal", "labh", "udveg", "shubh"],
  1: ["chal", "rog", "kaal", "labh", "udveg", "shubh", "amrit", "chal"],
  2: ["kaal", "labh", "udveg", "shubh", "amrit", "chal", "rog", "kaal"],
  3: ["udveg", "shubh", "amrit", "chal", "rog", "kaal", "labh", "udveg"],
  4: ["amrit", "chal", "rog", "kaal", "labh", "udveg", "shubh", "amrit"],
  5: ["rog", "kaal", "labh", "udveg", "shubh", "amrit", "chal", "rog"],
  6: ["labh", "udveg", "shubh", "amrit", "chal", "rog", "kaal", "labh"],
};

function choghadiyaDay(dow: number, sunrise: string, sunset: string, lang: string) {
  const seq = DAY_SEQ[dow];
  const sr = hhmmToMinutes(sunrise);
  const ss = hhmmToMinutes(sunset);
  const len = (ss - sr) / 8;
  return seq.map((kind, i) => ({
    kind,
    name: lang === "en" ? kind.charAt(0).toUpperCase() + kind.slice(1) : CHOGHADIYA_MR[kind],
    range: `${minutesToHHMM(sr + i * len)} - ${minutesToHHMM(sr + (i + 1) * len)}`,
  }));
}
function choghadiyaNight(dow: number, sunset: string, lang: string, nextSunrise?: string) {
  const seq = NIGHT_SEQ[dow];
  const ss = hhmmToMinutes(sunset);
  // Night ends at next-day sunrise; approximate as sunset + 12h unless provided.
  const nr = nextSunrise ? hhmmToMinutes(nextSunrise) + 24 * 60 : ss + 12 * 60;
  const len = (nr - ss) / 8;
  return seq.map((kind, i) => ({
    kind,
    name: lang === "en" ? kind.charAt(0).toUpperCase() + kind.slice(1) : CHOGHADIYA_MR[kind],
    range: `${minutesToHHMM(ss + i * len)} - ${minutesToHHMM(ss + (i + 1) * len)}`,
  }));
}

// ─── North Indian daily chart (kundali-style, 12 houses) ────────
const CHART_PLANET_ABBR: Record<string, { mr: string; en: string; hi: string }> = {
  Sun: { mr: "र", en: "Su", hi: "सू" },
  Moon: { mr: "चं", en: "Mo", hi: "चं" },
  Mars: { mr: "मं", en: "Ma", hi: "मं" },
  Mercury: { mr: "बु", en: "Me", hi: "बु" },
  Jupiter: { mr: "गु", en: "Ju", hi: "गु" },
  Venus: { mr: "शु", en: "Ve", hi: "शु" },
  Saturn: { mr: "श", en: "Sa", hi: "श" },
  Rahu: { mr: "रा", en: "Ra", hi: "रा" },
  Ketu: { mr: "के", en: "Ke", hi: "के" },
};
const RASHI_ANCHORS_NI: Record<number, { x: number; y: number }> = {
  1: { x: 200, y: 25 }, 2: { x: 100, y: 15 }, 3: { x: 15, y: 100 },
  4: { x: 25, y: 200 }, 5: { x: 15, y: 300 }, 6: { x: 100, y: 385 },
  7: { x: 200, y: 375 }, 8: { x: 300, y: 385 }, 9: { x: 385, y: 300 },
  10: { x: 375, y: 200 }, 11: { x: 385, y: 100 }, 12: { x: 300, y: 15 },
};
const PLANET_ANCHORS_NI: Record<number, { x: number; y: number }> = {
  1: { x: 200, y: 115 }, 2: { x: 100, y: 55 }, 3: { x: 55, y: 100 },
  4: { x: 115, y: 200 }, 5: { x: 55, y: 300 }, 6: { x: 100, y: 345 },
  7: { x: 200, y: 285 }, 8: { x: 300, y: 345 }, 9: { x: 345, y: 300 },
  10: { x: 285, y: 200 }, 11: { x: 345, y: 100 }, 12: { x: 300, y: 55 },
};

type DayPlanet = {
  id: string; name: string; nameMr: string;
  house: number; rashiIndex: number; rashiMr: string; rashi: string;
  isRetrograde: boolean; degreeDMS: string;
};
type DayChart = {
  lagnaRashiIndex: number; lagnaRashi: string; lagnaRashiMr: string;
  planets: DayPlanet[];
};

function NorthIndianChart({ chart, lang }: { chart: DayChart; lang: string }) {
  const stroke = "#8b2c2c";
  const bg = "#fafaf8";
  const rashiColor = "#8b2c2c";
  const planetColor = "#1f2937";
  const retroColor = "#dc2626";

  const rashiFor = (house: number) => ((chart.lagnaRashiIndex + house - 1) % 12) + 1;
  const nMr = (v: number) => String(v).replace(/[0-9]/g, (d) => "०१२३४५६७८९"[parseInt(d)]);

  const houseMap: Record<number, DayPlanet[]> = {};
  for (let i = 1; i <= 12; i++) houseMap[i] = [];
  chart.planets.forEach((p) => { if (houseMap[p.house]) houseMap[p.house].push(p); });

  const abbrFor = (p: DayPlanet) => {
    const a = CHART_PLANET_ABBR[p.id];
    if (!a) return p.nameMr;
    return lang === "mr" ? a.mr : lang === "hi" ? a.hi : a.en;
  };

  return (
    <svg
      viewBox="-12 -12 424 424"
      className="w-full max-w-sm mx-auto"
      style={{ background: bg, border: `2px solid ${stroke}` }}
      role="img"
      aria-label={lang === "mr" ? `आजच्या दिवसाचा द्वादश भाव ग्रहचक्र — लग्न ${chart.lagnaRashiMr}` : `Today's 12-house graha chart, Lagna ${chart.lagnaRashi}`}
    >
      <title>{lang === "mr" ? `आजचा ग्रहचक्र — लग्न ${chart.lagnaRashiMr}` : `Today's Graha Chart — Lagna ${chart.lagnaRashi}`}</title>
      <rect x="0" y="0" width="400" height="400" fill="none" stroke={stroke} strokeWidth="2" />
      <line x1="0" y1="0" x2="400" y2="400" stroke={stroke} strokeWidth="1.5" />
      <line x1="400" y1="0" x2="0" y2="400" stroke={stroke} strokeWidth="1.5" />
      <polygon points="200,0 400,200 200,400 0,200" fill="none" stroke={stroke} strokeWidth="1.5" />

      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((house) => {
        const planets = houseMap[house] || [];
        const n = planets.length;
        const fontSize = n <= 2 ? 13 : n === 3 ? 11 : 10;
        const lineH = n <= 2 ? 15 : n === 3 ? 13 : 11;
        const ra = RASHI_ANCHORS_NI[house];
        const pa = PLANET_ANCHORS_NI[house];
        const rashiText = lang === "mr" || lang === "hi" ? nMr(rashiFor(house)) : String(rashiFor(house));

        return (
          <g key={house}>
            <text x={ra.x} y={ra.y} textAnchor="middle" dominantBaseline="middle"
              fontSize="14" fontWeight="700" fill={rashiColor}
              style={{ paintOrder: "stroke", stroke: bg, strokeWidth: 4, strokeLinejoin: "round" }}>
              {rashiText}
            </text>
            {planets.map((p, i) => {
              const off = (i - (n - 1) / 2) * lineH;
              return (
                <text key={p.id} x={pa.x} y={pa.y + off} textAnchor="middle" dominantBaseline="middle"
                  fontSize={fontSize} fontWeight="700" fill={p.isRetrograde ? retroColor : planetColor}
                  style={{ paintOrder: "stroke", stroke: bg, strokeWidth: 3, strokeLinejoin: "round" }}>
                  {abbrFor(p)}{p.isRetrograde ? (lang === "mr" ? "(व)" : "(R)") : ""}
                </text>
              );
            })}
          </g>
        );
      })}

      <text x="200" y="200" textAnchor="middle" dominantBaseline="middle" fontSize="9"
        fill="#5c1a1a" opacity="0.6" fontWeight="600">
        {lang === "en" ? "Lagna" : "लग्न"} · {chart.lagnaRashiMr}
      </text>
    </svg>
  );
}

// ─── Day-clock chart (24h ring with Rahu/Gulika/Yamaganda/Abhijit bands) ────
function arcPath(r1: number, r2: number, a1: number, a2: number): string {
  const toRad = (d: number) => ((d - 90) * Math.PI) / 180;
  const p = (r: number, a: number): [number, number] => [r * Math.cos(toRad(a)), r * Math.sin(toRad(a))];
  const [x1o, y1o] = p(r2, a1);
  const [x2o, y2o] = p(r2, a2);
  const [x2i, y2i] = p(r1, a2);
  const [x1i, y1i] = p(r1, a1);
  const large = Math.abs(a2 - a1) > 180 ? 1 : 0;
  return `M ${x1o} ${y1o} A ${r2} ${r2} 0 ${large} 1 ${x2o} ${y2o} L ${x2i} ${y2i} A ${r1} ${r1} 0 ${large} 0 ${x1i} ${y1i} Z`;
}
function minToAngle(min: number) { return (min / 1440) * 360; }

function DayClock({ sunrise, sunset, rahuRange, gulikaRange, yamagandaRange, abhijitRange, lang }: {
  sunrise: string; sunset: string;
  rahuRange: { start: number; end: number };
  gulikaRange: { start: number; end: number };
  yamagandaRange: { start: number; end: number };
  abhijitRange: { start: number; end: number } | null;
  lang: string;
}) {
  const sr = hhmmToMinutes(sunrise);
  const ss = hhmmToMinutes(sunset);
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();

  const bands = [
    { name: "राहू", color: "#dc2626", range: rahuRange },
    { name: "गुळिक", color: "#b45309", range: gulikaRange },
    { name: "यम", color: "#374151", range: yamagandaRange },
  ];

  // Radii
  const R_OUTER_DAY = 100;
  const R_INNER_DAY = 82;
  const R_BAND = 78;
  const R_BAND_INNER = 66;
  const R_ABHIJIT = 62;
  const R_ABHIJIT_INNER = 54;

  // Tick labels every 6h
  const ticks = [0, 3, 6, 9, 12, 15, 18, 21];

  return (
    <svg width="240" height="240" viewBox="-120 -120 240 240" className="mx-auto">
      {/* Night ring background (dark) */}
      <circle cx="0" cy="0" r={R_OUTER_DAY} fill="#1a1a2e" />
      {/* Day arc (cream) */}
      <path
        d={arcPath(R_INNER_DAY, R_OUTER_DAY, minToAngle(sr), minToAngle(ss))}
        fill="#f5efe0"
      />
      {/* Sunrise marker */}
      <circle cx={(R_OUTER_DAY + 6) * Math.cos(((minToAngle(sr) - 90) * Math.PI) / 180)}
              cy={(R_OUTER_DAY + 6) * Math.sin(((minToAngle(sr) - 90) * Math.PI) / 180)}
              r="4" fill="#d4a843" />
      {/* Sunset marker */}
      <circle cx={(R_OUTER_DAY + 6) * Math.cos(((minToAngle(ss) - 90) * Math.PI) / 180)}
              cy={(R_OUTER_DAY + 6) * Math.sin(((minToAngle(ss) - 90) * Math.PI) / 180)}
              r="4" fill="#6366f1" />

      {/* Inauspicious bands (inside day arc) */}
      {bands.map((b, i) => (
        <path
          key={b.name}
          d={arcPath(R_BAND_INNER, R_BAND, minToAngle(b.range.start), minToAngle(b.range.end))}
          fill={b.color}
          opacity={0.9}
        />
      ))}

      {/* Abhijit (auspicious) inner arc */}
      {abhijitRange && (
        <path
          d={arcPath(R_ABHIJIT_INNER, R_ABHIJIT, minToAngle(abhijitRange.start), minToAngle(abhijitRange.end))}
          fill="#10b981"
          opacity={0.95}
        />
      )}

      {/* Hour ticks */}
      {ticks.map((h) => {
        const a = ((minToAngle(h * 60) - 90) * Math.PI) / 180;
        const x1 = (R_OUTER_DAY - 4) * Math.cos(a);
        const y1 = (R_OUTER_DAY - 4) * Math.sin(a);
        const x2 = (R_OUTER_DAY + 2) * Math.cos(a);
        const y2 = (R_OUTER_DAY + 2) * Math.sin(a);
        const lx = (R_OUTER_DAY + 14) * Math.cos(a);
        const ly = (R_OUTER_DAY + 14) * Math.sin(a);
        return (
          <g key={h}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#5c1a1a" strokeWidth="1.5" />
            <text x={lx} y={ly} textAnchor="middle" dominantBaseline="central" fontSize="10" fill="#5c1a1a" fontWeight="bold">
              {lang === "en" ? h : toDev(h)}
            </text>
          </g>
        );
      })}

      {/* "Now" pointer */}
      <line
        x1="0" y1="0"
        x2={(R_OUTER_DAY - 2) * Math.cos(((minToAngle(nowMin) - 90) * Math.PI) / 180)}
        y2={(R_OUTER_DAY - 2) * Math.sin(((minToAngle(nowMin) - 90) * Math.PI) / 180)}
        stroke="#b91c1c" strokeWidth="2" strokeLinecap="round"
      />
      <circle cx="0" cy="0" r="4" fill="#b91c1c" />

      {/* Center label */}
      <text x="0" y="-6" textAnchor="middle" fontSize="9" fill="#5c1a1a" fontWeight="bold">{lang === "en" ? "TODAY" : "आज"}</text>
      <text x="0" y="8" textAnchor="middle" fontSize="12" fill="#3d0c0c" fontWeight="bold">
        {lang === "mr" ? formatTimeMarathi(now.getHours(), now.getMinutes(), "mr") : `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`}
      </text>
    </svg>
  );
}

// ─── Moon phase (visual) ────────────────────────────────────────
function MoonPhase({ tithiIndex, paksha }: { tithiIndex: number; paksha: string }) {
  // tithiIndex 1-15; Shukla waxes 0→full, Krishna wanes full→0.
  const isShukla = paksha.includes("शुक्ल");
  const pct = isShukla ? tithiIndex / 15 : 1 - tithiIndex / 15;
  const r = 28;
  return (
    <svg width="72" height="72" viewBox="-40 -40 80 80" role="img" aria-label={`Moon phase, ${paksha}, tithi ${tithiIndex}`}><title>{`${paksha} — तिथि ${tithiIndex}`}</title>
      <circle cx="0" cy="0" r={r} fill="#1a1a2e" stroke="#d4a843" strokeWidth="1" />
      <path
        d={`M 0 -${r} A ${r * (1 - 2 * pct)} ${r} 0 0 ${isShukla ? 1 : 0} 0 ${r} A ${r} ${r} 0 0 ${isShukla ? 1 : 0} 0 -${r} Z`}
        fill="#f5efe0"
      />
    </svg>
  );
}

function Legend({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: color }} />
      <span className="font-bold text-stone-700 w-20">{label}</span>
      <span style={{ color: "#3d0c0c" }}>{value}</span>
    </div>
  );
}

// ─── Main preview ───────────────────────────────────────────────
const DAY_HEADERS_MR = ["रविवार", "सोमवार", "मंगळवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];
const DAY_HEADERS_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function todayLocalISO() {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
}

export default function PanchangPageClient() {
  const { t, lang } = useLang();
  // Mumbai-default to match Kalnirnay. localStorage overrides below.
  const DEFAULT_LOC = LOCATIONS.find((l) => l.key === "mumbai") || LOCATIONS[0];
  // SSR-safe: initial state empty; hydrate from Date.now() + localStorage on mount.
  const [date, setDate] = useState<string>("");
  const [loc, setLoc] = useState(DEFAULT_LOC);
  const [panchang, setPanchang] = useState<PanchangData | null>(null);
  const [dayChart, setDayChart] = useState<DayChart | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize client-side to avoid SSR/client date mismatch.
  useEffect(() => {
    setDate(todayLocalISO());
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("panchang.loc");
      if (saved) {
        const match = LOCATIONS.find((l) => l.key === saved);
        if (match) setLoc(match);
      }
    }
  }, []);

  // Persist location selection.
  useEffect(() => {
    if (typeof window !== "undefined" && loc?.key) {
      window.localStorage.setItem("panchang.loc", loc.key);
    }
  }, [loc]);

  useEffect(() => {
    if (!date) return;
    setLoading(true);
    const q = `date=${date}&lat=${loc.lat}&lng=${loc.lng}&tz=${loc.tz}`;
    Promise.all([
      fetch(`/api/panchang?${q}`).then((r) => r.json()),
      fetch(`/api/day-chart?${q}`).then((r) => r.json()),
    ])
      .then(([p, c]) => { setPanchang(p); setDayChart(c); })
      .finally(() => setLoading(false));
  }, [date, loc]);

  const dateObj = useMemo(() => {
    if (!date) return new Date();
    const [y, m, d] = date.split("-").map(Number);
    return new Date(y, m - 1, d);
  }, [date]);
  const dow = dateObj.getDay();
  const saka = useMemo(() => {
    if (!date) return { sakaYear: 0, monthIdx: 0, day: 1 };
    const [y, m, d] = date.split("-").map(Number);
    return sakaCivilDate(y, m, d);
  }, [date]);

  const shiftDay = (delta: number) => {
    const d = new Date(dateObj);
    d.setDate(d.getDate() + delta);
    setDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
  };

  const dayTypeColor = (() => {
    if (!panchang) return "#d4a843";
    if (panchang.festivals.some((f) => f.type === "major")) return "#d4a843";
    if (panchang.festivals.some((f) => f.type === "ekadashi")) return "#7c3aed";
    if (panchang.festivals.some((f) => f.type === "vrat")) return "#059669";
    if ([0].includes(dow)) return "#b91c1c"; // Sunday
    return "#3d0c0c";
  })();

  const chogDay = panchang ? choghadiyaDay(dow, panchang.sunrise, panchang.sunset, lang) : [];
  const chogNight = panchang ? choghadiyaNight(dow, panchang.sunset, lang) : [];

  const chartRanges = panchang ? {
    rahu: parseRangeToMin(panchang.rahuKaal),
    gulika: dayRangeMin(panchang.sunrise, panchang.sunset, GULIKA_SLOT[dow]),
    yamaganda: dayRangeMin(panchang.sunrise, panchang.sunset, YAMAGANDA_SLOT[dow]),
    abhijit: dow === 3 ? null : abhijitRangeMin(panchang.sunrise, panchang.sunset),
  } : null;

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-16">
      <h1 className="sr-only">
        {lang === "mr" ? "आजचे पंचांग — तिथी, नक्षत्र, योग, करण, राहू काळ"
          : lang === "hi" ? "आज का पंचांग — तिथि, नक्षत्र, योग, करण, राहु काल"
          : "Today's Panchang — Tithi, Nakshatra, Yoga, Karana, Rahu Kaal"}
      </h1>
      {/* ── Compact Top Bar ── */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-20 no-print">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          <select
            value={loc.key}
            onChange={(e) => setLoc(LOCATIONS.find((x) => x.key === e.target.value) || LOCATIONS[0])}
            className="px-3 py-2 border border-stone-300 rounded-lg text-sm font-semibold bg-white"
          >
            {LOCATIONS.map((l) => (
              <option key={l.key} value={l.key}>
                {lang === "en" ? l.nameEn : l.nameMr}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-1">
            <button onClick={() => shiftDay(-1)} className="w-9 h-9 rounded-lg hover:bg-stone-100 font-bold text-[#3d0c0c]">‹</button>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3 py-2 border border-stone-300 rounded-lg text-sm font-semibold"
            />
            <button onClick={() => shiftDay(1)} className="w-9 h-9 rounded-lg hover:bg-stone-100 font-bold text-[#3d0c0c]">›</button>
          </div>
          <button
            onClick={() => setDate(todayLocalISO())}
            className="px-3 py-2 text-xs font-bold rounded-lg bg-[#FFF3D6] text-[#3d0c0c] hover:bg-[#FFF8E7]"
          >
            {t("आज", "Today", "आज")}
          </button>
          <div className="flex-1" />
          <button onClick={() => typeof window !== "undefined" && window.print()} className="px-3 py-2 text-xs font-bold rounded-lg border border-stone-300 hover:bg-stone-100">
            {t("प्रिंट", "Print", "प्रिंट")} 🖨
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6">
        {loading || !panchang ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-[#d4a843]/30 border-t-[#5c1a1a] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            {/* ╔════ LEFT COLUMN ════╗ */}
            <div className="space-y-4">
            {/* ── Main Kalnirnay-style card ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden print-avoid-break">
              {/* Day-type color strip */}
              <div className="h-1.5" style={{ background: dayTypeColor }} />

              {/* Top strip: masa paksha tithi  |  vaar */}
              <div className="flex items-center" style={{ background: "#f5efe0" }}>
                <div className="flex-1 px-4 py-2.5 text-sm font-bold" style={{ color: "#5c1a1a" }}>
                  {panchang.masa.split("(")[0].trim()} {panchang.paksha.includes("शुक्ल") ? "शु." : "कृ."} {lang === "en" ? panchang.tithiIndex : toDev(panchang.tithiIndex)}
                </div>
                <div className="px-6 py-2.5 font-bold text-white text-sm tracking-wide"
                  style={{ background: dow === 0 ? "#b91c1c" : dow === 2 ? "#b91c1c" : "#3d0c0c" }}>
                  {lang === "en" ? DAY_HEADERS_EN[dow] : DAY_HEADERS_MR[dow]}
                </div>
              </div>

              {/* Festival chips */}
              {panchang.festivals.length > 0 && (
                <div className="px-4 pt-3 flex flex-wrap gap-1.5">
                  {panchang.festivals.map((f, i) => {
                    const bg = f.type === "major" ? "#d4a843"
                      : f.type === "ekadashi" ? "#7c3aed"
                      : f.type === "vrat" ? "#059669"
                      : f.type === "national" || f.type === "state" ? "#2563eb"
                      : "#6b7280";
                    return (
                      <span key={i} className="px-2.5 py-1 rounded-md text-xs font-bold text-white" style={{ background: bg }}>
                        {t(f.nameMr, f.name, f.nameMr)}
                      </span>
                    );
                  })}
                </div>
              )}

              {/* Giant red date numeral + month-year + moon glyph */}
              <div className="grid grid-cols-[1fr,auto,1fr] items-center px-4 py-6">
                <div />
                <div className="text-center">
                  <p className="leading-none font-bold" style={{ fontSize: "clamp(72px, 16vw, 104px)", color: "#b91c1c", fontFamily: "serif" }}>
                    {lang === "en" ? dateObj.getDate() : toDev(dateObj.getDate())}
                  </p>
                  <p className="text-sm mt-2 font-semibold" style={{ color: "#5c1a1a" }}>
                    {dateObj.toLocaleDateString(lang === "mr" ? "mr-IN" : lang === "hi" ? "hi-IN" : "en-IN", { month: "long", year: "numeric" })}
                  </p>
                </div>
                <div className="flex justify-end">
                  <MoonPhase tithiIndex={panchang.tithiIndex} paksha={panchang.paksha} />
                </div>
              </div>

              {/* Sunrise / Sunset / Moon Rashi row */}
              <div className="flex items-center justify-center gap-8 pb-4 px-4 border-b border-stone-100">
                <div className="text-center">
                  <div className="text-[10px] uppercase tracking-wider text-stone-500 font-bold">{t("सूर्योदय", "Sunrise", "सूर्योदय")}</div>
                  <div className="text-base font-bold" style={{ color: "#3d0c0c" }}>{fmtMr(panchang.sunrise, lang)}</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] uppercase tracking-wider text-stone-500 font-bold">{t("सूर्यास्त", "Sunset", "सूर्यास्त")}</div>
                  <div className="text-base font-bold" style={{ color: "#3d0c0c" }}>{fmtMr(panchang.sunset, lang)}</div>
                </div>
                <div className="text-center">
                  <div className="text-[10px] uppercase tracking-wider text-stone-500 font-bold">{t("चंद्र राशी", "Moon Sign", "चंद्र राशि")}</div>
                  <div className="text-base font-bold" style={{ color: "#3d0c0c" }}>
                    {panchang.moonRashi}
                    {panchang.moonRashiEnd && <span className="ml-1 text-xs font-normal text-stone-500">{fmtMr(panchang.moonRashiEnd, lang)}</span>}
                  </div>
                </div>
              </div>

              {/* Panchang rows (Kalnirnay layout) */}
              <div className="px-5 py-4 space-y-2.5">
                {(() => {
                  const sakaMonthName = lang === "mr" ? SAKA_MONTHS_MR[saka.monthIdx] : lang === "hi" ? SAKA_MONTHS_HI[saka.monthIdx] : SAKA_MONTHS_EN[saka.monthIdx];
                  const sakaDayStr = lang === "en" ? String(saka.day) : toDev(saka.day);
                  const sakaYearStr = lang === "en" ? String(saka.sakaYear) : toDev(saka.sakaYear);
                  const nakText = panchang.nakshatras.length > 0
                    ? panchang.nakshatras.map((n) => `${t(n.name, n.nameEn, n.name)}${n.end ? " " + fmt(n.end, lang) : ""}`).join(", ")
                    : t(panchang.nakshatra, panchang.nakshatraEn, panchang.nakshatra);
                  const karanaText = panchang.karanas.length > 0
                    ? panchang.karanas.slice(0, 2).map((k) => `${k.name}${k.end ? " " + fmt(k.end, lang) : ""}`).join(", ")
                    : panchang.karana;
                  const tithiTimeStr = panchang.tithiEnd ? " " + fmtMr(panchang.tithiEnd, lang) : "";
                  const yogaTimeStr = panchang.yogaEnd ? " " + fmtMr(panchang.yogaEnd, lang) : "";
                  const nakTextMr = panchang.nakshatras.length > 0
                    ? panchang.nakshatras.map((n) => `${t(n.name, n.nameEn, n.name)}${n.end ? " " + fmtMr(n.end, lang) : ""}`).join(", ")
                    : t(panchang.nakshatra, panchang.nakshatraEn, panchang.nakshatra);
                  const karanaTextMr = panchang.karanas.length > 0
                    ? panchang.karanas.slice(0, 2).map((k) => `${k.name}${k.end ? " " + fmtMr(k.end, lang) : ""}`).join(", ")
                    : panchang.karana;
                  const rows = [
                    { l: t("तिथी", "Tithi", "तिथि"), v: `${panchang.paksha.includes("शुक्ल") ? "शु." : "कृ."} ${panchang.tithi}${tithiTimeStr}` },
                    { l: t("नक्षत्र", "Nakshatra", "नक्षत्र"), v: nakTextMr },
                    { l: t("योग", "Yoga", "योग"), v: `${panchang.yoga}${yogaTimeStr}` },
                    { l: t("करण", "Karana", "करण"), v: karanaTextMr },
                    { l: t("राहुकाळ", "Rahu Kaal", "राहुकाल"), v: formatTimeRangeMarathi(panchang.rahuKaal, lang), danger: true },
                    { l: t("गुळिक काळ", "Gulika Kaal", "गुलिक काल"), v: fmtRangeMr(dayRange(panchang.sunrise, panchang.sunset, GULIKA_SLOT[dow]), lang) },
                    { l: t("यमगंड", "Yamaganda", "यमगंड"), v: fmtRangeMr(dayRange(panchang.sunrise, panchang.sunset, YAMAGANDA_SLOT[dow]), lang) },
                    { l: t("अभिजित मुहूर्त", "Abhijit Muhurta", "अभिजित मुहूर्त"), v: dow === 3 ? t("नाही (बुधवार)", "None (Wednesday)", "नहीं (बुधवार)") : fmtRangeMr(abhijitRange(panchang.sunrise, panchang.sunset), lang), good: true },
                    { l: t("राष्ट्रीय", "National", "राष्ट्रीय"), v: `${sakaMonthName} ${sakaDayStr}, ${t("शके", "Saka", "शक")} ${sakaYearStr}` },
                  ];
                  return rows.map((r, i) => (
                    <div key={i} className="flex items-baseline gap-3 text-sm">
                      <span className="font-bold w-32 shrink-0" style={{ color: "#5c1a1a" }}>{r.l}:</span>
                      <span style={{ color: r.danger ? "#b91c1c" : r.good ? "#047857" : "#3d0c0c" }}>
                        {(lang === "mr" || lang === "hi") && typeof r.v === "string" ? toDev(r.v) : r.v}
                      </span>
                    </div>
                  ));
                })()}
              </div>
            </div>

            {/* ── Sun + Moon detail mini-cards ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-4">
                <h4 className="text-[11px] uppercase tracking-wider font-bold text-stone-500 mb-2">☀ {t("सूर्य", "Sun", "सूर्य")}</h4>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between"><span className="text-stone-600">{t("राशी", "Sign", "राशि")}</span><span className="font-bold">{panchang.sunRashi}</span></div>
                  <div className="flex justify-between"><span className="text-stone-600">{t("मास", "Month", "मास")}</span><span className="font-bold">{panchang.masa.split("(")[0].trim()}</span></div>
                  <div className="flex justify-between"><span className="text-stone-600">{t("उदय", "Rise", "उदय")}</span><span className="font-bold">{fmtMr(panchang.sunrise, lang)}</span></div>
                  <div className="flex justify-between"><span className="text-stone-600">{t("अस्त", "Set", "अस्त")}</span><span className="font-bold">{fmtMr(panchang.sunset, lang)}</span></div>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-4">
                <h4 className="text-[11px] uppercase tracking-wider font-bold text-stone-500 mb-2">☽ {t("चंद्र", "Moon", "चंद्र")}</h4>
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between"><span className="text-stone-600">{t("राशी", "Sign", "राशि")}</span><span className="font-bold">{panchang.moonRashi}{panchang.moonRashiEnd && <span className="text-xs font-normal text-stone-500 ml-1">{fmtMr(panchang.moonRashiEnd, lang)}</span>}</span></div>
                  <div className="flex justify-between"><span className="text-stone-600">{t("नक्षत्र", "Nakshatra", "नक्षत्र")}</span><span className="font-bold">{t(panchang.nakshatra, panchang.nakshatraEn, panchang.nakshatra)}</span></div>
                  <div className="flex justify-between"><span className="text-stone-600">{t("नक्षत्र स्वामी", "Nak. Lord", "नक्षत्र स्वामी")}</span><span className="font-bold">{panchang.nakshatraLord}</span></div>
                  <div className="flex justify-between"><span className="text-stone-600">{t("पक्ष", "Paksha", "पक्ष")}</span><span className="font-bold">{panchang.paksha}</span></div>
                </div>
              </div>
            </div>
            </div>
            {/* ╚════ END LEFT COLUMN ════╝ */}

            {/* ╔════ RIGHT COLUMN ════╗ */}
            <div className="space-y-4">
            {/* ── Daily kundali chart (North Indian) ── */}
            {dayChart && (
              <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-5 print-avoid-break">
                <h3 className="text-sm font-bold mb-1" style={{ color: "#3d0c0c" }}>
                  {t("आजचा ग्रहचक्र (द्वादश भाव)", "Today's Graha Chart (12 Houses)", "आज का ग्रह चक्र (द्वादश भाव)")}
                </h3>
                <p className="text-[11px] text-stone-500 mb-3">
                  {t("दुपारी १२ वाजताचे ग्रहस्थान", "Planet positions at 12:00 noon", "दोपहर १२ बजे की ग्रह स्थिति")} — {lang === "en" ? loc.nameEn : loc.nameMr}
                </p>
                <div className="flex justify-center mb-4">
                  <NorthIndianChart chart={dayChart} lang={lang} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-200 sm:col-span-2">
                    <span className="font-bold text-stone-500 uppercase tracking-wider text-[10px]">{t("लग्न", "Lagna", "लग्न")}</span>
                    <span className="font-bold" style={{ color: "#8b2c2c" }}>{lang === "en" ? dayChart.lagnaRashi : dayChart.lagnaRashiMr}</span>
                  </div>
                  {dayChart.planets.map((p) => (
                    <div key={p.id} className="flex items-center justify-between gap-2">
                      <span className="font-bold w-10 shrink-0" style={{ color: p.isRetrograde ? "#dc2626" : "#1f2937" }}>
                        {lang === "en" ? p.name.slice(0, 3) : p.nameMr}{p.isRetrograde ? " (व)" : ""}
                      </span>
                      <span className="flex-1 text-stone-600">{lang === "en" ? p.rashi : p.rashiMr}</span>
                      <span className="text-stone-500 font-mono text-[10px]">{p.degreeDMS}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-stone-500 mt-3 leading-relaxed">
                  {t(
                    "(व) = वक्री ग्रह. भाव १ पासून लग्न राशीपासून सुरू. चौकटीतील अंक = राशी क्रमांक.",
                    "(R) = Retrograde. Houses count from Lagna. Numbers in cells = rashi number.",
                    "(व) = वक्री ग्रह. भाव १ से लग्न राशि से शुरू. कोष्ठक में अंक = राशि क्रम.",
                  )}
                </p>
              </div>
            )}

            {/* ── Choghadiya ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-5 print-avoid-break">
              <h3 className="text-sm font-bold mb-3" style={{ color: "#3d0c0c" }}>
                {t("चौघडिया", "Choghadiya", "चौघड़िया")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-stone-500 font-bold mb-2">{t("दिवसाचे (८)", "Day (8)", "दिन (8)")}</div>
                  <div className="space-y-1">
                    {chogDay.map((c, i) => (
                      <div key={i} className="flex items-center justify-between text-xs py-1 px-2 rounded" style={{ background: CHOGHADIYA_COLOR[c.kind] + "15" }}>
                        <span className="font-bold" style={{ color: CHOGHADIYA_COLOR[c.kind] }}>{c.name}</span>
                        <span style={{ color: "#3d0c0c" }}>{fmtRangeMr(c.range, lang)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-stone-500 font-bold mb-2">{t("रात्रीचे (८)", "Night (8)", "रात (8)")}</div>
                  <div className="space-y-1">
                    {chogNight.map((c, i) => (
                      <div key={i} className="flex items-center justify-between text-xs py-1 px-2 rounded" style={{ background: CHOGHADIYA_COLOR[c.kind] + "15" }}>
                        <span className="font-bold" style={{ color: CHOGHADIYA_COLOR[c.kind] }}>{c.name}</span>
                        <span style={{ color: "#3d0c0c" }}>{fmtRangeMr(c.range, lang)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-stone-500 mt-3 leading-relaxed">
                {t(
                  "शुभ/लाभ/अमृत = शुभ. चल = तटस्थ. रोग/काळ/उद्वेग = अशुभ.",
                  "Shubh/Labh/Amrit = auspicious. Chal = neutral. Rog/Kaal/Udveg = inauspicious.",
                  "शुभ/लाभ/अमृत = शुभ. चल = तटस्थ. रोग/काल/उद्वेग = अशुभ.",
                )}
              </p>
            </div>
            </div>
            {/* ╚════ END RIGHT COLUMN ════╝ */}
          </div>
        )}

        {!loading && panchang && (
          <p className="text-center text-xs text-stone-400 pt-6 pb-2">
            {t("स्थान:", "Location:", "स्थान:")} {lang === "en" ? loc.nameEn : loc.nameMr} · {t("गणना: Lahiri अयनांश + Swiss Ephemeris", "Calculation: Lahiri ayanamsa + Swiss Ephemeris", "गणना: Lahiri अयनांश")}
          </p>
        )}
      </div>
    </div>
  );
}
