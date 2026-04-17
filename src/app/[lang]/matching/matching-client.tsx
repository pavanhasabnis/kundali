"use client";

import { useState, useRef, useEffect } from "react";
import { useLang } from "@/lib/astrology/language-context";
import { PLACES, type Place } from "@/lib/astrology/places";
import { JsonLd, serviceSchema, breadcrumbSchema, faqSchema } from "@/components/json-ld";

interface FactorResult {
  factor: string;
  factorMr: string;
  maxPoints: number;
  scored: number;
  description: string;
}

interface MatchingData {
  matching: {
    totalPoints: number;
    maxPoints: number;
    percentage: number;
    verdict: string;
    verdictMr: string;
    factors: FactorResult[];
  };
  boyDetails: { rashi: string; rashiMr: string; nakshatra: string; nakshatraMr: string; lagna: string; lagnaMr: string };
  girlDetails: { rashi: string; rashiMr: string; nakshatra: string; nakshatraMr: string; lagna: string; lagnaMr: string };
}

const TYPE_LABEL_M: Record<string, { en: string; mr: string }> = {
  city: { en: "City", mr: "शहर" },
  town: { en: "Town", mr: "नगर" },
  taluka: { en: "Taluka", mr: "तालुका" },
  village: { en: "Village", mr: "गाव" },
};

function PersonForm({
  label,
  values,
  onChange,
}: {
  label: string;
  values: Record<string, string>;
  onChange: (key: string, val: string) => void;
}) {
  const { t, lang } = useLang();
  const [search, setSearch] = useState("");
  const [showDrop, setShowDrop] = useState(false);
  const [selected, setSelected] = useState<Place | null>(
    PLACES.find((p) => p.name === values.city) ?? null
  );
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setShowDrop(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = search.length >= 1
    ? PLACES.filter((p) => {
        const q = search.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.nameMr.includes(search) || (p.district?.toLowerCase().includes(q) ?? false);
      }).slice(0, 25)
    : [];

  const pick = (p: Place) => {
    setSelected(p);
    setSearch("");
    setShowDrop(false);
    onChange("city", p.name);
    onChange("latitude", String(p.lat));
    onChange("longitude", String(p.lng));
  };

  const monthNames = lang === "mr"
    ? ["जाने","फेब्रु","मार्च","एप्रि","मे","जून","जुलै","ऑग","सप्टें","ऑक्टो","नोव्हें","डिसें"]
    : ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
      <h3 className="text-lg font-bold text-[#3d0c0c] mb-4">{label}</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t("नाव", "Name")}</label>
          <input
            type="text"
            value={values.name}
            onChange={(e) => onChange("name", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#d4a843] text-sm"
            placeholder={t("नाव", "Name")}
          />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{t("दिवस", "Day")}</label>
            <input type="number" min="1" max="31" value={values.day} onChange={(e) => onChange("day", e.target.value)}
              className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{t("महिना", "Month")}</label>
            <select value={values.month} onChange={(e) => onChange("month", e.target.value)}
              className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm" required>
              <option value="">—</option>
              {monthNames.map((m, i) => (
                <option key={i + 1} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{t("वर्ष", "Year")}</label>
            <input type="number" min="1940" max="2010" value={values.year} onChange={(e) => onChange("year", e.target.value)}
              className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm" required />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{t("तास", "Hour")}</label>
            <input type="number" min="1" max="12" value={values.hour} onChange={(e) => onChange("hour", e.target.value)}
              className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">{t("मिनिटे", "Min")}</label>
            <input type="number" min="0" max="59" value={values.minute} onChange={(e) => onChange("minute", e.target.value)}
              className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm" required />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">AM/PM</label>
            <select value={values.ampm} onChange={(e) => onChange("ampm", e.target.value)}
              className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="AM">{t("AM (सकाळ)", "AM")}</option>
              <option value="PM">{t("PM (संध्या)", "PM")}</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">{t("जन्मस्थान", "Birth Place")}</label>
          <div ref={ref} className="relative">
            {selected && !showDrop ? (
              <div onClick={() => setShowDrop(true)}
                className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm cursor-pointer hover:border-[#d4a843] flex items-center justify-between">
                <span>{lang === "mr" ? `${selected.nameMr} (${selected.name})` : selected.name}</span>
                <span className="text-[10px] px-1 py-0.5 rounded bg-[#FFF8E7] text-[#5c1a1a]">
                  {lang === "mr" ? TYPE_LABEL_M[selected.type].mr : TYPE_LABEL_M[selected.type].en}
                </span>
              </div>
            ) : (
              <input type="text" value={search}
                onChange={(e) => { setSearch(e.target.value); setShowDrop(true); }}
                onFocus={() => setShowDrop(true)}
                placeholder={t("शोधा...", "Search place...")}
                className="w-full px-2 py-2 border border-[#d4a843] rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#d4a843]"
                autoFocus />
            )}
            {showDrop && search.length >= 1 && (
              <div className="absolute z-50 w-full mt-1 max-h-48 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg">
                {filtered.length === 0 ? (
                  <div className="px-3 py-2 text-xs text-gray-500">{t("सापडले नाही", "Not found")}</div>
                ) : filtered.map((p) => (
                  <button key={`${p.name}-${p.lat}`} type="button" onClick={() => pick(p)}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#FFF8E7] text-sm flex items-center justify-between border-b border-gray-50 last:border-0">
                    <span>{lang === "mr" ? `${p.nameMr} (${p.name})` : p.name}
                      {p.district && <span className="text-gray-400 text-xs ml-1">— {p.district}</span>}
                    </span>
                    <span className="text-[10px] px-1 py-0.5 rounded bg-gray-100 text-gray-500 ml-1 shrink-0">
                      {lang === "mr" ? TYPE_LABEL_M[p.type].mr : TYPE_LABEL_M[p.type].en}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const defaultPerson = {
  name: "", day: "", month: "", year: "", hour: "", minute: "",
  ampm: "AM", city: "", latitude: "", longitude: "",
};

export default function MatchingPageClient() {
  const { t, lang } = useLang();
  const [boy, setBoy] = useState({ ...defaultPerson });
  const [girl, setGirl] = useState({ ...defaultPerson });
  const [result, setResult] = useState<MatchingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateBoy = (key: string, val: string) => setBoy((p) => ({ ...p, [key]: val }));
  const updateGirl = (key: string, val: string) => setGirl((p) => ({ ...p, [key]: val }));

  const convertHour = (h: string, ampm: string) => {
    let hour = parseInt(h);
    if (ampm === "PM" && hour !== 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;
    return hour;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/matching", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boy: {
            year: parseInt(boy.year), month: parseInt(boy.month), day: parseInt(boy.day),
            hour: convertHour(boy.hour, boy.ampm), minute: parseInt(boy.minute),
            latitude: parseFloat(boy.latitude), longitude: parseFloat(boy.longitude), timezone: 5.5,
          },
          girl: {
            year: parseInt(girl.year), month: parseInt(girl.month), day: parseInt(girl.day),
            hour: convertHour(girl.hour, girl.ampm), minute: parseInt(girl.minute),
            latitude: parseFloat(girl.latitude), longitude: parseFloat(girl.longitude), timezone: 5.5,
          },
        }),
      });

      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setResult(data);
    } catch {
      setError(t("गणना करताना त्रुटी आली. कृपया माहिती तपासा.", "Error in calculation. Please check your details."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <JsonLd data={serviceSchema({ name: "Gun Milaan — गुण मिलान", description: "Free Ashtakoot gun milaan for marriage compatibility. 36-point matching with Varna, Vashya, Tara, Yoni, Maitri, Gana, Bhakoot & Nadi analysis.", url: `https://bhaagyavedh.com/${lang}/matching` })} />
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: `https://bhaagyavedh.com/${lang}` }, { name: "Gun Milaan", url: `https://bhaagyavedh.com/${lang}/matching` }])} />
      <section className="relative py-16 sm:py-24 overflow-hidden" style={{ background: "linear-gradient(135deg, #3d0c0c 0%, #5c1a1a 50%, #3d0c0c 100%)" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a843' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#d4a843] mb-3">
            {t("अष्टकूट गुण मिलान", "Ashtakoot Guna Milan")}
          </h1>
          <p className="text-white/60 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {t("३६ गुणांवर आधारित विवाह जुळणी", "Marriage matching based on 36 Gunas")}
          </p>
        </div>
      </section>
      <div className="space-y-8 max-w-5xl mx-auto px-4 sm:px-6 py-6">

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PersonForm label={t("वराची माहिती", "Groom Details")} values={boy} onChange={updateBoy} />
          <PersonForm label={t("वधूची माहिती", "Bride Details")} values={girl} onChange={updateGirl} />
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-[#5c1a1a] to-[#3d0c0c] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            {loading ? t("गणना चालू आहे...", "Calculating...") : t("गुण मिलान करा", "Match Gunas")}
          </button>
        </div>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
      </form>

      {/* Results */}
      {result && (
        <div className="space-y-6 max-w-3xl mx-auto">
          {/* Score Header */}
          <div className={`rounded-2xl p-8 text-white text-center shadow-lg ${
            result.matching.totalPoints >= 21 ? "bg-gradient-to-r from-[#2d6b2d] to-[#1e4d1e]" :
            result.matching.totalPoints >= 14 ? "bg-gradient-to-r from-sky-500 to-blue-600" :
            "bg-gradient-to-r from-red-600 to-red-800"
          }`}>
            <p className="text-6xl font-bold mb-2">
              {result.matching.totalPoints} / {result.matching.maxPoints}
            </p>
            <p className="text-xl font-semibold">{t(result.matching.verdictMr, result.matching.verdict)}</p>
            <p className="text-sm mt-1 opacity-80">{result.matching.percentage}%</p>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-white/15 rounded-xl p-3">
                <p className="text-xs opacity-75">{t("वर", "Groom")}</p>
                <p className="font-bold">{t(result.boyDetails.rashiMr || result.boyDetails.rashi, result.boyDetails.rashi)}</p>
                <p className="text-xs">{t(result.boyDetails.nakshatraMr || result.boyDetails.nakshatra, result.boyDetails.nakshatra)}</p>
              </div>
              <div className="bg-white/15 rounded-xl p-3">
                <p className="text-xs opacity-75">{t("वधू", "Bride")}</p>
                <p className="font-bold">{t(result.girlDetails.rashiMr || result.girlDetails.rashi, result.girlDetails.rashi)}</p>
                <p className="text-xs">{t(result.girlDetails.nakshatraMr || result.girlDetails.nakshatra, result.girlDetails.nakshatra)}</p>
              </div>
            </div>
          </div>

          {/* Factor Breakdown */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-[#3d0c0c] mb-4">
              {t("गुण तपशील", "Guna Details")}
            </h3>
            <div className="space-y-3">
              {result.matching.factors.map((f) => (
                <div key={f.factor} className="flex items-center gap-4">
                  <div className="w-24 text-sm font-semibold text-gray-800">
                    {t(f.factorMr, f.factor)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-100 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${
                            f.scored === f.maxPoints ? "bg-green-500" :
                            f.scored > 0 ? "bg-sky-500" : "bg-red-400"
                          }`}
                          style={{ width: `${(f.scored / f.maxPoints) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold w-12 text-right">
                        {f.scored}/{f.maxPoints}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>

      {/* FAQ Section for AEO/GEO */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <JsonLd data={faqSchema([
          { question: "What is Gun Milaan (Kundli Matching)?", answer: "Gun Milaan or Kundli Matching is a Vedic astrology method to check marriage compatibility between two people. It compares 8 aspects (Ashtakoot) of both horoscopes — Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, and Nadi — totaling 36 points. A score of 18+ is considered compatible." },
          { question: "How many points are needed for a good match?", answer: "In Ashtakoot matching, the maximum score is 36 points. A score of 18 or above (50%+) is considered acceptable for marriage. 25-32 points is very good, and above 32 is excellent. However, Nadi Dosha (8 points) and Bhakoot Dosha (7 points) are considered especially important." },
          { question: "गुण मिलान म्हणजे काय?", answer: "गुण मिलान हे वैदिक ज्योतिषशास्त्रातील लग्न जुळवणीचे तंत्र आहे. यात ८ अष्टकूट गुणांची तुलना केली जाते — वर्ण, वश्य, तारा, योनी, ग्रह मैत्री, गण, भकूट आणि नाडी — एकूण ३६ गुण. १८+ गुण लग्नासाठी अनुकूल मानले जातात." },
          { question: "Is online Kundli matching reliable?", answer: "Yes, our online matching uses the same Ashtakoot method that traditional astrologers use. The calculations are based on precise astronomical data for accurate planetary positions. However, for important life decisions like marriage, we recommend also consulting an experienced astrologer for a comprehensive analysis." },
        ])} />
        <h2 className="text-xl font-bold mb-6" style={{ color: "#5c1a1a" }}>
          {t("गुण मिलान बद्दल सामान्य प्रश्न", "Frequently Asked Questions about Gun Milaan")}
        </h2>
        <div className="space-y-4">
          {[
            { q: t("गुण मिलान म्हणजे काय?", "What is Gun Milaan (Kundli Matching)?"), a: t("गुण मिलान हे लग्न जुळवणीचे वैदिक तंत्र आहे. ८ अष्टकूट गुणांची तुलना — वर्ण, वश्य, तारा, योनी, ग्रह मैत्री, गण, भकूट, नाडी — एकूण ३६ गुण. १८+ गुण लग्नासाठी अनुकूल.", "Gun Milaan is a Vedic method comparing 8 Ashtakoot aspects — Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, Nadi — totaling 36 points. 18+ is considered compatible.") },
            { q: t("चांगल्या जुळणीसाठी किती गुण आवश्यक?", "How many points are needed for a good match?"), a: t("३६ पैकी १८+ गुण स्वीकार्य. २५-३२ गुण खूप चांगले, ३२+ उत्कृष्ट. नाडी दोष (८ गुण) आणि भकूट दोष (७ गुण) विशेष महत्त्वाचे.", "18+ out of 36 is acceptable. 25-32 is very good, 32+ is excellent. Nadi (8 points) and Bhakoot (7 points) are especially important.") },
            { q: t("ऑनलाइन गुण मिलान विश्वसनीय आहे का?", "Is online Kundli matching reliable?"), a: t("होय, आमचे गुण मिलान पारंपरिक अष्टकूट पद्धत आणि अचूक खगोलीय डेटा वापरते. लग्नासारख्या महत्त्वाच्या निर्णयासाठी अनुभवी ज्योतिषांचा सल्लाही घ्या.", "Yes, we use the same Ashtakoot method with precise astronomical data. For important decisions like marriage, also consult an experienced astrologer.") },
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
