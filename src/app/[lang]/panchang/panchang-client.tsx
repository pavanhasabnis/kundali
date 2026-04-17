"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/lib/astrology/language-context";
import { formatTimeRangeMarathi } from "@/lib/astrology/time-format";
import { JsonLd, serviceSchema, breadcrumbSchema } from "@/components/json-ld";

interface PanchangData {
  date: string;
  day: string;
  tithi: string;
  tithiIndex: number;
  paksha: string;
  nakshatra: string;
  nakshatraEn: string;
  nakshatraLord: string;
  yoga: string;
  karana: string;
  rahuKaal: string;
  masa: string;
  moonRashi: string;
  sunRashi: string;
}

const PLANET_MR: Record<string, string> = {
  Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगळ", Mercury: "बुध",
  Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु",
};

const DAY_EN: Record<string, string> = {
  "रविवार": "Sunday", "सोमवार": "Monday", "मंगळवार": "Tuesday",
  "बुधवार": "Wednesday", "गुरुवार": "Thursday", "शुक्रवार": "Friday", "शनिवार": "Saturday",
};

const PAKSHA_EN: Record<string, string> = {
  "शुक्ल पक्ष": "Shukla Paksha (Waxing)", "कृष्ण पक्ष": "Krishna Paksha (Waning)",
};

export default function PanchangPageClient() {
  const { t, lang } = useLang();
  const [date, setDate] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  });
  const [panchang, setPanchang] = useState<PanchangData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch_panchang() {
      setLoading(true);
      try {
        const res = await fetch(`/api/panchang?date=${date}`);
        if (res.ok) {
          const data = await res.json();
          setPanchang(data);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetch_panchang();
  }, [date]);

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <JsonLd data={serviceSchema({ name: "Today's Panchang — आजचे पंचांग", description: "Daily Hindu panchang with tithi, nakshatra, yoga, karana, rahu kaal, sunrise & sunset. Accurate Vedic calendar for auspicious timing.", url: "https://bhaagyavedh.com/panchang" })} />
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "https://bhaagyavedh.com" }, { name: "Panchang", url: "https://bhaagyavedh.com/panchang" }])} />
      <section className="relative py-16 sm:py-24 overflow-hidden" style={{ background: "linear-gradient(135deg, #3d0c0c 0%, #5c1a1a 50%, #3d0c0c 100%)" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a843' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#d4a843] mb-3">
            {t("आजचे पंचांग", "Daily Panchang")}
          </h1>
          <p className="text-white/60 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {t("दैनिक तिथी, नक्षत्र, योग, करण आणि राहुकाळ", "Daily Tithi, Nakshatra, Yoga, Karana & Rahu Kaal")}
          </p>
        </div>
      </section>
      <div className="space-y-8 max-w-4xl mx-auto px-4 sm:px-6 py-6">

      {/* Date Selector */}
      <div className="flex justify-center">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 flex items-center gap-4">
          <button
            onClick={() => {
              const d = new Date(date);
              d.setDate(d.getDate() - 1);
              setDate(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`);
            }}
            className="px-3 py-2 bg-[#FFF3D6] rounded-lg hover:bg-[#FFF8E7] transition text-[#3d0c0c] font-bold"
          >
            {t("← मागील", "← Prev")}
          </button>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4a843]"
          />
          <button
            onClick={() => {
              const d = new Date(date);
              d.setDate(d.getDate() + 1);
              setDate(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`);
            }}
            className="px-3 py-2 bg-[#FFF3D6] rounded-lg hover:bg-[#FFF8E7] transition text-[#3d0c0c] font-bold"
          >
            {t("पुढील →", "Next →")}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-3 border-[#f0c040]/30 border-t-[#8b2c2c] rounded-full animate-spin" />
          <p className="mt-4 text-gray-500">{t("पंचांग गणना चालू...", "Calculating Panchang...")}</p>
        </div>
      ) : panchang ? (
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Main Panchang Card */}
          <div className="bg-gradient-to-br from-[#5c1a1a] to-[#3d0c0c] text-white rounded-2xl p-6 shadow-lg">
            <div className="text-center mb-6">
              <p className="text-sm opacity-75">{panchang.masa}</p>
              <p className="text-3xl font-bold mt-1">{t(panchang.day, DAY_EN[panchang.day] || panchang.day)}</p>
              <p className="text-sm opacity-75 mt-1">
                {new Date(date).toLocaleDateString(lang === "mr" ? "mr-IN" : "en-IN", {
                  year: "numeric", month: "long", day: "numeric",
                })}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <PanchangItem label={t("तिथी", "Tithi")} value={`${t(panchang.paksha, PAKSHA_EN[panchang.paksha] || panchang.paksha)} ${panchang.tithi}`} />
              <PanchangItem label={t("नक्षत्र", "Nakshatra")} value={t(panchang.nakshatra, panchang.nakshatraEn)} />
              <PanchangItem label={t("योग", "Yoga")} value={panchang.yoga} />
              <PanchangItem label={t("करण", "Karana")} value={panchang.karana} />
            </div>
          </div>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
              <h3 className="font-bold text-[#3d0c0c] mb-3">{t("चंद्र माहिती", "Moon Details")}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("चंद्र राशी", "Moon Sign")}</span>
                  <span className="font-semibold">{panchang.moonRashi}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("नक्षत्र", "Nakshatra")}</span>
                  <span className="font-semibold">{t(panchang.nakshatra, panchang.nakshatraEn)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("नक्षत्र स्वामी", "Nakshatra Lord")}</span>
                  <span className="font-semibold">{t(PLANET_MR[panchang.nakshatraLord] || panchang.nakshatraLord, panchang.nakshatraLord)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("पक्ष", "Paksha")}</span>
                  <span className="font-semibold">{t(panchang.paksha, PAKSHA_EN[panchang.paksha] || panchang.paksha)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
              <h3 className="font-bold text-[#3d0c0c] mb-3">{t("सूर्य माहिती", "Sun Details")}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("सूर्य राशी", "Sun Sign")}</span>
                  <span className="font-semibold">{panchang.sunRashi}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("मास", "Month")}</span>
                  <span className="font-semibold">{panchang.masa}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rahu Kaal Warning */}
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-5">
            <h3 className="font-bold text-red-800 mb-2">{t("राहुकाळ", "Rahu Kaal")}</h3>
            <p className="text-2xl font-bold text-red-700">{formatTimeRangeMarathi(panchang.rahuKaal, lang)}</p>
            <p className="text-xs text-red-500 mt-2">
              {t("राहुकाळात शुभ कार्य टाळावे", "Avoid auspicious activities during Rahu Kaal")}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          {t("पंचांग उपलब्ध नाही", "Panchang not available")}
        </div>
      )}
    </div></div>
  );
}

function PanchangItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/15 rounded-xl p-3">
      <p className="text-xs opacity-75">{label}</p>
      <p className="font-bold text-sm mt-0.5">{value}</p>
    </div>
  );
}
