"use client";

import type React from "react";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useLang } from "@/lib/astrology/language-context";
import { formatTimeRangeMarathi, formatTimeMarathi } from "@/lib/astrology/time-format";
import { ZodiacBadge } from "@/components/zodiac-badge";
import { RASHI_LIST } from "@/lib/rashi-data";

interface Festival { name: string; nameMr: string; type: string; }
interface MuhuratTag { name: string; nameMr: string; }
interface CalendarDay {
  date: string; day: number; dayOfWeek: number; dayName: string;
  tithi: string; tithiIndex: number; paksha: string;
  nakshatra: string; nakshatraEn: string; yoga: string; karana: string;
  rahuKaal: string; moonRashi: string; sunRashi: string;
  masa: string; sunrise: string; sunset: string;
  tithiEnd: string | null; karanaEnd: string | null;
  yogaEnd: string | null; moonRashiEnd: string | null;
  nakshatras: { name: string; nameEn: string; end: string | null }[];
  karanas: { name: string; end: string | null }[];
  festivals: Festival[]; muhuratTags: MuhuratTag[];
  dayType: "shubh" | "ashubh" | "neutral" | "festival";
}
interface CalendarData {
  year: number; month: number; daysInMonth: number; firstDayOfWeek: number;
  days: CalendarDay[];
}
type TFn = (mr: string, en: string, hi: string) => string;
type MonthEntry = { year: number; month: number; data: CalendarData };

const MONTH_NAMES_MR = ["", "जानेवारी", "फेब्रुवारी", "मार्च", "एप्रिल", "मे", "जून", "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर"];
const MONTH_NAMES_EN = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTH_NAMES_HI = ["", "जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितम्बर", "अक्टूबर", "नवम्बर", "दिसम्बर"];
const DAY_HEADERS_MR = ["रवि", "सोम", "मंगळ", "बुध", "गुरु", "शुक्र", "शनि"];
const DAY_HEADERS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_HEADERS_HI = ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"];

const SAKA_MONTHS_MR = ["चैत्र", "वैशाख", "ज्येष्ठ", "आषाढ", "श्रावण", "भाद्रपद", "आश्विन", "कार्तिक", "अग्रहायण", "पौष", "माघ", "फाल्गुन"];
const SAKA_MONTHS_EN = ["Chaitra", "Vaisakha", "Jyaistha", "Asadha", "Sravana", "Bhadra", "Asvina", "Kartika", "Agrahayana", "Pausa", "Magha", "Phalguna"];
const SAKA_MONTHS_HI = ["चैत्र", "वैशाख", "ज्येष्ठ", "आषाढ़", "श्रावण", "भाद्रपद", "आश्विन", "कार्तिक", "अग्रहायण", "पौष", "माघ", "फाल्गुन"];

type SizeKey = "wall" | "a4" | "desk";
const SIZES: Record<SizeKey, { w: string; h: string; cssSize: string; labelMr: string; labelEn: string; labelHi: string; dims: string }> = {
  wall: { w: "356mm", h: "559mm", cssSize: "356mm 559mm", labelMr: "भिंत १४×२२ इंच", labelEn: "Wall 14×22\"", labelHi: "दीवार 14×22\"", dims: "356 × 559 mm" },
  a4:   { w: "210mm", h: "297mm", cssSize: "A4 portrait",   labelMr: "A4 पोर्ट्रेट",    labelEn: "A4 Portrait",    labelHi: "A4 पोर्ट्रेट",    dims: "210 × 297 mm" },
  desk: { w: "297mm", h: "210mm", cssSize: "A4 landscape",  labelMr: "A4 लँडस्केप (टेबल)", labelEn: "A4 Landscape (Desk)", labelHi: "A4 लैंडस्केप (डेस्क)", dims: "297 × 210 mm" },
};
function scaleFor(size: SizeKey) {
  if (size === "wall") return 1;
  if (size === "a4") return Math.min(210 / 356, 297 / 559);
  const w = parseInt(SIZES[size].w);
  const h = parseInt(SIZES[size].h);
  return Math.min(w / 356, h / 559);
}
function transformFor(size: SizeKey, s: number) {
  if (size === "a4") {
    const sX = 210 / 356;
    const sY = 297 / 559;
    return `scale(${sX}, ${sY})`;
  }
  return `scale(${s})`;
}

function toDev(n: number | string): string {
  const d = "०१२३४५६७८९";
  return String(n).split("").map(c => d[parseInt(c)] ?? c).join("");
}
function devIfNeeded(n: number, lang: string) {
  return lang === "en" ? String(n) : toDev(n);
}
function fmtTime(hhmm: string | null | undefined, lang: string): string {
  if (!hhmm) return "";
  const m = /^(\d{1,2}):(\d{2})/.exec(hhmm.trim());
  if (!m) return hhmm;
  let hour = parseInt(m[1], 10);
  const minute = parseInt(m[2], 10);
  if (hour >= 24) hour -= 24;
  if (lang === "mr") return formatTimeMarathi(hour, minute, "mr");
  if (lang === "hi") {
    const d = "०१२३४५६७८९";
    const hStr = String(hour).split("").map(c => d[parseInt(c)]).join("");
    const mStr = String(minute).padStart(2, "0").split("").map(c => d[parseInt(c)]).join("");
    return `${hStr}:${mStr}`;
  }
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${String(minute).padStart(2, "0")} ${ampm}`;
}
function fmtRange(range: string, lang: string): string {
  if (!range) return "";
  if (lang === "mr") return formatTimeRangeMarathi(range, "mr");
  if (lang === "hi") return range.replace(/\d/g, c => "०१२३४५६७८९"[parseInt(c)]);
  return range;
}
function shortPaksha(p: string): string {
  if (p.includes("शुक्ल")) return "शु.";
  if (p.includes("कृष्ण")) return "कृ.";
  return p;
}
function isGregLeap(y: number) { return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0; }
function sakaCivil(gY: number, gM: number, gD: number) {
  const c1M = 3;
  const c1D = (y: number) => isGregLeap(y) ? 21 : 22;
  let sY: number, aY: number;
  if (gM > c1M || (gM === c1M && gD >= c1D(gY))) { sY = gY - 78; aY = gY; }
  else { sY = gY - 79; aY = gY - 1; }
  const anchor = Date.UTC(aY, c1M - 1, c1D(aY));
  const cur = Date.UTC(gY, gM - 1, gD);
  const diff = Math.round((cur - anchor) / 86400000);
  const leap = isGregLeap(sY + 78);
  const mL = [leap ? 31 : 30, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30];
  let mi = 0, rem = diff;
  while (mi < 11 && rem >= mL[mi]) { rem -= mL[mi]; mi++; }
  return { sakaYear: sY, monthIdx: mi, day: rem + 1 };
}

function BrandMark({ size = 18 }: { size?: number }) {
  const h = `${size}mm`;
  const circleD = size * 0.85;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: `${size * 0.25}mm`, height: h }}>
      <div style={{
        width: `${circleD}mm`, height: `${circleD}mm`,
        borderRadius: "50%",
        border: `${size * 0.05}mm solid #d4a843`,
        background: "rgba(212,168,67,0.08)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: `inset 0 0 ${size * 0.15}mm rgba(212,168,67,0.3)`,
        flexShrink: 0,
      }}>
        <span style={{ fontSize: `${size * 0.5}mm`, fontWeight: "bold", color: "#d4a843", fontFamily: "'Noto Serif Devanagari', serif", lineHeight: 1 }}>भा</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ fontSize: `${size * 0.48}mm`, fontWeight: "bold", color: "#d4a843", letterSpacing: `${size * 0.02}mm`, lineHeight: 1 }}>भाग्यवेध</div>
        <div style={{ fontSize: `${size * 0.22}mm`, color: "#FFF8E7", opacity: 0.7, letterSpacing: `${size * 0.05}mm`, marginTop: `${size * 0.08}mm` }}>BHAAGYAVEDH</div>
      </div>
    </div>
  );
}

const cell: React.CSSProperties = { padding: "1.5mm 2mm", borderBottom: "0.2mm solid #e5d5b5", verticalAlign: "top" };
const cellH: React.CSSProperties = { ...cell, fontWeight: "bold", fontSize: "2.9mm", textAlign: "center", borderBottom: "0.5mm solid #d4a843" };
const dCell: React.CSSProperties = { padding: "0.8mm 1.5mm", borderBottom: "0.15mm solid #e5d5b5", verticalAlign: "middle", color: "#3d0c0c" };
const dCellH: React.CSSProperties = { padding: "1.5mm 1mm", fontWeight: "bold", fontSize: "2.5mm", textAlign: "center", borderBottom: "0.3mm solid #d4a843" };
const dCellHL: React.CSSProperties = { ...dCellH, textAlign: "left" };

function SectionHeader({ label }: { label: string }) {
  return (
    <div style={{ fontSize: "4mm", fontWeight: "bold", color: "#5c1a1a", borderBottom: "0.5mm solid #d4a843", paddingBottom: "1.5mm", marginBottom: "3mm", letterSpacing: "0.3mm" }}>{label}</div>
  );
}

function VratGroup({ title, days, lang, showTithi = false }: { title: string; days: CalendarDay[]; lang: string; showTithi?: boolean }) {
  if (days.length === 0) return null;
  return (
    <div style={{ marginBottom: "3mm" }}>
      <div style={{ fontSize: "3mm", fontWeight: "bold", color: "#d4a843", marginBottom: "1mm" }}>{title}</div>
      <div style={{ fontSize: "2.9mm", color: "#3d0c0c", lineHeight: 1.5 }}>
        {days.map((d, i) => (
          <span key={i}>
            <strong style={{ color: "#b91c1c" }}>{lang === "en" ? d.day : toDev(d.day)}</strong>
            <span style={{ color: "#6b5b3e", marginLeft: "1mm" }}>({d.dayName.slice(0, 3)})</span>
            {showTithi && <span style={{ color: "#6b5b3e", marginLeft: "1mm" }}>— {d.tithi}</span>}
            {i < days.length - 1 ? ", " : ""}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Front sheet (big calendar grid) ──
function FrontSheet({ entry, lang, t, size }: { entry: MonthEntry; lang: string; t: TFn; size: SizeKey }) {
  const { year, month, data } = entry;
  const sz = SIZES[size];
  const s = scaleFor(size);
  const monthNames = lang === "mr" ? MONTH_NAMES_MR : lang === "hi" ? MONTH_NAMES_HI : MONTH_NAMES_EN;
  const dayHeaders = lang === "mr" ? DAY_HEADERS_MR : lang === "hi" ? DAY_HEADERS_HI : DAY_HEADERS_EN;
  const sakaMonths = lang === "mr" ? SAKA_MONTHS_MR : lang === "hi" ? SAKA_MONTHS_HI : SAKA_MONTHS_EN;

  const s1 = sakaCivil(year, month, 1);
  const sN = sakaCivil(year, month, data.daysInMonth);
  const m1 = sakaMonths[s1.monthIdx];
  const m2 = sakaMonths[sN.monthIdx];
  const yr = devIfNeeded(sN.sakaYear, lang);
  const sakaLabel = m1 === m2 ? `${m1} · ${t("शके", "Saka", "शक")} ${yr}` : `${m1}–${m2} · ${t("शके", "Saka", "शक")} ${yr}`;

  const ekadashiDays = data.days.filter(d => d.tithi?.includes("एकादशी"));
  const purnimaAmavasya = data.days.filter(d => d.tithi?.includes("पौर्णिमा") || d.tithi?.includes("अमावस्या"));
  const midDay = data.days[Math.floor(data.days.length / 2)];
  const sunRashiSlug = midDay ? RASHI_LIST.find(r => r.mr === midDay.sunRashi)?.slug : null;

  const grid: (CalendarDay | null)[] = [...Array(data.firstDayOfWeek).fill(null), ...data.days];
  while (grid.length < 42) grid.push(null);

  return (
    <div className="sheet" style={{
      width: sz.w, height: sz.h, background: "#FFF8E7",
      boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
      overflow: "hidden", position: "relative",
    }}>
    <div style={{
      width: "356mm", height: "559mm", background: "#FFF8E7",
      transform: transformFor(size, s), transformOrigin: "top left",
      position: "relative",
      display: "flex", flexDirection: "column",
      fontFamily: "'Noto Serif Devanagari', 'Times New Roman', serif",
      color: "#3d0c0c", overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{
        height: "60mm",
        background: "linear-gradient(135deg, #3d0c0c 0%, #5c1a1a 50%, #3d0c0c 100%)",
        color: "#FFF8E7", display: "grid", gridTemplateColumns: "1fr 2fr 1fr",
        padding: "8mm 12mm", alignItems: "center", borderBottom: "3mm solid #d4a843",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2mm" }}>
          <BrandMark size={18} />
          <div style={{ fontSize: "3.5mm", color: "#FFF8E7", opacity: 0.85 }}>
            {t("वैदिक पंचांग · दिनदर्शिका", "Vedic Panchang · Calendar", "वैदिक पंचांग · दिनदर्शिका")}
          </div>
          <div style={{ fontSize: "3mm", color: "#d4a843", opacity: 0.8 }}>bhaagyavedh.com</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "22mm", fontWeight: "bold", color: "#d4a843", lineHeight: 1, letterSpacing: "1mm" }}>{monthNames[month]}</div>
          <div style={{ fontSize: "10mm", fontWeight: "bold", color: "#FFF8E7", lineHeight: 1, marginTop: "3mm" }}>{devIfNeeded(year, lang)}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "4.5mm", color: "#d4a843", fontWeight: "bold" }}>{sakaLabel}</div>
          {midDay && (
            <div style={{ fontSize: "3.5mm", color: "#FFF8E7", opacity: 0.9, marginTop: "2mm" }}>
              {t("सूर्य राशी", "Sun in", "सूर्य राशि")}: <strong style={{ color: "#d4a843" }}>{midDay.sunRashi}</strong>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "3mm" }}>
            {sunRashiSlug && <ZodiacBadge slug={sunRashiSlug} size={44} variant="gold" />}
          </div>
        </div>
      </div>

      {/* Day headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", background: "#5c1a1a", color: "#d4a843", fontWeight: "bold", fontSize: "5mm", borderBottom: "1mm solid #d4a843" }}>
        {dayHeaders.map((d, i) => (
          <div key={i} style={{ padding: "3mm 2mm", textAlign: "center", color: i === 0 ? "#ff9999" : "#d4a843", borderRight: i < 6 ? "0.3mm solid rgba(212,168,67,0.3)" : "none" }}>{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gridAutoRows: "1fr", background: "#FFF8E7" }}>
        {grid.map((d, i) => {
          const col = i % 7;
          const row = Math.floor(i / 7);
          const isSunday = col === 0;
          return (
            <div key={i} style={{
              borderRight: col < 6 ? "0.3mm solid #e5d5b5" : "none",
              borderBottom: row < 5 ? "0.3mm solid #e5d5b5" : "none",
              padding: "2.5mm 2.5mm 2mm", position: "relative", minHeight: 0,
              display: "flex", flexDirection: "column",
              background: d?.dayType === "festival" ? "#fff3d6" : "transparent",
            }}>
              {d ? (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", lineHeight: 1 }}>
                    <span style={{ fontSize: "14mm", fontWeight: "bold", color: isSunday ? "#b91c1c" : "#3d0c0c", lineHeight: 0.9, fontFamily: "'Noto Serif Devanagari', serif" }}>{devIfNeeded(d.day, lang)}</span>
                    {lang !== "en" && <span style={{ fontSize: "3mm", color: "#9b8b6e", marginTop: "1mm" }}>{d.day}</span>}
                  </div>
                  <div style={{ fontSize: "3mm", color: "#5c1a1a", marginTop: "1.5mm", fontWeight: 600 }}>
                    {shortPaksha(d.paksha)} {d.tithi}
                    {d.tithiEnd && <span style={{ color: "#9b8b6e", fontWeight: 400, marginLeft: "1mm" }}>{fmtTime(d.tithiEnd, lang)}</span>}
                  </div>
                  <div style={{ fontSize: "2.8mm", color: "#6b5b3e", marginTop: "0.5mm" }}>{d.nakshatra}</div>
                  {d.moonRashiEnd && (
                    <div style={{ fontSize: "2.5mm", color: "#6366f1", marginTop: "0.5mm" }}>☽ {d.moonRashi} {fmtTime(d.moonRashiEnd, lang)}</div>
                  )}
                  {d.festivals.length > 0 && (
                    <div style={{ marginTop: "auto", marginBottom: "1mm" }}>
                      {d.festivals.slice(0, 2).map((f, fi) => (
                        <div key={fi} style={{ fontSize: "3mm", fontWeight: "bold", color: f.type === "national" || f.type === "state" ? "#1e40af" : "#b91c1c", marginTop: "0.5mm", lineHeight: 1.15 }}>
                          • {t(f.nameMr, f.name, f.nameMr)}
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ fontSize: "2.3mm", color: "#9b8b6e", marginTop: d.festivals.length > 0 ? 0 : "auto", paddingTop: "1mm", borderTop: "0.2mm dotted #d4c090" }}>
                    {t("राहु", "Rahu", "राहु")}: {fmtRange(d.rahuKaal, lang)}
                  </div>
                  {d.dayType === "shubh" && (
                    <div style={{ position: "absolute", top: "2mm", right: "2mm", width: "2mm", height: "2mm", borderRadius: "50%", background: "#2d6b2d" }} />
                  )}
                  {d.dayType === "ashubh" && (
                    <div style={{ position: "absolute", top: "2mm", right: "2mm", width: "2mm", height: "2mm", borderRadius: "50%", background: "#b91c1c" }} />
                  )}
                </>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{ minHeight: "30mm", background: "#3d0c0c", color: "#FFF8E7", padding: "5mm 12mm", display: "grid", gridTemplateColumns: "1.5fr 1.2fr 1fr", gap: "8mm", borderTop: "3mm solid #d4a843", fontSize: "3mm" }}>
        <div>
          <div style={{ fontSize: "3.5mm", fontWeight: "bold", color: "#d4a843", marginBottom: "2mm" }}>{t("चिन्हे", "Legend", "संकेत")}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2mm" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "2mm" }}>
              <span style={{ width: "2.5mm", height: "2.5mm", borderRadius: "50%", background: "#2d6b2d", display: "inline-block" }} />
              <span>{t("शुभ दिवस", "Auspicious", "शुभ दिन")}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "2mm" }}>
              <span style={{ width: "2.5mm", height: "2.5mm", borderRadius: "50%", background: "#b91c1c", display: "inline-block" }} />
              <span>{t("अशुभ दिवस", "Inauspicious", "अशुभ दिन")}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "2mm" }}>
              <span style={{ width: "4mm", height: "2.5mm", background: "#fff3d6", display: "inline-block", border: "0.2mm solid #d4a843" }} />
              <span>{t("सण / उत्सव", "Festival", "त्यौहार")}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "2mm" }}>
              <span style={{ color: "#d4a843", fontWeight: "bold" }}>●</span>
              <span>{t("तिथी / राहुकाळ समाप्ती वेळ", "Tithi/Rahu end time", "तिथि/राहुकाल समाप्ति")}</span>
            </div>
          </div>
        </div>
        <div>
          <div style={{ fontSize: "3.5mm", fontWeight: "bold", color: "#d4a843", marginBottom: "2mm" }}>{t("या महिन्यातील मुख्य", "Key Days This Month", "इस माह के मुख्य दिन")}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1mm", fontSize: "2.8mm" }}>
            {ekadashiDays.slice(0, 3).map((d, i) => (
              <div key={i}><strong style={{ color: "#d4a843" }}>{devIfNeeded(d.day, lang)}</strong> — {t("एकादशी", "Ekadashi", "एकादशी")}</div>
            ))}
            {purnimaAmavasya.slice(0, 2).map((d, i) => (
              <div key={i}><strong style={{ color: "#d4a843" }}>{devIfNeeded(d.day, lang)}</strong> — {d.tithi}</div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: "right", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "3.5mm", fontWeight: "bold", color: "#d4a843" }}>{t("भाग्यवेध", "Bhaagyavedh", "भाग्यवेध")}</div>
            <div style={{ fontSize: "2.8mm", opacity: 0.85, marginTop: "1mm" }}>{t("वैदिक पंचांग गणनेवर आधारित", "Based on Vedic Panchang", "वैदिक पंचांग गणना पर आधारित")}</div>
            <div style={{ fontSize: "2.8mm", opacity: 0.7, marginTop: "1mm" }}>{t("लाहिरी अयनांश", "Lahiri Ayanamsa", "लाहिरी अयनांश")}</div>
          </div>
          <div style={{ fontSize: "2.5mm", opacity: 0.6, marginTop: "2mm" }}>© {devIfNeeded(year, lang)} bhaagyavedh.com</div>
        </div>
      </div>
    </div>
    </div>
  );
}

// ── Back sheet (detailed panchang) ──
function BackSheet({ entry, lang, t, size }: { entry: MonthEntry; lang: string; t: TFn; size: SizeKey }) {
  const { year, month, data } = entry;
  const sz = SIZES[size];
  const s = scaleFor(size);
  const monthNames = lang === "mr" ? MONTH_NAMES_MR : lang === "hi" ? MONTH_NAMES_HI : MONTH_NAMES_EN;
  const dayHeaders = lang === "mr" ? DAY_HEADERS_MR : lang === "hi" ? DAY_HEADERS_HI : DAY_HEADERS_EN;
  const sakaMonths = lang === "mr" ? SAKA_MONTHS_MR : lang === "hi" ? SAKA_MONTHS_HI : SAKA_MONTHS_EN;

  const s1 = sakaCivil(year, month, 1);
  const sN = sakaCivil(year, month, data.daysInMonth);
  const m1 = sakaMonths[s1.monthIdx];
  const m2 = sakaMonths[sN.monthIdx];
  const yr = devIfNeeded(sN.sakaYear, lang);
  const sakaLabel = m1 === m2 ? `${m1} · ${t("शके", "Saka", "शक")} ${yr}` : `${m1}–${m2} · ${t("शके", "Saka", "शक")} ${yr}`;

  const ekadashiDays = data.days.filter(d => d.tithi?.includes("एकादशी"));
  const purnimaAmavasya = data.days.filter(d => d.tithi?.includes("पौर्णिमा") || d.tithi?.includes("अमावस्या"));
  const pradoshDays = data.days.filter(d => d.tithi?.includes("त्रयोदशी"));
  const sankashtiDays = data.days.filter(d => d.paksha?.includes("कृष्ण") && d.tithi?.includes("चतुर्थी"));
  const vinayakiDays = data.days.filter(d => d.paksha?.includes("शुक्ल") && d.tithi?.includes("चतुर्थी"));
  const allFestivals = data.days.filter(d => d.festivals.length > 0);
  const shubhDays = data.days.filter(d => d.dayType === "shubh");
  const ashubhDays = data.days.filter(d => d.dayType === "ashubh");
  const moonTransits = data.days.filter(d => d.moonRashiEnd);
  const weeklyRahu: (string | null)[] = [null, null, null, null, null, null, null];
  data.days.forEach(d => { if (weeklyRahu[d.dayOfWeek] === null) weeklyRahu[d.dayOfWeek] = d.rahuKaal; });

  return (
    <div className="sheet" style={{
      width: sz.w, height: sz.h, background: "#FFF8E7",
      boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
      overflow: "hidden",
    }}>
    <div style={{
      width: "356mm", height: "559mm", background: "#FFF8E7",
      transform: transformFor(size, s), transformOrigin: "top left",
      display: "flex", flexDirection: "column",
      fontFamily: "'Noto Serif Devanagari', 'Times New Roman', serif",
      color: "#3d0c0c", overflow: "hidden",
    }}>
      {/* Back header */}
      <div style={{ height: "40mm", background: "linear-gradient(135deg, #3d0c0c 0%, #5c1a1a 50%, #3d0c0c 100%)", color: "#FFF8E7", display: "grid", gridTemplateColumns: "1fr 2fr 1fr", padding: "6mm 12mm", alignItems: "center", borderBottom: "2mm solid #d4a843" }}>
        <div><BrandMark size={14} /></div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "8mm", fontWeight: "bold", color: "#d4a843" }}>{t("सविस्तर पंचांग", "Detailed Panchang", "विस्तृत पंचांग")}</div>
          <div style={{ fontSize: "4mm", color: "#FFF8E7", marginTop: "1mm" }}>{monthNames[month]} {devIfNeeded(year, lang)} · {sakaLabel}</div>
        </div>
        <div style={{ textAlign: "right", fontSize: "3.5mm", color: "#d4a843", opacity: 0.9 }}>bhaagyavedh.com</div>
      </div>

      {/* 3-col body */}
      <div style={{ padding: "6mm 10mm 4mm", display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr", gap: "8mm", fontSize: "3.2mm" }}>
        <div>
          <SectionHeader label={t("सर्व सण व उत्सव", "All Festivals & Events", "सभी त्यौहार व उत्सव")} />
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "3mm" }}>
            <thead>
              <tr style={{ background: "#f5efe0", color: "#5c1a1a" }}>
                <th style={cellH}>{t("दिनांक", "Date", "दिनांक")}</th>
                <th style={cellH}>{t("वार", "Day", "वार")}</th>
                <th style={{ ...cellH, textAlign: "left" }}>{t("सण/उत्सव", "Festival", "त्यौहार")}</th>
              </tr>
            </thead>
            <tbody>
              {allFestivals.length === 0 && (
                <tr><td colSpan={3} style={{ ...cell, textAlign: "center", opacity: 0.6 }}>—</td></tr>
              )}
              {allFestivals.map((d) => d.festivals.map((f, fi) => (
                <tr key={`${d.day}-${fi}`} style={{ background: fi % 2 === 0 ? "#fffdf6" : "transparent" }}>
                  <td style={{ ...cell, fontWeight: "bold", color: "#b91c1c", width: "12mm", textAlign: "center" }}>{devIfNeeded(d.day, lang)}</td>
                  <td style={{ ...cell, width: "18mm", textAlign: "center", color: "#6b5b3e" }}>{d.dayName}</td>
                  <td style={{ ...cell, fontWeight: 600 }}>{t(f.nameMr, f.name, f.nameMr)}</td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
        <div>
          <SectionHeader label={t("व्रत व उपवास दिवस", "Vrat & Upvas Days", "व्रत व उपवास दिन")} />
          <VratGroup title={t("एकादशी", "Ekadashi", "एकादशी")} days={ekadashiDays} lang={lang} />
          <VratGroup title={t("पौर्णिमा / अमावस्या", "Purnima / Amavasya", "पूर्णिमा / अमावस्या")} days={purnimaAmavasya} lang={lang} showTithi />
          <VratGroup title={t("त्रयोदशी (प्रदोष)", "Trayodashi (Pradosh)", "त्रयोदशी (प्रदोष)")} days={pradoshDays} lang={lang} />
          <VratGroup title={t("संकष्टी चतुर्थी", "Sankashti Chaturthi", "संकष्टी चतुर्थी")} days={sankashtiDays} lang={lang} />
          <VratGroup title={t("विनायकी चतुर्थी", "Vinayaki Chaturthi", "विनायकी चतुर्थी")} days={vinayakiDays} lang={lang} />
        </div>
        <div>
          <SectionHeader label={t("शुभ / अशुभ दिवस", "Shubh / Ashubh Days", "शुभ / अशुभ दिन")} />
          <div style={{ marginBottom: "4mm" }}>
            <div style={{ fontSize: "3.2mm", fontWeight: "bold", color: "#2d6b2d", marginBottom: "1.5mm" }}>● {t("शुभ दिवस", "Auspicious Days", "शुभ दिन")}</div>
            <div style={{ fontSize: "3mm", color: "#3d0c0c", lineHeight: 1.6 }}>{shubhDays.length === 0 ? "—" : shubhDays.map(d => devIfNeeded(d.day, lang)).join(", ")}</div>
          </div>
          <div style={{ marginBottom: "4mm" }}>
            <div style={{ fontSize: "3.2mm", fontWeight: "bold", color: "#b91c1c", marginBottom: "1.5mm" }}>● {t("अशुभ दिवस", "Inauspicious Days", "अशुभ दिन")}</div>
            <div style={{ fontSize: "3mm", color: "#3d0c0c", lineHeight: 1.6 }}>{ashubhDays.length === 0 ? "—" : ashubhDays.map(d => devIfNeeded(d.day, lang)).join(", ")}</div>
          </div>
          <SectionHeader label={t("चंद्र राशी संक्रमण", "Moon Rashi Transit", "चंद्र राशि संक्रमण")} />
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "2.8mm" }}>
            <tbody>
              {moonTransits.length === 0 && <tr><td colSpan={3} style={{ ...cell, textAlign: "center", opacity: 0.6 }}>—</td></tr>}
              {moonTransits.map((d) => (
                <tr key={d.day}>
                  <td style={{ ...cell, fontWeight: "bold", color: "#5c1a1a", width: "10mm", textAlign: "center" }}>{devIfNeeded(d.day, lang)}</td>
                  <td style={{ ...cell, color: "#6366f1", fontWeight: 600 }}>☽ {d.moonRashi}</td>
                  <td style={{ ...cell, color: "#6b5b3e", textAlign: "right" }}>{fmtTime(d.moonRashiEnd, lang)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Daily panchang table */}
      <div style={{ padding: "0 10mm 4mm" }}>
        <SectionHeader label={t("दैनिक पंचांग तक्ता", "Daily Panchang Table", "दैनिक पंचांग तालिका")} />
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "2.4mm" }}>
          <thead>
            <tr style={{ background: "#5c1a1a", color: "#d4a843" }}>
              <th style={dCellH}>{t("दि.", "Dt", "दि.")}</th>
              <th style={dCellH}>{t("वार", "Day", "वार")}</th>
              <th style={dCellHL}>{t("तिथी", "Tithi", "तिथि")}</th>
              <th style={dCellHL}>{t("नक्षत्र", "Nakshatra", "नक्षत्र")}</th>
              <th style={dCellHL}>{t("योग", "Yoga", "योग")}</th>
              <th style={dCellHL}>{t("करण", "Karana", "करण")}</th>
              <th style={dCellH}>{t("सू.उ.", "Sun↑", "सू.उ.")}</th>
              <th style={dCellH}>{t("सू.अ.", "Sun↓", "सू.अ.")}</th>
              <th style={dCellHL}>{t("राहुकाळ", "Rahu", "राहुकाल")}</th>
              <th style={dCellH}>{t("चं.रा.", "Moon", "चं.रा.")}</th>
            </tr>
          </thead>
          <tbody>
            {data.days.map((d, idx) => (
              <tr key={d.day} style={{ background: d.dayType === "festival" ? "#fff3d6" : d.dayOfWeek === 0 ? "#fef5f5" : idx % 2 === 0 ? "#fffdf6" : "transparent" }}>
                <td style={{ ...dCell, fontWeight: "bold", textAlign: "center", color: d.dayOfWeek === 0 ? "#b91c1c" : "#3d0c0c" }}>{devIfNeeded(d.day, lang)}</td>
                <td style={{ ...dCell, textAlign: "center", color: "#6b5b3e" }}>{d.dayName.slice(0, 3)}</td>
                <td style={dCell}>{shortPaksha(d.paksha)} {d.tithi}{d.tithiEnd ? <span style={{ color: "#9b8b6e" }}> {fmtTime(d.tithiEnd, lang)}</span> : null}</td>
                <td style={dCell}>{d.nakshatra}{d.nakshatras[0]?.end ? <span style={{ color: "#9b8b6e" }}> {fmtTime(d.nakshatras[0].end, lang)}</span> : null}</td>
                <td style={dCell}>{d.yoga}{d.yogaEnd ? <span style={{ color: "#9b8b6e" }}> {fmtTime(d.yogaEnd, lang)}</span> : null}</td>
                <td style={dCell}>{d.karanas[0]?.name || d.karana}{d.karanas[0]?.end ? <span style={{ color: "#9b8b6e" }}> {fmtTime(d.karanas[0].end, lang)}</span> : null}</td>
                <td style={{ ...dCell, textAlign: "center", color: "#d4a843", fontSize: "2.3mm" }}>{fmtTime(d.sunrise, lang)}</td>
                <td style={{ ...dCell, textAlign: "center", color: "#6b5b3e", fontSize: "2.3mm" }}>{fmtTime(d.sunset, lang)}</td>
                <td style={{ ...dCell, color: "#b91c1c", fontSize: "2.3mm" }}>{fmtRange(d.rahuKaal, lang)}</td>
                <td style={{ ...dCell, textAlign: "center", color: "#6366f1", fontWeight: 600 }}>{d.moonRashi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Weekly rahu + muhurat */}
      <div style={{ padding: "0 10mm 5mm", display: "grid", gridTemplateColumns: "2fr 1fr", gap: "8mm" }}>
        <div>
          <SectionHeader label={t("साप्ताहिक राहुकाळ", "Weekly Rahu-Kaal", "साप्ताहिक राहुकाल")} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "1.5mm", fontSize: "2.6mm" }}>
            {dayHeaders.map((dn, i) => (
              <div key={i} style={{ background: i === 0 ? "#fef2f2" : "#f5efe0", padding: "1.5mm", borderRadius: "1mm", textAlign: "center", border: "0.3mm solid #e5d5b5" }}>
                <div style={{ fontWeight: "bold", color: i === 0 ? "#b91c1c" : "#5c1a1a", fontSize: "2.9mm" }}>{dn}</div>
                <div style={{ color: "#6b5b3e", marginTop: "0.5mm", fontSize: "2.3mm" }}>{weeklyRahu[i] ? fmtRange(weeklyRahu[i]!, lang) : "—"}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <SectionHeader label={t("महिन्यातील मुहूर्त", "Month Muhurat", "माह के मुहूर्त")} />
          <div style={{ fontSize: "2.8mm", color: "#3d0c0c", lineHeight: 1.5 }}>
            {(() => {
              const muhuratCount = new Map<string, { mr: string; en: string; count: number; days: number[] }>();
              data.days.forEach(d => d.muhuratTags.forEach(m => {
                const k = m.nameMr;
                const cur = muhuratCount.get(k) ?? { mr: m.nameMr, en: m.name, count: 0, days: [] };
                cur.count++; cur.days.push(d.day);
                muhuratCount.set(k, cur);
              }));
              const list = Array.from(muhuratCount.values());
              if (list.length === 0) return <span style={{ opacity: 0.6 }}>—</span>;
              return list.map((m, i) => (
                <div key={i} style={{ marginBottom: "1mm" }}>
                  <strong style={{ color: "#2d6b2d" }}>{t(m.mr, m.en, m.mr)}</strong>
                  <span style={{ color: "#6b5b3e", marginLeft: "1mm" }}>({m.days.map(d => devIfNeeded(d, lang)).join(", ")})</span>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>

      {/* Back footer */}
      <div style={{ minHeight: "22mm", marginTop: "auto", background: "#3d0c0c", color: "#FFF8E7", padding: "5mm 12mm", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8mm", borderTop: "3mm solid #d4a843", fontSize: "2.8mm", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "3.2mm", fontWeight: "bold", color: "#d4a843" }}>{t("भाग्यवेध", "Bhaagyavedh", "भाग्यवेध")}</div>
          <div style={{ opacity: 0.85, marginTop: "1mm" }}>{t("वैदिक पंचांग · कुंडली · रास भविष्य", "Vedic Panchang · Kundli · Rashifal", "वैदिक पंचांग · कुंडली · राशिफल")}</div>
        </div>
        <div style={{ textAlign: "center", opacity: 0.85 }}>
          <div>{t("लाहिरी अयनांश", "Lahiri Ayanamsa", "लाहिरी अयनांश")}</div>
          <div style={{ opacity: 0.7, marginTop: "1mm" }}>{t("वेळा IST मध्ये", "Times in IST", "समय IST में")}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: "bold", color: "#d4a843" }}>bhaagyavedh.com</div>
          <div style={{ opacity: 0.6, marginTop: "1mm" }}>© {devIfNeeded(year, lang)}</div>
        </div>
      </div>
    </div>
    </div>
  );
}

// ── Desk (A4 landscape 297×210mm) native layout ──
function DeskSheet({ entry, lang, t }: { entry: MonthEntry; lang: string; t: TFn }) {
  const { year, month, data } = entry;
  const monthNames = lang === "mr" ? MONTH_NAMES_MR : lang === "hi" ? MONTH_NAMES_HI : MONTH_NAMES_EN;
  const dayHeaders = lang === "mr" ? DAY_HEADERS_MR : lang === "hi" ? DAY_HEADERS_HI : DAY_HEADERS_EN;
  const sakaMonths = lang === "mr" ? SAKA_MONTHS_MR : lang === "hi" ? SAKA_MONTHS_HI : SAKA_MONTHS_EN;
  const s1 = sakaCivil(year, month, 1);
  const sN = sakaCivil(year, month, data.daysInMonth);
  const m1 = sakaMonths[s1.monthIdx];
  const m2 = sakaMonths[sN.monthIdx];
  const yr = devIfNeeded(sN.sakaYear, lang);
  const sakaLabel = m1 === m2 ? `${m1} · ${t("शके", "Saka", "शक")} ${yr}` : `${m1}–${m2} · ${t("शके", "Saka", "शक")} ${yr}`;
  const midDay = data.days[Math.floor(data.days.length / 2)];
  const sunRashiSlug = midDay ? RASHI_LIST.find(r => r.mr === midDay.sunRashi)?.slug : null;
  const grid: (CalendarDay | null)[] = [...Array(data.firstDayOfWeek).fill(null), ...data.days];
  while (grid.length < 42) grid.push(null);
  const ekadashi = data.days.filter(d => d.tithi?.includes("एकादशी"));
  const purnimaAmavasya = data.days.filter(d => d.tithi?.includes("पौर्णिमा") || d.tithi?.includes("अमावस्या"));
  const fests = data.days.flatMap(d => d.festivals.map(f => ({ day: d.day, name: t(f.nameMr, f.name, f.nameMr) })));
  return (
    <div className="sheet" style={{
      width: "297mm", height: "210mm", background: "#FFF8E7",
      boxShadow: "0 4px 24px rgba(0,0,0,0.2)", overflow: "hidden",
      display: "flex", flexDirection: "column",
      fontFamily: "'Noto Serif Devanagari', 'Times New Roman', serif",
      color: "#3d0c0c",
    }}>
      {/* Header 22mm */}
      <div style={{
        height: "22mm",
        background: "linear-gradient(135deg, #3d0c0c 0%, #5c1a1a 50%, #3d0c0c 100%)",
        color: "#FFF8E7", display: "grid", gridTemplateColumns: "1.2fr 2fr 1.2fr",
        padding: "3mm 8mm", alignItems: "center", borderBottom: "1.2mm solid #d4a843",
      }}>
        <div><BrandMark size={10} /></div>
        <div style={{ textAlign: "center", display: "flex", alignItems: "baseline", justifyContent: "center", gap: "4mm" }}>
          <span style={{ fontSize: "9mm", fontWeight: "bold", color: "#d4a843", lineHeight: 1 }}>{monthNames[month]}</span>
          <span style={{ fontSize: "6mm", fontWeight: "bold", color: "#FFF8E7", lineHeight: 1 }}>{devIfNeeded(year, lang)}</span>
        </div>
        <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "1mm" }}>
          <div style={{ fontSize: "2.8mm", color: "#d4a843", fontWeight: "bold" }}>{sakaLabel}</div>
          <div style={{ display: "flex", alignItems: "center", gap: "2mm" }}>
            {midDay && <span style={{ fontSize: "2.5mm", color: "#FFF8E7" }}>{t("सूर्य", "Sun", "सूर्य")}: <strong style={{ color: "#d4a843" }}>{midDay.sunRashi}</strong></span>}
            {sunRashiSlug && <ZodiacBadge slug={sunRashiSlug} size={18} variant="gold" />}
          </div>
        </div>
      </div>
      {/* Day headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", background: "#5c1a1a", color: "#d4a843", fontWeight: "bold", fontSize: "3mm", borderBottom: "0.4mm solid #d4a843" }}>
        {dayHeaders.map((d, i) => (
          <div key={i} style={{ padding: "1.2mm 1mm", textAlign: "center", color: i === 0 ? "#ff9999" : "#d4a843", borderRight: i < 6 ? "0.2mm solid rgba(212,168,67,0.3)" : "none" }}>{d}</div>
        ))}
      </div>
      {/* Main: grid + side column */}
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 55mm", overflow: "hidden" }}>
        {/* Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gridAutoRows: "1fr", background: "#FFF8E7" }}>
          {grid.map((d, i) => {
            const col = i % 7;
            const row = Math.floor(i / 7);
            const isSunday = col === 0;
            return (
              <div key={i} style={{
                borderRight: col < 6 ? "0.2mm solid #e5d5b5" : "none",
                borderBottom: row < 5 ? "0.2mm solid #e5d5b5" : "none",
                padding: "1.2mm 1.5mm", position: "relative",
                display: "flex", flexDirection: "column",
                background: d?.dayType === "festival" ? "#fff3d6" : "transparent",
                overflow: "hidden",
              }}>
                {d ? (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", lineHeight: 1 }}>
                      <span style={{ fontSize: "5.5mm", fontWeight: "bold", color: isSunday ? "#b91c1c" : "#3d0c0c", lineHeight: 0.9, fontFamily: "'Noto Serif Devanagari', serif" }}>{devIfNeeded(d.day, lang)}</span>
                      {lang !== "en" && <span style={{ fontSize: "2mm", color: "#9b8b6e" }}>{d.day}</span>}
                    </div>
                    <div style={{ fontSize: "2mm", color: "#5c1a1a", marginTop: "0.6mm", fontWeight: 600, lineHeight: 1.1 }}>
                      {shortPaksha(d.paksha)} {d.tithi}
                    </div>
                    <div style={{ fontSize: "1.9mm", color: "#6b5b3e", marginTop: "0.3mm", lineHeight: 1.1 }}>{d.nakshatra}</div>
                    {d.festivals.length > 0 && (
                      <div style={{ fontSize: "1.9mm", fontWeight: "bold", color: d.festivals[0].type === "national" || d.festivals[0].type === "state" ? "#1e40af" : "#b91c1c", marginTop: "0.4mm", lineHeight: 1.1, overflow: "hidden", textOverflow: "ellipsis" }}>
                        • {t(d.festivals[0].nameMr, d.festivals[0].name, d.festivals[0].nameMr)}
                      </div>
                    )}
                    <div style={{ fontSize: "1.7mm", color: "#9b8b6e", marginTop: "auto", paddingTop: "0.5mm", borderTop: "0.2mm dotted #d4c090" }}>
                      {t("राहु", "Rahu", "Rahu")}: {fmtRange(d.rahuKaal, lang)}
                    </div>
                    {d.dayType === "shubh" && <div style={{ position: "absolute", top: "1mm", right: "1mm", width: "1.5mm", height: "1.5mm", borderRadius: "50%", background: "#2d6b2d" }} />}
                    {d.dayType === "ashubh" && <div style={{ position: "absolute", top: "1mm", right: "1mm", width: "1.5mm", height: "1.5mm", borderRadius: "50%", background: "#b91c1c" }} />}
                  </>
                ) : null}
              </div>
            );
          })}
        </div>
        {/* Side column: festivals + key days */}
        <div style={{ borderLeft: "0.4mm solid #d4a843", padding: "2mm 3mm", background: "#fffdf6", display: "flex", flexDirection: "column", gap: "2mm", fontSize: "2.2mm", overflow: "hidden" }}>
          <div>
            <div style={{ fontSize: "2.8mm", fontWeight: "bold", color: "#5c1a1a", borderBottom: "0.3mm solid #d4a843", paddingBottom: "0.5mm", marginBottom: "1mm" }}>{t("सण व उत्सव", "Festivals", "त्यौहार")}</div>
            <div style={{ lineHeight: 1.4 }}>
              {fests.length === 0 ? <span style={{ opacity: 0.6 }}>—</span> : fests.slice(0, 14).map((f, i) => (
                <div key={i} style={{ marginBottom: "0.3mm" }}><strong style={{ color: "#b91c1c" }}>{devIfNeeded(f.day, lang)}</strong> <span style={{ color: "#3d0c0c" }}>{f.name}</span></div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "2.8mm", fontWeight: "bold", color: "#5c1a1a", borderBottom: "0.3mm solid #d4a843", paddingBottom: "0.5mm", marginBottom: "1mm" }}>{t("व्रत / मुख्य", "Vrat / Key", "व्रत / मुख्य")}</div>
            <div style={{ lineHeight: 1.4 }}>
              {ekadashi.slice(0, 2).map((d, i) => (
                <div key={`e${i}`}><strong style={{ color: "#d4a843" }}>{devIfNeeded(d.day, lang)}</strong> {t("एकादशी", "Ekadashi", "एकादशी")}</div>
              ))}
              {purnimaAmavasya.slice(0, 2).map((d, i) => (
                <div key={`p${i}`}><strong style={{ color: "#d4a843" }}>{devIfNeeded(d.day, lang)}</strong> {d.tithi}</div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: "auto", fontSize: "1.9mm", color: "#6b5b3e", borderTop: "0.2mm dotted #d4a843", paddingTop: "1mm" }}>
            <div>● {t("शुभ", "Auspicious", "शुभ")}  ● {t("अशुभ", "Inauspicious", "अशुभ")}</div>
            <div style={{ marginTop: "0.5mm" }}>{t("लाहिरी अयनांश · IST", "Lahiri · IST", "लाहिरी · IST")}</div>
          </div>
        </div>
      </div>
      {/* Footer 14mm */}
      <div style={{ height: "14mm", background: "#3d0c0c", color: "#FFF8E7", padding: "2mm 8mm", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "4mm", borderTop: "1.2mm solid #d4a843", fontSize: "2.3mm", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "2.8mm", fontWeight: "bold", color: "#d4a843" }}>{t("भाग्यवेध", "Bhaagyavedh", "भाग्यवेध")}</div>
          <div style={{ opacity: 0.85, marginTop: "0.5mm" }}>{t("वैदिक पंचांग · दिनदर्शिका", "Vedic Panchang · Calendar", "वैदिक पंचांग · दिनदर्शिका")}</div>
        </div>
        <div style={{ textAlign: "center", opacity: 0.85 }}>
          <div>{t("राहुकाळ · तिथी समाप्ती वेळा", "Rahu-Kaal · Tithi end times", "राहुकाल · तिथि समाप्ति")}</div>
          <div style={{ opacity: 0.7, marginTop: "0.5mm" }}>{t("लाहिरी अयनांश · वेळा IST", "Lahiri Ayanamsa · IST", "लाहिरी · IST")}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: "bold", color: "#d4a843" }}>bhaagyavedh.com</div>
          <div style={{ opacity: 0.6, marginTop: "0.5mm" }}>© {devIfNeeded(year, lang)}</div>
        </div>
      </div>
    </div>
  );
}

export default function PrintPreviewClient() {
  const { t, lang } = useLang();
  const searchParams = useSearchParams();
  const now = new Date(Date.now() + 5.5 * 3600 * 1000);
  const qpYear = Number(searchParams.get("year"));
  const qpMonth = Number(searchParams.get("month"));
  const qpSize = searchParams.get("size") as SizeKey | null;
  const autoPrint = searchParams.get("auto") === "1";
  const fullYear = searchParams.get("full") === "1";

  const [year, setYear] = useState(qpYear && qpYear > 1900 ? qpYear : now.getUTCFullYear());
  const [month, setMonth] = useState(qpMonth >= 1 && qpMonth <= 12 ? qpMonth : now.getUTCMonth() + 1);
  const [mode, setMode] = useState<"single" | "full">(fullYear ? "full" : "single");
  const [size, setSize] = useState<SizeKey>(qpSize && SIZES[qpSize] ? qpSize : "wall");
  const [entries, setEntries] = useState<MonthEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const sheetWrapRef = useRef<HTMLDivElement>(null);

  // Fetch data (1 or 12 months)
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setEntries([]);
    async function run() {
      if (mode === "full") {
        const months = Array.from({ length: 12 }, (_, i) => i + 1);
        const results = await Promise.all(months.map(async m => {
          const r = await fetch(`/api/calendar?year=${year}&month=${m}`);
          if (!r.ok) return null;
          const d: CalendarData = await r.json();
          return { year, month: m, data: d } as MonthEntry;
        }));
        if (!cancelled) {
          setEntries(results.filter((x): x is MonthEntry => x !== null));
          setLoading(false);
        }
      } else {
        const r = await fetch(`/api/calendar?year=${year}&month=${month}`);
        if (!r.ok) { setLoading(false); return; }
        const d: CalendarData = await r.json();
        if (!cancelled) {
          setEntries([{ year, month, data: d }]);
          setLoading(false);
        }
      }
    }
    run();
    return () => { cancelled = true; };
  }, [year, month, mode]);

  // Fit-to-screen (sheet px depends on chosen paper width)
  useLayoutEffect(() => {
    function recalc() {
      const sheetMm = parseInt(SIZES[size].w);
      const SHEET_PX = (sheetMm / 25.4) * 96;
      const PADDING = 24;
      const w = window.innerWidth - PADDING;
      setScale(w < SHEET_PX ? w / SHEET_PX : 1);
    }
    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, [size]);

  // Dynamic title
  const monthNamesForTitle = lang === "mr" ? MONTH_NAMES_MR : lang === "hi" ? MONTH_NAMES_HI : MONTH_NAMES_EN;
  useEffect(() => {
    const yrStr = lang === "en" ? String(year) : toDev(year);
    if (mode === "full") {
      document.title = `${t("भाग्यवेध दिनदर्शिका", "Bhaagyavedh Calendar", "भाग्यवेध कैलेंडर")} — ${yrStr}`;
    } else {
      document.title = `${t("भाग्यवेध दिनदर्शिका", "Bhaagyavedh Calendar", "भाग्यवेध कैलेंडर")} — ${monthNamesForTitle[month]} ${yrStr}`;
    }
  }, [lang, month, year, mode, t, monthNamesForTitle]);

  // Auto-print — wait for ALL entries to load (especially in full-year mode)
  useEffect(() => {
    if (!autoPrint || loading || entries.length === 0) return;
    const expected = mode === "full" ? 12 : 1;
    if (entries.length < expected) return;
    const timer = setTimeout(() => window.print(), 900);
    return () => clearTimeout(timer);
  }, [autoPrint, entries, loading, mode]);

  const monthNames = lang === "mr" ? MONTH_NAMES_MR : lang === "hi" ? MONTH_NAMES_HI : MONTH_NAMES_EN;

  return (
    <div style={{ background: "#e5e5e5", minHeight: "100vh" }}>
      {/* Controls */}
      <div className="no-print" style={{ position: "sticky", top: 0, zIndex: 10, background: "#fff", padding: "12px 20px", borderBottom: "1px solid #ddd", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <strong style={{ color: "#3d0c0c" }}>
          {mode === "full"
            ? t("वार्षिक दिनदर्शिका", "Full-Year Calendar", "वार्षिक कैलेंडर")
            : t("मासिक दिनदर्शिका", "Monthly Calendar", "मासिक कैलेंडर")}
        </strong>
        <span style={{ fontSize: 12, color: "#6b5b3e" }}>{SIZES[size].dims}</span>
        <select value={size} onChange={e => setSize(e.target.value as SizeKey)} style={{ padding: "4px 8px" }}>
          <option value="wall">{t(SIZES.wall.labelMr, SIZES.wall.labelEn, SIZES.wall.labelHi)}</option>
          <option value="a4">{t(SIZES.a4.labelMr, SIZES.a4.labelEn, SIZES.a4.labelHi)}</option>
          <option value="desk">{t(SIZES.desk.labelMr, SIZES.desk.labelEn, SIZES.desk.labelHi)}</option>
        </select>
        <select value={mode} onChange={e => setMode(e.target.value as "single" | "full")} style={{ padding: "4px 8px" }}>
          <option value="full">{t("पूर्ण वर्ष (१२ महिने)", "Full Year (12 months)", "पूरा वर्ष (12 माह)")}</option>
          <option value="single">{t("एक महिना", "Single Month", "एक माह")}</option>
        </select>
        {mode === "single" && (
          <select value={month} onChange={e => setMonth(+e.target.value)} style={{ padding: "4px 8px" }}>
            {monthNames.slice(1).map((n, i) => <option key={i} value={i + 1}>{n}</option>)}
          </select>
        )}
        <select value={year} onChange={e => setYear(+e.target.value)} style={{ padding: "4px 8px" }}>
          {[year - 1, year, year + 1, year + 2].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <button onClick={() => window.print()} style={{ padding: "6px 14px", background: "#3d0c0c", color: "#FFF8E7", fontWeight: "bold", borderRadius: 6, border: 0, cursor: "pointer" }}>
          {t("डाउनलोड / छापा (PDF)", "Download / Print (PDF)", "डाउनलोड / प्रिंट (PDF)")}
        </button>
      </div>

      {/* Sheets */}
      <div ref={sheetWrapRef} className="sheets-wrap" style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "24px 12px", gap: "24px",
        maxWidth: `calc(${SIZES[size].w} + 24px)`,
        margin: "0 auto",
        zoom: scale,
      }}>
        {loading && (
          <div style={{ padding: "60px 20px", textAlign: "center", color: "#6b5b3e", fontSize: 16 }}>
            {t("लोड होत आहे…", "Loading…", "लोड हो रहा है…")}
            {mode === "full" && <div style={{ fontSize: 12, marginTop: 8, opacity: 0.7 }}>{t("१२ महिन्यांचा डेटा आणत आहे", "Fetching 12 months", "12 महीनों का डेटा ला रहे हैं")}</div>}
          </div>
        )}
        {!loading && entries.flatMap((e) => {
          if (size === "wall") return [
            <FrontSheet key={`${e.year}-${e.month}-f`} entry={e} lang={lang} t={t} size={size} />,
            <BackSheet key={`${e.year}-${e.month}-b`} entry={e} lang={lang} t={t} size={size} />,
          ];
          if (size === "desk") return [
            <DeskSheet key={`${e.year}-${e.month}-d`} entry={e} lang={lang} t={t} />,
          ];
          return [
            <FrontSheet key={`${e.year}-${e.month}-f`} entry={e} lang={lang} t={t} size={size} />,
          ];
        })}
      </div>

      <style>{`
        @page { size: ${SIZES[size].cssSize}; margin: 0; }
        @media print {
          html, body { background: #FFF8E7 !important; margin: 0 !important; padding: 0 !important; }
          .no-print { display: none !important; }
          .sheets-wrap { zoom: 1 !important; padding: 0 !important; gap: 0 !important; }
          .sheet { box-shadow: none !important; margin: 0 !important; break-inside: avoid; page-break-inside: avoid; }
          .sheet:not(:last-child) { page-break-after: always; break-after: page; }
          .sheet:last-child { page-break-after: auto; break-after: auto; }
        }
      `}</style>
    </div>
  );
}
