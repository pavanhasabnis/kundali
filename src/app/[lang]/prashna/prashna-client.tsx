"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useLang } from "@/lib/astrology/language-context";
import { PLACES, type Place } from "@/lib/astrology/places";
import { PRASHNA_CATEGORY_MR, PRASHNA_CATEGORY_EN, type PrashnaCategory } from "@/lib/astrology/prashna";

type PlanetData = {
  id: string;
  nameMr: string;
  name: string;
  rashi: string;
  rashiMr: string;
  degreeDMS: string;
  house: number;
  isRetrograde: boolean;
};

type ApiResponse = {
  question: string;
  castAt: string;
  chart: {
    ayanamsa: number;
    lagnaRashi: string;
    lagnaRashiMr: string;
    lagnaRashiIndex: number;
    lagnaDMS: string;
    moonRashi: string;
    moonRashiMr: string;
    moonNakshatra: string;
    moonNakshatraMr: string;
    moonPada: number;
    planets: PlanetData[];
  };
  prashna: {
    verdict: "favorable" | "mixed" | "unfavorable";
    verdictLabel: { mr: string; en: string };
    score: number;
    timing: { mr: string; en: string };
    category: PrashnaCategory;
    questionHouses: number[];
    reasoning: { mr: string; en: string; polarity: "+" | "-" | "0" }[];
    moonIndicator: {
      house: number;
      rashiIndex: number;
      inKendra: boolean;
      aspectedByBenefic: boolean;
      aspectedByMalefic: boolean;
    };
    lagnaModality: "movable" | "fixed" | "dual";
  };
};

const CATEGORIES: PrashnaCategory[] = [
  "marriage", "career", "health", "money", "travel",
  "litigation", "education", "property", "children", "enemy", "general",
];

export default function PrashnaClient() {
  const { lang, t } = useLang();

  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState<PrashnaCategory>("general");
  const [placeSearch, setPlaceSearch] = useState("");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ApiResponse | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // default place Pune
  useEffect(() => {
    const pune = PLACES.find((p) => p.name === "Pune");
    if (pune) setSelectedPlace(pune);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredPlaces = useMemo(() => {
    if (placeSearch.length < 1) return [];
    const q = placeSearch.toLowerCase();
    return PLACES.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.nameMr.includes(placeSearch) ||
      (p.district?.toLowerCase().includes(q) ?? false)
    ).slice(0, 20);
  }, [placeSearch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlace) {
      setError(t("ठिकाण निवडा", "Select a place", "स्थान चुनें"));
      return;
    }
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/prashna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          category,
          latitude: selectedPlace.lat,
          longitude: selectedPlace.lng,
          timestamp: new Date().toISOString(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  const castDisplay = result
    ? new Date(result.castAt).toLocaleString(lang === "mr" ? "mr-IN" : lang === "hi" ? "hi-IN" : "en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "";

  const verdictColor =
    result?.prashna.verdict === "favorable"
      ? "#1f6b3a"
      : result?.prashna.verdict === "unfavorable"
      ? "#8b0000"
      : "#b86e00";

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <section className="relative py-12 overflow-hidden" style={{ background: "linear-gradient(135deg, #3d0c0c 0%, #5c1a1a 50%, #3d0c0c 100%)" }}>
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-block px-4 py-1 rounded-full text-[11px] font-bold tracking-widest mb-4" style={{ background: "rgba(212,168,67,0.15)", border: "1px solid rgba(212,168,67,0.4)", color: "#d4a843" }}>
            ॥ {t("श्रीगणेशाय नमः", "SHRI GANESHAYA NAMAH", "श्रीगणेशाय नमः")} ॥
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold mb-3 text-white">{t("प्रश्न कुंडली", "Prashna Kundli", "प्रश्न कुंडली")}</h1>
          <p className="text-[#e8d9b3] text-sm sm:text-base max-w-2xl mx-auto">
            {t(
              "मनातील प्रश्न विचारा. आत्ताच्या ग्रहस्थितीवरून पारंपरिक प्रश्न ज्योतिष उत्तर देते.",
              "Ask a question on your mind. Traditional Prashna astrology interprets the current planetary positions for an answer.",
              "मन का प्रश्न पूछें. वर्तमान ग्रह स्थिति से पारंपरिक प्रश्न ज्योतिष उत्तर देता है."
            )}
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-10">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              {t("तुमचा प्रश्न", "Your Question", "आपका प्रश्न")}
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={2}
              maxLength={300}
              placeholder={t("उदा. मला नोकरी मिळेल का?", "e.g., Will I get the job?", "उदा. मुझे नौकरी मिलेगी?")}
              className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#5c1a1a]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              {t("प्रश्नाचा विषय", "Question Topic", "प्रश्न का विषय")}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as PrashnaCategory)}
              className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#5c1a1a]"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {lang === "mr" ? PRASHNA_CATEGORY_MR[c] : PRASHNA_CATEGORY_EN[c]}
                </option>
              ))}
            </select>
          </div>

          <div ref={dropdownRef} className="relative">
            <label className="block text-sm font-semibold text-stone-700 mb-2">
              {t("ठिकाण (जिथून विचारत आहात)", "Place (where you're asking from)", "स्थान (जहाँ से पूछ रहे हैं)")}
            </label>
            {selectedPlace ? (
              <div className="flex items-center justify-between px-3 py-2 border border-stone-300 rounded-md bg-stone-50">
                <span className="text-sm text-stone-800">
                  {lang === "mr" ? selectedPlace.nameMr : selectedPlace.name}
                  {selectedPlace.district && ` · ${selectedPlace.district}`}
                </span>
                <button type="button" onClick={() => setSelectedPlace(null)} className="text-xs text-[#8b0000]">
                  {t("बदला", "Change", "बदलें")}
                </button>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  value={placeSearch}
                  onChange={(e) => { setPlaceSearch(e.target.value); setShowDropdown(true); }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder={t("शहर शोधा...", "Search city...", "शहर खोजें...")}
                  className="w-full px-3 py-2 border border-stone-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#5c1a1a]"
                />
                {showDropdown && filteredPlaces.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full max-h-64 overflow-y-auto bg-white border border-stone-200 rounded-md shadow-lg">
                    {filteredPlaces.map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => { setSelectedPlace(p); setPlaceSearch(""); setShowDropdown(false); }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-stone-50 border-b border-stone-100"
                      >
                        {lang === "mr" ? p.nameMr : p.name}
                        {p.district && <span className="text-stone-500"> · {p.district}</span>}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {error && <p className="text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-md text-white font-semibold text-sm disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #5c1a1a, #3d0c0c)" }}
          >
            {loading
              ? t("गणना होत आहे...", "Casting chart...", "गणना हो रही है...")
              : t("आत्ता प्रश्न कुंडली तयार करा", "Cast Prashna Now", "अभी प्रश्न कुंडली बनाएँ")}
          </button>
        </form>

        {result && (
          <div className="mt-8 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
              <div className="text-xs text-stone-500 mb-2">
                {t("वेळ", "Cast at", "समय")}: {castDisplay}
              </div>
              {result.question && (
                <div className="text-sm text-stone-800 italic mb-4 border-l-4 border-[#d4a843] pl-3">
                  &ldquo;{result.question}&rdquo;
                </div>
              )}
              <div
                className="rounded-lg p-4 mb-4 text-center"
                style={{ background: `${verdictColor}15`, border: `1.5px solid ${verdictColor}` }}
              >
                <div className="text-xs uppercase tracking-wider font-semibold" style={{ color: verdictColor }}>
                  {t("उत्तर", "Verdict", "उत्तर")}
                </div>
                <div className="text-2xl font-bold mt-1" style={{ color: verdictColor }}>
                  {lang === "mr" ? result.prashna.verdictLabel.mr : result.prashna.verdictLabel.en}
                </div>
                <div className="text-xs text-stone-600 mt-2">
                  {t("अपेक्षित कालावधी", "Expected timing", "अपेक्षित अवधि")}:{" "}
                  <strong>{lang === "mr" ? result.prashna.timing.mr : result.prashna.timing.en}</strong>
                </div>
              </div>

              <h3 className="text-sm font-bold text-stone-800 mb-2">
                {t("कारण मीमांसा", "Reasoning", "कारण विश्लेषण")}
              </h3>
              <ul className="space-y-2">
                {result.prashna.reasoning.map((r, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <span className={`font-bold w-5 text-center flex-shrink-0 ${r.polarity === "+" ? "text-green-700" : r.polarity === "-" ? "text-red-700" : "text-stone-500"}`}>
                      {r.polarity}
                    </span>
                    <span className="text-stone-700">{lang === "mr" ? r.mr : r.en}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6">
              <h3 className="text-sm font-bold text-stone-800 mb-3">
                {t("आत्ताची ग्रहस्थिती", "Current Planetary Positions", "वर्तमान ग्रह स्थिति")}
              </h3>
              <div className="text-xs text-stone-600 mb-3 grid grid-cols-2 gap-2">
                <div><strong>{t("लग्न", "Lagna", "लग्न")}:</strong> {lang === "mr" ? result.chart.lagnaRashiMr : result.chart.lagnaRashi} ({result.chart.lagnaDMS})</div>
                <div><strong>{t("चंद्र राशी", "Moon Sign", "चंद्र राशि")}:</strong> {lang === "mr" ? result.chart.moonRashiMr : result.chart.moonRashi}</div>
                <div><strong>{t("नक्षत्र", "Nakshatra", "नक्षत्र")}:</strong> {lang === "mr" ? result.chart.moonNakshatraMr : result.chart.moonNakshatra} ({t("चरण", "Pada", "चरण")} {result.chart.moonPada})</div>
                <div><strong>{t("लग्न स्वभाव", "Lagna modality", "लग्न स्वभाव")}:</strong> {t(
                  result.prashna.lagnaModality === "movable" ? "चर" : result.prashna.lagnaModality === "fixed" ? "स्थिर" : "द्विस्वभाव",
                  result.prashna.lagnaModality,
                  result.prashna.lagnaModality === "movable" ? "चर" : result.prashna.lagnaModality === "fixed" ? "स्थिर" : "द्विस्वभाव"
                )}</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-stone-100 text-stone-700">
                      <th className="px-2 py-1.5 text-left">{t("ग्रह", "Planet", "ग्रह")}</th>
                      <th className="px-2 py-1.5 text-left">{t("राशी", "Rashi", "राशि")}</th>
                      <th className="px-2 py-1.5 text-left">{t("अंश", "Degree", "अंश")}</th>
                      <th className="px-2 py-1.5 text-center">{t("भाव", "House", "भाव")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.chart.planets.map((p) => (
                      <tr key={p.id} className="border-t border-stone-100">
                        <td className="px-2 py-1.5 font-semibold">
                          {lang === "mr" ? p.nameMr : p.name}
                          {p.isRetrograde && <span className="text-red-600 ml-1">↺</span>}
                        </td>
                        <td className="px-2 py-1.5">{lang === "mr" ? p.rashiMr : p.rashi}</td>
                        <td className="px-2 py-1.5 font-mono">{p.degreeDMS}</td>
                        <td className="px-2 py-1.5 text-center">{p.house}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-[10px] text-stone-500 italic">
                {t(
                  "ही प्रश्न कुंडली प्रश्न विचारल्या क्षणी (आत्ता) लग्न व ग्रहस्थितीवर आधारित आहे. पारंपरिक प्रश्नशास्त्र नियमांनुसार उत्तर दर्शवले आहे.",
                  "This Prashna chart is based on the lagna and planetary positions at the moment the question is asked. Verdict follows traditional horary rules.",
                  "यह प्रश्न कुंडली प्रश्न पूछने के क्षण (अभी) के लग्न व ग्रह स्थिति पर आधारित है."
                )}
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
