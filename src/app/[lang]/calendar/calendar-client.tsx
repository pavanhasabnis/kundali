"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/lib/astrology/language-context";
import { formatTimeRangeMarathi } from "@/lib/astrology/time-format";

interface Festival { name: string; nameMr: string; type: string; }
interface MuhuratTag { name: string; nameMr: string; }
interface CalendarDay {
  date: string; day: number; dayOfWeek: number; dayName: string;
  tithi: string; tithiIndex: number; paksha: string;
  nakshatra: string; nakshatraEn: string; yoga: string; karana: string;
  rahuKaal: string; moonRashi: string; sunRashi: string;
  masa: string; sunrise: string; sunset: string;
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

// Rashi to zodiac symbol
const RASHI_SYMBOL: Record<string, string> = {
  "मेष": "♈", "वृषभ": "♉", "मिथुन": "♊", "कर्क": "♋", "सिंह": "♌", "कन्या": "♍",
  "तुला": "♎", "वृश्चिक": "♏", "धनु": "♐", "मकर": "♑", "कुंभ": "♒", "मीन": "♓",
};

// Saka calendar year: English year - 78 (after March 22) or - 79 (before March 22)
function getSakaYear(year: number, month: number, day: number): number {
  if (month > 3 || (month === 3 && day >= 22)) return year - 78;
  return year - 79;
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
      <section className="relative py-16 sm:py-24 overflow-hidden" style={{ background: "linear-gradient(135deg, #3d0c0c 0%, #5c1a1a 50%, #3d0c0c 100%)" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a843' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#d4a843] mb-3">{t("वैदिक दिनदर्शिका", "Vedic Calendar", "वैदिक कैलेंडर")}</h1>
          <p className="text-white/60 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">{t("सण, मुहूर्त, शुभ-अशुभ दिवस — वास्तविक पंचांग गणनेवर आधारित", "Festivals, Muhurat, Auspicious days — based on real Panchang calculations", "त्यौहार, मुहूर्त, शुभ-अशुभ दिन — वास्तविक पंचांग गणना पर आधारित")}</p>
        </div>
      </section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">

        {/* Month Navigation */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button onClick={prevMonth} className="px-4 py-2 rounded-lg font-bold text-sm" style={{ background: "#FFF3D6", color: "#3d0c0c" }}>
            {t("← मागील", "← Prev", "← पिछला")}
          </button>
          <div className="text-center min-w-[200px]">
            <h2 className="text-xl font-bold" style={{ color: "#3d0c0c" }}>
              {monthNames[month]} {year}
            </h2>
          </div>
          <button onClick={nextMonth} className="px-4 py-2 rounded-lg font-bold text-sm" style={{ background: "#FFF3D6", color: "#3d0c0c" }}>
            {t("पुढील →", "Next →", "अगला →")}
          </button>
        </div>

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
                            {d.day}
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

                  {/* ── Sunrise / Sunset + Moon Sign ── */}
                  <div className="flex items-center justify-center gap-6 pb-3 px-4">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span style={{ color: "#d4a843" }}>☀</span>
                      <span className="font-semibold" style={{ color: "#3d0c0c" }}>{selectedDay.sunrise}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span style={{ color: "#d4a843" }}>☀</span>
                      <span className="font-semibold" style={{ color: "#3d0c0c" }}>{selectedDay.sunset}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span style={{ color: "#6366f1" }}>{RASHI_SYMBOL[selectedDay.moonRashi] || "☽"}</span>
                      <span className="font-semibold" style={{ color: "#3d0c0c" }}>{selectedDay.moonRashi}</span>
                    </div>
                  </div>

                  {/* ── Panchang Details (Kalnirnay style) ── */}
                  <div className="px-4 py-3 space-y-2" style={{ borderTop: "1px solid #e5e0d5" }}>
                    {[
                      { l: t("तिथी:", "Tithi:", "तिथि:"), v: `${shortPaksha(selectedDay.paksha)} ${selectedDay.tithi}` },
                      { l: t("नक्षत्र:", "Nakshatra:", "नक्षत्र:"), v: selectedDay.nakshatra },
                      { l: t("योग:", "Yoga:", "योग:"), v: selectedDay.yoga },
                      { l: t("करण:", "Karana:", "करण:"), v: selectedDay.karana },
                      { l: t("राहुकाळ:", "Rahu Kaal:", "राहुकाल:"), v: formatTimeRangeMarathi(selectedDay.rahuKaal, lang) },
                      { l: t("राष्ट्रीय:", "National:", "राष्ट्रीय:"), v: toDevanagari(getSakaYear(year, month, selectedDay.day)) + " शक" },
                    ].map((item, i) => (
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
                            <span className="text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "#d4a843", color: "#fff" }}>{d.day}</span>
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
