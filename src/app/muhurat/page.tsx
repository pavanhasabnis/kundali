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
  { id: "Vastushanti", mr: "वास्तुशांती", en: "Vastushanti" },
  { id: "Gruhapravesh", mr: "गृहप्रवेश", en: "Gruhapravesh" },
  { id: "Vivah Muhurat", mr: "विवाह मुहूर्त", en: "Marriage Muhurat" },
  { id: "Vyapar Shubharambh", mr: "व्यापार शुभारंभ", en: "Business Start" },
  { id: "Shubh Din", mr: "शुभ दिवस (सामान्य)", en: "General Auspicious Day" },
];

export default function MuhuratFinderPage() {
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
        const res = await fetch(`/api/astrology/calendar?year=${y}&month=${m}`);
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
    : ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="bg-[#FAFAF8] py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">{t("मुहूर्त शोधक", "Muhurat Finder")}</h1>
          <p className="text-gray-600 mt-2">{t("शुभ मुहूर्त शोधा — वास्तुशांती, गृहप्रवेश, विवाह, व्यापार", "Find auspicious dates — Vastushanti, Gruhapravesh, Marriage, Business")}</p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {/* Event Type */}
            <div>
              <label className="block text-sm font-bold mb-1" style={{ color: "#3d0c0c" }}>{t("कार्य प्रकार", "Event Type")}</label>
              <select value={eventType} onChange={(e) => setEventType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#d4a843]">
                {EVENT_TYPES.map((e) => (
                  <option key={e.id} value={e.id}>{t(e.mr, e.en)}</option>
                ))}
              </select>
            </div>
            {/* Start Month */}
            <div>
              <label className="block text-sm font-bold mb-1" style={{ color: "#3d0c0c" }}>{t("पासून महिना", "From Month")}</label>
              <input type="month" value={startMonth} onChange={(e) => setStartMonth(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#d4a843]" />
            </div>
            {/* Duration */}
            <div>
              <label className="block text-sm font-bold mb-1" style={{ color: "#3d0c0c" }}>{t("किती महिने", "Duration")}</label>
              <select value={months} onChange={(e) => setMonths(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#d4a843]">
                <option value={1}>{t("१ महिना", "1 Month")}</option>
                <option value={2}>{t("२ महिने", "2 Months")}</option>
                <option value={3}>{t("३ महिने", "3 Months")}</option>
                <option value={6}>{t("६ महिने", "6 Months")}</option>
              </select>
            </div>
          </div>
          <button onClick={searchMuhurat} disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white text-sm disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #5c1a1a, #3d0c0c)" }}>
            {loading ? t("शोधत आहे...", "Searching...") : t("शुभ मुहूर्त शोधा", "Find Auspicious Dates")}
          </button>
        </div>

        {/* Results */}
        {loading && (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-3 border-[#f0c040]/30 border-t-[#8b2c2c] rounded-full animate-spin mx-auto" />
            <p className="text-sm text-stone-500 mt-3">{t("मुहूर्त शोधत आहे...", "Searching for muhurat dates...")}</p>
          </div>
        )}

        {searched && !loading && (
          <div>
            <h2 className="text-lg font-bold mb-4" style={{ color: "#3d0c0c" }}>
              {results.length > 0
                ? t(`${results.length} शुभ दिवस सापडले`, `${results.length} auspicious dates found`)
                : t("या कालावधीत शुभ मुहूर्त नाही", "No auspicious dates in this period")}
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
                      <div><span className="text-stone-400">{t("तिथी:", "Tithi:")}</span> <span className="font-semibold">{r.tithi}</span></div>
                      <div><span className="text-stone-400">{t("नक्षत्र:", "Nak:")}</span> <span className="font-semibold">{r.nakshatra}</span></div>
                      <div><span className="text-stone-400">{t("योग:", "Yoga:")}</span> <span className="font-semibold">{r.yoga}</span></div>
                      <div><span className="text-stone-400">{t("चंद्र:", "Moon:")}</span> <span className="font-semibold">{r.moonRashi}</span></div>
                    </div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {r.muhuratTags.map((tag, j) => (
                        <span key={j} className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "#dcfce7", color: "#166534" }}>
                          {t(tag.nameMr, tag.name)}
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
