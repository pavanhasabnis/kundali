"use client";

import { useState, useRef, useEffect } from "react";
import { useLang } from "@/lib/astrology/language-context";
import { PLACES, type Place } from "@/lib/astrology/places";

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

export default function MatchingPage() {
  const { t } = useLang();
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
    <div className="bg-[#FAFAF8] py-6"><div className="space-y-8 max-w-5xl mx-auto px-4 sm:px-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          {t("अष्टकूट गुण मिलान", "Ashtakoot Guna Milan")}
        </h1>
        <p className="text-gray-600 mt-2">
          {t("३६ गुणांवर आधारित विवाह जुळणी", "Marriage matching based on 36 Gunas")}
        </p>
      </div>

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
    </div></div>
  );
}
