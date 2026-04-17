"use client";

import { useState } from "react";
import { useLang } from "@/lib/astrology/language-context";

interface MuhuratResult {
  date: string; day: number; dayName: string; tithi: string; paksha: string;
  nakshatra: string; yoga: string; moonRashi: string;
  muhuratTags: { name: string; nameMr: string }[];
  dayType: string;
}

const EVENT_TYPES = [
  { id: "Vastushanti", mr: "वास्तुशांती", en: "Vastushanti", hi: "वास्तुशांति" },
  { id: "Gruhapravesh", mr: "गृहप्रवेश", en: "Gruhapravesh", hi: "गृहप्रवेश" },
  { id: "Vivah Muhurat", mr: "विवाह मुहूर्त", en: "Marriage Muhurat", hi: "विवाह मुहूर्त" },
  { id: "Vyapar Shubharambh", mr: "व्यापार शुभारंभ", en: "Business Start", hi: "व्यापार शुभारंभ" },
  { id: "Shubh Din", mr: "शुभ दिवस (सामान्य)", en: "General Auspicious Day", hi: "शुभ दिन (सामान्य)" },
];

export default function MuhuratFinderPageClient() {
  const { t, lang } = useLang();
  const [eventType, setEventType] = useState("Vastushanti");
  const [startMonth, setStartMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [months, setMonths] = useState(3);
  const [results, setResults] = useState<MuhuratResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function searchMuhurat() {
    setLoading(true);
    setResults([]);
    setSearched(true);
    const allResults: MuhuratResult[] = [];

    const [sy, sm] = startMonth.split("-").map(Number);
    for (let i = 0; i < months; i++) {
      let m = sm + i;
      let y = sy;
      if (m > 12) { m -= 12; y += 1; }

      try {
        const res = await fetch(`/api/calendar?year=${y}&month=${m}`);
        if (res.ok) {
          const data = await res.json();
          for (const day of data.days) {
            const hasTag = day.muhuratTags.some((tag: { name: string }) => tag.name === eventType);
            if (hasTag) {
              allResults.push(day);
            }
          }
        }
      } catch { /* skip */ }
    }

    setResults(allResults);
    setLoading(false);
  }

  const monthNames = lang === "mr"
    ? ["", "जानेवारी", "फेब्रुवारी", "मार्च", "एप्रिल", "मे", "जून", "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर"]
    : lang === "hi"
    ? ["", "जनवरी", "फ़रवरी", "मार्च", "अप्रैल", "मई", "जून", "जुलाई", "अगस्त", "सितम्बर", "अक्टूबर", "नवम्बर", "दिसम्बर"]
    : ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <section className="relative py-16 sm:py-24 overflow-hidden" style={{ background: "linear-gradient(135deg, #3d0c0c 0%, #5c1a1a 50%, #3d0c0c 100%)" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a843' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#d4a843] mb-3">{t("मुहूर्त शोधक", "Muhurat Finder", "मुहूर्त खोजक")}</h1>
          <p className="text-white/60 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">{t("शुभ मुहूर्त शोधा — वास्तुशांती, गृहप्रवेश, विवाह, व्यापार", "Find auspicious dates — Vastushanti, Gruhapravesh, Marriage, Business", "शुभ मुहूर्त खोजें — वास्तुशांति, गृहप्रवेश, विवाह, व्यापार")}</p>
        </div>
      </section>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8 py-6">

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {/* Event Type */}
            <div>
              <label className="block text-sm font-bold mb-1" style={{ color: "#3d0c0c" }}>{t("कार्य प्रकार", "Event Type", "कार्य प्रकार")}</label>
              <select value={eventType} onChange={(e) => setEventType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#d4a843]">
                {EVENT_TYPES.map((e) => (
                  <option key={e.id} value={e.id}>{t(e.mr, e.en, e.hi)}</option>
                ))}
              </select>
            </div>
            {/* Start Month */}
            <div>
              <label className="block text-sm font-bold mb-1" style={{ color: "#3d0c0c" }}>{t("पासून महिना", "From Month", "से महीना")}</label>
              <input type="month" value={startMonth} onChange={(e) => setStartMonth(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#d4a843]" />
            </div>
            {/* Duration */}
            <div>
              <label className="block text-sm font-bold mb-1" style={{ color: "#3d0c0c" }}>{t("किती महिने", "Duration", "कितने महीने")}</label>
              <select value={months} onChange={(e) => setMonths(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#d4a843]">
                <option value={1}>{t("१ महिना", "1 Month", "१ महीना")}</option>
                <option value={2}>{t("२ महिने", "2 Months", "२ महीने")}</option>
                <option value={3}>{t("३ महिने", "3 Months", "३ महीने")}</option>
                <option value={6}>{t("६ महिने", "6 Months", "६ महीने")}</option>
              </select>
            </div>
          </div>
          <button onClick={searchMuhurat} disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white text-sm disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #5c1a1a, #3d0c0c)" }}>
            {loading ? t("शोधत आहे...", "Searching...", "खोज रहे हैं...") : t("शुभ मुहूर्त शोधा", "Find Auspicious Dates", "शुभ मुहूर्त खोजें")}
          </button>
        </div>

        {/* Results */}
        {loading && (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-3 border-[#f0c040]/30 border-t-[#8b2c2c] rounded-full animate-spin mx-auto" />
            <p className="text-sm text-stone-500 mt-3">{t("मुहूर्त शोधत आहे...", "Searching for muhurat dates...", "मुहूर्त खोज रहे हैं...")}</p>
          </div>
        )}

        {searched && !loading && (
          <div>
            <h2 className="text-lg font-bold mb-4" style={{ color: "#3d0c0c" }}>
              {results.length > 0
                ? t(`${results.length} शुभ दिवस सापडले`, `${results.length} auspicious dates found`, `${results.length} शुभ दिन मिले`)
                : t("या कालावधीत शुभ मुहूर्त नाही", "No auspicious dates in this period", "इस अवधि में शुभ मुहूर्त नहीं")}
            </h2>
            <div className="space-y-3">
              {results.map((r, i) => {
                const [ry, rm, rd] = r.date.split("-").map(Number);
                return (
                  <div key={i} className="bg-white rounded-xl border border-stone-200 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                    {/* Date badge */}
                    <div className="w-16 text-center shrink-0">
                      <div className="text-2xl font-bold" style={{ color: "#5c1a1a" }}>{rd}</div>
                      <div className="text-[10px] text-stone-500">{monthNames[rm]} {ry}</div>
                      <div className="text-xs font-semibold mt-0.5 px-2 py-0.5 rounded-full" style={{ background: "#3d0c0c", color: "#d4a843" }}>{r.dayName}</div>
                    </div>
                    {/* Details */}
                    <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div><span className="text-stone-400">{t("तिथी:", "Tithi:", "तिथि:")}</span> <span className="font-semibold">{r.tithi}</span></div>
                      <div><span className="text-stone-400">{t("नक्षत्र:", "Nak:", "नक्षत्र:")}</span> <span className="font-semibold">{r.nakshatra}</span></div>
                      <div><span className="text-stone-400">{t("योग:", "Yoga:", "योग:")}</span> <span className="font-semibold">{r.yoga}</span></div>
                      <div><span className="text-stone-400">{t("चंद्र:", "Moon:", "चंद्र:")}</span> <span className="font-semibold">{r.moonRashi}</span></div>
                    </div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {r.muhuratTags.map((tag, j) => (
                        <span key={j} className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "#dcfce7", color: "#166534" }}>
                          {t(tag.nameMr, tag.name, tag.nameMr)}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
