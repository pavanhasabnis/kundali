"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/lib/astrology/language-context";

const RASHIS = [
  { id: 0, mr: "मेष", en: "Aries", symbol: "♈", dates: "एप्रिल 14 - मे 14", datesEn: "Apr 14 - May 14" },
  { id: 1, mr: "वृषभ", en: "Taurus", symbol: "♉", dates: "मे 15 - जून 14", datesEn: "May 15 - Jun 14" },
  { id: 2, mr: "मिथुन", en: "Gemini", symbol: "♊", dates: "जून 15 - जुलै 14", datesEn: "Jun 15 - Jul 14" },
  { id: 3, mr: "कर्क", en: "Cancer", symbol: "♋", dates: "जुलै 15 - ऑगस्ट 14", datesEn: "Jul 15 - Aug 14" },
  { id: 4, mr: "सिंह", en: "Leo", symbol: "♌", dates: "ऑगस्ट 15 - सप्टेंबर 15", datesEn: "Aug 15 - Sep 15" },
  { id: 5, mr: "कन्या", en: "Virgo", symbol: "♍", dates: "सप्टेंबर 16 - ऑक्टोबर 15", datesEn: "Sep 16 - Oct 15" },
  { id: 6, mr: "तुला", en: "Libra", symbol: "♎", dates: "ऑक्टोबर 16 - नोव्हेंबर 14", datesEn: "Oct 16 - Nov 14" },
  { id: 7, mr: "वृश्चिक", en: "Scorpio", symbol: "♏", dates: "नोव्हेंबर 15 - डिसेंबर 14", datesEn: "Nov 15 - Dec 14" },
  { id: 8, mr: "धनु", en: "Sagittarius", symbol: "♐", dates: "डिसेंबर 15 - जानेवारी 13", datesEn: "Dec 15 - Jan 13" },
  { id: 9, mr: "मकर", en: "Capricorn", symbol: "♑", dates: "जानेवारी 14 - फेब्रुवारी 12", datesEn: "Jan 14 - Feb 12" },
  { id: 10, mr: "कुंभ", en: "Aquarius", symbol: "♒", dates: "फेब्रुवारी 13 - मार्च 13", datesEn: "Feb 13 - Mar 13" },
  { id: 11, mr: "मीन", en: "Pisces", symbol: "♓", dates: "मार्च 14 - एप्रिल 13", datesEn: "Mar 14 - Apr 13" },
];

interface TransitInfo { planet: string; planetMr: string; house: number; effect: "good" | "bad" | "neutral" }
interface Prediction {
  rashiId: number;
  rashiMr: string;
  rashiEn: string;
  overall: { mr: string; en: string };
  career: { mr: string; en: string };
  love: { mr: string; en: string };
  health: { mr: string; en: string };
  advice: { mr: string; en: string };
  rating: number;
  transits: TransitInfo[];
  luckyColor: { mr: string; en: string };
  luckyNumber: number;
}

interface RashifalData {
  date: string;
  transitPlanets: { id: string; rashiEn: string; rashiIndex: number }[];
  predictions: Prediction[];
}

export default function RashifalPage() {
  const { t, lang } = useLang();
  const [selectedRashi, setSelectedRashi] = useState<number | null>(null);
  const [data, setData] = useState<RashifalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRashifal() {
      setLoading(true);
      try {
        const res = await fetch("/api/rashifal?rashi=all");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchRashifal();
  }, []);

  return (
    <div className="bg-[#FAFAF8] py-0"><div className="space-y-8">

      {/* Hero Header */}
      <div className="text-center py-10 px-6 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1a0505, #3d0c0c, #5c1a1a)" }}>
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Ccircle cx='30' cy='30' r='25' fill='none' stroke='%23d4a843' stroke-width='0.4'/%3E%3C/svg%3E")`, backgroundSize: "60px 60px" }} />
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white">
            {t("आजचे राशीफल", "Today's Horoscope")}
          </h1>
          <p className="text-sm mt-2" style={{ color: "#d4a843" }}>
            {new Date().toLocaleDateString(lang === "mr" ? "mr-IN" : "en-IN", { year: "numeric", month: "long", day: "numeric", weekday: "long" })}
          </p>
          <p className="text-xs mt-1 text-white/40">
            {t("आजच्या वास्तविक ग्रह गोचरावर आधारित भविष्य", "Based on today's real planetary transits")}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8 pb-12">

      {/* Current Transit Positions */}
      {data && (
        <div className="rounded-xl p-4 max-w-3xl mx-auto" style={{ background: "#FFF8E7", border: "1px solid rgba(212,168,67,0.2)" }}>
          <p className="text-xs font-semibold mb-2" style={{ color: "#5c1a1a" }}>
            {t("आजची ग्रह स्थिती (गोचर)", "Today's Planetary Positions (Transit)")}
          </p>
          <div className="flex flex-wrap gap-2">
            {data.transitPlanets.map((tp) => (
              <span key={tp.id} className="text-xs rounded-full px-3 py-1 font-medium" style={{ background: "white", color: "#3d0c0c", border: "1px solid rgba(212,168,67,0.15)" }}>
                {t(tp.planetMr || tp.id, tp.id)} → {t(tp.rashiMr || tp.rashiEn, tp.rashiEn)}
              </span>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-3 border-[#f0c040]/30 border-t-[#8b2c2c] rounded-full animate-spin" />
          <p className="mt-4 text-stone-500">{t("गोचर गणना चालू...", "Calculating transits...")}</p>
        </div>
      ) : data ? (
        <>
          {/* Rashi Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {RASHIS.map((rashi) => (
                <button
                  key={rashi.id}
                  id={rashi.en.toLowerCase()}
                  onClick={() => setSelectedRashi(selectedRashi === rashi.id ? null : rashi.id)}
                  className={`p-4 rounded-xl text-center transition-all ${
                    selectedRashi === rashi.id
                      ? "shadow-lg scale-105"
                      : "hover:shadow-md hover:-translate-y-1"
                  }`}
                  style={selectedRashi === rashi.id
                    ? { background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)", color: "#d4a843" }
                    : { background: "white", border: "1px solid rgba(212,168,67,0.15)" }
                  }
                >
                  <span className="text-3xl block mb-1">{rashi.symbol}</span>
                  <p className="font-bold text-sm" style={{ color: selectedRashi === rashi.id ? "#d4a843" : "#3d0c0c" }}>{t(rashi.mr, rashi.en)}</p>
                </button>
            ))}
          </div>

          {/* Detail View */}
          {selectedRashi !== null && data.predictions[selectedRashi] && (
            <div className="max-w-2xl mx-auto mb-10">
              <RashiDetail rashi={RASHIS[selectedRashi]} pred={data.predictions[selectedRashi]} />
            </div>
          )}

          {/* All Rashis Quick View */}
          {selectedRashi === null && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-center" style={{ color: "#3d0c0c" }}>
                {t("सर्व राशींचे आजचे भविष्य", "Today's Horoscope for All Signs")}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {RASHIS.map((rashi) => {
                  const pred = data.predictions[rashi.id];
                  if (!pred) return null;
                  return (
                    <button
                      key={rashi.id}
                      onClick={() => setSelectedRashi(rashi.id)}
                      className="bg-white rounded-xl p-4 text-left hover:shadow-md transition-all"
                      style={{ border: "1px solid rgba(212,168,67,0.15)" }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)", color: "#d4a843" }}>
                          {rashi.symbol}
                        </div>
                        <div>
                          <p className="font-bold" style={{ color: "#3d0c0c" }}>{t(rashi.mr, rashi.en)}</p>
                          <p className="text-xs" style={{ color: "#8b6914" }}>{lang === "mr" ? rashi.en : rashi.mr}</p>
                        </div>
                      </div>
                      <p className="text-sm leading-relaxed line-clamp-2" style={{ color: "#6b5b3e" }}>
                        {t(pred.overall.mr, pred.overall.en)}
                      </p>
                      <span className="text-xs font-semibold mt-2 inline-block" style={{ color: "#d4a843" }}>{t("सविस्तर पहा →", "Read more →")}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-stone-500">
          {t("राशीफल उपलब्ध नाही", "Horoscope not available")}
        </div>
      )}
    </div></div></div>
  );
}

function RashiDetail({ rashi, pred }: { rashi: typeof RASHIS[number]; pred: Prediction }) {
  const { t, lang } = useLang();

  return (
    <div className="rounded-2xl shadow-md overflow-hidden" style={{ border: "1px solid rgba(212,168,67,0.2)" }}>
      {/* Header */}
      <div className="text-white p-6 text-center" style={{ background: "linear-gradient(135deg, #1a0505, #3d0c0c, #5c1a1a)" }}>
        <span className="text-4xl block mb-2">{rashi.symbol}</span>
        <h2 className="text-2xl font-bold">
          {t(`${rashi.mr} — आजचे भविष्य`, `${rashi.en} — Today's Horoscope`)}
        </h2>
        <p className="text-sm mt-1" style={{ color: "#d4a843" }}>
          {new Date().toLocaleDateString(lang === "mr" ? "mr-IN" : "en-IN", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Lucky info */}
      <div className="grid grid-cols-2" style={{ background: "#FFF8E7", borderBottom: "1px solid rgba(212,168,67,0.15)" }}>
        <div className="p-3 text-center" style={{ borderRight: "1px solid rgba(212,168,67,0.15)" }}>
          <p className="text-[10px] uppercase tracking-wider" style={{ color: "#8b6914" }}>{t("भाग्यशाली रंग", "Lucky Color")}</p>
          <p className="font-semibold text-sm mt-0.5" style={{ color: "#3d0c0c" }}>{t(pred.luckyColor.mr, pred.luckyColor.en)}</p>
        </div>
        <div className="p-3 text-center">
          <p className="text-[10px] uppercase tracking-wider" style={{ color: "#8b6914" }}>{t("भाग्यांक", "Lucky Number")}</p>
          <p className="font-semibold text-sm mt-0.5" style={{ color: "#3d0c0c" }}>{pred.luckyNumber}</p>
        </div>
      </div>

      <div className="p-6 space-y-5 bg-white">
        {/* Prediction sections */}
        {[
          { title: t("आजचे एकंदर भविष्य", "Overall Prediction"), text: t(pred.overall.mr, pred.overall.en) },
          { title: t("करिअर व आर्थिक", "Career & Finance"), text: t(pred.career.mr, pred.career.en) },
          { title: t("प्रेम व कुटुंब", "Love & Family"), text: t(pred.love.mr, pred.love.en) },
          { title: t("आरोग्य", "Health"), text: t(pred.health.mr, pred.health.en) },
          { title: t("सल्ला", "Advice"), text: t(pred.advice.mr, pred.advice.en) },
        ].map((sec, i) => (
          <div key={i} className={i > 0 ? "pt-4" : ""} style={i > 0 ? { borderTop: "1px solid rgba(212,168,67,0.1)" } : {}}>
            <h3 className="text-sm font-bold mb-1.5" style={{ color: "#5c1a1a" }}>{sec.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: "#4a3a2a" }}>{sec.text}</p>
          </div>
        ))}

        {/* Transit Details */}
        <div className="pt-4" style={{ borderTop: "1px solid rgba(212,168,67,0.1)" }}>
          <h3 className="text-sm font-bold mb-2" style={{ color: "#5c1a1a" }}>{t("आजचे गोचर (ग्रह संचार)", "Today's Transits")}</h3>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {pred.transits.map((tr) => (
              <div key={tr.planet} className="text-center p-2 rounded-lg text-xs"
                style={tr.effect === "good"
                  ? { background: "#FFF8E7", border: "1px solid rgba(212,168,67,0.2)", color: "#3d0c0c" }
                  : { background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b" }
                }>
                <p className="font-semibold">{t(tr.planetMr, tr.planet)}</p>
                <p className="mt-0.5">{t(`${tr.house}वा भाव`, `House ${tr.house}`)}</p>
                <p className="text-[10px] mt-0.5 font-semibold">
                  {tr.effect === "good" ? t("शुभ", "Good") : t("सावध", "Caution")}
                </p>
              </div>
            ))}
          </div>
          <p className="text-[10px] mt-2" style={{ color: "rgba(139,44,44,0.4)" }}>
            {t("वरील भविष्य वास्तविक ग्रह गोचरावर आधारित आहे", "Based on real planetary transit positions")}
          </p>
        </div>
      </div>
    </div>
  );
}
