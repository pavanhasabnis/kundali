"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useLang } from "@/lib/astrology/language-context";
import { PLACES, type Place } from "@/lib/astrology/places";
import { JsonLd, serviceSchema, breadcrumbSchema, faqSchema } from "@/components/json-ld";

interface PlanetData {
  id: string;
  nameMr: string;
  name: string;
  rashiMr: string;
  rashi: string;
  degreeDMS: string;
  nakshatraMr: string;
  nakshatra: string;
  nakshatraLord: string;
  pada: number;
  house: number;
  isRetrograde: boolean;
}

interface DashaData {
  lord: string;
  startDate: string;
  endDate: string;
  years: number;
}

interface PlanetStrengthData {
  id: string;
  nameMr: string;
  nameEn: string;
  dignity: string;
  dignityMr: string;
  dignityEn: string;
  isRetrograde: boolean;
  isCombust: boolean;
  house: number;
  strengthScore: number;
}

interface YogaData {
  nameMr: string;
  nameEn: string;
  descriptionMr: string;
  descriptionEn: string;
  type: "benefic" | "malefic" | "neutral";
  strength: "strong" | "moderate" | "weak";
}

interface DoshaData {
  nameMr: string;
  nameEn: string;
  present: boolean;
  severity: string;
  descriptionMr: string;
  descriptionEn: string;
  remedyMr: string;
  remedyEn: string;
}

interface HousePredictionData {
  house: number;
  titleMr: string;
  titleEn: string;
  iconLabel: string;
  predictionMr: string;
  predictionEn: string;
  rating: number;
}

interface DashaInterpData {
  lordMr: string;
  lordEn: string;
  periodMr: string;
  periodEn: string;
  careerMr: string;
  careerEn: string;
  financeMr: string;
  financeEn: string;
  healthMr: string;
  healthEn: string;
  relationshipMr: string;
  relationshipEn: string;
  adviceMr: string;
  adviceEn: string;
}

interface RemedyData {
  categoryMr: string;
  categoryEn: string;
  items: { mr: string; en: string }[];
}

interface AnalysisData {
  planetaryStrength: PlanetStrengthData[];
  yogas: YogaData[];
  doshas: DoshaData[];
  housePredictions: HousePredictionData[];
  currentDasha: DashaInterpData | null;
  remedies: RemedyData[];
}

interface KundliData {
  lagnaRashiMr: string;
  lagnaRashi: string;
  lagnaDMS: string;
  lagnaNakshatraMr: string;
  lagnaNakshatra: string;
  moonRashiMr: string;
  moonRashi: string;
  moonNakshatraMr: string;
  moonNakshatra: string;
  moonNakshatraLord: string;
  moonPada: number;
  ayanamsa: number;
  planets: PlanetData[];
  dashas: DashaData[];
  analysis: AnalysisData;
}

const TYPE_LABEL: Record<string, { en: string; mr: string }> = {
  city: { en: "City", mr: "शहर" },
  town: { en: "Town", mr: "नगर" },
  taluka: { en: "Taluka", mr: "तालुका" },
  village: { en: "Village", mr: "गाव" },
};

const PLANET_LORD_MR: Record<string, string> = {
  Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगळ", Mercury: "बुध",
  Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु",
};

export default function KundliPageClient() {
  const { lang, t } = useLang();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    day: "",
    month: "",
    year: "",
    hour: "",
    minute: "",
    ampm: "AM",
    city: "",
    latitude: "",
    longitude: "",
  });
  const [result, setResult] = useState<KundliData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("basic");
  const [placeSearch, setPlaceSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [userSession, setUserSession] = useState<{ email: string; plan?: string } | null>(null);
  const [kundliCount, setKundliCount] = useState(0);
  const [showPaywall, setShowPaywall] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);

  // Check user session & kundli count
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();
        if (data?.user?.email) {
          setUserSession(data.user);
          // Get kundli count
          const kr = await fetch("/api/user/kundlis");
          const kd = await kr.json();
          setKundliCount(kd.kundlis?.length || 0);
        }
      } catch { /* not logged in */ }
      setSessionLoading(false);
    }
    checkSession();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filteredPlaces = placeSearch.length >= 1
    ? PLACES.filter((p) => {
        const q = placeSearch.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.nameMr.includes(placeSearch) || (p.district?.toLowerCase().includes(q) ?? false);
      }).slice(0, 30)
    : [];

  const handlePlaceSelect = (place: Place) => {
    setSelectedPlace(place);
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

    // 1. Must be logged in
    if (!userSession) {
      signIn("google", { callbackUrl: "/kundli" });
      return;
    }

    // 2. Free plan: max 1 kundli (admins bypass)
    const plan = (userSession as Record<string, string>).plan || "free";
    const role = (userSession as Record<string, string>).role || "user";
    if (role !== "admin" && plan === "free" && kundliCount >= 1) {
      setShowPaywall(true);
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    let hour = parseInt(form.hour);
    if (form.ampm === "PM" && hour !== 12) hour += 12;
    if (form.ampm === "AM" && hour === 12) hour = 0;

    try {
      // Redirect to result page with query params
      const params = new URLSearchParams({
        name: form.name,
        year: form.year,
        month: form.month,
        day: form.day,
        hour: String(hour),
        minute: form.minute,
        lat: form.latitude,
        lng: form.longitude,
        tz: "5.5",
        place: form.city,
      });
      router.push(`/kundli/result?${params.toString()}`);
    } catch {
      setError(t("कुंडली गणना करताना त्रुटी आली. कृपया माहिती तपासा.", "Error calculating Kundli. Please check your details.", "कुंडली गणना में त्रुटि हुई. कृपया जानकारी जाँचें."));
      setLoading(false);
    }
  };

  const monthNames = lang === "mr"
    ? ["जानेवारी","फेब्रुवारी","मार्च","एप्रिल","मे","जून","जुलै","ऑगस्ट","सप्टेंबर","ऑक्टोबर","नोव्हेंबर","डिसेंबर"]
    : ["January","February","March","April","May","June","July","August","September","October","November","December"];


  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <JsonLd data={serviceSchema({ name: "Free Kundli Generator — मोफत कुंडली", description: "Generate accurate Vedic birth chart (kundli) with planetary positions, dashas, yogas, and doshas. Free online janam kundali.", url: `https://bhaagyavedh.com/${lang}/kundli` })} />
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: `https://bhaagyavedh.com/${lang}` }, { name: "Kundli", url: `https://bhaagyavedh.com/${lang}/kundli` }])} />
      <section className="relative py-16 sm:py-24 overflow-hidden" style={{ background: "linear-gradient(135deg, #3d0c0c 0%, #5c1a1a 50%, #3d0c0c 100%)" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a843' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#d4a843] mb-3">
            {t("कुंडली निर्मिती", "Kundli Generation", "कुंडली निर्माण")}
          </h1>
          <p className="text-white/60 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {t("जन्म माहिती भरा आणि अचूक कुंडली मिळवा", "Enter birth details to get accurate Kundli", "जन्म जानकारी भरें और सटीक कुंडली पाएँ")}
          </p>
        </div>
      </section>
      <div className="space-y-8 max-w-4xl mx-auto px-4 sm:px-6 py-6">

      {/* Saved Kundlis */}
      {(() => {
        if (typeof window === "undefined") return null;
        const saved = JSON.parse(localStorage.getItem("savedKundlis") || "[]");
        if (saved.length === 0) return null;
        return (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 max-w-2xl mx-auto">
            <h3 className="text-sm font-bold mb-3" style={{ color: "#3d0c0c" }}>{t("सेव्ह केलेल्या कुंडल्या", "Saved Kundlis", "सहेजी गई कुंडलियाँ")}</h3>
            <div className="space-y-2">
              {saved.map((s: { name: string; params: Record<string, string> }, i: number) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-[#FFF8E7] transition">
                  <button onClick={() => {
                    const p = s.params;
                    const q = new URLSearchParams(p).toString();
                    router.push(`/kundli/result?${q}`);
                  }} className="text-sm font-semibold text-left flex-1" style={{ color: "#3d0c0c" }}>
                    {s.name}
                  </button>
                  <button onClick={() => {
                    const all = JSON.parse(localStorage.getItem("savedKundlis") || "[]");
                    all.splice(i, 1);
                    localStorage.setItem("savedKundlis", JSON.stringify(all));
                    window.location.reload();
                  }} className="text-xs text-red-400 hover:text-red-600 px-2">
                    {t("काढा", "Remove", "हटाएँ")}
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Birth Details Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 max-w-2xl mx-auto"
      >
        <h2 className="text-lg font-bold text-[#3d0c0c] mb-4">
          {t("जन्म माहिती", "Birth Details", "जन्म जानकारी")}
        </h2>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("नाव", "Name", "नाम")}</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4a843] focus:border-[#d4a843]"
            placeholder={t("तुमचे नाव", "Your name", "आपका नाम")}
          />
        </div>

        {/* Date */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("दिवस", "Day", "दिन")}</label>
            <input
              type="number"
              min="1"
              max="31"
              value={form.day}
              onChange={(e) => setForm((f) => ({ ...f, day: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4a843]"
              placeholder="DD"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("महिना", "Month", "महीना")}</label>
            <select
              value={form.month}
              onChange={(e) => setForm((f) => ({ ...f, month: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4a843]"
              required
            >
              <option value="">{t("निवडा", "Select", "चुनें")}</option>
              {monthNames.map((m, i) => (
                <option key={i + 1} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("वर्ष", "Year", "वर्ष")}</label>
            <input
              type="number"
              min="1900"
              max="2030"
              value={form.year}
              onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4a843]"
              placeholder="YYYY"
              required
            />
          </div>
        </div>

        {/* Time */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("तास", "Hour", "घंटा")}</label>
            <input
              type="number"
              min="1"
              max="12"
              value={form.hour}
              onChange={(e) => setForm((f) => ({ ...f, hour: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4a843]"
              placeholder="HH"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("मिनिटे", "Minutes", "मिनट")}</label>
            <input
              type="number"
              min="0"
              max="59"
              value={form.minute}
              onChange={(e) => setForm((f) => ({ ...f, minute: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4a843]"
              placeholder="MM"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t("वेळ", "AM/PM", "समय")}</label>
            <select
              value={form.ampm}
              onChange={(e) => setForm((f) => ({ ...f, ampm: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4a843]"
            >
              <option value="AM">{t("सकाळी (AM)", "AM (Morning)", "सुबह (AM)")}</option>
              <option value="PM">{t("दुपारी/संध्याकाळी (PM)", "PM (Afternoon/Evening)", "दोपहर/शाम (PM)")}</option>
            </select>
          </div>
        </div>

        {/* Birth Place — Searchable */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("जन्मस्थान", "Birth Place", "जन्मस्थान")}</label>
          <div ref={dropdownRef} className="relative">
            {/* Selected place display */}
            {selectedPlace && !showDropdown && (
              <div
                onClick={() => setShowDropdown(true)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg cursor-pointer bg-white flex items-center justify-between hover:border-[#d4a843] transition"
              >
                <span>
                  {lang === "mr"
                    ? `${selectedPlace.nameMr} (${selectedPlace.name})`
                    : selectedPlace.name}
                  {selectedPlace.district && (
                    <span className="text-gray-400 text-xs ml-1">— {selectedPlace.district}</span>
                  )}
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-[#FFF8E7] text-[#5c1a1a]">
                  {lang === "mr" ? TYPE_LABEL[selectedPlace.type].mr : TYPE_LABEL[selectedPlace.type].en}
                </span>
              </div>
            )}
            {/* Search input */}
            {(showDropdown || !selectedPlace) && (
              <input
                type="text"
                value={placeSearch}
                onChange={(e) => { setPlaceSearch(e.target.value); setShowDropdown(true); }}
                onFocus={() => setShowDropdown(true)}
                placeholder={t("शहर, तालुका किंवा गाव शोधा...", "Search city, town, taluka or village...", "शहर, तहसील या गाँव खोजें...")}
                className="w-full px-4 py-2 border border-[#d4a843] rounded-lg focus:ring-2 focus:ring-[#d4a843] outline-none"
                autoFocus
              />
            )}
            {/* Dropdown results */}
            {showDropdown && placeSearch.length >= 1 && (
              <div className="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                {filteredPlaces.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    {t("ठिकाण सापडले नाही. खाली अक्षांश/रेखांश टाका.", "No place found. Enter lat/lng manually below.", "स्थान नहीं मिला. नीचे अक्षांश/देशांतर भरें.")}
                  </div>
                ) : (
                  filteredPlaces.map((p) => (
                    <button
                      key={`${p.name}-${p.lat}-${p.lng}`}
                      type="button"
                      onClick={() => handlePlaceSelect(p)}
                      className="w-full text-left px-4 py-2 hover:bg-[#FFF8E7] flex items-center justify-between border-b border-gray-50 last:border-0"
                    >
                      <span className="text-sm">
                        {lang === "mr" ? `${p.nameMr} (${p.name})` : p.name}
                        {p.district && (
                          <span className="text-gray-400 text-xs ml-1">— {p.district}</span>
                        )}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 shrink-0 ml-2">
                        {lang === "mr" ? TYPE_LABEL[p.type].mr : TYPE_LABEL[p.type].en}
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {t("गाव सापडत नसल्यास जवळचे ठिकाण निवडा किंवा अक्षांश/रेखांश टाका", "If your village is not listed, select nearest place or enter coordinates", "गाँव सूची में न हो तो निकटतम स्थान चुनें या निर्देशांक भरें")}
          </p>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={form.latitude}
              onChange={(e) => setForm((f) => ({ ...f, latitude: e.target.value }))}
              className="w-1/2 px-3 py-1 text-xs border border-gray-200 rounded"
              placeholder={t("अक्षांश (Latitude)", "Latitude", "अक्षांश (Latitude)")}
            />
            <input
              type="text"
              value={form.longitude}
              onChange={(e) => setForm((f) => ({ ...f, longitude: e.target.value }))}
              className="w-1/2 px-3 py-1 text-xs border border-gray-200 rounded"
              placeholder={t("रेखांश (Longitude)", "Longitude", "देशांतर (Longitude)")}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || sessionLoading}
          className="w-full py-3 bg-gradient-to-r from-[#5c1a1a] to-[#3d0c0c] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
        >
          {loading
            ? t("गणना चालू आहे...", "Calculating...", "गणना चल रही है...")
            : !userSession
            ? t("लॉग इन करा आणि कुंडली बनवा", "Login & Generate Kundli", "लॉग इन करें और कुंडली बनाएँ")
            : t("कुंडली बनवा", "Generate Kundli", "कुंडली बनाएँ")}
        </button>

        {!userSession && !sessionLoading && (
          <p className="mt-2 text-xs text-center text-[#5c1a1a]/50">
            {t("कुंडली बनवण्यासाठी Google लॉग इन आवश्यक आहे", "Google login is required to generate kundli", "कुंडली बनाने के लिए Google लॉग इन आवश्यक है")}
          </p>
        )}

        {error && (
          <p className="mt-4 text-red-600 text-sm text-center">{error}</p>
        )}
      </form>

      {/* Paywall Modal */}
      {showPaywall && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setShowPaywall(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-5 text-center" style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)" }}>
              <h2 className="text-xl font-bold text-[#d4a843]">
                {t("मोफत कुंडली मर्यादा संपली", "Free Kundli Limit Reached", "मुफ्त कुंडली सीमा समाप्त")}
              </h2>
            </div>
            <div className="p-6 text-center">
              <p className="text-sm text-[#5c1a1a]/70 mb-2">
                {t(
                  "तुम्ही तुमची १ मोफत कुंडली आधीच बनवली आहे.",
                  "You have already used your 1 free kundli."
                )}
              </p>
              <p className="text-sm text-[#5c1a1a]/70 mb-6">
                {t(
                  "अधिक कुंडल्या बनवण्यासाठी प्रीमियम प्लॅन घ्या.",
                  "Upgrade to premium plan to generate more kundlis."
                )}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => router.push("/account")}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #d4a843, #c49535)", color: "#1a0505" }}
                >
                  {t("प्रीमियम प्लॅन पहा", "View Premium Plans", "प्रीमियम प्लान देखें")}
                </button>
                <button
                  onClick={() => setShowPaywall(false)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-semibold border border-gray-200 text-[#5c1a1a]/60 hover:bg-gray-50"
                >
                  {t("बंद करा", "Close", "बंद करें")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>

      {/* FAQ Section for AEO/GEO */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <JsonLd data={faqSchema([
          { question: "What is a Kundli (Birth Chart)?", answer: "A Kundli or Janam Kundali is a Vedic astrological birth chart that maps the exact positions of planets at the time and place of your birth. It contains 12 houses representing different aspects of life — career, marriage, health, wealth, and more. It is the foundation of Vedic astrology predictions." },
          { question: "कुंडली म्हणजे काय?", answer: "कुंडली किंवा जन्मकुंडली हा वैदिक ज्योतिषशास्त्रातील जन्मपत्रिका आहे जी तुमच्या जन्माच्या वेळी आणि ठिकाणी ग्रहांच्या अचूक स्थितीचे मॅपिंग करते. यात जीवनाच्या विविध पैलूंचे प्रतिनिधित्व करणारी १२ भावस्थाने आहेत." },
          { question: "How accurate is online Kundli generation?", answer: "Our Kundli generator uses precise astronomical data (the same data used by professional astrologers worldwide) for planetary calculations. The accuracy depends on the precision of your birth time — even a few minutes difference can change the Lagna (Ascendant). We recommend using the exact birth time from your birth certificate." },
          { question: "What details do I need to generate a Kundli?", answer: "You need three essential details: (1) Date of Birth, (2) Exact Time of Birth (as accurate as possible), and (3) Place of Birth. The place is needed to calculate the exact longitude and latitude for accurate planetary positions and house placements." },
          { question: "Is the Kundli generation free?", answer: "Yes, your first Kundli generation is completely free. After that, you can upgrade to our Premium plan at ₹199/month for unlimited Kundli generations, detailed analysis, and more features." },
          { question: "What is included in the Kundli report?", answer: "Our Kundli report includes: Lagna (Ascendant) chart, planetary positions with degrees, Nakshatra details, Dasha periods (Vimshottari), Yoga analysis (Raj Yoga, Gajakesari, etc.), Dosha check (Mangal Dosha, Kaal Sarp, Sade Sati), house-wise predictions, and personalized remedies." },
        ])} />
        <h2 className="text-xl font-bold mb-6" style={{ color: "#5c1a1a" }}>
          {t("कुंडलीबद्दल सामान्य प्रश्न", "Frequently Asked Questions about Kundli", "कुंडली के बारे में सामान्य प्रश्न")}
        </h2>
        <div className="space-y-4">
          {[
            { q: t("कुंडली म्हणजे काय?", "What is a Kundli (Birth Chart)?", "कुंडली क्या है?"), a: t("कुंडली किंवा जन्मकुंडली हा वैदिक ज्योतिषशास्त्रातील जन्मपत्रिका आहे जी तुमच्या जन्माच्या वेळी आणि ठिकाणी ग्रहांच्या अचूक स्थितीचे मॅपिंग करते. यात जीवनाच्या विविध पैलूंचे प्रतिनिधित्व करणारी १२ भावस्थाने आहेत — करिअर, लग्न, आरोग्य, संपत्ती इत्यादी.", "A Kundli or Janam Kundali is a Vedic astrological birth chart that maps the exact positions of planets at the time and place of your birth. It contains 12 houses representing different aspects of life — career, marriage, health, wealth, and more.", "कुंडली या जन्मकुंडली वैदिक ज्योतिष की जन्म पत्रिका है जो आपके जन्म के समय और स्थान पर ग्रहों की सटीक स्थिति का मानचित्रण करती है. इसमें जीवन के विभिन्न पहलुओं का प्रतिनिधित्व करने वाले १२ भाव हैं — करियर, विवाह, स्वास्थ्य, धन आदि.") },
            { q: t("ऑनलाइन कुंडली किती अचूक आहे?", "How accurate is online Kundli generation?", "ऑनलाइन कुंडली कितनी सटीक है?"), a: t("आमचा कुंडली जनरेटर अचूक खगोलीय डेटा वापरतो — जगभरातील व्यावसायिक ज्योतिषी वापरतात तेच गणना आधार. अचूकतेसाठी जन्म प्रमाणपत्रावरील अचूक जन्म वेळ वापरा.", "Our Kundli generator uses precise astronomical data (the same data used by professional astrologers worldwide). For best accuracy, use the exact birth time from your birth certificate.", "हमारा कुंडली जनरेटर सटीक खगोलीय डेटा का उपयोग करता है — दुनिया भर के पेशेवर ज्योतिषी यही गणना आधार उपयोग करते हैं. सटीकता के लिए जन्म प्रमाणपत्र पर अंकित सटीक जन्म समय का उपयोग करें.") },
            { q: t("कुंडली बनवण्यासाठी कोणती माहिती लागते?", "What details do I need to generate a Kundli?", "कुंडली बनाने के लिए क्या जानकारी चाहिए?"), a: t("तीन गोष्टी आवश्यक आहेत: (१) जन्म तारीख, (२) अचूक जन्म वेळ, आणि (३) जन्म ठिकाण. ग्रह स्थिती आणि भावस्थान गणनेसाठी अक्षांश-रेखांश आवश्यक आहेत.", "You need three details: (1) Date of Birth, (2) Exact Time of Birth, and (3) Place of Birth. The place is needed for longitude/latitude calculations.", "तीन चीज़ें आवश्यक हैं: (१) जन्म तिथि, (२) सटीक जन्म समय, और (३) जन्म स्थान. ग्रह स्थिति और भाव गणना के लिए अक्षांश-देशांतर आवश्यक हैं.") },
            { q: t("कुंडली बनवणे मोफत आहे का?", "Is the Kundli generation free?", "क्या कुंडली बनाना मुफ्त है?"), a: t("होय, तुमची पहिली कुंडली पूर्णपणे मोफत आहे. त्यानंतर Premium plan (₹१९९/महिना) घेऊन अमर्यादित कुंडली बनवा.", "Yes, your first Kundli is completely free. After that, upgrade to Premium (₹199/month) for unlimited generations.", "हाँ, आपकी पहली कुंडली पूरी तरह मुफ्त है. उसके बाद Premium plan (₹१९९/माह) लेकर असीमित कुंडली बनाएँ.") },
            { q: t("कुंडली रिपोर्टमध्ये काय समाविष्ट आहे?", "What is included in the Kundli report?", "कुंडली रिपोर्ट में क्या शामिल है?"), a: t("लग्न कुंडली, ग्रह स्थिती, नक्षत्र, दशा काल, योग विश्लेषण (राजयोग, गजकेसरी इ.), दोष तपासणी (मंगळ दोष, कालसर्प, साडेसाती), भावस्थान भविष्य, आणि उपाय.", "Lagna chart, planetary positions, Nakshatra, Dasha periods, Yoga analysis (Raj Yoga, Gajakesari), Dosha check (Mangal, Kaal Sarp, Sade Sati), house predictions, and remedies.", "लग्न कुंडली, ग्रह स्थिति, नक्षत्र, दशा काल, योग विश्लेषण (राजयोग, गजकेसरी आदि), दोष जाँच (मंगल दोष, कालसर्प, साढ़ेसाती), भाव भविष्य और उपाय.") },
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

// ─── Sub Components ──────────────────────────────────────────────────

function BasicInfoSection({ result, form }: { result: KundliData; form: { name: string } }) {
  const { t } = useLang();
  return (
    <div className="bg-gradient-to-r from-[#5c1a1a] to-[#3d0c0c] text-white rounded-2xl p-6 shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center">
        {form.name ? `${form.name} — ` : ""}{t("मूळ माहिती", "Basic Info", "मूल जानकारी")}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-white/15 rounded-xl p-3">
          <p className="text-xs text-[#d4a843]/80">{t("लग्न", "Ascendant", "लग्न")}</p>
          <p className="text-lg font-bold">{t(result.lagnaRashiMr, result.lagnaRashi)}</p>
          <p className="text-xs">{result.lagnaDMS}</p>
        </div>
        <div className="bg-white/15 rounded-xl p-3">
          <p className="text-xs text-[#d4a843]/80">{t("राशी (चंद्र)", "Moon Sign", "राशि (चंद्र)")}</p>
          <p className="text-lg font-bold">{t(result.moonRashiMr, result.moonRashi)}</p>
          <p className="text-xs">{t(result.moonRashiMr, result.moonRashi)}</p>
        </div>
        <div className="bg-white/15 rounded-xl p-3">
          <p className="text-xs text-[#d4a843]/80">{t("नक्षत्र", "Nakshatra", "नक्षत्र")}</p>
          <p className="text-lg font-bold">{t(result.moonNakshatraMr, result.moonNakshatra)}</p>
          <p className="text-xs">{t("पद", "Pada", "पद")} {result.moonPada}</p>
        </div>
        <div className="bg-white/15 rounded-xl p-3">
          <p className="text-xs text-[#d4a843]/80">{t("नक्षत्र स्वामी", "Nakshatra Lord", "नक्षत्र स्वामी")}</p>
          <p className="text-lg font-bold">{t(PLANET_LORD_MR[result.moonNakshatraLord] || result.moonNakshatraLord, result.moonNakshatraLord)}</p>
          <p className="text-xs">{t("अयनांश", "Ayanamsa", "अयनांश")}: {result.ayanamsa.toFixed(4)}°</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-white/15 rounded-xl p-3">
          <p className="text-xs text-[#d4a843]/80">{t("लग्न नक्षत्र", "Lagna Nakshatra", "लग्न नक्षत्र")}</p>
          <p className="text-sm font-bold">{t(result.lagnaNakshatraMr, result.lagnaNakshatra)}</p>
        </div>
        <div className="bg-white/15 rounded-xl p-3">
          <p className="text-xs text-[#d4a843]/80">{t("योग संख्या", "Yogas Found", "योग संख्या")}</p>
          <p className="text-lg font-bold">{result.analysis.yogas.length}</p>
        </div>
        <div className="bg-white/15 rounded-xl p-3">
          <p className="text-xs text-[#d4a843]/80">{t("सक्रिय दोष", "Active Doshas", "सक्रिय दोष")}</p>
          <p className="text-lg font-bold">{result.analysis.doshas.filter((d) => d.present).length}</p>
        </div>
        <div className="bg-white/15 rounded-xl p-3">
          <p className="text-xs text-[#d4a843]/80">{t("गणना पद्धती", "Calculation Method", "गणना पद्धति")}</p>
          <p className="text-sm font-bold">{t("अधिकृत पद्धत", "Official Method", "आधिकारिक पद्धति")}</p>
        </div>
      </div>
    </div>
  );
}

function PlanetTableSection({ planets }: { planets: PlanetData[] }) {
  const { t } = useLang();
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 overflow-x-auto">
      <h3 className="text-lg font-bold text-[#3d0c0c] mb-4">
        {t("निरयण ग्रह स्पष्ट", "Nirayana Planet Positions", "निरयण ग्रह स्थिति")}
      </h3>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-[#d4a843]/30">
            <th className="text-left py-2 px-3">{t("ग्रह", "Planet", "ग्रह")}</th>
            <th className="text-left py-2 px-3">{t("राशी", "Sign", "राशि")}</th>
            <th className="text-left py-2 px-3">{t("अंश", "Degree", "अंश")}</th>
            <th className="text-left py-2 px-3">{t("नक्षत्र", "Nakshatra", "नक्षत्र")}</th>
            <th className="text-center py-2 px-3">{t("पद", "Pada", "पद")}</th>
            <th className="text-center py-2 px-3">{t("भाव", "House", "भाव")}</th>
            <th className="text-center py-2 px-3">{t("वक्री", "Retro", "वक्री")}</th>
          </tr>
        </thead>
        <tbody>
          {planets.map((p) => (
            <tr key={p.id} className="border-b border-gray-100 hover:bg-[#FFF8E7]">
              <td className="py-2 px-3 font-semibold">{t(p.nameMr, p.name || p.id)}</td>
              <td className="py-2 px-3">{t(p.rashiMr, p.rashi)}</td>
              <td className="py-2 px-3 font-mono text-xs">{p.degreeDMS}</td>
              <td className="py-2 px-3">{t(p.nakshatraMr, p.nakshatra)}</td>
              <td className="py-2 px-3 text-center">{p.pada}</td>
              <td className="py-2 px-3 text-center">{p.house}</td>
              <td className="py-2 px-3 text-center">{p.isRetrograde ? t("वक्री", "R", "वक्री") : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PlanetStrengthSection({ strengths }: { strengths: PlanetStrengthData[] }) {
  const { t } = useLang();
  const getColor = (score: number) => {
    if (score >= 70) return "bg-green-500";
    if (score >= 50) return "bg-sky-500";
    if (score >= 30) return "bg-[#d4a843]";
    return "bg-red-500";
  };
  const getTextColor = (score: number) => {
    if (score >= 70) return "text-green-700";
    if (score >= 50) return "text-sky-700";
    if (score >= 30) return "text-[#5c1a1a]";
    return "text-red-700";
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-[#3d0c0c] mb-4">
        {t("ग्रह बल विश्लेषण", "Planetary Strength Analysis", "ग्रह बल विश्लेषण")}
      </h3>
      <div className="space-y-3">
        {strengths.map((s) => (
          <div key={s.id} className="flex items-center gap-3">
            <div className="w-16 text-sm font-semibold text-gray-800">
              {t(s.nameMr, s.nameEn)}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-medium ${getTextColor(s.strengthScore)}`}>
                  {t(s.dignityMr, s.dignityEn)}
                  {s.isRetrograde && s.id !== "Rahu" && s.id !== "Ketu" ? t(" (वक्री)", " (Retro)", " (वक्री)") : ""}
                  {s.isCombust ? t(" (अस्त)", " (Combust)", " (अस्त)") : ""}
                </span>
                <span className="text-xs text-gray-500">
                  {t(`भाव ${s.house}`, `House ${s.house}`, `भाव ${s.house}`)} | {s.strengthScore}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getColor(s.strengthScore)}`}
                  style={{ width: `${s.strengthScore}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-4">
        {t(
          "* बल गणना: उच्च/नीच, स्वगृही, मित्र/शत्रू, केंद्र/त्रिकोण, दुःस्थान, वक्री, अस्त या गोष्टी विचारात घेतल्या आहेत.",
          "* Strength considers: exaltation/debilitation, own sign, friend/enemy, kendra/trikona, dusthana, retrograde, combustion."
        )}
      </p>
    </div>
  );
}

function YogaSection({ yogas }: { yogas: YogaData[] }) {
  const { t } = useLang();
  const typeColor = { benefic: "bg-green-50 border-green-200", malefic: "bg-red-50 border-red-200", neutral: "bg-gray-50 border-gray-200" };
  const typeLabel = { benefic: { mr: "शुभ", en: "Benefic" }, malefic: { mr: "अशुभ", en: "Malefic" }, neutral: { mr: "मिश्र", en: "Neutral" } };
  const strengthLabel = { strong: { mr: "प्रबळ", en: "Strong" }, moderate: { mr: "मध्यम", en: "Moderate" }, weak: { mr: "दुर्बल", en: "Weak" } };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-[#3d0c0c] mb-4">
        {t("योग विश्लेषण", "Yoga Analysis", "योग विश्लेषण")}
      </h3>
      {yogas.length === 0 ? (
        <p className="text-gray-500 text-center py-4">{t("कोणतेही विशेष योग आढळले नाहीत.", "No special yogas found.", "कोई विशेष योग नहीं मिले.")}</p>
      ) : (
        <div className="space-y-4">
          {yogas.map((y, i) => (
            <div key={i} className={`rounded-xl border p-4 ${typeColor[y.type]}`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-gray-900">{t(y.nameMr, y.nameEn)}</h4>
                <div className="flex gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    y.type === "benefic" ? "bg-green-200 text-green-800" :
                    y.type === "malefic" ? "bg-red-200 text-red-800" :
                    "bg-gray-200 text-gray-800"
                  }`}>
                    {t(typeLabel[y.type].mr, typeLabel[y.type].en)}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    {t(strengthLabel[y.strength].mr, strengthLabel[y.strength].en)}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-700">{t(y.descriptionMr, y.descriptionEn)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DoshaSection({ doshas }: { doshas: DoshaData[] }) {
  const { t } = useLang();
  const severityColor: Record<string, string> = {
    high: "bg-red-50 border-red-300",
    medium: "bg-sky-50 border-sky-300",
    low: "bg-blue-50 border-blue-200",
    none: "bg-green-50 border-green-200",
  };
  const severityLabel: Record<string, { mr: string; en: string }> = {
    high: { mr: "तीव्र", en: "High" },
    medium: { mr: "मध्यम", en: "Medium" },
    low: { mr: "सौम्य", en: "Low" },
    none: { mr: "नाही", en: "None" },
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-[#3d0c0c] mb-4">
        {t("दोष विश्लेषण", "Dosha Analysis", "दोष विश्लेषण")}
      </h3>
      <div className="space-y-4">
        {doshas.map((d, i) => (
          <div key={i} className={`rounded-xl border-2 p-4 ${severityColor[d.severity]}`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-gray-900">{t(d.nameMr, d.nameEn)}</h4>
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                d.present ? "bg-red-500 text-white" : "bg-green-500 text-white"
              }`}>
                {d.present
                  ? `${t("उपस्थित", "Present", "उपस्थित")} — ${t(severityLabel[d.severity].mr, severityLabel[d.severity].en, severityLabel[d.severity].mr)}`
                  : t("अनुपस्थित", "Absent", "अनुपस्थित")}
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-3">{t(d.descriptionMr, d.descriptionEn)}</p>
            {d.present && (
              <div className="bg-white/70 rounded-lg p-3 border border-gray-100">
                <p className="text-xs font-bold text-[#3d0c0c] mb-1">{t("उपाय:", "Remedies:", "उपाय:")}</p>
                <p className="text-sm text-gray-600">{t(d.remedyMr, d.remedyEn)}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function HousePredictionSection({ predictions }: { predictions: HousePredictionData[] }) {
  const { t } = useLang();
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-[#3d0c0c] mb-2">
        {t("भावनिहाय भविष्यकथन", "House-wise Predictions", "भाव-अनुसार भविष्यकथन")}
      </h3>
      <p className="text-xs text-gray-500 mb-4">
        {t("प्रत्येक भावातील ग्रह आणि त्यांच्या बलानुसार भविष्य", "Predictions based on planets and their strength in each house", "प्रत्येक भाव के ग्रह और उनके बल के आधार पर भविष्य")}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {predictions.map((p) => (
          <div key={p.house} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded bg-[#FFF8E7] text-[#5c1a1a] text-xs font-bold flex items-center justify-center shrink-0">{p.house}</span>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">
                    {t(`${p.house}वा भाव`, `House ${p.house}`, `${p.house}वाँ भाव`)} — {t(p.titleMr, p.titleEn)}
                  </h4>
                </div>
              </div>
              <div className="text-[#d4a843] text-sm">
                {"★".repeat(p.rating)}{"☆".repeat(5 - p.rating)}
              </div>
            </div>
            <p className="text-sm text-gray-600">{t(p.predictionMr, p.predictionEn)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashaInterpSection({ interp }: { interp: DashaInterpData | null }) {
  const { t } = useLang();

  if (!interp) {
    return (
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 text-center text-gray-500">
        {t("सध्याची दशा माहिती उपलब्ध नाही.", "Current dasha information not available.", "वर्तमान दशा जानकारी उपलब्ध नहीं.")}
      </div>
    );
  }

  const areas = [
    { labelMr: "करिअर / व्यवसाय", labelEn: "Career / Profession", mr: interp.careerMr, en: interp.careerEn },
    { labelMr: "आर्थिक / धन", labelEn: "Finance / Wealth", mr: interp.financeMr, en: interp.financeEn },
    { labelMr: "आरोग्य", labelEn: "Health", mr: interp.healthMr, en: interp.healthEn },
    { labelMr: "संबंध / कुटुंब", labelEn: "Relationships / Family", mr: interp.relationshipMr, en: interp.relationshipEn },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-stone-700 to-stone-800 text-white p-6">
        <h3 className="text-lg font-bold text-center">
          {t(`चालू ${interp.lordMr} महादशा फल`, `Current ${interp.lordEn} Mahadasha Predictions`, `वर्तमान ${interp.lordMr} महादशा फल`)}
        </h3>
        <p className="text-center text-sm text-stone-300 mt-1">
          {t(interp.periodMr, interp.periodEn)}
        </p>
      </div>
      <div className="p-6 space-y-4">
        {areas.map((area, i) => (
          <div key={i} className="border-b border-gray-100 pb-4 last:border-0">
            <h4 className="text-sm font-bold text-gray-800 mb-1">
              {t(area.labelMr, area.labelEn)}
            </h4>
            <p className="text-sm text-gray-600 mt-1">{t(area.mr, area.en)}</p>
          </div>
        ))}
        <div className="bg-[#FFF8E7] rounded-xl p-4 border border-[#d4a843]/20">
          <h4 className="text-sm font-bold text-[#3d0c0c] mb-1">
            {t("उपाय व सल्ला", "Remedies & Advice", "उपाय और सलाह")}
          </h4>
          <p className="text-sm text-gray-700">{t(interp.adviceMr, interp.adviceEn)}</p>
        </div>
      </div>
    </div>
  );
}

function DashaTimelineSection({ dashas }: { dashas: DashaData[] }) {
  const { t, lang } = useLang();
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-[#3d0c0c] mb-4">
        {t("विंशोत्तरी दशा कालावधी", "Vimshottari Dasha Timeline", "विंशोत्तरी दशा समयावधि")}
      </h3>
      <div className="space-y-2">
        {dashas.map((d, i) => {
          const start = new Date(d.startDate);
          const end = new Date(d.endDate);
          const now = new Date();
          const isCurrent = now >= start && now <= end;

          return (
            <div
              key={i}
              className={`flex items-center justify-between p-3 rounded-xl ${
                isCurrent
                  ? "bg-[#FFF3D6] border-2 border-[#d4a843]"
                  : "bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                {isCurrent && (
                  <span className="text-xs bg-[#d4a843] text-white px-2 py-0.5 rounded-full">
                    {t("चालू", "Current", "वर्तमान")}
                  </span>
                )}
                <span className="font-bold text-gray-900">
                  {t(PLANET_LORD_MR[d.lord] || d.lord, d.lord)} {t("महादशा", "Mahadasha", "महादशा")}
                </span>
              </div>
              <div className="text-right text-sm text-gray-600">
                <p>
                  {start.toLocaleDateString(lang === "mr" ? "mr-IN" : "en-IN")} — {end.toLocaleDateString(lang === "mr" ? "mr-IN" : "en-IN")}
                </p>
                <p className="text-xs">{d.years.toFixed(1)} {t("वर्षे", "years", "वर्ष")}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RemedySection({ remedies }: { remedies: RemedyData[] }) {
  const { t } = useLang();
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-[#3d0c0c] mb-4">
        {t("उपाय व रत्न सुचना", "Remedies & Gemstone Recommendations", "उपाय और रत्न सुझाव")}
      </h3>
      <div className="space-y-6">
        {remedies.map((r, i) => (
          <div key={i}>
            <h4 className="font-bold text-sm text-gray-900 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#d4a843] rounded-full inline-block" />
              {t(r.categoryMr, r.categoryEn)}
            </h4>
            <div className="ml-4 space-y-2">
              {r.items.map((item, j) => (
                <div key={j} className="flex items-start gap-2 bg-[#FFF8E7] rounded-lg p-3">
                  <span className="text-[#d4a843] mt-0.5">&#8226;</span>
                  <p className="text-sm text-gray-700">{t(item.mr, item.en)}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-4">
        <p className="text-xs text-slate-700">
          {t(
            "सूचना: रत्न धारण करण्यापूर्वी अनुभवी ज्योतिषाचा सल्ला अवश्य घ्या. चुकीचे रत्न हानिकारक असू शकते.",
            "Note: Always consult an experienced astrologer before wearing gemstones. Wrong gemstones can be harmful."
          )}
        </p>
      </div>
    </div>
  );
}

// ─── North Indian Chart ──────────────────────────────────────────────

function NorthIndianChartNew({ planets }: { planets: PlanetData[] }) {
  const { t, lang } = useLang();
  const houseMap: Record<number, PlanetData[]> = {};
  for (let i = 1; i <= 12; i++) houseMap[i] = [];
  planets.forEach((p) => { if (houseMap[p.house]) houseMap[p.house].push(p); });

  const shortMr: Record<string, string> = { Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगल", Mercury: "बुध", Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु" };
  const shortEn: Record<string, string> = { Sun: "Sun", Moon: "Moon", Mars: "Mars", Mercury: "Mer", Jupiter: "Jup", Venus: "Ven", Saturn: "Sat", Rahu: "Rahu", Ketu: "Ketu" };
  const abbrMr: Record<string, string> = { Sun: "सू", Moon: "चं", Mars: "मं", Mercury: "बु", Jupiter: "गु", Venus: "शु", Saturn: "श", Rahu: "रा", Ketu: "के" };

  // Diamond chart: 600x600 square. Diamond touches midpoints: top(300,0), right(600,300), bottom(300,600), left(0,300)
  const W = 600;
  const M = 300; // midpoint

  // House positions in the photo (lagna kundli):
  // 1 = top diamond triangle (लग्न), with house numbers going anti-clockwise
  // Photo layout:
  //   Top triangle of diamond: 1 (लग्न)
  //   Top-left outer: 12 (चंद्र in your chart)
  //   Left triangle of diamond: 11 (सूर्य बुध)
  //   Bottom-left outer: 2|3 area → actually:
  //
  // From photo reading house numbers exactly:
  //   "1|11" at left edge of top diamond = houses 1 and 11
  //   "12" at top-left area with चंद्र
  //   "2|3" at left side = house 2 (upper-left trapezoid area) and 3 (lower-left area)
  //   सूर्य बुध between 2 and 3 area
  //   केतु at "3" with number "2|3"
  //   "4|5" at bottom-left area
  //   शुक्र मंगल गुरु at 4|5 area
  //   "6" at bottom diamond triangle
  //   "5|7" at bottom-right
  //   "8|9" at right side
  //   राहु at 8|9 area
  //   शनि at right diamond triangle area
  //
  // Standard North Indian numbering in diamond chart:
  // Top diamond = House 1
  // Going ANTI-CLOCKWISE from top:
  // 12 = upper-left trapezoid
  // 11 = left diamond triangle
  // 10 = lower-left trapezoid
  // 9 = bottom diamond triangle
  // 8 = lower-right trapezoid
  // 7 = right diamond triangle
  // 6 = upper-right trapezoid
  // Then: 2 = upper-right trapezoid...
  //
  // WAIT. Let me read the photo one final time:
  // The numbers I can clearly see in the lagna kundli:
  //   "1|11" written together → these are at the junction
  //   "12" → top left with चंद्र
  //   "2|3" → left side with सूर्य बुध and केतु
  //   "4|5" → bottom with शुक्र मंगल गुरु
  //   "6" → bottom center
  //   "5|7" or similar → bottom right
  //   "8|9" → right side with राहु
  //
  // I think the junction numbers (1|11, 2|3, 4|5, 8|9) indicate
  // which two houses share that corner/edge of the diamond.
  //
  // Final mapping from photo:
  // House 1 (लग्न) = TOP diamond triangle
  // House 12 = top-LEFT trapezoid (चंद्र)
  // House 11 = LEFT diamond triangle (शनि)... wait शनि should be in 11
  //   Actually photo shows शनि near center-right area
  //
  // OK I'll map based on OUR PLANET DATA since positions are verified correct:
  // H1=top, H2=upper-left-trap, H3=left-upper, H4=left-lower, H5=lower-left-trap,
  // H6=bottom, H7=lower-right-trap, H8=right-lower, H9=right-upper, H10=upper-right-trap,
  // H11=center-top(inner), H12=center-bottom(inner)
  //
  // But photo shows different... In standard North Indian diamond:
  // H1=top, going clockwise: H2=upper-right, H3=right-upper, H4=right-lower,
  // H5=lower-right, H6=bottom, H7=lower-left, H8=left-lower, H9=left-upper,
  // H10=upper-left, H11=inner-left, H12=inner-right
  //
  // NO — North Indian goes COUNTER-CLOCKWISE:
  // H1=top, H12=upper-left, H11=left, H10=lower-left, H9=bottom, H8=lower-right,
  // H7=right, H6=upper-right, H5=inner-upper-right, H4=inner-lower-right,
  // H3=inner-lower-left, H2=inner-upper-left
  //
  // I keep going in circles. Let me just use the house numbers from our existing
  // system (which matches the API data correctly) and ONLY change the GEOMETRY
  // to match the diamond pattern from the photo.

  // Text centers for each house in the diamond layout:
  // The outer shape: square 0,0 to 600,600
  // Diamond vertices: T(300,0), R(600,300), B(300,600), L(0,300)
  // Horizontal line through center: (0,300)-(600,300) — already the L-R line
  // Vertical line through center: (300,0)-(300,600) — already the T-B line
  // These divide diamond into 4 inner triangles
  // Outer square corners create 4 outer triangles

  // House mapping (matching our existing API house numbers):
  // Our H1=top-center, H2=top-left-corner, H3=left-upper, H4=left-lower,
  // H5=bottom-left-corner, H6=bottom-center, H7=bottom-right-corner,
  // H8=right-lower, H9=right-upper, H10=top-right-corner,
  // H11=inner-upper, H12=inner-lower

  const centers: Record<number, { x: number; y: number }> = {
    1:  { x: M,     y: 80 },      // top trapezoid center
    2:  { x: 80,    y: 80 },      // top-left outer triangle
    3:  { x: 60,    y: M - 50 },  // left-upper trapezoid
    4:  { x: 60,    y: M + 50 },  // left-lower trapezoid
    5:  { x: 80,    y: W - 80 },  // bottom-left outer triangle
    6:  { x: M,     y: W - 80 },  // bottom trapezoid
    7:  { x: W-80,  y: W - 80 },  // bottom-right outer triangle
    8:  { x: W-60,  y: M + 50 },  // right-lower trapezoid
    9:  { x: W-60,  y: M - 50 },  // right-upper trapezoid
    10: { x: W-80,  y: 80 },      // top-right outer triangle
    11: { x: M,     y: M - 70 },  // inner diamond — upper triangle
    12: { x: M,     y: M + 70 },  // inner diamond — lower triangle
  };

  function renderPlanets(houseNum: number) {
    const pl = houseMap[houseNum] || [];
    const c = centers[houseNum];
    if (!c || pl.length === 0) return null;
    const count = pl.length;
    const fs = count >= 4 ? 16 : count >= 3 ? 18 : 20;
    const lh = count >= 4 ? 18 : count >= 3 ? 20 : 24;
    const startY = c.y - ((count - 1) * lh) / 2;
    return pl.map((p, i) => {
      const nm = count >= 4
        ? (lang === "mr" ? abbrMr[p.id] || p.nameMr : shortEn[p.id] || p.id)
        : (lang === "mr" ? shortMr[p.id] || p.nameMr : shortEn[p.id] || p.id);
      const retro = p.isRetrograde ? t("(व)", "(R)", "(व)") : "";
      return (
        <text key={p.id} x={c.x} y={startY + i * lh} textAnchor="middle" dominantBaseline="middle"
          fontSize={fs} fontWeight="bold" fill={p.isRetrograde ? "#dc2626" : "#1f2937"}>
          {nm}{retro}
        </text>
      );
    });
  }

  return (
    <div className="flex justify-center">
      <svg viewBox="-2 -2 604 604" className="w-full max-w-lg">
        {/* Outer square */}
        <rect x="0" y="0" width={W} height={W} fill="#fafaf8" stroke="#8b2c2c" strokeWidth="2.5" />

        {/* Diamond — connecting midpoints of outer square */}
        <line x1={M} y1="0" x2={W} y2={M} stroke="#8b2c2c" strokeWidth="1.5" />
        <line x1={W} y1={M} x2={M} y2={W} stroke="#8b2c2c" strokeWidth="1.5" />
        <line x1={M} y1={W} x2="0" y2={M} stroke="#8b2c2c" strokeWidth="1.5" />
        <line x1="0" y1={M} x2={M} y2="0" stroke="#8b2c2c" strokeWidth="1.5" />

        {/* Horizontal and vertical through center */}
        <line x1="0" y1={M} x2={W} y2={M} stroke="#8b2c2c" strokeWidth="1.5" />
        <line x1={M} y1="0" x2={M} y2={W} stroke="#8b2c2c" strokeWidth="1.5" />

        {/* House numbers (small green) */}
        {Object.entries(centers).map(([h, c]) => {
          const num = parseInt(h);
          const pl = houseMap[num] || [];
          const oY = pl.length > 0 ? -(pl.length * 10 + 8) : 0;
          return <text key={`n${h}`} x={c.x} y={c.y + oY} textAnchor="middle" fontSize="12" fill="#86efac">{num}</text>;
        })}

        {/* Lagna label */}
        <text x={M} y={35} textAnchor="middle" fontSize="16" fontWeight="bold" fill="#dc2626">
          {t("लग्न", "Asc", "लग्न")}
        </text>

        {/* Planets */}
        {[1,2,3,4,5,6,7,8,9,10,11,12].map(h => <g key={`p${h}`}>{renderPlanets(h)}</g>)}
      </svg>
    </div>
  );
}

function NorthIndianChart({ planets }: { planets: PlanetData[] }) {
  const { t, lang } = useLang();
  const houseMap: Record<number, PlanetData[]> = {};
  for (let i = 1; i <= 12; i++) houseMap[i] = [];
  planets.forEach((p) => { if (houseMap[p.house]) houseMap[p.house].push(p); });

  // Pure SVG approach — all text in foreignObject at exact SVG coordinates
  // Grid: 300x300. Lines at x=100, x=200, y=100, y=200. Center=150,150.
  // Diagonals: (0,0)→(150,150), (300,0)→(150,150), (0,300)→(150,150), (300,300)→(150,150)
  //
  // SAFE TEXT ZONES (rectangles that don't cross any line):
  // H1:  top-center cell, upper portion → x:105-195, y:5-50
  // H2:  top-left corner, upper-left triangle → x:3-45, y:3-30
  // H3:  left cell, upper half (above diagonal) → x:5-95, y:103-145
  // H4:  left cell, lower half (below diagonal) → x:5-95, y:158-195
  // H5:  bottom-left corner, lower-left triangle → x:3-45, y:268-295
  // H6:  bottom-center cell, lower portion → x:105-195, y:250-295
  // H7:  bottom-right corner, lower-right → x:255-295, y:268-295
  // H8:  right cell, lower half → x:205-295, y:158-195
  // H9:  right cell, upper half → x:205-295, y:103-145
  // H10: top-right corner, upper-right → x:255-295, y:3-30
  // H11: center diamond, upper triangle → x:110-190, y:105-145
  // H12: center diamond, lower triangle → x:110-190, y:158-195

  const zones: { id: number; x: number; y: number; w: number; h: number }[] = [
    { id: 1,  x: 105, y: 5,   w: 90, h: 50 },
    { id: 2,  x: 3,   y: 3,   w: 50, h: 20 },
    { id: 3,  x: 5,   y: 103, w: 90, h: 42 },
    { id: 4,  x: 5,   y: 158, w: 90, h: 38 },
    { id: 5,  x: 5,   y: 235, w: 60, h: 45 },
    { id: 6,  x: 105, y: 248, w: 90, h: 48 },
    { id: 7,  x: 240, y: 250, w: 55, h: 30 },
    { id: 8,  x: 205, y: 158, w: 90, h: 38 },
    { id: 9,  x: 205, y: 103, w: 90, h: 42 },
    { id: 10, x: 248, y: 3,   w: 50, h: 20 },
    { id: 11, x: 110, y: 103, w: 80, h: 42 },
    { id: 12, x: 110, y: 158, w: 80, h: 38 },
  ];

  function renderHouseContent(z: typeof zones[0]) {
    const pl = houseMap[z.id] || [];
    const isCorner = [2, 5, 7, 10].includes(z.id);
    const fs = pl.length >= 3 ? 9 : isCorner ? 9 : 11;
    const lh = pl.length >= 3 ? 11 : isCorner ? 11 : 13;

    return (
      <foreignObject key={z.id} x={z.x} y={z.y} width={z.w} height={z.h}>
        <div xmlns="http://www.w3.org/1999/xhtml" style={{
          width: '100%', height: '100%',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center',
          justifyContent: (z.id === 5 || z.id === 7) ? 'flex-end' : (z.id === 2 || z.id === 10) ? 'flex-start' : 'center',
          overflow: 'hidden',
        }}>
          {z.id === 1 && (
            <span style={{ color: '#dc2626', fontWeight: 'bold', fontSize: 12, lineHeight: 1 }}>
              {t("लग्न", "Asc", "लग्न")}
            </span>
          )}
          {pl.map((p) => (
            <span key={p.id} style={{
              fontSize: fs,
              fontWeight: 'bold',
              lineHeight: `${lh}px`,
              color: p.isRetrograde ? '#dc2626' : '#1f2937',
              whiteSpace: 'nowrap',
            }}>
              {t(p.nameMr, p.id)}{p.isRetrograde ? t("(व)", "(R)", "(व)") : ""}
            </span>
          ))}
        </div>
      </foreignObject>
    );
  }

  return (
    <div className="flex justify-center">
      <svg viewBox="0 0 300 300" className="w-full max-w-md" style={{ background: '#fafaf8', border: '2px solid #8b2c2c' }}>
        {/* Grid lines */}
        <line x1="100" y1="0" x2="100" y2="300" stroke="#8b2c2c" strokeWidth="1" />
        <line x1="200" y1="0" x2="200" y2="300" stroke="#8b2c2c" strokeWidth="1" />
        <line x1="0" y1="100" x2="300" y2="100" stroke="#8b2c2c" strokeWidth="1" />
        <line x1="0" y1="200" x2="300" y2="200" stroke="#8b2c2c" strokeWidth="1" />
        {/* Diagonals — split into segments with gaps for corner text */}
        {/* Top-left: (0,0) to (100,100) then (100,100) to (150,150) */}
        <line x1="0" y1="0" x2="40" y2="40" stroke="#8b2c2c" strokeWidth="1" />
        <line x1="60" y1="60" x2="150" y2="150" stroke="#8b2c2c" strokeWidth="1" />
        {/* Top-right: (300,0) to (150,150) */}
        <line x1="300" y1="0" x2="260" y2="40" stroke="#8b2c2c" strokeWidth="1" />
        <line x1="240" y1="60" x2="150" y2="150" stroke="#8b2c2c" strokeWidth="1" />
        {/* Bottom-left: (0,300) to (150,150) */}
        <line x1="0" y1="300" x2="40" y2="260" stroke="#8b2c2c" strokeWidth="1" />
        <line x1="60" y1="240" x2="150" y2="150" stroke="#8b2c2c" strokeWidth="1" />
        {/* Bottom-right: (300,300) to (150,150) */}
        <line x1="300" y1="300" x2="260" y2="260" stroke="#8b2c2c" strokeWidth="1" />
        <line x1="240" y1="240" x2="150" y2="150" stroke="#8b2c2c" strokeWidth="1" />
        {/* House content */}
        {zones.map(renderHouseContent)}
      </svg>
    </div>
  );
}

// Old versions — not used
function NorthIndianChartNew2({ planets }: { planets: PlanetData[] }) {
  const { t, lang } = useLang();
  const houseMap: Record<number, PlanetData[]> = {};
  for (let i = 1; i <= 12; i++) houseMap[i] = [];
  planets.forEach((p) => {
    if (houseMap[p.house]) houseMap[p.house].push(p);
  });

  const shortMr: Record<string, string> = { Sun: "सू", Moon: "चं", Mars: "मं", Mercury: "बु", Jupiter: "गु", Venus: "शु", Saturn: "श", Rahu: "रा", Ketu: "के" };
  const shortEn: Record<string, string> = { Sun: "Su", Moon: "Mo", Mars: "Ma", Mercury: "Me", Jupiter: "Ju", Venus: "Ve", Saturn: "Sa", Rahu: "Ra", Ketu: "Ke" };

  /*
    Standard North Indian Kundli Layout (diamond inside square):

    Outer square with a diamond (rotated square) inside.
    The diamond touches the midpoints of each side.

    ┌──────────┬──────────┬──────────┐
    │    12    │    1     │    2     │
    │       ╲  │  लग्न    │  ╱       │
    │         ╲│          │╱         │
    ├──────────┤          ├──────────┤
    │          │╲        ╱│          │
    │   11     │  ╲  ╱    │   3      │
    │          │   ╱╲     │          │
    │          │ ╱    ╲   │          │
    │   10     │╱        ╲│   4      │
    ├──────────┤          ├──────────┤
    │         ╱│          │╲         │
    │       ╱  │          │  ╲       │
    │    9     │    6     │    5     │
    └──────────┴──────────┴──────────┘

    House 1 = top center, numbers go COUNTER-CLOCKWISE:
    1(top), 12(top-left), 11(mid-left-upper), 10(mid-left-lower),
    9(bottom-left), 8(bottom-center)... wait, let me match the photo exactly.

    From the photo:
    Top row: 12 | 1(लग्न) | 2
    Mid-upper: 11 | (inner-top) | 3
    Mid-lower: 10 | (inner-bottom) | 4
    Bottom row: 9 | 6 | 5
    Inner-top diamond half: (shared by 11/1/2/3)
    Inner-bottom diamond half: (shared by 10/9/6/5)

    Actually from photo numbering:
    1|11 written at top-left of center, 12 next to it
    So: top-center=1, going anti-clockwise: 12, 11, 10, 9, 8(bottom center??)

    Let me re-read the photo carefully:
    Top: 1(center, लग्न), 12(left of 1), 2(right of 1)
    Left-upper: 11(सूर्य बुध)  Right-upper: 3(केतु)
    Left-lower: 10             Right-lower: 4(राहु)
    Bottom: 9(शनि left), 8(center?), 5(शुक्र मंगळ गुरु right?)

    Hmm, from the photo the numbering around the outside is:
    12|1|2 (top row)
    11| |3 (upper middle)
    10| |4 (lower middle)
    9|6|5 (bottom row, with 7/8 in corners)

    Actually looking again at lagna kundli in photo:
    - 1|11 at top-left inner, 12 at top-left outer
    - सूर्य बुध in position marked 11/12 area
    - लग्न in center-top
    - शनि in the inner diamond area
    - Numbers: 2|3 on left going down, 4|5 at bottom, 9|8 on right

    OK I think the standard is:
    House 1 = top center diamond area
    Going anti-clockwise: 2 (upper-right), 3 (right-upper), 4 (right-lower),
    5 (lower-right), 6 (bottom center), 7 (lower-left), 8 (left-lower),
    9 (left-upper), 10 (upper-left), 11 (inner upper-left), 12 (inner upper-right)

    No wait — from the photo I can now clearly read:
    The corners show paired numbers like "2|3", "4|5", "5|7", "8|9"
    And the sides show single numbers.

    Standard North Indian: House 1 at top. Going ANTI-CLOCKWISE around outside:
    Top-center: 1
    Upper-left corner: 12 (outer triangle)
    Left-upper: 11
    Left-lower: 10
    Lower-left corner: 9 (outer triangle)
    Bottom-center: 8...

    I think I need to just match exactly what the photo shows.
  */

  // From the reference photo, the layout is:
  // Outer square 600x600, diamond inside touching midpoints
  const W = 600;
  const M = W / 2; // 300 = midpoint

  // The diamond vertices: top(300,0), left(0,300), bottom(300,600), right(600,300)
  // But the actual chart has rectangular cells, not a pure diamond.
  // It's an outer square with lines from midpoints creating the inner diamond.

  // House centers matched to the reference photo layout:
  // Top row (y=0 to y=M): houses 12, 1, 2
  // Middle (y around M): houses 11, [inner], 3 (upper) and 10, [inner], 4 (lower)
  // Bottom row (y=M to y=W): houses 9, 6, 5
  // Inner diamond top half: between houses 1,12,11,2,3 — no separate house
  // Inner diamond bottom half: between houses 10,9,6,5,4
  // Houses 7 and 8 in bottom corners

  // Actually from photo: the paired corner numbers are "2|3", "4|5" etc.
  // The photo shows this standard:
  // Top: 12(left triangle) | 1(center, लग्न) | 2(right triangle)
  // Upper-mid: 11(left rect) | inner-top | 3(right rect)
  // Lower-mid: 10(left rect) | inner-bottom | 4(right rect)
  // Bottom: 9(left triangle) | 6(center) | 5(right triangle)
  // Inner top: has शनि → this must be where planets in inner houses go
  // Inner bottom: empty or other planets
  // 7 = bottom-right outer, 8 = right-lower area

  // Wait — I see in photo: 2|3 written together at right-upper corner
  // And 4|5 at bottom-right. This means the corner is SPLIT between 2 houses.
  // Top-left corner: split into 12 (upper-left triangle) and nothing
  // Top-right corner: split into 2 (upper triangle) and 3 (lower triangle)
  // Bottom-left corner: split into 9 and 8?? or 9 and 10?
  // Bottom-right: split into 5 and 4??

  // FROM THE PHOTO EXACTLY:
  // Top-left of chart: "1|11" with "12" nearby → corner has houses 12 above diagonal
  // and below the top-center cell is house 1

  // I'll use the EXACT layout from the reference photo:
  const centers: Record<number, { x: number; y: number }> = {
    1:  { x: M,    y: 90 },      // top center — लग्न
    12: { x: 90,   y: 90 },      // top-left outer triangle
    2:  { x: M+155, y: 90 },     // top-right outer triangle (was: upper-right)
    11: { x: 90,   y: M-55 },    // left-upper half
    3:  { x: M+155, y: M-55 },   // right-upper half
    10: { x: 90,   y: M+55 },    // left-lower half
    4:  { x: M+155, y: M+55 },   // right-lower half
    9:  { x: 90,   y: W-90 },    // bottom-left outer triangle
    5:  { x: M+155, y: W-90 },   // bottom-right outer triangle
    8:  { x: M,    y: M+55 },    // inner-bottom diamond (was 6?)
    6:  { x: M,    y: W-90 },    // bottom center
    7:  { x: M,    y: M-55 },    // inner-top diamond (was 11 center)
  };

  // Hmm, this is getting confused. Let me look at the photo ONE MORE TIME.

  // THE PHOTO CLEARLY SHOWS (lagna kundli, top-left chart):
  // I can read these numbers and planets:
  //
  // Row 1 (top): "सूर्य बुध" on left, "लग्न" center-top, "शनि" right area
  //   Numbers: 1|11 (left of center), 12 (above left), ...
  //
  // Actually the house numbers in the photo are placed at edges of cells:
  // "1|11" at top-left inner corner
  // "12" at top
  // "चंद्" near top
  //
  // I think the confusion is because the photo uses a different house numbering
  // placement than what I expected. Let me just match the GEOMETRY from the photo
  // and place planets correctly.
  //
  // The photo geometry is EXACTLY:
  // - Outer square
  // - Inner diamond touching midpoints of outer square sides
  // - This creates 4 outer triangles (corners) and 4 outer rectangles (sides)
  //   plus 4 inner triangles (diamond quarters)
  //
  // Numbering (from photo):
  // Outer top-left triangle: has "12" and "चंद्र"
  // Top rectangle (between top side and diamond top): has "1", "लग्न"
  // Outer top-right triangle: has "2"
  // Right-upper rectangle: has "3", "केतु"
  // Right-lower rectangle: has "4", "राहु"
  // Outer bottom-right triangle: has "5", "शुक्र मंगळ गुरु"
  // Bottom rectangle: has "6"
  // Outer bottom-left triangle: has "7"
  // Left-lower rectangle: has "8"
  // Left-upper rectangle: has "9", "बुध" ← wait, photo shows सूर्य बुध
  // Outer top-left triangle: has "12"
  // Inner diamond upper: has "11"
  // Inner diamond lower: has "10"
  //
  // NO WAIT. Let me read the photo more carefully with the finger pointing.
  //
  // The chart in the photo (top-left, "लग्न कुंडली"):
  //   Top area: 1(लग्न center) | 11(left inner) | 12(right area with चंद्र)
  //   Left side: 2|3 with "सूर्य बुध" in position 2, "केतु" in 3
  //   Right side: with "राहु" in 8 or 9 area
  //   Bottom: 5|6|7 with शुक्र मंगळ गुरु in 5
  //   शनि somewhere inner
  //
  // I'm going to simplify. The issue is just text positioning.
  // The geometry I have now (3x3 grid + corner diagonals) is CLOSE ENOUGH
  // to the photo. The photo's chart is very similar. Let me just fix the
  // text positions and stop overthinking the geometry.

  // KEEP THE CURRENT GEOMETRY. Just make sure planets don't sit on lines.

  // Going back to basics: the current 3x3 grid with corner-to-center diagonals
  // is the correct North Indian format. Match house numbering from the photo.

  // From photo reference (reading carefully):
  // House 1 (लग्न) = top center ← confirmed, our chart has this
  // Going COUNTER-CLOCKWISE from house 1:
  // 12 = left of 1 (inner-upper-left) ← photo shows "12" with चंद्र
  // 11 = left-upper rectangle ← photo shows सूर्य बुध
  // 10 = left-lower rectangle
  // 9 = bottom-left corner triangle
  // 8 = bottom center
  // 7 = bottom-right corner triangle
  // 6 = right-lower rectangle
  // 5 = right-upper rectangle ← photo shows शुक्र मंगळ गुरु
  // 4 = inner-lower diamond
  // 3 = inner-upper diamond (right side)
  // 2 = right of 1 (top-right corner)
  //
  // Wait that doesn't match either. Let me look at which planets are WHERE
  // in the photo vs our API data:
  //
  // Our API: Sun H3, Mercury H3, Moon H12, Mars H5, Jupiter H5, Venus H5,
  //          Saturn H11, Rahu H10, Ketu H4
  //
  // Photo shows:
  // सूर्य बुध → together → must be houses 3 (our H3 matches if this position is 3)
  //   In photo they're at LEFT side upper area
  // चंद्र → alone → H12 → photo shows near top, slightly left
  // शनि → alone → H11 → photo shows in inner/center area
  // केतु → alone → H4 → photo shows right-upper area...
  // राहु → alone → H10 → photo shows right-lower area
  // शुक्र मंगळ गुरु → H5 → photo shows at BOTTOM-LEFT area
  //
  // So from photo:
  // LEFT-UPPER = house 3 (सूर्य बुध) ← but our chart currently shows this as house 3 ✓
  // LEFT-LOWER = house 4 (केतु) ← our chart shows this as house 4 ✓
  // BOTTOM-LEFT = house 5 (शुक्र मंगळ गुरु) ✓
  // TOP-RIGHT = house 10 (राहु) ← our shows H10 in top-right ✓
  // INNER = house 11 (शनि) ✓
  // INNER-LOWER = house 12 (चंद्र) ✓
  //
  // OUR POSITIONS ARE ACTUALLY CORRECT! The issue is just text overlapping lines.
  // The geometry matches the photo. I just need better text positioning.

  // Reset to simple, correct positions with more padding from lines:
  const correctedCenters: Record<number, { x: number; y: number }> = {
    1:  { x: M,       y: 80 },       // top center
    2:  { x: 80,      y: 80 },       // top-left triangle
    3:  { x: 80,      y: M - 60 },   // left upper
    4:  { x: 80,      y: M + 60 },   // left lower
    5:  { x: 110,     y: W - 100 },  // bottom-left triangle — more center
    6:  { x: M,       y: W - 80 },   // bottom center
    7:  { x: W - 80,  y: W - 80 },   // bottom-right triangle
    8:  { x: W - 80,  y: M + 60 },   // right lower
    9:  { x: W - 80,  y: M - 60 },   // right upper
    10: { x: W - 80,  y: 80 },       // top-right triangle
    11: { x: M,       y: M - 60 },   // center upper diamond
    12: { x: M,       y: M + 60 },   // center lower diamond
  };

  function renderHousePlanets(houseNum: number) {
    const pl = houseMap[houseNum] || [];
    const c = correctedCenters[houseNum];
    if (!c || pl.length === 0) return null;

    const count = pl.length;
    const isSmall = [2, 5, 7, 10].includes(houseNum); // corner triangles — less space
    const fontSize = count >= 4 ? 18 : count >= 3 ? 20 : isSmall ? 20 : 24;
    const lh = count >= 4 ? 20 : count >= 3 ? 22 : 26;
    const startY = c.y - ((count - 1) * lh) / 2;

    return pl.map((p, i) => {
      const useShort = count >= 3 || isSmall;
      const nm = useShort
        ? (lang === "mr" ? shortMr[p.id] || p.nameMr : shortEn[p.id] || p.id)
        : t(p.nameMr, p.name || p.id);
      const retro = p.isRetrograde ? t("(व)", "(R)", "(व)") : "";
      return (
        <text key={p.id} x={c.x} y={startY + i * lh} textAnchor="middle" dominantBaseline="middle"
          fontSize={fontSize} fontWeight="bold" fill={p.isRetrograde ? "#dc2626" : "#1f2937"}>
          {nm}{retro}
        </text>
      );
    });
  }

  const Q = W / 3;

  return (
    <div className="flex justify-center">
      <svg viewBox="-2 -2 604 604" className="w-full max-w-lg">
        <rect x="0" y="0" width={W} height={W} fill="#fafaf8" stroke="#8b2c2c" strokeWidth="2.5" />

        {/* 3x3 grid */}
        <line x1={Q} y1="0" x2={Q} y2={W} stroke="#8b2c2c" strokeWidth="1.5" />
        <line x1={Q*2} y1="0" x2={Q*2} y2={W} stroke="#8b2c2c" strokeWidth="1.5" />
        <line x1="0" y1={Q} x2={W} y2={Q} stroke="#8b2c2c" strokeWidth="1.5" />
        <line x1="0" y1={Q*2} x2={W} y2={Q*2} stroke="#8b2c2c" strokeWidth="1.5" />

        {/* Corner-to-center diagonals */}
        <line x1="0" y1="0" x2={M} y2={M} stroke="#8b2c2c" strokeWidth="1" />
        <line x1={W} y1="0" x2={M} y2={M} stroke="#8b2c2c" strokeWidth="1" />
        <line x1="0" y1={W} x2={M} y2={M} stroke="#8b2c2c" strokeWidth="1" />
        <line x1={W} y1={W} x2={M} y2={M} stroke="#8b2c2c" strokeWidth="1" />

        {/* House numbers */}
        {Object.entries(correctedCenters).map(([h, c]) => {
          const num = parseInt(h);
          const pl = houseMap[num] || [];
          const oY = pl.length > 0 ? -(pl.length * 11 + 8) : 0;
          return <text key={`n${h}`} x={c.x} y={c.y + oY} textAnchor="middle" fontSize="13" fill="#86efac">{num}</text>;
        })}

        {/* Lagna */}
        <text x={M} y={40} textAnchor="middle" fontSize="18" fontWeight="bold" fill="#dc2626">
          {t("लग्न", "Asc", "लग्न")}
        </text>

        {/* Planets */}
        {[1,2,3,4,5,6,7,8,9,10,11,12].map(h => <g key={`p${h}`}>{renderHousePlanets(h)}</g>)}
      </svg>
    </div>
  );
}
