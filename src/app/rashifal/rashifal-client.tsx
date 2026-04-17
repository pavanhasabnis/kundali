"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLang } from "@/lib/astrology/language-context";
import { RASHI_LIST } from "@/lib/rashi-data";
import { JsonLd, serviceSchema, breadcrumbSchema, faqSchema } from "@/components/json-ld";

const RASHIS = RASHI_LIST;

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

export default function RashifalPageClient() {
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
    <div className="min-h-screen bg-[#FAFAF8]">
      <JsonLd data={serviceSchema({ name: "Daily Rashifal — आजचे राशीफल", description: "Daily horoscope predictions for all 12 zodiac signs based on Vedic astrology. Career, love, health & financial predictions in Marathi & English.", url: "https://bhaagyavedh.com/rashifal" })} />
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: "https://bhaagyavedh.com" }, { name: "Rashifal", url: "https://bhaagyavedh.com/rashifal" }])} />
      <section className="relative py-16 sm:py-24 overflow-hidden" style={{ background: "linear-gradient(135deg, #3d0c0c 0%, #5c1a1a 50%, #3d0c0c 100%)" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a843' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#d4a843] mb-3">
            {t("आजचे राशीफल", "Today's Horoscope")}
          </h1>
          <p className="text-white/60 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {new Date().toLocaleDateString(lang === "mr" ? "mr-IN" : "en-IN", { year: "numeric", month: "long", day: "numeric", weekday: "long" })}
          </p>
          <p className="text-white/40 text-xs mt-1">
            {t("आजच्या वास्तविक ग्रह गोचरावर आधारित भविष्य", "Based on today's real planetary transits")}
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8 py-6 pb-12">

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
                  <span
                    className="w-12 h-12 mx-auto mb-2 rounded-lg flex items-center justify-center text-2xl text-white"
                    style={{ background: selectedRashi === rashi.id ? "linear-gradient(135deg, #d4a843, #e5bc5a)" : "linear-gradient(135deg, #7B2D8E, #9B59B6)" }}
                  >
                    {rashi.symbol}
                  </span>
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
                    <Link
                      key={rashi.id}
                      href={`/rashifal/${rashi.slug}`}
                      className="bg-white rounded-xl p-4 text-left hover:shadow-md hover:-translate-y-0.5 transition-all block"
                      style={{ border: "1px solid rgba(212,168,67,0.15)" }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg text-white shrink-0" style={{ background: "linear-gradient(135deg, #7B2D8E, #9B59B6)" }}>
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
                    </Link>
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
    </div></div>
  );
}

function RashiDetail({ rashi, pred }: { rashi: typeof RASHIS[number]; pred: Prediction }) {
  const { t, lang } = useLang();

  return (
    <div className="rounded-2xl shadow-md overflow-hidden" style={{ border: "1px solid rgba(212,168,67,0.2)" }}>
      {/* Header */}
      <div className="text-white p-6 text-center" style={{ background: "linear-gradient(135deg, #1a0505, #3d0c0c, #5c1a1a)" }}>
        <div className="w-14 h-14 mx-auto mb-2 rounded-xl flex items-center justify-center text-2xl text-white" style={{ background: "linear-gradient(135deg, #7B2D8E, #9B59B6)" }}>
          {rashi.symbol}
        </div>
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

        {/* Link to dedicated page */}
        <div className="pt-4 text-center" style={{ borderTop: "1px solid rgba(212,168,67,0.1)" }}>
          <Link
            href={`/rashifal/${rashi.slug}`}
            className="inline-block px-6 py-2.5 rounded-xl text-sm font-semibold text-[#3d0c0c] transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #d4a843, #e5bc5a)" }}
          >
            {t(`${rashi.mr} राशीचे संपूर्ण भविष्य पहा`, `View Full ${rashi.en} Horoscope`)}
          </Link>
        </div>
      </div>

      {/* FAQ Section for AEO/GEO */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <JsonLd data={faqSchema([
          { question: "What is Rashifal (Horoscope)?", answer: "Rashifal is a daily horoscope prediction based on your zodiac sign (Rashi) in Vedic astrology. It analyzes the current planetary transits (Gochar) and their effects on each of the 12 zodiac signs — Mesh (Aries) to Meen (Pisces). Predictions cover career, love, health, and finances." },
          { question: "राशीफल म्हणजे काय?", answer: "राशीफल हे वैदिक ज्योतिषशास्त्रातील तुमच्या राशीवर आधारित दैनिक भविष्य आहे. सध्याच्या ग्रह गोचराचे विश्लेषण करून मेष ते मीन अशा १२ राशींसाठी करिअर, प्रेम, आरोग्य आणि आर्थिक भविष्य सांगितले जाते." },
          { question: "How is Vedic Rashifal different from Western Horoscope?", answer: "Vedic Rashifal uses the sidereal zodiac (actual star positions) while Western horoscope uses the tropical zodiac. This means your Vedic Rashi may differ from your Western sun sign by about 23 degrees. Vedic astrology also uses Moon sign (Chandra Rashi) as the primary reference, not Sun sign." },
          { question: "How often is the Rashifal updated?", answer: "Our Rashifal is generated daily based on real-time planetary transit calculations. The predictions change every day as planets move through different signs and nakshatras, affecting each Rashi differently." },
        ])} />
        <h2 className="text-xl font-bold mb-6" style={{ color: "#5c1a1a" }}>
          {t("राशीफल बद्दल सामान्य प्रश्न", "Frequently Asked Questions about Rashifal")}
        </h2>
        <div className="space-y-4">
          {[
            { q: t("राशीफल म्हणजे काय?", "What is Rashifal (Horoscope)?"), a: t("राशीफल हे तुमच्या राशीवर आधारित दैनिक भविष्य आहे. ग्रह गोचराचे विश्लेषण करून मेष ते मीन अशा १२ राशींसाठी करिअर, प्रेम, आरोग्य आणि आर्थिक भविष्य सांगितले जाते.", "Rashifal is a daily horoscope based on your zodiac sign. It analyzes planetary transits to predict career, love, health, and finances for all 12 signs from Aries to Pisces.") },
            { q: t("वैदिक राशीफल आणि पाश्चात्य राशीभविष्य यात काय फरक आहे?", "How is Vedic Rashifal different from Western Horoscope?"), a: t("वैदिक राशीफल नक्षत्र-आधारित (सायडरियल) राशिचक्र वापरते तर पाश्चात्य ज्योतिष ट्रॉपिकल राशिचक्र वापरते. वैदिक ज्योतिषात चंद्र राशी प्रमुख आहे, सूर्य राशी नव्हे.", "Vedic uses the sidereal zodiac (actual star positions) while Western uses tropical. Vedic astrology uses Moon sign as the primary reference, not Sun sign.") },
            { q: t("राशीफल किती वेळा अपडेट होते?", "How often is the Rashifal updated?"), a: t("आमचे राशीफल दररोज रिअल-टाइम ग्रह गोचर गणनेवर आधारित तयार होते. ग्रह वेगवेगळ्या राशींत संचार करतात तेव्हा भविष्य बदलते.", "Our Rashifal is generated daily based on real-time planetary transit calculations. Predictions change daily as planets move through different signs.") },
          ].map((faq, i) => (
            <details key={i} className="bg-white rounded-xl border border-[#d4a843]/20 overflow-hidden">
              <summary className="px-5 py-4 cursor-pointer font-semibold text-sm text-[#5c1a1a] hover:bg-[#d4a843]/5">{faq.q}</summary>
              <p className="px-5 pb-4 text-sm text-[#5c1a1a]/70 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
