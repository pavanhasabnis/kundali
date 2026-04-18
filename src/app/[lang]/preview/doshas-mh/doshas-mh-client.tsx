"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/astrology/language-context";
import { PLACES, type Place } from "@/lib/astrology/places";

interface MangalDosh {
  present: boolean;
  severity: string;
  severityMr: string;
  severityEn: string;
  severityHi: string;
  fromLagna: boolean;
  fromMoon: boolean;
  fromVenus: boolean;
  marsHouse: number;
  marsRashi: string;
  marsRashiMr: string;
  cancellations: string[];
  cancellationsMr: string[];
  cancellationsHi: string[];
  affectedAreasMr: string[];
  affectedAreasEn: string[];
  affectedAreasHi: string[];
  remediesMr: string[];
  remediesEn: string[];
  remediesHi: string[];
  summaryMr: string;
  summaryEn: string;
  summaryHi: string;
}

interface KalsarpDosh {
  present: boolean;
  partial: boolean;
  type: string | null;
  typeMr: string;
  typeEn: string;
  typeHi: string;
  rahuHouse: number;
  ketuHouse: number;
  udit: boolean;
  planetsOutside: string[];
  effectsEn: string;
  effectsMr: string;
  effectsHi: string;
  remediesEn: string[];
  remediesMr: string[];
  remediesHi: string[];
  yatraRecommendationEn: string;
  yatraRecommendationMr: string;
  yatraRecommendationHi: string;
  summaryEn: string;
  summaryMr: string;
  summaryHi: string;
}

interface ApiResponse {
  mangal: MangalDosh;
  kalsarp: KalsarpDosh;
  meta: { lagnaRashi: string; lagnaRashiMr: string; moonRashi: string; moonRashiMr: string };
}

export default function DoshasMhPreviewClient() {
  const { t, lang } = useLang();
  const [form, setForm] = useState({
    day: "15", month: "6", year: "1995",
    hour: "10", minute: "30", ampm: "AM",
    city: "Pune", latitude: "18.52", longitude: "73.85",
  });
  const [placeSearch, setPlaceSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [tab, setTab] = useState<"mangal" | "kalsarp">("mangal");

  const filteredPlaces = placeSearch.length >= 2
    ? PLACES.filter((p) =>
        p.name.toLowerCase().includes(placeSearch.toLowerCase()) ||
        p.nameMr.includes(placeSearch)
      ).slice(0, 8)
    : [];

  const handlePlaceSelect = (place: Place) => {
    setPlaceSearch("");
    setShowDropdown(false);
    setForm((f) => ({
      ...f,
      city: place.name,
      latitude: String(place.lat),
      longitude: String(place.lng),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    let hour = parseInt(form.hour);
    if (form.ampm === "PM" && hour !== 12) hour += 12;
    if (form.ampm === "AM" && hour === 12) hour = 0;
    try {
      const res = await fetch("/api/doshas-mh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year: parseInt(form.year),
          month: parseInt(form.month),
          day: parseInt(form.day),
          hour,
          minute: parseInt(form.minute),
          latitude: parseFloat(form.latitude),
          longitude: parseFloat(form.longitude),
          timezone: 5.5,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      const data: ApiResponse = await res.json();
      setResult(data);
    } catch {
      setError(t("गणना करताना त्रुटी आली.", "Calculation error.", "गणना में त्रुटि."));
    } finally {
      setLoading(false);
    }
  };

  const pick = (mr: string, en: string, hi: string) =>
    lang === "en" ? en : lang === "hi" ? hi : mr;
  const pickArr = (mr: string[], en: string[], hi: string[]) =>
    lang === "en" ? en : lang === "hi" ? hi : mr;

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <section className="py-10" style={{ background: "linear-gradient(135deg, #3d0c0c 0%, #5c1a1a 50%, #3d0c0c 100%)" }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-[#d4a843]/80 text-xs tracking-wide mb-2">PREVIEW</p>
          <h1 className="text-3xl font-bold text-[#d4a843] mb-2">
            {t("मंगळ व काळसर्प दोष", "Mangal & Kalsarp Dosh", "मंगल व कालसर्प दोष")}
          </h1>
          <p className="text-white/60 text-sm">
            {t("जन्म माहिती भरा — मंगळ दोष व काळसर्प दोषाचे निदान व उपाय मिळवा.", "Enter birth details — detect Mangal & Kalsarp Dosh with traditional Maharashtrian remedies.", "जन्म विवरण दर्ज करें — मंगल व कालसर्प दोष का निदान व उपाय")}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-[#3d0c0c]">{t("दिवस", "Day", "दिन")}</label>
              <input type="number" min={1} max={31} value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-[#3d0c0c]">{t("महिना", "Month", "माह")}</label>
              <input type="number" min={1} max={12} value={form.month} onChange={(e) => setForm({ ...form, month: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-[#3d0c0c]">{t("वर्ष", "Year", "वर्ष")}</label>
              <input type="number" min={1900} max={2100} value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-[#3d0c0c]">{t("तास", "Hour", "घंटा")}</label>
              <input type="number" min={1} max={12} value={form.hour} onChange={(e) => setForm({ ...form, hour: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-[#3d0c0c]">{t("मिनिटे", "Minute", "मिनट")}</label>
              <input type="number" min={0} max={59} value={form.minute} onChange={(e) => setForm({ ...form, minute: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-[#3d0c0c]">AM/PM</label>
              <select value={form.ampm} onChange={(e) => setForm({ ...form, ampm: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm">
                <option>AM</option><option>PM</option>
              </select>
            </div>
          </div>
          <div className="relative">
            <label className="block text-xs font-semibold mb-1 text-[#3d0c0c]">{t("जन्मस्थान", "Birth Place", "जन्म स्थान")}</label>
            <div className="text-xs text-gray-500 mb-1">{t("निवडलेले", "Selected", "चयनित")}: <b>{form.city}</b></div>
            <input type="text" value={placeSearch} onChange={(e) => { setPlaceSearch(e.target.value); setShowDropdown(true); }} placeholder={t("शहर शोधा...", "Search city...", "शहर खोजें...")} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
            {showDropdown && filteredPlaces.length > 0 && (
              <div className="absolute z-10 mt-1 w-full bg-white rounded-lg border border-gray-200 shadow-lg max-h-56 overflow-y-auto">
                {filteredPlaces.map((p, i) => (
                  <button type="button" key={i} onClick={() => handlePlaceSelect(p)} className="w-full px-3 py-2 text-left text-sm hover:bg-[#FFF8E7] border-b border-gray-50 last:border-0">
                    <span className="font-semibold">{lang === "mr" ? p.nameMr : p.name}</span>
                    {p.district && <span className="text-xs text-gray-400 ml-2">{p.district}</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-bold text-white disabled:opacity-50" style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)" }}>
            {loading ? t("गणना होत आहे...", "Calculating...", "गणना हो रही है...") : t("दोष तपासा", "Check Doshas", "दोष जाँचें")}
          </button>
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        </form>

        {result && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex border-b border-gray-100">
              <button onClick={() => setTab("mangal")} className={`flex-1 py-3 text-sm font-bold transition ${tab === "mangal" ? "bg-[#FFF8E7] text-[#3d0c0c] border-b-2 border-[#d4a843]" : "text-gray-500"}`}>
                {t("मंगळ दोष", "Mangal Dosh", "मंगल दोष")}{" "}
                <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${result.mangal.present ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                  {result.mangal.present ? pick(result.mangal.severityMr, result.mangal.severityEn, result.mangal.severityHi) : t("नाही", "No", "नहीं")}
                </span>
              </button>
              <button onClick={() => setTab("kalsarp")} className={`flex-1 py-3 text-sm font-bold transition ${tab === "kalsarp" ? "bg-[#FFF8E7] text-[#3d0c0c] border-b-2 border-[#d4a843]" : "text-gray-500"}`}>
                {t("काळसर्प दोष", "Kalsarp Dosh", "कालसर्प दोष")}{" "}
                <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${result.kalsarp.present ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                  {result.kalsarp.present ? (result.kalsarp.partial ? t("आंशिक", "Partial", "आंशिक") : t("पूर्ण", "Full", "पूर्ण")) : t("नाही", "No", "नहीं")}
                </span>
              </button>
            </div>

            <div className="p-5">
              {tab === "mangal" && (
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl ${result.mangal.present ? "bg-red-50 border border-red-100" : "bg-green-50 border border-green-100"}`}>
                    <p className="font-bold text-[#3d0c0c] text-sm mb-1">
                      {pick(result.mangal.summaryMr, result.mangal.summaryEn, result.mangal.summaryHi)}
                    </p>
                    {result.mangal.present && (
                      <div className="text-xs text-gray-600 mt-2 flex flex-wrap gap-x-4 gap-y-1">
                        <span>{t("लग्नापासून", "From Lagna", "लग्न से")}: {result.mangal.fromLagna ? "✓" : "—"}</span>
                        <span>{t("चंद्रापासून", "From Moon", "चंद्र से")}: {result.mangal.fromMoon ? "✓" : "—"}</span>
                        <span>{t("शुक्रापासून", "From Venus", "शुक्र से")}: {result.mangal.fromVenus ? "✓" : "—"}</span>
                        <span>{t("मंगळाची राशी", "Mars Rashi", "मंगल राशि")}: {lang === "mr" ? result.mangal.marsRashiMr : result.mangal.marsRashi}</span>
                      </div>
                    )}
                  </div>

                  {result.mangal.affectedAreasMr.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-[#3d0c0c] mb-2">{t("प्रभावित क्षेत्रे", "Affected Areas", "प्रभावित क्षेत्र")}</p>
                      <ul className="space-y-1">
                        {pickArr(result.mangal.affectedAreasMr, result.mangal.affectedAreasEn, result.mangal.affectedAreasHi).map((a, i) => (
                          <li key={i} className="text-sm text-gray-700 pl-3 border-l-2 border-[#d4a843]/40">{a}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.mangal.cancellations.length > 0 && (
                    <div className="p-3 rounded-lg bg-[#FFF8E7] border border-[#d4a843]/20">
                      <p className="text-xs font-bold text-[#3d0c0c] mb-2">{t("परिहार (दोष रद्द)", "Cancellations (Parihara)", "परिहार")}</p>
                      <ul className="space-y-1 text-sm text-gray-700">
                        {pickArr(result.mangal.cancellationsMr, result.mangal.cancellations, result.mangal.cancellationsHi).map((c, i) => (
                          <li key={i}>• {c}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.mangal.present && (
                    <div>
                      <p className="text-xs font-bold text-[#3d0c0c] mb-2">{t("उपाय", "Remedies", "उपाय")}</p>
                      <ul className="space-y-1.5">
                        {pickArr(result.mangal.remediesMr, result.mangal.remediesEn, result.mangal.remediesHi).map((r, i) => (
                          <li key={i} className="text-sm text-gray-700 flex gap-2">
                            <span className="text-[#d4a843] font-bold">{i + 1}.</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {tab === "kalsarp" && (
                <div className="space-y-4">
                  <div className={`p-4 rounded-xl ${result.kalsarp.present ? "bg-purple-50 border border-purple-100" : "bg-green-50 border border-green-100"}`}>
                    <p className="font-bold text-[#3d0c0c] text-sm mb-1">
                      {pick(result.kalsarp.summaryMr, result.kalsarp.summaryEn, result.kalsarp.summaryHi)}
                    </p>
                    {result.kalsarp.present && (
                      <div className="text-xs text-gray-600 mt-2 flex flex-wrap gap-x-4 gap-y-1">
                        <span>{t("प्रकार", "Type", "प्रकार")}: <b>{pick(result.kalsarp.typeMr, result.kalsarp.typeEn, result.kalsarp.typeHi)}</b></span>
                        <span>{t("राहू स्थान", "Rahu House", "राहु भाव")}: {result.kalsarp.rahuHouse}</span>
                        <span>{t("केतू स्थान", "Ketu House", "केतु भाव")}: {result.kalsarp.ketuHouse}</span>
                        <span>{result.kalsarp.udit ? t("उदित", "Udit", "उदित") : t("अनुदित", "Anudit", "अनुदित")}</span>
                      </div>
                    )}
                  </div>

                  {result.kalsarp.present && (
                    <>
                      <div>
                        <p className="text-xs font-bold text-[#3d0c0c] mb-2">{t("परिणाम", "Effects", "प्रभाव")}</p>
                        <p className="text-sm text-gray-700">{pick(result.kalsarp.effectsMr, result.kalsarp.effectsEn, result.kalsarp.effectsHi)}</p>
                      </div>

                      <div className="p-4 rounded-xl border border-[#d4a843]/30" style={{ background: "linear-gradient(135deg, #FFF8E7, #FFF3D6)" }}>
                        <p className="text-xs font-bold text-[#3d0c0c] mb-2 flex items-center gap-1">
                          <span>🛕</span> {t("शिफारस केलेले तीर्थक्षेत्र", "Recommended Yatra", "अनुशंसित तीर्थ")}
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed mb-3">
                          {pick(result.kalsarp.yatraRecommendationMr, result.kalsarp.yatraRecommendationEn, result.kalsarp.yatraRecommendationHi)}
                        </p>
                        <Link href="/temples/trimbakeshwar" className="inline-block text-xs font-bold px-3 py-1.5 rounded-lg text-white" style={{ background: "#5c1a1a" }}>
                          {t("त्र्यंबकेश्वर बद्दल वाचा →", "Read about Trimbakeshwar →", "त्र्यंबकेश्वर के बारे में →")}
                        </Link>
                      </div>

                      <div>
                        <p className="text-xs font-bold text-[#3d0c0c] mb-2">{t("उपाय", "Remedies", "उपाय")}</p>
                        <ul className="space-y-1.5">
                          {pickArr(result.kalsarp.remediesMr, result.kalsarp.remediesEn, result.kalsarp.remediesHi).map((r, i) => (
                            <li key={i} className="text-sm text-gray-700 flex gap-2">
                              <span className="text-[#d4a843] font-bold">{i + 1}.</span>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400 text-center">
          {t("प्रीव्ह्यू रूट — उत्पादनात प्रमोट करण्याआधी चाचणीसाठी.", "Preview route — for testing before production rollout.", "प्रीव्यू रूट — उत्पादन में प्रमोट करने से पहले परीक्षण हेतु")}
        </p>
      </div>
    </div>
  );
}
