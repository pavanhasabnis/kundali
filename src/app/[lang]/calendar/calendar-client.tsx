"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLang } from "@/lib/astrology/language-context";
import { formatTimeRangeMarathi } from "@/lib/astrology/time-format";
import { PageHero } from "@/components/page-hero";

interface Festival { name: string; nameMr: string; type: string; }
interface MuhuratTag { name: string; nameMr: string; }
interface CalendarDay {
  date: string; day: number; dayOfWeek: number; dayName: string;
  tithi: string; tithiIndex: number; paksha: string;
  nakshatra: string; nakshatraEn: string; yoga: string; karana: string;
  rahuKaal: string; gulikaKaal: string; yamaganda: string; moonRashi: string; sunRashi: string;
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

const MONTH_NAMES_MR = ["", "जानेवारी", "फेब्रुवारी", "मार्च", "एप्रिल", "मे", "जून", "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर"];
const MONTH_NAMES_EN = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTH_NAMES_HI = ["", "जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितम्बर", "अक्टूबर", "नवम्बर", "दिसम्बर"];
const DAY_HEADERS_MR = ["रवि", "सोम", "मंगळ", "बुध", "गुरु", "शुक्र", "शनि"];
const DAY_HEADERS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_HEADERS_HI = ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"];

// Convert to Devanagari digits: 14 → १४
function toDevanagari(n: number): string {
  const digits = "०१२३४५६७८९";
  return String(n).split("").map(c => digits[parseInt(c)] || c).join("");
}

// Convert a time string (e.g. "07:10" or "28:35") to language-appropriate digits.
function formatPanchangTime(hhmm: string | null, lang: string): string {
  if (!hhmm) return "";
  if (lang === "mr" || lang === "hi") {
    const digits = "०१२३४५६७८९";
    return hhmm.replace(/\d/g, (c) => digits[parseInt(c)]);
  }
  return hhmm;
}

// Rashi to zodiac symbol
const RASHI_SYMBOL: Record<string, string> = {
  "मेष": "♈", "वृषभ": "♉", "मिथुन": "♊", "कर्क": "♋", "सिंह": "♌", "कन्या": "♍",
  "तुला": "♎", "वृश्चिक": "♏", "धनु": "♐", "मकर": "♑", "कुंभ": "♒", "मीन": "♓",
};

// ── Indian National (Saka civil) calendar ──────────────────────────────
// Rules per Government of India gazette: Chaitra 1 = March 22 (March 21 in Gregorian leap
// year). Month lengths: Chaitra 30 (31 in leap), Vaisakha-Bhadra 31, Asvina-Phalguna 30.
// Saka year is leap when (Saka+78) is a Gregorian leap year.
const SAKA_MONTHS_MR = ["चैत्र", "वैशाख", "ज्येष्ठ", "आषाढ", "श्रावण", "भाद्रपद", "आश्विन", "कार्तिक", "अग्रहायण", "पौष", "माघ", "फाल्गुन"];
const SAKA_MONTHS_EN = ["Chaitra", "Vaisakha", "Jyaistha", "Asadha", "Sravana", "Bhadra", "Asvina", "Kartika", "Agrahayana", "Pausa", "Magha", "Phalguna"];
const SAKA_MONTHS_HI = ["चैत्र", "वैशाख", "ज्येष्ठ", "आषाढ़", "श्रावण", "भाद्रपद", "आश्विन", "कार्तिक", "अग्रहायण", "पौष", "माघ", "फाल्गुन"];

function isGregorianLeap(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

function sakaCivilDate(gregYear: number, gregMonth: number, gregDay: number): {
  sakaYear: number; monthIdx: number; day: number;
} {
  const chaitra1Month = 3;
  const chaitra1DayFor = (gy: number) => (isGregorianLeap(gy) ? 21 : 22);
  let sakaYear: number;
  let anchorYear: number;
  if (gregMonth > chaitra1Month || (gregMonth === chaitra1Month && gregDay >= chaitra1DayFor(gregYear))) {
    sakaYear = gregYear - 78;
    anchorYear = gregYear;
  } else {
    sakaYear = gregYear - 79;
    anchorYear = gregYear - 1;
  }
  const anchor = Date.UTC(anchorYear, chaitra1Month - 1, chaitra1DayFor(anchorYear));
  const current = Date.UTC(gregYear, gregMonth - 1, gregDay);
  const daysFromChaitra1 = Math.round((current - anchor) / 86400000);
  const sakaLeap = isGregorianLeap(sakaYear + 78);
  const monthLengths = [sakaLeap ? 31 : 30, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30];
  let monthIdx = 0;
  let remaining = daysFromChaitra1;
  while (monthIdx < 11 && remaining >= monthLengths[monthIdx]) {
    remaining -= monthLengths[monthIdx];
    monthIdx++;
  }
  return { sakaYear, monthIdx, day: remaining + 1 };
}

// Short paksha format: शुक्ल पक्ष → शु., कृष्ण पक्ष → कृ.
function shortPaksha(paksha: string): string {
  if (paksha.includes("शुक्ल")) return "शु.";
  if (paksha.includes("कृष्ण")) return "कृ.";
  return paksha;
}

export default function CalendarPageClient() {
  const { t, lang } = useLang();

  const nowIST = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
  const [year, setYear] = useState(nowIST.getUTCFullYear());
  const [month, setMonth] = useState(nowIST.getUTCMonth() + 1);
  const [data, setData] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<CalendarDay | null>(null);

  const todayStr = `${nowIST.getUTCFullYear()}-${String(nowIST.getUTCMonth() + 1).padStart(2, "0")}-${String(nowIST.getUTCDate()).padStart(2, "0")}`;

  useEffect(() => {
    async function fetchCalendar() {
      setLoading(true);
      setSelectedDay(null);
      try {
        const res = await fetch(`/api/calendar?year=${year}&month=${month}`);
        if (res.ok) {
          const d = await res.json();
          setData(d);
          // Auto-select today if current month
          const today = d.days.find((dy: CalendarDay) => dy.date === todayStr);
          if (today) setSelectedDay(today);
        }
      } catch { /* silent */ } finally {
        setLoading(false);
      }
    }
    fetchCalendar();
  }, [year, month, todayStr]);

  function prevMonth() {
    if (month === 1) { setMonth(12); setYear(year - 1); }
    else setMonth(month - 1);
  }
  function nextMonth() {
    if (month === 12) { setMonth(1); setYear(year + 1); }
    else setMonth(month + 1);
  }

  const monthNames = lang === "mr" ? MONTH_NAMES_MR : lang === "hi" ? MONTH_NAMES_HI : MONTH_NAMES_EN;
  const dayHeaders = lang === "mr" ? DAY_HEADERS_MR : lang === "hi" ? DAY_HEADERS_HI : DAY_HEADERS_EN;

  const dayTypeBg = (d: CalendarDay, isToday: boolean) => {
    if (isToday) return "#5c1a1a";
    if (d.dayType === "festival") return "#d4a843";
    if (d.dayType === "shubh") return "#2d6b2d";
    if (d.dayType === "ashubh") return "#b91c1c";
    return "transparent";
  };

  const dayTypeText = (d: CalendarDay, isToday: boolean) => {
    if (isToday) return "#fff";
    if (d.dayType === "festival" || d.dayType === "shubh" || d.dayType === "ashubh") return "#fff";
    return "#1f2937";
  };

  // Collect all festivals this month
  const monthFestivals = data ? data.days.filter(d => d.festivals.length > 0) : [];

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <PageHero
        title={t("वैदिक दिनदर्शिका", "Vedic Calendar", "वैदिक कैलेंडर")}
        subtitle={t("सण, मुहूर्त, शुभ-अशुभ दिवस — वास्तविक पंचांग गणनेवर आधारित", "Festivals, Muhurat, auspicious days — based on real Panchang calculations", "त्यौहार, मुहूर्त, शुभ-अशुभ दिन — वास्तविक पंचांग गणना पर आधारित")}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">

        {/* Month Navigation */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <button onClick={prevMonth} className="px-4 py-2 rounded-lg font-bold text-sm" style={{ background: "#FFF3D6", color: "#3d0c0c" }}>
            {t("← मागील", "← Prev", "← पिछला")}
          </button>
          <div className="text-center min-w-[200px]">
            <h2 className="text-xl font-bold" style={{ color: "#3d0c0c" }}>
              {monthNames[month]} {lang === "en" ? year : toDevanagari(year)}
            </h2>
          </div>
          <button onClick={nextMonth} className="px-4 py-2 rounded-lg font-bold text-sm" style={{ background: "#FFF3D6", color: "#3d0c0c" }}>
            {t("पुढील →", "Next →", "अगला →")}
          </button>
        </div>

        {/* Download / Print CTA — opens full-year (12 months) preview */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-2">
          <Link
            href={`/${lang}/calendar/print-preview?year=${year}&full=1&auto=1`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm shadow-md hover:shadow-lg transition"
            style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)", color: "#d4a843", border: "1px solid #d4a843" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            {t(`वार्षिक दिनदर्शिका डाउनलोड (${toDevanagari(year)})`, `Download Full-Year Calendar (${year})`, `वार्षिक कैलेंडर डाउनलोड (${toDevanagari(year)})`)}
          </Link>
          <Link
            href={`/${lang}/calendar/print-preview?year=${year}&month=${month}&auto=1`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm"
            style={{ background: "#FFF3D6", color: "#3d0c0c", border: "1px solid #d4a843" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            {t("फक्त हा महिना छापा", "Print This Month Only", "केवल इस माह प्रिंट")}
          </Link>
        </div>
        <p className="text-center text-xs text-stone-500 mb-6">
          {t("डाउनलोड बटण दाबल्यावर प्रिंट डायलॉग उघडेल — ‘Save as PDF’ निवडा", "Clicking Download opens print dialog — choose ‘Save as PDF’", "डाउनलोड बटन दबाने पर प्रिंट डायलॉग खुलेगा — ‘Save as PDF’ चुनें")}
        </p>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-6 text-xs">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full" style={{ background: "#5c1a1a" }} /><span>{t("आज", "Today", "आज")}</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full" style={{ background: "#d4a843" }} /><span>{t("सण/उत्सव", "Festival", "त्यौहार/उत्सव")}</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full" style={{ background: "#2d6b2d" }} /><span>{t("शुभ दिवस", "Auspicious", "शुभ दिन")}</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full" style={{ background: "#b91c1c" }} /><span>{t("अशुभ", "Inauspicious", "अशुभ")}</span></div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-[#f0c040]/30 border-t-[#8b2c2c] rounded-full animate-spin" />
          </div>
        ) : data ? (
          <div className="flex flex-col lg:flex-row gap-6">

            {/* ── Calendar Grid ── */}
            <div className="flex-1">
              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
                {/* Day headers */}
                <div className="grid grid-cols-7 border-b" style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)" }}>
                  {dayHeaders.map((d, i) => (
                    <div key={i} className="text-center py-2 text-xs font-bold" style={{ color: i === 0 ? "#f87171" : "#d4a843" }}>
                      {d}
                    </div>
                  ))}
                </div>

                {/* Day cells */}
                <div className="grid grid-cols-7">
                  {/* Empty cells for first week offset */}
                  {Array.from({ length: data.firstDayOfWeek }).map((_, i) => (
                    <div key={`e${i}`} className="min-h-[80px] sm:min-h-[100px] border-b border-r border-stone-100" />
                  ))}

                  {data.days.map((d) => {
                    const isToday = d.date === todayStr;
                    const isSelected = selectedDay?.date === d.date;
                    const isSunday = d.dayOfWeek === 0;

                    return (
                      <button
                        key={d.day}
                        onClick={() => setSelectedDay(d)}
                        className={`min-h-[80px] sm:min-h-[100px] border-b border-r border-stone-100 p-1.5 text-left hover:bg-stone-50 transition-all relative ${isSelected ? "ring-2 ring-[#d4a843] bg-[#FFF8E7]" : ""}`}
                      >
                        {/* Date number */}
                        <div className="flex items-start justify-between">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{ background: dayTypeBg(d, isToday), color: dayTypeText(d, isToday) }}>
                            {lang === "en" ? d.day : toDevanagari(d.day)}
                          </div>
                          {d.festivals.length > 0 && (
                            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#d4a843" }} />
                          )}
                        </div>

                        {/* Tithi */}
                        <p className="text-[10px] mt-1 leading-tight truncate" style={{ color: isSunday ? "#b91c1c" : "#6b5b3e" }}>
                          {d.tithi}
                        </p>

                        {/* Nakshatra */}
                        <p className="text-[10px] leading-tight truncate text-stone-400">
                          {d.nakshatra}
                        </p>

                        {/* Festival name */}
                        {d.festivals.length > 0 && (
                          <p className="text-[10px] font-bold mt-0.5 truncate" style={{ color: "#d4a843" }}>
                            {d.festivals[0].nameMr}
                          </p>
                        )}

                        {/* Muhurat dots */}
                        {d.muhuratTags.length > 0 && (
                          <div className="flex gap-0.5 mt-0.5">
                            {d.muhuratTags.slice(0, 3).map((_, i) => (
                              <div key={i} className="w-1 h-1 rounded-full" style={{ background: "#2d6b2d" }} />
                            ))}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── Right Panel: Day Details ── */}
            <div className="w-full lg:w-80 shrink-0">
              <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-hide space-y-4">
              {selectedDay ? (
                <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">

                  {/* ── Top: Marathi month + paksha + tithi ── */}
                  <div className="flex items-center text-xs" style={{ background: "#f5efe0" }}>
                    <div className="flex-1 px-3 py-2 font-bold" style={{ color: "#5c1a1a" }}>
                      {selectedDay.masa ? selectedDay.masa.split("(")[0].trim() : ""} {shortPaksha(selectedDay.paksha)} {toDevanagari(selectedDay.tithiIndex)}
                    </div>
                    <div className="px-4 py-2 font-bold text-white text-center" style={{ background: selectedDay.dayOfWeek === 0 ? "#b91c1c" : selectedDay.dayOfWeek === 2 ? "#b91c1c" : "#3d0c0c" }}>
                      {selectedDay.dayName}
                    </div>
                  </div>

                  {/* ── Festivals (colored badges like Kalnirnay) ── */}
                  {selectedDay.festivals.length > 0 && (
                    <div className="px-3 pt-2 space-y-1">
                      {selectedDay.festivals.map((f, i) => (
                        <div key={i} className="px-3 py-1.5 rounded-md text-xs font-bold text-white"
                          style={{ background: f.type === "national" || f.type === "state" ? "#2563eb" : f.type === "major" ? "#d4a843" : "#6b7280" }}>
                          {t(f.nameMr, f.name, f.nameMr)}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ── Big Devanagari Date Number ── */}
                  <div className="text-center py-4">
                    <p className="font-bold leading-none" style={{ fontSize: "72px", color: "#b91c1c", fontFamily: "serif" }}>
                      {toDevanagari(selectedDay.day)}
                    </p>
                    <p className="text-sm mt-1 font-semibold" style={{ color: "#5c1a1a" }}>
                      {lang === "mr" ? `${MONTH_NAMES_MR[month]} ${toDevanagari(year)}` : lang === "hi" ? `${MONTH_NAMES_HI[month]} ${toDevanagari(year)}` : `${MONTH_NAMES_EN[month]} ${year}`}
                    </p>
                  </div>

                  {/* ── Sunrise / Sunset + Moon Sign (with end time) ── */}
                  <div className="flex items-center justify-center gap-6 pb-3 px-4">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span style={{ color: "#d4a843" }}>☀</span>
                      <span className="font-semibold" style={{ color: "#3d0c0c" }}>{formatPanchangTime(selectedDay.sunrise, lang)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span style={{ color: "#d4a843" }}>☀</span>
                      <span className="font-semibold" style={{ color: "#3d0c0c" }}>{formatPanchangTime(selectedDay.sunset, lang)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span style={{ color: "#6366f1" }}>{RASHI_SYMBOL[selectedDay.moonRashi] || "☽"}</span>
                      <span className="font-semibold" style={{ color: "#3d0c0c" }}>
                        {selectedDay.moonRashi}
                        {selectedDay.moonRashiEnd && <span className="ml-1 font-normal" style={{ color: "#6b7280" }}>{formatPanchangTime(selectedDay.moonRashiEnd, lang)}</span>}
                      </span>
                    </div>
                  </div>

                  {/* ── Panchang Details (Kalnirnay style — with end times) ── */}
                  <div className="px-4 py-3 space-y-2" style={{ borderTop: "1px solid #e5e0d5" }}>
                    {(() => {
                      const saka = sakaCivilDate(year, month, selectedDay.day);
                      const sakaMonth = lang === "mr" ? SAKA_MONTHS_MR[saka.monthIdx] : lang === "hi" ? SAKA_MONTHS_HI[saka.monthIdx] : SAKA_MONTHS_EN[saka.monthIdx];
                      const sakaDay = lang === "en" ? String(saka.day) : toDevanagari(saka.day);
                      const sakaYr = lang === "en" ? String(saka.sakaYear) : toDevanagari(saka.sakaYear);
                      const nakText = selectedDay.nakshatras.length > 0
                        ? selectedDay.nakshatras.map((n) => `${n.name}${n.end ? " " + formatPanchangTime(n.end, lang) : ""}`).join(", ")
                        : selectedDay.nakshatra;
                      const karanaText = selectedDay.karanas.length > 0
                        ? selectedDay.karanas.slice(0, 2).map((k) => `${k.name}${k.end ? " " + formatPanchangTime(k.end, lang) : ""}`).join(", ")
                        : selectedDay.karana;
                      return [
                        { l: t("तिथी:", "Tithi:", "तिथि:"), v: `${shortPaksha(selectedDay.paksha)} ${selectedDay.tithi}${selectedDay.tithiEnd ? " " + formatPanchangTime(selectedDay.tithiEnd, lang) : ""}` },
                        { l: t("नक्षत्र:", "Nakshatra:", "नक्षत्र:"), v: nakText },
                        { l: t("योग:", "Yoga:", "योग:"), v: `${selectedDay.yoga}${selectedDay.yogaEnd ? " " + formatPanchangTime(selectedDay.yogaEnd, lang) : ""}` },
                        { l: t("करण:", "Karana:", "करण:"), v: karanaText },
                        { l: t("राहुकाळ:", "Rahu Kaal:", "राहुकाल:"), v: formatTimeRangeMarathi(selectedDay.rahuKaal, lang) },
                        { l: t("गुलिक काळ:", "Gulika Kaal:", "गुलिक काल:"), v: formatTimeRangeMarathi(selectedDay.gulikaKaal, lang) },
                        { l: t("यमगंड:", "Yamaganda:", "यमगंड:"), v: formatTimeRangeMarathi(selectedDay.yamaganda, lang) },
                        { l: t("राष्ट्रीय:", "National:", "राष्ट्रीय:"), v: `${sakaMonth} ${sakaDay}, ${t("शके", "Saka", "शक")} ${sakaYr}` },
                      ];
                    })().map((item, i) => (
                      <div key={i} className="flex items-baseline gap-2">
                        <span className="text-xs font-bold shrink-0" style={{ color: "#5c1a1a" }}>{item.l}</span>
                        <span className="text-xs" style={{ color: "#3d0c0c" }}>{item.v}</span>
                      </div>
                    ))}
                  </div>

                  {/* ── Muhurat Tags ── */}
                  {selectedDay.muhuratTags.length > 0 && (
                    <div className="px-4 pb-3" style={{ borderTop: "1px solid #e5e0d5" }}>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400 mt-2 mb-2">{t("मुहूर्त", "Muhurat", "मुहूर्त")}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedDay.muhuratTags.map((tag, i) => (
                          <span key={i} className="text-[10px] font-semibold px-2 py-1 rounded-full" style={{ background: "#dcfce7", color: "#166534" }}>
                            {t(tag.nameMr, tag.name, tag.nameMr)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Day Classification ── */}
                  <div className="px-4 pb-3">
                    <div className="text-center py-2 rounded-lg text-xs font-bold" style={{
                      background: selectedDay.dayType === "shubh" ? "#dcfce7" : selectedDay.dayType === "ashubh" ? "#fef2f2" : selectedDay.dayType === "festival" ? "#FFF8E7" : "#f5f5f5",
                      color: selectedDay.dayType === "shubh" ? "#166534" : selectedDay.dayType === "ashubh" ? "#991b1b" : selectedDay.dayType === "festival" ? "#92400e" : "#6b7280",
                    }}>
                      {selectedDay.dayType === "shubh" && t("शुभ दिवस", "Auspicious Day", "शुभ दिन")}
                      {selectedDay.dayType === "ashubh" && t("अशुभ दिवस — शुभ कार्य टाळावे", "Inauspicious — Avoid", "अशुभ दिन — शुभ कार्य से बचें")}
                      {selectedDay.dayType === "festival" && t("सण / उत्सव दिवस", "Festival Day", "त्यौहार / उत्सव दिन")}
                      {selectedDay.dayType === "neutral" && t("सामान्य दिवस", "Normal Day", "सामान्य दिन")}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-stone-200 p-8 text-center text-stone-400 text-sm">
                  {t("तारीख निवडा", "Select a date", "तारीख चुनें")}
                </div>
              )}

              {/* Month Festivals List */}
              {monthFestivals.length > 0 && (
                <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm mt-4">
                  <div className="p-3 text-center" style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)" }}>
                    <p className="text-xs font-bold" style={{ color: "#d4a843" }}>{t("या महिन्यातील सण", "This Month's Festivals", "इस महीने के त्यौहार")}</p>
                  </div>
                  <div className="p-3 space-y-2">
                    {monthFestivals.map((d) =>
                      d.festivals.map((f, i) => (
                        <button key={`${d.day}-${i}`} onClick={() => setSelectedDay(d)}
                          className="w-full flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-[#FFF8E7] transition text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "#d4a843", color: "#fff" }}>{lang === "en" ? d.day : toDevanagari(d.day)}</span>
                            <span className="text-xs font-semibold" style={{ color: "#3d0c0c" }}>{t(f.nameMr, f.name, f.nameMr)}</span>
                          </div>
                          <span className="text-[10px] text-stone-400">{d.dayName}</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 text-stone-500">{t("दिनदर्शिका उपलब्ध नाही", "Calendar not available", "कैलेंडर उपलब्ध नहीं")}</div>
        )}
      </div>
    </div>
  );
}
