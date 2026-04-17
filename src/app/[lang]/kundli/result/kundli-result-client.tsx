"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLang } from "@/lib/astrology/language-context";

// Re-use all the same interfaces
interface PlanetData { id: string; nameMr: string; name: string; rashiMr: string; rashi: string; degreeDMS: string; nakshatraMr: string; nakshatra: string; nakshatraLord: string; pada: number; house: number; isRetrograde: boolean; }
interface ChartPlanetData { id: string; name: string; nameMr: string; rashiIndex: number; rashi: string; rashiMr: string; house: number; degreeInSign: number; isRetrograde: boolean; }
interface DivisionalChartData { id: string; name: string; nameMr: string; planets: ChartPlanetData[]; }
interface AntarDashaData { lord: string; startDate: string; endDate: string; years: number; }
interface DashaData { lord: string; startDate: string; endDate: string; years: number; antardashas: AntarDashaData[]; }
interface PlanetStrengthData { id: string; nameMr: string; nameEn: string; dignity: string; dignityMr: string; dignityEn: string; isRetrograde: boolean; isCombust: boolean; house: number; strengthScore: number; }
interface YogaData { nameMr: string; nameEn: string; descriptionMr: string; descriptionEn: string; type: "benefic" | "malefic" | "neutral"; strength: "strong" | "moderate" | "weak"; }
interface DoshaData { nameMr: string; nameEn: string; present: boolean; severity: string; descriptionMr: string; descriptionEn: string; remedyMr: string; remedyEn: string; }
interface HousePredictionData { house: number; titleMr: string; titleEn: string; iconLabel: string; predictionMr: string; predictionEn: string; rating: number; }
interface DashaInterpData { lordMr: string; lordEn: string; periodMr: string; periodEn: string; careerMr: string; careerEn: string; financeMr: string; financeEn: string; healthMr: string; healthEn: string; relationshipMr: string; relationshipEn: string; adviceMr: string; adviceEn: string; }
interface RemedyData { categoryMr: string; categoryEn: string; items: { mr: string; en: string }[]; }
interface EnhancementsData {
  birthPanchang: { day: string; sunrise: string; sunset: string; dinman: string; tithi: string; paksha: string; yoga: string; karana: string; masa: string; shakaSamvat: number };
  rashiAkshar: string;
  balanceDasha: { lordMr: string; lordEn: string; years: number; months: number; days: number };
  sadeSati: { active: boolean; phase: string; phaseMr: string; phaseEn: string; descriptionMr: string; descriptionEn: string };
  pitraDosha: { present: boolean; reasonMr: string; reasonEn: string };
  luckyItems: { gemstone: { mr: string; en: string; planet: string }; color: { mr: string; en: string }; number: number; day: { mr: string; en: string }; direction: { mr: string; en: string }; metal: { mr: string; en: string } };
  combustion: { id: string; isCombust: boolean; distance: number }[];
  houseLords: { house: number; rashiMr: string; rashiEn: string; subjectMr: string; subjectEn: string; lordId: string; lordMr: string; lordEn: string; lordHouse: number; lordRashiMr: string; lordStrengthMr: string; lordStrengthEn: string }[];
  aspects: { fromId: string; toId: string; type: string; aspectHouse: number; descriptionMr: string; descriptionEn: string }[];
  vargottam: { id: string; nameMr: string; nameEn: string; rashiMr: string; rashiEn: string; descriptionMr: string; descriptionEn: string }[];
  bhavSandhi: { house: number; cuspDegree: number; cuspDMS: string; rashiMr: string; rashiEn: string }[];
  houseShifts: { planetId: string; planetMr: string; d1House: number; chalitHouse: number; shifted: boolean }[];
  chandraYogas: { nameMr: string; nameEn: string; present: boolean; descriptionMr: string; descriptionEn: string; type: string }[];
  lagnaAnalysis: { rashiDescMr: string; rashiDescEn: string; lagnaLordPositionMr: string; lagnaLordPositionEn: string };
  mentalTemperament: { descriptionMr: string; descriptionEn: string; moonStrengthMr: string; moonStrengthEn: string };
  marriageAnalysis: { venusMr: string; venusEn: string; seventhMr: string; seventhEn: string; timingMr: string; timingEn: string };
  careerAnalysis: { careerTypeMr: string; careerTypeEn: string; jobOrBusinessMr: string; jobOrBusinessEn: string };
  childrenAnalysis: { yogaMr: string; yogaEn: string; timingMr: string; timingEn: string };
}

interface KundliData {
  lagnaRashiIndex: number;
  lagnaRashiMr: string; lagnaRashi: string; lagnaDMS: string; lagnaNakshatraMr: string; lagnaNakshatra: string;
  moonRashiMr: string; moonRashi: string; moonNakshatraMr: string; moonNakshatra: string; moonNakshatraLord: string; moonPada: number; ayanamsa: number;
  planets: PlanetData[]; dashas: DashaData[];
  analysis: { planetaryStrength: PlanetStrengthData[]; yogas: YogaData[]; doshas: DoshaData[]; housePredictions: HousePredictionData[]; currentDasha: DashaInterpData | null; remedies: RemedyData[]; };
  divisionalCharts: DivisionalChartData[];
  enhancements?: EnhancementsData;
}

const PLANET_LORD_MR: Record<string, string> = { Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगळ", Mercury: "बुध", Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु" };

const MARATHI_DIGITS = ["०", "१", "२", "३", "४", "५", "६", "७", "८", "९"];
function toMr(val: string | number): string {
  return String(val).replace(/[0-9]/g, (d) => MARATHI_DIGITS[parseInt(d)]);
}

// Transliterate English name to Devanagari (Marathi)
function toDevanagari(input: string): string {
  const cMap: [string, string][] = [
    ['ksh', 'क्ष'], ['gny', 'ज्ञ'], ['tr', 'त्र'],
    ['chh', 'छ'], ['shh', 'ष'],
    ['kh', 'ख'], ['gh', 'घ'],
    ['ch', 'च'], ['jh', 'झ'],
    ['th', 'थ'], ['dh', 'ध'],
    ['ph', 'फ'], ['bh', 'भ'],
    ['sh', 'श'],
    ['k', 'क'], ['g', 'ग'],
    ['c', 'क'], ['j', 'ज'],
    ['t', 'त'], ['d', 'द'], ['n', 'न'],
    ['p', 'प'], ['b', 'ब'], ['m', 'म'],
    ['y', 'य'], ['r', 'र'], ['l', 'ल'],
    ['v', 'व'], ['w', 'व'],
    ['s', 'स'], ['h', 'ह'],
    ['f', 'फ'], ['z', 'ज़'], ['q', 'क़'],
  ];
  const vMap: [string, string, string][] = [
    ['aa', 'आ', 'ा'], ['ee', 'ई', 'ी'], ['oo', 'ऊ', 'ू'],
    ['ai', 'ऐ', 'ै'], ['au', 'औ', 'ौ'],
    ['a', 'अ', ''], ['i', 'इ', 'ि'], ['u', 'उ', 'ु'],
    ['e', 'ए', 'े'], ['o', 'ओ', 'ो'],
  ];
  return input.split(/(\s+)/).map(word => {
    if (/^\s+$/.test(word)) return word;
    let res = '', i = 0;
    const s = word.toLowerCase();
    while (i < s.length) {
      if (!/[a-z]/.test(s[i])) { res += word[i]; i++; continue; }
      let cm = false;
      for (const [cp, cd] of cMap) {
        if (s.substring(i, i + cp.length) === cp) {
          const vi = i + cp.length;
          let vm2 = false;
          for (const [vp, , vm] of vMap) {
            if (s.substring(vi, vi + vp.length) === vp) {
              res += cd + (vp === 'a' && vi + vp.length === s.length ? 'ा' : vm);
              i = vi + vp.length; vm2 = true; break;
            }
          }
          if (!vm2) { res += cd + (vi >= s.length ? '' : '्'); i += cp.length; }
          cm = true; break;
        }
      }
      if (!cm) {
        let vm2 = false;
        for (const [vp, vs] of vMap) {
          if (s.substring(i, i + vp.length) === vp) { res += vs; i += vp.length; vm2 = true; break; }
        }
        if (!vm2) { res += word[i]; i++; }
      }
    }
    return res;
  }).join('');
}

const TABS = [
  { id: "all-charts", mr: "सर्व कुंडली", en: "All Charts", group: "charts" },
  { id: "chart", mr: "लग्न कुंडली", en: "Birth Chart", group: "charts" },
  { id: "chandra", mr: "चंद्र कुंडली", en: "Moon Chart", group: "charts" },
  { id: "navamsha", mr: "नवमांश (D9)", en: "Navamsha (D9)", group: "charts" },
  { id: "bhav-chalit", mr: "भाव चलित", en: "Bhav Chalit", group: "charts" },
  { id: "dashamsha", mr: "दशमांश (D10)", en: "Dashamsha (D10)", group: "charts" },
  { id: "saptamsha", mr: "सप्तांश (D7)", en: "Saptamsha (D7)", group: "charts" },
  { id: "dwadashamsha", mr: "द्वादशांश (D12)", en: "Dwadashamsha (D12)", group: "charts" },
  { id: "shodashamsha", mr: "षोडशांश (D16)", en: "Shodashamsha (D16)", group: "charts" },
  { id: "trimshamsha", mr: "त्रिंशांश (D30)", en: "Trimshamsha (D30)", group: "charts" },
  { id: "planets", mr: "ग्रह स्पष्ट", en: "Planet Positions", group: "analysis" },
  { id: "strength", mr: "ग्रह बल", en: "Planet Strength", group: "analysis" },
  { id: "yogas", mr: "योग", en: "Yogas", group: "analysis" },
  { id: "doshas", mr: "दोष", en: "Doshas", group: "analysis" },
  { id: "predictions", mr: "भविष्यकथन", en: "Predictions", group: "analysis" },
  { id: "dasha", mr: "चालू दशा फल", en: "Current Dasha", group: "analysis" },
  { id: "timeline", mr: "दशा कालावधी", en: "Dasha Timeline", group: "analysis" },
  { id: "remedies", mr: "उपाय", en: "Remedies", group: "analysis" },
];

const PrintHeaderContent = () => (
  <div className="print-page-header">
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <img src="/logos/navbar-dark-mr.svg" alt="भाग्यवेध" style={{ height: "28px", width: "auto" }} />
    </div>
    <div style={{ color: "#d4a843", fontSize: "10px", opacity: 0.5 }}>॥ श्री गणेशाय नमः ॥</div>
  </div>
);

const PrintFooterContent = () => (
  <div className="print-page-footer">
    <span style={{ color: "#d4a843", fontSize: "9px", fontWeight: 700, letterSpacing: "2px" }}>Bhaagyavedh</span>
    <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "8px" }}>bhaagyavedh.com</span>
  </div>
);

function PrintPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="print-page">
      <PrintHeaderContent />
      <div className="print-page-content">{children}</div>
      <PrintFooterContent />
    </div>
  );
}

function PrintChartsPages({ planets, divisionalCharts, lagnaRashi }: { planets: PlanetData[]; divisionalCharts: DivisionalChartData[]; lagnaRashi: number }) {
  const { t } = useLang();
  const buildHouseMap = (planetList: { id: string; nameMr: string; name?: string; house: number; isRetrograde: boolean }[]) => {
    const map: Record<number, typeof planetList> = {};
    for (let i = 1; i <= 12; i++) map[i] = [];
    planetList.forEach((p) => { if (map[p.house]) map[p.house].push(p); });
    return map;
  };
  const allCharts = [
    { id: "lagna", name: t("लग्न कुंडली", "Lagna Kundli"), houseMap: buildHouseMap(planets), label: t("लग्न", "Asc"), lagnaRashi },
    ...divisionalCharts.map(c => ({
      id: c.id, name: t(c.nameMr, c.name), houseMap: buildHouseMap(c.planets),
      label: c.id === "chandra" ? t("चंद्र", "Moon") : undefined,
      lagnaRashi: getChartLagnaRashi(c.planets),
    })),
  ];
  // Split into chunks of 4 charts per page
  const chunks: typeof allCharts[] = [];
  for (let i = 0; i < allCharts.length; i += 4) {
    chunks.push(allCharts.slice(i, i + 4));
  }
  return (
    <>
      {chunks.map((chunk, ci) => (
        <PrintPage key={ci}>
          {ci === 0 && <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1c1917", marginBottom: "12px" }}>{t("सर्व कुंडली चार्ट", "All Kundli Charts")}</h2>}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {chunk.map((chart) => (
              <div key={chart.id} style={{ textAlign: "center" }}>
                <h3 style={{ fontSize: "12px", fontWeight: 700, color: "#3d0c0c", marginBottom: "6px" }}>{chart.name}</h3>
                <NorthIndianChartSVG houseMap={chart.houseMap} label={chart.label} lagnaRashi={chart.lagnaRashi} />
              </div>
            ))}
          </div>
        </PrintPage>
      ))}
    </>
  );
}

function KundliResultContent() {
  const { t, lang } = useLang();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [result, setResult] = useState<KundliData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all-charts");
  const [nameMr, setNameMr] = useState("");
  const [authChecked, setAuthChecked] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [userPlan, setUserPlan] = useState("free");
  const savedRef = useRef(false);
  const fetchedRef = useRef(false);

  // Auth + limit check
  useEffect(() => {
    async function check() {
      try {
        const sRes = await fetch("/api/user");
        const sData = await sRes.json();
        if (!sData?.user?.email) {
          router.replace("/kundli");
          return;
        }
        setUserPlan(sData.user.plan || "free");

        // Check kundli count for free users (skip for admin/premium)
        if (!sData.user.plan || sData.user.plan === "free") {
          const kRes = await fetch("/api/user/kundlis");
          const kData = await kRes.json();
          const count = kData.kundlis?.length || 0;
          if (count >= 1) {
            setLimitReached(true);
            setLoading(false);
            return;
          }
        }
        setAuthChecked(true);
      } catch {
        router.replace("/kundli");
      }
    }
    check();
  }, [router]);

  const name = searchParams.get("name") || "";

  // Fetch Marathi transliteration of name + set PDF filename via document title
  useEffect(() => {
    if (!name) return;
    fetch(`/api/transliterate?text=${encodeURIComponent(name)}`)
      .then(r => r.json())
      .then(d => {
        if (d.result) {
          setNameMr(d.result);
          document.title = `${d.result} — कुंडली | Bhaagyavedh`;
        }
      })
      .catch(() => {
        const fallback = toDevanagari(name);
        setNameMr(fallback);
        document.title = `${fallback} — कुंडली | Bhaagyavedh`;
      });
    // Set English title immediately as fallback
    document.title = `${name} — Kundli | Bhaagyavedh`;
  }, [name]);

  useEffect(() => {
    if (!authChecked) return;
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    async function fetchKundli() {
      setLoading(true);
      try {
        const res = await fetch("/api/kundli", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            year: parseInt(searchParams.get("year") || "2000"),
            month: parseInt(searchParams.get("month") || "1"),
            day: parseInt(searchParams.get("day") || "1"),
            hour: parseInt(searchParams.get("hour") || "12"),
            minute: parseInt(searchParams.get("minute") || "0"),
            latitude: parseFloat(searchParams.get("lat") || "18.52"),
            longitude: parseFloat(searchParams.get("lng") || "73.85"),
            timezone: parseFloat(searchParams.get("tz") || "5.5"),
          }),
        });
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setResult(data);

        // Auto-save kundli to DB (once per mount)
        if (!savedRef.current) {
          savedRef.current = true;
          try {
            const day = searchParams.get("day") || "1";
            const month = searchParams.get("month") || "1";
            const year = searchParams.get("year") || "2000";
            const hour = searchParams.get("hour") || "12";
            const minute = searchParams.get("minute") || "0";
            await fetch("/api/user/kundlis", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: searchParams.get("name") || "Unknown",
                dateOfBirth: `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
                birthTime: `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`,
                birthPlace: searchParams.get("place") || "",
                latitude: searchParams.get("lat") || "",
                longitude: searchParams.get("lng") || "",
                resultJson: data,
              }),
            });
          } catch { /* save failed silently */ }
        }
      } catch {
        setError(t("कुंडली गणना करताना त्रुटी आली.", "Error calculating Kundli."));
      } finally {
        setLoading(false);
      }
    }
    fetchKundli();
  }, [searchParams, t, authChecked]);

  if (limitReached) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-[#d4a843]/20 overflow-hidden">
          <div className="px-6 py-5 text-center" style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)" }}>
            <h2 className="text-xl font-bold text-[#d4a843]">
              {t("मोफत कुंडली मर्यादा संपली", "Free Kundli Limit Reached")}
            </h2>
          </div>
          <div className="p-6 text-center">
            <p className="text-sm text-[#5c1a1a]/70 mb-2">
              {t("तुम्ही तुमची १ मोफत कुंडली आधीच बनवली आहे.", "You have already used your 1 free kundli.")}
            </p>
            <p className="text-sm text-[#5c1a1a]/70 mb-6">
              {t("अधिक कुंडल्या बनवण्यासाठी प्रीमियम प्लॅन घ्या.", "Upgrade to premium plan to generate more kundlis.")}
            </p>
            <div className="flex gap-3">
              <button onClick={() => router.push("/account")}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
                style={{ background: "linear-gradient(135deg, #d4a843, #c49535)", color: "#1a0505" }}>
                {t("प्रीमियम प्लॅन पहा", "View Premium Plans")}
              </button>
              <button onClick={() => router.push("/kundli")}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold border border-gray-200 text-[#5c1a1a]/60 hover:bg-gray-50">
                {t("मागे जा", "Go Back")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-[#f0c040]/30 border-t-[#8b2c2c] rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-stone-500">{t("कुंडली गणना चालू आहे...", "Calculating Kundli...")}</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return <div className="text-center py-20 text-red-600">{error || t("कुंडली उपलब्ध नाही", "Kundli not available")}</div>;
  }

  return (
    <div className="bg-[#FAFAF8]">
      {/* Basic Info Header — full width */}
      <div className="no-print text-white px-6 py-5" style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-bold">
              {nameMr || name ? `${nameMr || name} — ` : ""}{t("कुंडली", "Kundli")}
            </h1>
            <div className="flex gap-2">
              {/* Save Kundli */}
              <button onClick={async () => {
                // Save to localStorage
                const saved = JSON.parse(localStorage.getItem("savedKundlis") || "[]");
                const entry = { name: name || t("कुंडली", "Kundli"), date: new Date().toISOString(), params: Object.fromEntries(searchParams.entries()) };
                const exists = saved.findIndex((s: { name: string }) => s.name === entry.name);
                if (exists >= 0) saved[exists] = entry; else saved.push(entry);
                localStorage.setItem("savedKundlis", JSON.stringify(saved));

                // Also save to DB for logged-in users
                try {
                  const p = Object.fromEntries(searchParams.entries());
                  const dob = `${p.year}-${String(p.month).padStart(2,"0")}-${String(p.day).padStart(2,"0")}`;
                  const birthTime = `${String(p.hour).padStart(2,"0")}:${String(p.minute).padStart(2,"0")}`;
                  await fetch("/api/user/kundlis", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      name: name || "Kundli",
                      dateOfBirth: dob,
                      birthTime,
                      birthPlace: p.place || "",
                      latitude: parseFloat(p.lat || "0"),
                      longitude: parseFloat(p.lng || "0"),
                      resultJson: result,
                    }),
                  });
                } catch { /* not logged in — ignore */ }

                alert(t("कुंडली सेव्ह झाली!", "Kundli saved!"));
              }} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:bg-white/20" style={{ background: "rgba(212,168,67,0.2)", color: "#d4a843", border: "1px solid rgba(212,168,67,0.3)" }}>
                {t("सेव्ह करा", "Save")}
              </button>
              {/* PDF Download */}
              <button onClick={() => window.print()} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:bg-white/20" style={{ background: "rgba(212,168,67,0.2)", color: "#d4a843", border: "1px solid rgba(212,168,67,0.3)" }}>
                {t("PDF", "PDF")}
              </button>
              {/* WhatsApp Share */}
              <button onClick={() => {
                const url = window.location.href;
                const text = `${name ? name + " — " : ""}${t("कुंडली", "Kundli")}%0A${t("लग्न", "Asc")}: ${t(result.lagnaRashiMr, result.lagnaRashi)}%0A${t("राशी", "Moon")}: ${t(result.moonRashiMr, result.moonRashi)}%0A${t("नक्षत्र", "Nak")}: ${t(result.moonNakshatraMr, result.moonNakshatra)}%0A%0A${url}`;
                window.open(`https://wa.me/?text=${text}`, "_blank");
              }} className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:bg-white/20" style={{ background: "rgba(37,211,102,0.2)", color: "#25d366", border: "1px solid rgba(37,211,102,0.3)" }}>
                {t("WhatsApp", "WhatsApp")}
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/10 rounded-lg px-3 py-2">
              <p className="text-xs text-[#d4a843]/80">{t("लग्न", "Ascendant")}</p>
              <p className="font-bold">{t(result.lagnaRashiMr, result.lagnaRashi)}</p>
            </div>
            <div className="bg-white/10 rounded-lg px-3 py-2">
              <p className="text-xs text-[#d4a843]/80">{t("राशी (चंद्र)", "Moon Sign")}</p>
              <p className="font-bold">{t(result.moonRashiMr, result.moonRashi)}</p>
            </div>
            <div className="bg-white/10 rounded-lg px-3 py-2">
              <p className="text-xs text-[#d4a843]/80">{t("नक्षत्र", "Nakshatra")}</p>
              <p className="font-bold">{t(result.moonNakshatraMr, result.moonNakshatra)}</p>
            </div>
            <div className="bg-white/10 rounded-lg px-3 py-2">
              <p className="text-xs text-[#d4a843]/80">{t("नक्षत्र स्वामी", "Nakshatra Lord")}</p>
              <p className="font-bold">{t(PLANET_LORD_MR[result.moonNakshatraLord] || result.moonNakshatraLord, result.moonNakshatraLord)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile tabs */}
      <div className="no-print md:hidden overflow-x-auto border-b border-stone-200 bg-white px-4 py-2 scrollbar-hide">
        <div className="flex gap-2">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === tab.id ? "bg-[#5c1a1a] text-white" : "bg-stone-100 text-stone-600"
              }`}>
              {t(tab.mr, tab.en)}
            </button>
          ))}
        </div>
      </div>

      {/* Sidebar + Content (hidden during print — print-only section below renders all) */}
      <div className="max-w-7xl mx-auto flex gap-6 px-6 mt-6 pb-12 no-print">
        {/* Left Sidebar */}
        <div className="w-56 shrink-0 hidden md:block no-print">
          <div className="sticky top-20 bg-white rounded-xl border border-stone-200 overflow-hidden py-1 mb-6">
            <p className="px-4 py-1.5 text-[9px] font-bold text-stone-400 uppercase tracking-wider">{t("कुंडली","Charts")}</p>
            {TABS.filter(tab => tab.group === "charts").map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-1.5 text-xs transition-all ${
                  activeTab === tab.id
                    ? "bg-[#FFF8E7] text-[#5c1a1a] font-semibold border-l-3 border-l-[#8b2c2c]"
                    : "text-stone-600 hover:bg-stone-50 border-l-3 border-l-transparent"
                }`}>
                {t(tab.mr, tab.en)}
              </button>
            ))}
            <div className="border-t border-stone-200 my-1" />
            <p className="px-4 py-1.5 text-[9px] font-bold text-stone-400 uppercase tracking-wider">{t("विश्लेषण","Analysis")}</p>
            {TABS.filter(tab => tab.group === "analysis").map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-1.5 text-xs transition-all ${
                  activeTab === tab.id
                    ? "bg-[#FFF8E7] text-[#5c1a1a] font-semibold border-l-3 border-l-[#8b2c2c]"
                    : "text-stone-600 hover:bg-stone-50 border-l-3 border-l-transparent"
                }`}>
                {t(tab.mr, tab.en)}
              </button>
            ))}
          </div>
        </div>

        {/* Right Content — Patrika Page Style */}
        <div className="flex-1 min-w-0">
          <div className="relative overflow-hidden"
            style={{
              background: "#fffdf7",
              borderLeft: "1px solid rgba(212,168,67,0.15)",
              borderRight: "1px solid rgba(212,168,67,0.12)",
              boxShadow: "4px 4px 20px rgba(0,0,0,0.06), -1px 0 3px rgba(0,0,0,0.03)",
              minHeight: "80vh",
            }}>
            {/* Page edge effect — left margin line like real notebook */}
            <div className="absolute left-10 top-0 bottom-0 w-px" style={{ background: "rgba(212,168,67,0.12)" }} />
            {/* Subtle page texture */}
            <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"4\" height=\"4\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Crect width=\"1\" height=\"1\" fill=\"%23000\"/%3E%3C/svg%3E')", backgroundSize: "4px 4px" }} />

            {/* Patrika Header */}
            <div className="relative text-center py-4 px-6" style={{ borderBottom: "1px solid rgba(212,168,67,0.12)" }}>
              <p className="text-xs tracking-[0.15em]" style={{ color: "rgba(139,44,44,0.4)" }}>॥ श्री गणेशाय नमः ॥</p>
              <div className="w-24 h-px mx-auto mt-2" style={{ background: "linear-gradient(90deg, transparent, rgba(212,168,67,0.25), transparent)" }} />
            </div>

            {/* Content */}
            <div className="relative p-6 pl-14">
              {activeTab === "all-charts" && <AllChartsGrid planets={result.planets} divisionalCharts={result.divisionalCharts} lagnaRashi={result.lagnaRashiIndex} />}
              {activeTab === "chart" && <ChartSection planets={result.planets} lagnaRashi={result.lagnaRashiIndex} />}
              {activeTab === "chandra" && <DivisionalChartSection chart={findChart(result.divisionalCharts, "chandra")} description={t("चंद्र कुंडलीमध्ये भाव चंद्राच्या राशीपासून मोजले जातात. हे मानसिक स्थिती, भावना आणि लोकप्रियता दर्शवते.","In Chandra Kundli, houses are counted from Moon sign. It shows mental disposition, emotions, and public image.")} />}
              {activeTab === "navamsha" && <DivisionalChartSection chart={findChart(result.divisionalCharts, "navamsha")} description={t("नवमांश कुंडली विवाह, भाग्य आणि आध्यात्मिक प्रगती दर्शवते. हा सर्वात महत्त्वाचा वर्ग चार्ट आहे.","Navamsha chart reveals marriage, fortune, and spiritual progress. This is the most important divisional chart.")} />}
              {activeTab === "bhav-chalit" && <DivisionalChartSection chart={findChart(result.divisionalCharts, "bhav-chalit")} description={t("भाव चलित कुंडलीमध्ये ग्रह भाव मध्यबिंदूनुसार स्थानांतरित होऊ शकतात. भविष्यवाणीसाठी हे अधिक अचूक आहे.","In Bhav Chalit, planets may shift houses based on cusp midpoints. This is more accurate for predictions.")} />}
              {activeTab === "dashamsha" && <DivisionalChartSection chart={findChart(result.divisionalCharts, "dashamsha")} description={t("दशमांश कुंडली करिअर, व्यवसाय आणि सामाजिक स्थान दर्शवते.","Dashamsha chart shows career, profession, and social standing.")} />}
              {activeTab === "saptamsha" && <DivisionalChartSection chart={findChart(result.divisionalCharts, "saptamsha")} description={t("सप्तांश कुंडली संतती, मुलांचे भाग्य आणि सृजनशीलता दर्शवते.","Saptamsha chart reveals children, progeny fortune, and creativity.")} />}
              {activeTab === "dwadashamsha" && <DivisionalChartSection chart={findChart(result.divisionalCharts, "dwadashamsha")} description={t("द्वादशांश कुंडली आई-वडील, पूर्वज आणि वंशपरंपरा दर्शवते.","Dwadashamsha chart shows parents, ancestors, and lineage.")} />}
              {activeTab === "shodashamsha" && <DivisionalChartSection chart={findChart(result.divisionalCharts, "shodashamsha")} description={t("षोडशांश कुंडली वाहने, संपत्ती आणि भौतिक सुखसोयी दर्शवते.","Shodashamsha chart reveals vehicles, property, and material comforts.")} />}
              {activeTab === "trimshamsha" && <DivisionalChartSection chart={findChart(result.divisionalCharts, "trimshamsha")} description={t("त्रिंशांश कुंडली अरिष्ट, संकट आणि दुर्दैवी घटना दर्शवते.","Trimshamsha chart indicates misfortunes, calamities, and adversities.")} />}
              {activeTab === "planets" && <PlanetTable planets={result.planets} combustion={result.enhancements?.combustion} />}
              {activeTab === "strength" && <StrengthSection strengths={result.analysis.planetaryStrength} />}
              {activeTab === "yogas" && <YogaSection yogas={result.analysis.yogas} />}
              {activeTab === "doshas" && <DoshaSection doshas={result.analysis.doshas} />}
              {activeTab === "predictions" && <PredictionSection predictions={result.analysis.housePredictions} />}
              {activeTab === "dasha" && <DashaSection interp={result.analysis.currentDasha} />}
              {activeTab === "timeline" && <TimelineSection dashas={result.dashas} />}
              {activeTab === "remedies" && <RemedySection remedies={result.analysis.remedies} />}
            </div>

            {/* Patrika Footer */}
            <div className="relative text-center py-4 px-6 mt-6" style={{ borderTop: "1px solid rgba(212,168,67,0.12)" }}>
              <div className="flex items-center justify-center gap-4">
                <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(212,168,67,0.2), transparent)" }} />
                <p className="text-[10px] tracking-[0.15em] shrink-0" style={{ color: "rgba(139,44,44,0.3)" }}>भाग्यवेध पत्रिका</p>
                <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(212,168,67,0.2), transparent)" }} />
              </div>
            </div>

            {/* Page curl / bottom edge shadow */}
            <div className="h-1" style={{ background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.04))" }} />
          </div>
        </div>
      </div>

      {/* ─── Print-only: each section wrapped in its own page with header+footer ─── */}
      <div className="print-only">

        {/* ══════ PAGE 1: COVER (premium layout) ══════ */}
        {(() => {
          const year = searchParams.get("year") || "";
          const month = searchParams.get("month") || "";
          const day = searchParams.get("day") || "";
          const hour = parseInt(searchParams.get("hour") || "0");
          const minute = searchParams.get("minute") || "00";
          const lat = searchParams.get("lat") || "";
          const lng = searchParams.get("lng") || "";
          const tz = parseFloat(searchParams.get("tz") || "5.5");
          const tzH = Math.floor(tz);
          const tzM = Math.round((tz - tzH) * 60);
          const ampm = hour >= 12 ? "PM" : "AM";
          const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
          const timeStr = `${String(h12).padStart(2,"0")}:${String(minute).padStart(2,"0")} ${ampm}`;
          const dateStr = `${day}/${month}/${year}`;
          // Marathi number helper — converts all digits when lang is "mr"
          const m = (v: string | number) => lang === "mr" ? toMr(v) : String(v);

          // Find current dasha
          const now = new Date();
          const currentDasha = result.dashas.find(d => now >= new Date(d.startDate) && now <= new Date(d.endDate));
          const currentAntardasha = currentDasha?.antardashas?.find(ad => now >= new Date(ad.startDate) && now <= new Date(ad.endDate));

          // Ayanamsa formatted
          const ayanDeg = result.ayanamsa ? Math.floor(result.ayanamsa) : 0;
          const ayanMin = result.ayanamsa ? Math.floor((result.ayanamsa % 1) * 60) : 0;
          const ayanSec = result.ayanamsa ? Math.round(((result.ayanamsa % 1) * 60 % 1) * 60) : 0;
          const ayanStr = result.ayanamsa ? `${m(ayanDeg)}° ${m(ayanMin)}' ${m(ayanSec)}"` : "—";

          return (
            <>
            <div className="print-page">
              {/* BIG cover header */}
              <div style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a, #3d0c0c)", padding: "30px 40px", textAlign: "center", position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img src="/logos/logo-transparent.svg" alt="भाग्यवेध" style={{ height: "60px", width: "auto" }} />
                </div>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "4px", background: "linear-gradient(90deg, #3d0c0c, #d4a843, #3d0c0c)" }} />
              </div>

              {/* Person name */}
              <div style={{ textAlign: "center", padding: "24px 40px 16px", borderBottom: "2px solid #f5efe0" }}>
                <div style={{ fontSize: "30px", fontWeight: 700, color: "#3d0c0c" }}>{nameMr || name || t("कुंडली पत्रिका", "Kundli Patrika")}</div>
                <div style={{ fontSize: "13px", color: "#8b6b4a", marginTop: "4px" }}>{t("जन्म पत्रिका", "Birth Chart")} — {name}</div>
              </div>

              {/* Birth details — row 1 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: "1px solid #f5efe0", margin: "0 30px" }}>
                <div style={{ padding: "14px 16px", textAlign: "center", borderRight: "1px solid #f5efe0" }}>
                  <div style={{ fontSize: "8px", color: "#8b6b4a", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 600 }}>{t("जन्म तारीख", "DATE OF BIRTH")}</div>
                  <div style={{ fontSize: "15px", fontWeight: 600, color: "#3d0c0c", marginTop: "4px" }}>{m(dateStr)}</div>
                </div>
                <div style={{ padding: "14px 16px", textAlign: "center", borderRight: "1px solid #f5efe0" }}>
                  <div style={{ fontSize: "8px", color: "#8b6b4a", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 600 }}>{t("जन्म वेळ", "BIRTH TIME")}</div>
                  <div style={{ fontSize: "15px", fontWeight: 600, color: "#3d0c0c", marginTop: "4px" }}>{m(timeStr)}</div>
                </div>
                <div style={{ padding: "14px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: "8px", color: "#8b6b4a", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 600 }}>{t("जन्म ठिकाण", "BIRTH PLACE")}</div>
                  <div style={{ fontSize: "15px", fontWeight: 600, color: "#3d0c0c", marginTop: "4px" }}>{searchParams.get("place") || `${m(lat)}°N, ${m(lng)}°E`}</div>
                  {searchParams.get("place") && <div style={{ fontSize: "9px", color: "#8b6b4a", marginTop: "2px" }}>{m(lat)}°N, {m(lng)}°E</div>}
                </div>
              </div>

              {/* Birth details — row 2 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: "2px solid #f5efe0", margin: "0 30px" }}>
                <div style={{ padding: "14px 16px", textAlign: "center", borderRight: "1px solid #f5efe0" }}>
                  <div style={{ fontSize: "8px", color: "#8b6b4a", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 600 }}>{t("अक्षांश / रेखांश", "LAT / LNG")}</div>
                  <div style={{ fontSize: "15px", fontWeight: 600, color: "#3d0c0c", marginTop: "4px" }}>{m(lat)}°N, {m(lng)}°E</div>
                </div>
                <div style={{ padding: "14px 16px", textAlign: "center", borderRight: "1px solid #f5efe0" }}>
                  <div style={{ fontSize: "8px", color: "#8b6b4a", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 600 }}>{t("अयनांश (लाहिरी)", "AYANAMSHA")}</div>
                  <div style={{ fontSize: "15px", fontWeight: 600, color: "#3d0c0c", marginTop: "4px" }}>{ayanStr}</div>
                </div>
                <div style={{ padding: "14px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: "8px", color: "#8b6b4a", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 600 }}>{t("टाइमझोन", "TIMEZONE")}</div>
                  <div style={{ fontSize: "15px", fontWeight: 600, color: "#3d0c0c", marginTop: "4px" }}>IST (+{m(tzH)}:{m(String(tzM).padStart(2,"0"))})</div>
                </div>
              </div>

              {/* Birth details — row 3 (Panchang) */}
              {result.enhancements?.birthPanchang && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", borderBottom: "1px solid #f5efe0", margin: "0 30px" }}>
                  <div style={{ padding: "10px 12px", textAlign: "center", borderRight: "1px solid #f5efe0" }}>
                    <div style={{ fontSize: "8px", color: "#8b6b4a", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 600 }}>{t("वार", "DAY")}</div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#3d0c0c", marginTop: "3px" }}>{result.enhancements.birthPanchang.day}</div>
                  </div>
                  <div style={{ padding: "10px 12px", textAlign: "center", borderRight: "1px solid #f5efe0" }}>
                    <div style={{ fontSize: "8px", color: "#8b6b4a", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 600 }}>{t("सूर्योदय / सूर्यास्त", "SUNRISE / SUNSET")}</div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#3d0c0c", marginTop: "3px" }}>{m(result.enhancements.birthPanchang.sunrise)} / {m(result.enhancements.birthPanchang.sunset)}</div>
                  </div>
                  <div style={{ padding: "10px 12px", textAlign: "center", borderRight: "1px solid #f5efe0" }}>
                    <div style={{ fontSize: "8px", color: "#8b6b4a", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 600 }}>{t("दिनमान", "DAY DURATION")}</div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#3d0c0c", marginTop: "3px" }}>{m(result.enhancements.birthPanchang.dinman)}</div>
                  </div>
                  <div style={{ padding: "10px 12px", textAlign: "center" }}>
                    <div style={{ fontSize: "8px", color: "#8b6b4a", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 600 }}>{t("तिथी", "TITHI")}</div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#3d0c0c", marginTop: "3px" }}>{result.enhancements.birthPanchang.tithi} ({result.enhancements.birthPanchang.paksha})</div>
                  </div>
                </div>
              )}

              {/* Birth details — row 4 (Panchang contd.) */}
              {result.enhancements?.birthPanchang && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", borderBottom: "2px solid #f5efe0", margin: "0 30px" }}>
                  <div style={{ padding: "10px 12px", textAlign: "center", borderRight: "1px solid #f5efe0" }}>
                    <div style={{ fontSize: "8px", color: "#8b6b4a", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 600 }}>{t("योग / करण", "YOGA / KARANA")}</div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#3d0c0c", marginTop: "3px" }}>{result.enhancements.birthPanchang.yoga} / {result.enhancements.birthPanchang.karana}</div>
                  </div>
                  <div style={{ padding: "10px 12px", textAlign: "center", borderRight: "1px solid #f5efe0" }}>
                    <div style={{ fontSize: "8px", color: "#8b6b4a", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 600 }}>{t("राशी अक्षर", "RASHI AKSHAR")}</div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#3d0c0c", marginTop: "3px" }}>{result.enhancements?.rashiAkshar || "—"}</div>
                  </div>
                  <div style={{ padding: "10px 12px", textAlign: "center", borderRight: "1px solid #f5efe0" }}>
                    <div style={{ fontSize: "8px", color: "#8b6b4a", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 600 }}>{t("शक संवत", "SHAKA SAMVAT")}</div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#3d0c0c", marginTop: "3px" }}>{m(result.enhancements.birthPanchang.shakaSamvat)}</div>
                  </div>
                  <div style={{ padding: "10px 12px", textAlign: "center" }}>
                    <div style={{ fontSize: "8px", color: "#8b6b4a", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 600 }}>{t("पद्धती", "SYSTEM")}</div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#3d0c0c", marginTop: "3px" }}>{t("लाहिरी", "Lahiri")}</div>
                  </div>
                </div>
              )}

              {/* मूलभूत माहिती section */}
              <div style={{ padding: "20px 30px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#d4a843", letterSpacing: "2px", marginBottom: "8px", paddingBottom: "4px", borderBottom: "1px solid #f5efe0" }}>{t("मूलभूत माहिती", "BASIC INFORMATION")}</div>
                {[
                  [t("लग्न (Ascendant)", "Ascendant"), `${t(result.lagnaRashiMr, result.lagnaRashi)} — ${m(result.lagnaDMS)}`],
                  [t("राशी (Moon Sign)", "Moon Sign"), t(result.moonRashiMr, result.moonRashi)],
                  [t("नक्षत्र", "Nakshatra"), `${t(result.moonNakshatraMr, result.moonNakshatra)} — ${t("पद", "Pada")} ${m(result.moonPada)}`],
                  [t("नक्षत्र स्वामी", "Nakshatra Lord"), t(PLANET_LORD_MR[result.moonNakshatraLord] || result.moonNakshatraLord, result.moonNakshatraLord)],
                ].map(([label, value], i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #faf5eb", fontSize: "12px" }}>
                    <span style={{ color: "#8b6b4a", fontWeight: 500 }}>{label}</span>
                    <span style={{ color: "#3d0c0c", fontWeight: 600 }}>{value}</span>
                  </div>
                ))}

                {/* विंशोत्तरी दशा */}
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#d4a843", letterSpacing: "2px", marginTop: "20px", marginBottom: "8px", paddingBottom: "4px", borderBottom: "1px solid #f5efe0" }}>{t("विंशोत्तरी दशा", "VIMSHOTTARI DASHA")}</div>
                {[
                  [t("सध्याची महादशा", "Current Mahadasha"), currentDasha ? `${t(PLANET_LORD_MR[currentDasha.lord] || currentDasha.lord, currentDasha.lord)} ${t("दशा", "Dasha")}` : "—"],
                  [t("कालावधी", "Period"), currentDasha ? `${m(new Date(currentDasha.startDate).getFullYear())} - ${m(new Date(currentDasha.endDate).getFullYear())}` : "—"],
                  [t("अंतर्दशा", "Antardasha"), currentDasha && currentAntardasha ? `${t(PLANET_LORD_MR[currentDasha.lord] || currentDasha.lord, currentDasha.lord)}-${t(PLANET_LORD_MR[currentAntardasha.lord] || currentAntardasha.lord, currentAntardasha.lord)}` : "—"],
                  [t("भोग्य दशा (जन्मवेळी शिल्लक)", "Balance Dasha at Birth"), result.enhancements?.balanceDasha ? `${t(result.enhancements.balanceDasha.lordMr, result.enhancements.balanceDasha.lordEn)}: ${m(result.enhancements.balanceDasha.years)} ${t("वर्षे", "Y")} ${m(result.enhancements.balanceDasha.months)} ${t("महिने", "M")} ${m(result.enhancements.balanceDasha.days)} ${t("दिवस", "D")}` : "—"],
                ].map(([label, value], i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #faf5eb", fontSize: "12px" }}>
                    <span style={{ color: "#8b6b4a", fontWeight: 500 }}>{label}</span>
                    <span style={{ color: "#3d0c0c", fontWeight: 600 }}>{value}</span>
                  </div>
                ))}

              </div>

              {/* Footer */}
              <PrintFooterContent />
            </div>

            {/* ══════ PAGE 2: दोष स्थिती + शुभ माहिती ══════ */}
            <PrintPage>
              <div style={{ padding: "0" }}>
                {/* दोष स्थिती section */}
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#d4a843", letterSpacing: "2px", marginBottom: "8px", paddingBottom: "4px", borderBottom: "1px solid #f5efe0" }}>{t("दोष स्थिती", "DOSHA STATUS")}</div>
                {[
                  ...(result.analysis.doshas.filter(d => d.nameEn.toLowerCase().includes("mangal") || d.nameEn.toLowerCase().includes("manglik")).map(d => [t(d.nameMr, d.nameEn), d.present ? t("उपस्थित", "Present") : t("अनुपस्थित", "Absent")]) || []),
                  ...(result.analysis.doshas.filter(d => d.nameEn.toLowerCase().includes("kaal") || d.nameEn.toLowerCase().includes("sarp") || d.nameMr?.includes("काळ")).map(d => [t(d.nameMr, d.nameEn), d.present ? t("उपस्थित", "Present") : t("अनुपस्थित", "Absent")]) || []),
                  [t("साडेसाती", "Sade Sati"), result.enhancements?.sadeSati ? (result.enhancements.sadeSati.active ? `${t("चालू", "Active")} — ${t(result.enhancements.sadeSati.phaseMr, result.enhancements.sadeSati.phaseEn)}` : t("नाही", "Not Active")) : "—"],
                  [t("पितृ दोष", "Pitra Dosha"), result.enhancements?.pitraDosha ? (result.enhancements.pitraDosha.present ? `${t("उपस्थित", "Present")} — ${t(result.enhancements.pitraDosha.reasonMr, result.enhancements.pitraDosha.reasonEn)}` : t("अनुपस्थित", "Absent")) : "—"],
                ].map(([label, value], i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #faf5eb", fontSize: "12px" }}>
                    <span style={{ color: "#8b6b4a", fontWeight: 500 }}>{label}</span>
                    <span style={{ color: "#3d0c0c", fontWeight: 600 }}>{value}</span>
                  </div>
                ))}

                {/* शुभ माहिती section */}
                {result.enhancements?.luckyItems && (
                  <>
                    <div style={{ fontSize: "11px", fontWeight: 700, color: "#d4a843", letterSpacing: "2px", marginTop: "24px", marginBottom: "10px", paddingBottom: "4px", borderBottom: "1px solid #f5efe0" }}>{t("शुभ माहिती", "LUCKY ITEMS")}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                      {[
                        [t("रत्न", "Gemstone"), t(result.enhancements.luckyItems.gemstone.mr, result.enhancements.luckyItems.gemstone.en), `(${result.enhancements.luckyItems.gemstone.planet})`],
                        [t("रंग", "Color"), t(result.enhancements.luckyItems.color.mr, result.enhancements.luckyItems.color.en), ""],
                        [t("अंक", "Number"), m(result.enhancements.luckyItems.number), ""],
                        [t("वार", "Day"), t(result.enhancements.luckyItems.day.mr, result.enhancements.luckyItems.day.en), ""],
                        [t("दिशा", "Direction"), t(result.enhancements.luckyItems.direction.mr, result.enhancements.luckyItems.direction.en), ""],
                        [t("धातू", "Metal"), t(result.enhancements.luckyItems.metal.mr, result.enhancements.luckyItems.metal.en), ""],
                      ].map(([label, value, extra], i) => (
                        <div key={i} style={{ background: "#FFF8E7", border: "1px solid #f5efe0", borderRadius: "8px", padding: "12px 14px", textAlign: "center" }}>
                          <div style={{ fontSize: "9px", color: "#8b6b4a", fontWeight: 600, letterSpacing: "1px", marginBottom: "4px" }}>{label}</div>
                          <div style={{ fontSize: "16px", fontWeight: 700, color: "#3d0c0c" }}>{value}</div>
                          {extra && <div style={{ fontSize: "9px", color: "#8b6b4a", marginTop: "2px" }}>{extra}</div>}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </PrintPage>
            </>
          );
        })()}

        {/* ══════ CHARTS: 1 chart per page + analysis below ══════ */}
        {(() => {
          const buildHouseMap = (planetList: { id: string; nameMr: string; name?: string; house: number; isRetrograde: boolean }[]) => {
            const map: Record<number, typeof planetList> = {};
            for (let i = 1; i <= 12; i++) map[i] = [];
            planetList.forEach((p) => { if (map[p.house]) map[p.house].push(p); });
            return map;
          };
          const enh = result.enhancements;
          const interpBox = { background: "#FFF8E7", border: "1px solid #f5efe0", borderLeft: "3px solid #d4a843", borderRadius: "0 8px 8px 0" as const, padding: "12px 16px", marginTop: "12px" };
          const interpLabel = { fontSize: "10px", color: "#8b6b4a", fontWeight: 600 as const, marginBottom: "3px" };
          const interpText = { fontSize: "11px", color: "#3d0c0c", lineHeight: 1.5 };
          const badgeGreen = { display: "inline-block" as const, background: "#e8f5e9", color: "#2e7d32", fontSize: "10px", padding: "2px 8px", borderRadius: "4px", fontWeight: 600 as const, marginRight: "6px" };
          const badgeRed = { display: "inline-block" as const, background: "#fce4ec", color: "#c62828", fontSize: "10px", padding: "2px 8px", borderRadius: "4px", fontWeight: 600 as const, marginRight: "6px" };

          const allCharts = [
            { id: "lagna", name: t("लग्न कुंडली", "Lagna Kundli"), houseMap: buildHouseMap(result.planets), label: t("लग्न", "Asc"), lagnaRashi: result.lagnaRashiIndex },
            ...result.divisionalCharts.map(c => ({
              id: c.id, name: t(c.nameMr, c.name), houseMap: buildHouseMap(c.planets),
              label: c.id === "chandra" ? t("चंद्र", "Moon") : undefined,
              lagnaRashi: getChartLagnaRashi(c.planets),
            })),
          ];

          return allCharts.map((chart) => (
            <PrintPage key={chart.id}>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1c1917", marginBottom: "10px" }}>{chart.name}</h2>
              <div style={{ maxWidth: "320px", margin: "0 auto" }}>
                <NorthIndianChartSVG houseMap={chart.houseMap} label={chart.label} lagnaRashi={chart.lagnaRashi} />
              </div>

              {/* ── Lagna Analysis ── */}
              {chart.id === "lagna" && enh && (
                <div style={{ marginTop: "16px" }}>
                  <div style={interpBox}>
                    <div style={interpLabel}>{t("लग्न राशी", "Ascendant Sign")}</div>
                    <div style={interpText}>{t(enh.lagnaAnalysis.rashiDescMr, enh.lagnaAnalysis.rashiDescEn)}</div>
                  </div>
                  <div style={interpBox}>
                    <div style={interpLabel}>{t("लग्नेश स्थिती", "Lagna Lord Position")}</div>
                    <div style={interpText}>{t(enh.lagnaAnalysis.lagnaLordPositionMr, enh.lagnaAnalysis.lagnaLordPositionEn)}</div>
                  </div>
                  {result.analysis.doshas.filter(d => d.nameEn?.toLowerCase().includes("mangal") || d.nameEn?.toLowerCase().includes("manglik") || d.nameMr?.includes("मंगळ")).map((d, i) => (
                    <div key={i} style={{ ...interpBox, borderLeft: `3px solid ${d.present ? "#c62828" : "#2e7d32"}` }}>
                      <div style={interpLabel}>{t("मंगळिक स्थिती", "Manglik Status")}</div>
                      <div style={interpText}>
                        <span style={d.present ? badgeRed : badgeGreen}>{d.present ? t("मंगळिक", "Manglik") : t("मंगळिक नाही", "Not Manglik")}</span>
                        {t(d.descriptionMr, d.descriptionEn)}
                      </div>
                    </div>
                  ))}
                  <div style={{ ...interpBox, borderLeft: `3px solid ${enh.sadeSati.active ? "#c62828" : "#2e7d32"}` }}>
                    <div style={interpLabel}>{t("साडेसाती", "Sade Sati")}</div>
                    <div style={interpText}>
                      <span style={enh.sadeSati.active ? badgeRed : badgeGreen}>{t(enh.sadeSati.phaseMr, enh.sadeSati.phaseEn)}</span>
                      {t(enh.sadeSati.descriptionMr, enh.sadeSati.descriptionEn)}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Chandra Analysis ── */}
              {chart.id === "chandra" && enh && (
                <div style={{ marginTop: "16px" }}>
                  <div style={interpBox}>
                    <div style={interpLabel}>{t("मानसिक स्वभाव", "Mental Temperament")}</div>
                    <div style={interpText}>{t(enh.mentalTemperament.descriptionMr, enh.mentalTemperament.descriptionEn)}</div>
                  </div>
                  <div style={interpBox}>
                    <div style={interpLabel}>{t("चंद्र बल", "Moon Strength")}</div>
                    <div style={interpText}>{t(enh.mentalTemperament.moonStrengthMr, enh.mentalTemperament.moonStrengthEn)}</div>
                  </div>
                  {enh.chandraYogas.length > 0 ? enh.chandraYogas.map((y, i) => (
                    <div key={i} style={{ ...interpBox, borderLeft: `3px solid ${y.type === "benefic" ? "#2e7d32" : y.type === "malefic" ? "#c62828" : "#f57f17"}` }}>
                      <div style={interpLabel}>
                        <span style={{ ...(y.type === "benefic" ? badgeGreen : badgeRed) }}>{y.type === "benefic" ? t("शुभ", "Benefic") : t("अशुभ", "Malefic")}</span>
                        {t(y.nameMr, y.nameEn)}
                      </div>
                      <div style={interpText}>{t(y.descriptionMr, y.descriptionEn)}</div>
                    </div>
                  )) : (
                    <div style={interpBox}>
                      <div style={interpLabel}>{t("चंद्र योग", "Moon Yogas")}</div>
                      <div style={interpText}>{t("विशेष चंद्र योग आढळले नाहीत.", "No special Moon yogas detected.")}</div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Navamsha D9 — Marriage ── */}
              {chart.id === "navamsha" && enh && (
                <div style={{ marginTop: "16px" }}>
                  {enh.vargottam.length > 0 && (
                    <div style={interpBox}>
                      <div style={interpLabel}>{t("वर्गोत्तम ग्रह", "Vargottam Planets")} — {t("D1 आणि D9 दोन्हीत एकाच राशीत", "Same sign in D1 & D9")}</div>
                      <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "6px", marginTop: "6px" }}>
                        {enh.vargottam.map((v, i) => (
                          <span key={i} style={{ display: "inline-block", background: "linear-gradient(135deg, #d4a843, #b8922e)", color: "white", fontSize: "10px", padding: "3px 10px", borderRadius: "12px", fontWeight: 600 }}>{t(v.nameMr, v.nameEn)} — {t(v.rashiMr, v.rashiEn)}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div style={interpBox}>
                    <div style={interpLabel}>{t("शुक्र स्थिती (विवाह कारक)", "Venus Position")}</div>
                    <div style={interpText}>{t(enh.marriageAnalysis.venusMr, enh.marriageAnalysis.venusEn)}</div>
                  </div>
                  <div style={interpBox}>
                    <div style={interpLabel}>{t("सप्तमेश स्थिती", "7th Lord Position")}</div>
                    <div style={interpText}>{t(enh.marriageAnalysis.seventhMr, enh.marriageAnalysis.seventhEn)}</div>
                  </div>
                  <div style={interpBox}>
                    <div style={interpLabel}>{t("विवाह काळ संकेत", "Marriage Timing")}</div>
                    <div style={interpText}>{t(enh.marriageAnalysis.timingMr, enh.marriageAnalysis.timingEn)}</div>
                  </div>
                </div>
              )}

              {/* ── Bhav Chalit — House Cusps + Shifts ── */}
              {chart.id === "bhav-chalit" && enh && (
                <div style={{ marginTop: "16px" }}>
                  <div style={{ fontSize: "10px", fontWeight: 700, color: "#d4a843", letterSpacing: "2px", marginBottom: "6px" }}>{t("भाव संधी", "HOUSE CUSPS")}</div>
                  <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: "9px", marginBottom: "12px" }}>
                    <thead><tr>{[t("भाव","House"), t("अंश","Degree"), t("राशी","Sign")].map((h,i) => <th key={i} style={{ background: "#3d0c0c", color: "#d4a843", padding: "4px 6px", textAlign: "left" as const, fontSize: "8px", fontWeight: 600 }}>{h}</th>)}</tr></thead>
                    <tbody>
                      {enh.bhavSandhi.map((bs, i) => (
                        <tr key={i}><td style={{ padding: "3px 6px", borderBottom: "1px solid #f5efe0", fontWeight: 600, color: "#3d0c0c" }}>{bs.house}</td><td style={{ padding: "3px 6px", borderBottom: "1px solid #f5efe0", color: "#3d0c0c" }}>{bs.cuspDMS}</td><td style={{ padding: "3px 6px", borderBottom: "1px solid #f5efe0", color: "#3d0c0c" }}>{t(bs.rashiMr, bs.rashiEn)}</td></tr>
                      ))}
                    </tbody>
                  </table>
                  {enh.houseShifts.filter(h => h.shifted).length > 0 && (
                    <>
                      <div style={{ fontSize: "10px", fontWeight: 700, color: "#d4a843", letterSpacing: "2px", marginBottom: "6px" }}>{t("ग्रह भाव बदल", "PLANET SHIFTS")}</div>
                      {enh.houseShifts.filter(h => h.shifted).map((hs, i) => (
                        <div key={i} style={{ background: "#fff8e1", border: "1px solid #f5efe0", borderRadius: "4px", padding: "6px 12px", marginBottom: "4px", fontSize: "10px", color: "#3d0c0c" }}>
                          <strong style={{ color: "#e65100" }}>{hs.planetMr}</strong> — {t("भाव", "H")} {hs.d1House} → <strong>{t("भाव", "H")} {hs.chalitHouse}</strong>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              )}

              {/* ── Dashamsha D10 — Career ── */}
              {chart.id === "dashamsha" && enh && (
                <div style={{ marginTop: "16px" }}>
                  <div style={interpBox}>
                    <div style={interpLabel}>{t("व्यवसाय प्रकार", "Career Type")}</div>
                    <div style={interpText}>{t(enh.careerAnalysis.careerTypeMr, enh.careerAnalysis.careerTypeEn)}</div>
                  </div>
                  <div style={interpBox}>
                    <div style={interpLabel}>{t("नोकरी / व्यवसाय", "Job / Business")}</div>
                    <div style={interpText}>{t(enh.careerAnalysis.jobOrBusinessMr, enh.careerAnalysis.jobOrBusinessEn)}</div>
                  </div>
                </div>
              )}

              {/* ── Saptamsha D7 — Children ── */}
              {chart.id === "saptamsha" && enh && (
                <div style={{ marginTop: "16px" }}>
                  <div style={interpBox}>
                    <div style={interpLabel}>{t("संतती योग", "Children Yoga")}</div>
                    <div style={interpText}>{t(enh.childrenAnalysis.yogaMr, enh.childrenAnalysis.yogaEn)}</div>
                  </div>
                  <div style={interpBox}>
                    <div style={interpLabel}>{t("संतती काळ संकेत", "Children Timing")}</div>
                    <div style={interpText}>{t(enh.childrenAnalysis.timingMr, enh.childrenAnalysis.timingEn)}</div>
                  </div>
                </div>
              )}

              {/* ── D12 — Parents ── */}
              {chart.id === "dwadashamsha" && (
                <div style={{ marginTop: "16px" }}>
                  <div style={interpBox}>
                    <div style={interpLabel}>{t("पितृ/वंश विश्लेषण", "Parents/Ancestry Analysis")}</div>
                    <div style={interpText}>{t("द्वादशांश कुंडलीवरून पितृ-मातृ संबंध, वंशपरंपरा आणि कौटुंबिक वारसा कळतो.", "D12 reveals relationship with parents, ancestry and family heritage.")}</div>
                  </div>
                </div>
              )}

              {/* ── D16 — Comforts ── */}
              {chart.id === "shodashamsha" && (
                <div style={{ marginTop: "16px" }}>
                  <div style={interpBox}>
                    <div style={interpLabel}>{t("सुखसोयी विश्लेषण", "Comforts & Vehicles Analysis")}</div>
                    <div style={interpText}>{t("षोडशांश कुंडलीवरून वाहन, मालमत्ता आणि भौतिक सुखसोयींचे संकेत मिळतात.", "D16 indicates vehicles, property and material comforts.")}</div>
                  </div>
                </div>
              )}

              {/* ── D30 — Misfortunes ── */}
              {chart.id === "trimshamsha" && (
                <div style={{ marginTop: "16px" }}>
                  <div style={interpBox}>
                    <div style={interpLabel}>{t("अरिष्ट विश्लेषण", "Challenges Analysis")}</div>
                    <div style={interpText}>{t("त्रिंशांश कुंडलीवरून आरोग्य जोखीम, अडचणी आणि सावधगिरीची क्षेत्रे कळतात.", "D30 reveals health risks, obstacles and areas requiring caution.")}</div>
                  </div>
                </div>
              )}
            </PrintPage>
          ));
        })()}

        {/* ══════ CHART ANALYSIS (now merged into chart pages above) ══════ */}
        {false && result.enhancements && (
          <>
            {/* OLD SEPARATE ANALYSIS PAGES — DISABLED, NOW MERGED INTO CHARTS */}
            <PrintPage>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1c1917", marginBottom: "16px" }}>{t("लग्न विश्लेषण", "Lagna Analysis")}</h2>
              <div style={{ background: "#FFF8E7", border: "1px solid #f5efe0", borderLeft: "3px solid #d4a843", borderRadius: "0 8px 8px 0", padding: "14px 18px", marginBottom: "14px" }}>
                <div style={{ fontSize: "10px", color: "#8b6b4a", fontWeight: 600, marginBottom: "4px" }}>{t("लग्न राशी", "Ascendant Sign")}</div>
                <div style={{ fontSize: "11px", color: "#3d0c0c", lineHeight: 1.6 }}>{t(result.enhancements.lagnaAnalysis.rashiDescMr, result.enhancements.lagnaAnalysis.rashiDescEn)}</div>
              </div>
              <div style={{ background: "#FFF8E7", border: "1px solid #f5efe0", borderLeft: "3px solid #d4a843", borderRadius: "0 8px 8px 0", padding: "14px 18px", marginBottom: "14px" }}>
                <div style={{ fontSize: "10px", color: "#8b6b4a", fontWeight: 600, marginBottom: "4px" }}>{t("लग्नेश स्थिती", "Lagna Lord Position")}</div>
                <div style={{ fontSize: "11px", color: "#3d0c0c", lineHeight: 1.6 }}>{t(result.enhancements.lagnaAnalysis.lagnaLordPositionMr, result.enhancements.lagnaAnalysis.lagnaLordPositionEn)}</div>
              </div>
              {/* Manglik from doshas */}
              {result.analysis.doshas.filter(d => d.nameEn?.toLowerCase().includes("mangal") || d.nameEn?.toLowerCase().includes("manglik") || d.nameMr?.includes("मंगळ")).map((d, i) => (
                <div key={i} style={{ background: "#FFF8E7", border: "1px solid #f5efe0", borderLeft: `3px solid ${d.present ? "#c62828" : "#2e7d32"}`, borderRadius: "0 8px 8px 0", padding: "14px 18px", marginBottom: "14px" }}>
                  <div style={{ fontSize: "10px", color: "#8b6b4a", fontWeight: 600, marginBottom: "4px" }}>{t("मंगळिक स्थिती", "Manglik Status")}</div>
                  <div style={{ fontSize: "11px", color: "#3d0c0c", lineHeight: 1.6 }}>
                    <span style={{ display: "inline-block", background: d.present ? "#fce4ec" : "#e8f5e9", color: d.present ? "#c62828" : "#2e7d32", fontSize: "11px", padding: "2px 10px", borderRadius: "4px", fontWeight: 600, marginRight: "8px" }}>{d.present ? t("मंगळिक", "Manglik") : t("मंगळिक नाही", "Not Manglik")}</span>
                    {t(d.descriptionMr, d.descriptionEn)}
                  </div>
                </div>
              ))}
              <div style={{ background: "#FFF8E7", border: "1px solid #f5efe0", borderLeft: `3px solid ${result.enhancements.sadeSati.active ? "#c62828" : "#2e7d32"}`, borderRadius: "0 8px 8px 0", padding: "14px 18px", marginBottom: "14px" }}>
                <div style={{ fontSize: "10px", color: "#8b6b4a", fontWeight: 600, marginBottom: "4px" }}>{t("साडेसाती", "Sade Sati")}</div>
                <div style={{ fontSize: "11px", color: "#3d0c0c", lineHeight: 1.6 }}>
                  <span style={{ display: "inline-block", background: result.enhancements.sadeSati.active ? "#fce4ec" : "#e8f5e9", color: result.enhancements.sadeSati.active ? "#c62828" : "#2e7d32", fontSize: "11px", padding: "2px 10px", borderRadius: "4px", fontWeight: 600, marginRight: "8px" }}>{t(result.enhancements.sadeSati.phaseMr, result.enhancements.sadeSati.phaseEn)}</span>
                  {t(result.enhancements.sadeSati.descriptionMr, result.enhancements.sadeSati.descriptionEn)}
                </div>
              </div>
            </PrintPage>

            {/* ── Chandra Analysis ── */}
            <PrintPage>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1c1917", marginBottom: "16px" }}>{t("चंद्र विश्लेषण", "Moon Analysis")}</h2>
              <div style={{ background: "#FFF8E7", border: "1px solid #f5efe0", borderLeft: "3px solid #d4a843", borderRadius: "0 8px 8px 0", padding: "14px 18px", marginBottom: "14px" }}>
                <div style={{ fontSize: "10px", color: "#8b6b4a", fontWeight: 600, marginBottom: "4px" }}>{t("मानसिक स्वभाव", "Mental Temperament")}</div>
                <div style={{ fontSize: "11px", color: "#3d0c0c", lineHeight: 1.6 }}>{t(result.enhancements.mentalTemperament.descriptionMr, result.enhancements.mentalTemperament.descriptionEn)}</div>
              </div>
              <div style={{ background: "#FFF8E7", border: "1px solid #f5efe0", borderLeft: "3px solid #d4a843", borderRadius: "0 8px 8px 0", padding: "14px 18px", marginBottom: "14px" }}>
                <div style={{ fontSize: "10px", color: "#8b6b4a", fontWeight: 600, marginBottom: "4px" }}>{t("चंद्र बल", "Moon Strength")}</div>
                <div style={{ fontSize: "11px", color: "#3d0c0c", lineHeight: 1.6 }}>{t(result.enhancements.mentalTemperament.moonStrengthMr, result.enhancements.mentalTemperament.moonStrengthEn)}</div>
              </div>
              {result.enhancements.chandraYogas.length > 0 && (
                <>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#d4a843", letterSpacing: "2px", marginBottom: "8px", paddingBottom: "4px", borderBottom: "1px solid #f5efe0" }}>{t("चंद्र योग", "MOON YOGAS")}</div>
                  {result.enhancements.chandraYogas.map((y, i) => (
                    <div key={i} style={{ background: "#FFF8E7", border: "1px solid #f5efe0", borderLeft: `3px solid ${y.type === "benefic" ? "#2e7d32" : y.type === "malefic" ? "#c62828" : "#f57f17"}`, borderRadius: "0 8px 8px 0", padding: "14px 18px", marginBottom: "10px" }}>
                      <div style={{ fontSize: "12px", color: "#3d0c0c", fontWeight: 700, marginBottom: "4px" }}>
                        <span style={{ display: "inline-block", background: y.type === "benefic" ? "#e8f5e9" : y.type === "malefic" ? "#fce4ec" : "#fff8e1", color: y.type === "benefic" ? "#2e7d32" : y.type === "malefic" ? "#c62828" : "#f57f17", fontSize: "10px", padding: "2px 8px", borderRadius: "4px", fontWeight: 600, marginRight: "8px" }}>{y.type === "benefic" ? t("शुभ", "Benefic") : y.type === "malefic" ? t("अशुभ", "Malefic") : t("मिश्र", "Mixed")}</span>
                        {t(y.nameMr, y.nameEn)}
                      </div>
                      <div style={{ fontSize: "11px", color: "#5c3a1a", lineHeight: 1.6 }}>{t(y.descriptionMr, y.descriptionEn)}</div>
                    </div>
                  ))}
                </>
              )}
              {result.enhancements.chandraYogas.length === 0 && (
                <div style={{ background: "#FFF8E7", border: "1px solid #f5efe0", borderLeft: "3px solid #d4a843", borderRadius: "0 8px 8px 0", padding: "14px 18px" }}>
                  <div style={{ fontSize: "10px", color: "#8b6b4a", fontWeight: 600, marginBottom: "4px" }}>{t("चंद्र योग", "Moon Yogas")}</div>
                  <div style={{ fontSize: "11px", color: "#3d0c0c" }}>{t("विशेष चंद्र योग आढळले नाहीत.", "No special Moon yogas detected.")}</div>
                </div>
              )}
            </PrintPage>

            {/* ── Navamsha D9 — Marriage Analysis ── */}
            <PrintPage>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1c1917", marginBottom: "16px" }}>{t("नवमांश (D9) — विवाह विश्लेषण", "Navamsha (D9) — Marriage Analysis")}</h2>
              {result.enhancements.vargottam.length > 0 && (
                <div style={{ background: "#FFF8E7", border: "1px solid #f5efe0", borderLeft: "3px solid #d4a843", borderRadius: "0 8px 8px 0", padding: "14px 18px", marginBottom: "14px" }}>
                  <div style={{ fontSize: "10px", color: "#8b6b4a", fontWeight: 600, marginBottom: "8px" }}>{t("वर्गोत्तम ग्रह", "Vargottam Planets")} — {t("D1 आणि D9 दोन्हीत एकाच राशीत — अत्यंत बलवान", "Same sign in D1 & D9 — extremely strong")}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {result.enhancements.vargottam.map((v, i) => (
                      <span key={i} style={{ display: "inline-block", background: "linear-gradient(135deg, #d4a843, #b8922e)", color: "white", fontSize: "10px", padding: "3px 10px", borderRadius: "12px", fontWeight: 600 }}>{t(v.nameMr, v.nameEn)} — {t(v.rashiMr, v.rashiEn)}</span>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ background: "#FFF8E7", border: "1px solid #f5efe0", borderLeft: "3px solid #d4a843", borderRadius: "0 8px 8px 0", padding: "14px 18px", marginBottom: "14px" }}>
                <div style={{ fontSize: "10px", color: "#8b6b4a", fontWeight: 600, marginBottom: "4px" }}>{t("शुक्र स्थिती (विवाह कारक)", "Venus Position (Marriage Significator)")}</div>
                <div style={{ fontSize: "11px", color: "#3d0c0c", lineHeight: 1.6 }}>{t(result.enhancements.marriageAnalysis.venusMr, result.enhancements.marriageAnalysis.venusEn)}</div>
              </div>
              <div style={{ background: "#FFF8E7", border: "1px solid #f5efe0", borderLeft: "3px solid #d4a843", borderRadius: "0 8px 8px 0", padding: "14px 18px", marginBottom: "14px" }}>
                <div style={{ fontSize: "10px", color: "#8b6b4a", fontWeight: 600, marginBottom: "4px" }}>{t("सप्तमेश स्थिती (७ वा भाव)", "7th Lord Position")}</div>
                <div style={{ fontSize: "11px", color: "#3d0c0c", lineHeight: 1.6 }}>{t(result.enhancements.marriageAnalysis.seventhMr, result.enhancements.marriageAnalysis.seventhEn)}</div>
              </div>
              <div style={{ background: "#FFF8E7", border: "1px solid #f5efe0", borderLeft: "3px solid #d4a843", borderRadius: "0 8px 8px 0", padding: "14px 18px" }}>
                <div style={{ fontSize: "10px", color: "#8b6b4a", fontWeight: 600, marginBottom: "4px" }}>{t("विवाह काळ संकेत", "Marriage Timing Indication")}</div>
                <div style={{ fontSize: "11px", color: "#3d0c0c", lineHeight: 1.6 }}>{t(result.enhancements.marriageAnalysis.timingMr, result.enhancements.marriageAnalysis.timingEn)}</div>
              </div>
            </PrintPage>

            {/* ── Bhav Chalit — House Cusps + Shifts ── */}
            <PrintPage>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1c1917", marginBottom: "16px" }}>{t("भाव चलित विश्लेषण", "Bhav Chalit Analysis")}</h2>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#d4a843", letterSpacing: "2px", marginBottom: "8px", paddingBottom: "4px", borderBottom: "1px solid #f5efe0" }}>{t("भाव संधी (House Cusps)", "HOUSE CUSPS")}</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px", marginBottom: "20px" }}>
                <thead><tr>{[t("भाव","House"), t("अंश","Degree"), t("राशी","Sign")].map((h,i) => <th key={i} style={{ background: "#3d0c0c", color: "#d4a843", padding: "5px 8px", textAlign: "left", fontSize: "9px", letterSpacing: "1px", fontWeight: 600 }}>{h}</th>)}</tr></thead>
                <tbody>
                  {result.enhancements.bhavSandhi.map((bs, i) => (
                    <tr key={i}><td style={{ padding: "4px 8px", borderBottom: "1px solid #f5efe0", fontWeight: 600, color: "#3d0c0c" }}>{bs.house}</td><td style={{ padding: "4px 8px", borderBottom: "1px solid #f5efe0", color: "#3d0c0c" }}>{bs.cuspDMS}</td><td style={{ padding: "4px 8px", borderBottom: "1px solid #f5efe0", color: "#3d0c0c" }}>{t(bs.rashiMr, bs.rashiEn)}</td></tr>
                  ))}
                </tbody>
              </table>
              {result.enhancements.houseShifts.filter(h => h.shifted).length > 0 && (
                <>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#d4a843", letterSpacing: "2px", marginBottom: "8px", paddingBottom: "4px", borderBottom: "1px solid #f5efe0" }}>{t("ग्रह भाव बदल (D1 → भाव चलित)", "PLANET HOUSE SHIFTS")}</div>
                  <p style={{ fontSize: "9px", color: "#8b6b4a", marginBottom: "8px" }}>{t("हे ग्रह लग्न कुंडलीपेक्षा भाव चलितमध्ये वेगळ्या भावात बसतात", "These planets shift houses from D1 to Bhav Chalit")}</p>
                  {result.enhancements.houseShifts.filter(h => h.shifted).map((hs, i) => (
                    <div key={i} style={{ background: "#fff8e1", border: "1px solid #f5efe0", borderRadius: "6px", padding: "8px 14px", marginBottom: "6px", fontSize: "11px", color: "#3d0c0c" }}>
                      <span style={{ display: "inline-block", background: "#fff3e0", color: "#e65100", fontSize: "10px", padding: "2px 8px", borderRadius: "4px", fontWeight: 600, marginRight: "8px" }}>{hs.planetMr}</span>
                      {t("लग्न कुंडली", "D1")}: {t("भाव", "House")} {hs.d1House} → {t("भाव चलित", "Bhav Chalit")}: <strong>{t("भाव", "House")} {hs.chalitHouse}</strong>
                    </div>
                  ))}
                </>
              )}
            </PrintPage>

            {/* ── D10 Career + D7 Children ── */}
            <PrintPage>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1c1917", marginBottom: "16px" }}>{t("करिअर विश्लेषण (D10)", "Career Analysis (D10)")}</h2>
              <div style={{ background: "#FFF8E7", border: "1px solid #f5efe0", borderLeft: "3px solid #d4a843", borderRadius: "0 8px 8px 0", padding: "14px 18px", marginBottom: "14px" }}>
                <div style={{ fontSize: "10px", color: "#8b6b4a", fontWeight: 600, marginBottom: "4px" }}>{t("व्यवसाय प्रकार", "Career Type")}</div>
                <div style={{ fontSize: "11px", color: "#3d0c0c", lineHeight: 1.6 }}>{t(result.enhancements.careerAnalysis.careerTypeMr, result.enhancements.careerAnalysis.careerTypeEn)}</div>
              </div>
              <div style={{ background: "#FFF8E7", border: "1px solid #f5efe0", borderLeft: "3px solid #d4a843", borderRadius: "0 8px 8px 0", padding: "14px 18px", marginBottom: "24px" }}>
                <div style={{ fontSize: "10px", color: "#8b6b4a", fontWeight: 600, marginBottom: "4px" }}>{t("नोकरी / व्यवसाय", "Job / Business")}</div>
                <div style={{ fontSize: "11px", color: "#3d0c0c", lineHeight: 1.6 }}>{t(result.enhancements.careerAnalysis.jobOrBusinessMr, result.enhancements.careerAnalysis.jobOrBusinessEn)}</div>
              </div>

              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1c1917", marginBottom: "16px" }}>{t("संतती विश्लेषण (D7)", "Children Analysis (D7)")}</h2>
              <div style={{ background: "#FFF8E7", border: "1px solid #f5efe0", borderLeft: "3px solid #d4a843", borderRadius: "0 8px 8px 0", padding: "14px 18px", marginBottom: "14px" }}>
                <div style={{ fontSize: "10px", color: "#8b6b4a", fontWeight: 600, marginBottom: "4px" }}>{t("संतती योग", "Children Yoga")}</div>
                <div style={{ fontSize: "11px", color: "#3d0c0c", lineHeight: 1.6 }}>{t(result.enhancements.childrenAnalysis.yogaMr, result.enhancements.childrenAnalysis.yogaEn)}</div>
              </div>
              <div style={{ background: "#FFF8E7", border: "1px solid #f5efe0", borderLeft: "3px solid #d4a843", borderRadius: "0 8px 8px 0", padding: "14px 18px" }}>
                <div style={{ fontSize: "10px", color: "#8b6b4a", fontWeight: 600, marginBottom: "4px" }}>{t("संतती काळ संकेत", "Children Timing")}</div>
                <div style={{ fontSize: "11px", color: "#3d0c0c", lineHeight: 1.6 }}>{t(result.enhancements.childrenAnalysis.timingMr, result.enhancements.childrenAnalysis.timingEn)}</div>
              </div>
            </PrintPage>

            {/* ── House Lords Table ── */}
            <PrintPage>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1c1917", marginBottom: "12px" }}>{t("भाव स्वामी सारणी", "House Lords Table")}</h2>
              <p style={{ fontSize: "9px", color: "#8b6b4a", marginBottom: "10px" }}>{t("प्रत्येक भावाचा स्वामी ग्रह कोणता आणि तो कोणत्या भावात बसला आहे", "Which planet owns each house and where it is placed")}</p>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px" }}>
                <thead><tr>{[t("भाव","House"), t("राशी","Sign"), t("विषय","Subject"), t("स्वामी","Lord"), t("स्वामी भाव","Lord House"), t("बल","Strength")].map((h,i) => <th key={i} style={{ background: "#3d0c0c", color: "#d4a843", padding: "6px 6px", textAlign: "left", fontSize: "8px", letterSpacing: "1px", fontWeight: 600 }}>{h}</th>)}</tr></thead>
                <tbody>
                  {result.enhancements.houseLords.map((hl, i) => (
                    <tr key={i} style={{ background: i % 2 === 1 ? "#fdfbf6" : "white" }}>
                      <td style={{ padding: "5px 6px", borderBottom: "1px solid #f5efe0", fontWeight: 600, color: "#3d0c0c" }}>{hl.house}</td>
                      <td style={{ padding: "5px 6px", borderBottom: "1px solid #f5efe0", color: "#3d0c0c" }}>{t(hl.rashiMr, hl.rashiEn)}</td>
                      <td style={{ padding: "5px 6px", borderBottom: "1px solid #f5efe0", color: "#8b6b4a", fontSize: "9px" }}>{t(hl.subjectMr, hl.subjectEn)}</td>
                      <td style={{ padding: "5px 6px", borderBottom: "1px solid #f5efe0", color: "#d4a843", fontWeight: 600 }}>{t(hl.lordMr, hl.lordEn)}</td>
                      <td style={{ padding: "5px 6px", borderBottom: "1px solid #f5efe0", color: "#3d0c0c" }}>{hl.lordHouse}</td>
                      <td style={{ padding: "5px 6px", borderBottom: "1px solid #f5efe0", color: "#8b6b4a", fontSize: "9px" }}>{t(hl.lordStrengthMr, hl.lordStrengthEn)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </PrintPage>

            {/* ── Aspects Matrix ── */}
            <PrintPage>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1c1917", marginBottom: "8px" }}>{t("ग्रह दृष्टी सारणी", "Planetary Aspects Table")}</h2>
              <p style={{ fontSize: "8px", color: "#8b6b4a", marginBottom: "10px" }}>● = {t("७ वी दृष्टी", "7th aspect")} &nbsp; ✦ = {t("विशेष दृष्टी", "Special aspect")} ({t("मंगळ ४/८, गुरु ५/९, शनि ३/१०", "Mars 4/8, Jupiter 5/9, Saturn 3/10")})</p>
              {(() => {
                const pIds = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"];
                const pMr: Record<string, string> = { Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगळ", Mercury: "बुध", Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु" };
                const aspectMap = new Map<string, { type: string; house: number }>();
                result.enhancements!.aspects.forEach(a => { aspectMap.set(`${a.fromId}-${a.toId}`, { type: a.type, house: a.aspectHouse }); });
                return (
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "9px" }}>
                    <thead><tr><th style={{ background: "#3d0c0c", color: "#d4a843", padding: "4px", border: "1px solid #f5efe0", fontSize: "8px" }}>{t("दृष्टी↓ वर→", "From↓ To→")}</th>{pIds.map(p => <th key={p} style={{ background: "#3d0c0c", color: "#d4a843", padding: "4px", border: "1px solid #f5efe0", fontSize: "8px", textAlign: "center" }}>{t(pMr[p], p)}</th>)}</tr></thead>
                    <tbody>
                      {pIds.map(from => (
                        <tr key={from}>
                          <th style={{ background: "#3d0c0c", color: "#d4a843", padding: "4px", border: "1px solid #f5efe0", fontSize: "8px", textAlign: "left" }}>{t(pMr[from], from)}</th>
                          {pIds.map(to => {
                            if (from === to) return <td key={to} style={{ padding: "4px", border: "1px solid #f5efe0", textAlign: "center", color: "#ccc" }}>—</td>;
                            const asp = aspectMap.get(`${from}-${to}`);
                            if (!asp) return <td key={to} style={{ padding: "4px", border: "1px solid #f5efe0", textAlign: "center" }}></td>;
                            return <td key={to} style={{ padding: "4px", border: "1px solid #f5efe0", textAlign: "center", background: asp.type === "special" ? "#fff3e0" : "#e8f5e9", color: asp.type === "special" ? "#e65100" : "#2e7d32", fontWeight: 700 }}>{asp.type === "special" ? `✦${asp.house}` : "●"}</td>;
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              })()}
              {/* Important aspect interpretations */}
              {result.enhancements.aspects.filter(a => a.type === "special").length > 0 && (
                <div style={{ marginTop: "16px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#d4a843", letterSpacing: "2px", marginBottom: "8px", paddingBottom: "4px", borderBottom: "1px solid #f5efe0" }}>{t("महत्त्वाचे विशेष दृष्टी योग", "IMPORTANT SPECIAL ASPECTS")}</div>
                  {result.enhancements.aspects.filter(a => a.type === "special").slice(0, 6).map((a, i) => (
                    <div key={i} style={{ fontSize: "10px", color: "#3d0c0c", padding: "4px 0", borderBottom: "1px solid #faf5eb" }}>
                      <strong>{t(a.descriptionMr, a.descriptionEn)}</strong>
                    </div>
                  ))}
                </div>
              )}
            </PrintPage>
          </>
        )}

        {/* ══════ PAGE 3: Planet Positions ══════ */}
        <PrintPage>
          <PlanetTable planets={result.planets} combustion={result.enhancements?.combustion} />
        </PrintPage>

        {/* ══════ PAGE 4: Planet Strength ══════ */}
        <PrintPage>
          <StrengthSection strengths={result.analysis.planetaryStrength} />
        </PrintPage>

        {/* ══════ PAGE 5: Yogas ══════ */}
        <PrintPage>
          <YogaSection yogas={result.analysis.yogas} />
        </PrintPage>

        {/* ══════ PAGE 6: Doshas ══════ */}
        <PrintPage>
          <DoshaSection doshas={result.analysis.doshas} />
        </PrintPage>

        {/* ══════ Predictions: split into 2 pages of 6 ══════ */}
        <PrintPage>
          <PredictionSection predictions={result.analysis.housePredictions.slice(0, 6)} />
        </PrintPage>
        <PrintPage>
          <PredictionSection predictions={result.analysis.housePredictions.slice(6)} />
        </PrintPage>

        {/* ══════ PAGE 8: Current Dasha ══════ */}
        <PrintPage>
          <DashaSection interp={result.analysis.currentDasha} />
        </PrintPage>

        {/* ══════ Dasha Timeline: mahadashas ══════ */}
        <PrintPage>
          <PrintTimelineMahadashas dashas={result.dashas} />
        </PrintPage>

        {/* ══════ Dasha Timeline: current mahadasha antardashas ══════ */}
        <PrintPage>
          <PrintTimelineAntardashas dashas={result.dashas} />
        </PrintPage>

        {/* ══════ Pratyantar Dasha (3rd level) ══════ */}
        {(() => {
          const now = new Date();
          const currentMaha = result.dashas.find(d => now >= new Date(d.startDate) && now <= new Date(d.endDate));
          const currentAntar = currentMaha?.antardashas?.find(ad => now >= new Date(ad.startDate) && now <= new Date(ad.endDate));
          if (!currentMaha || !currentAntar) return null;
          // Calculate pratyantar dashas for current antardasha
          const DASHA_LORDS = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
          const DASHA_YEARS: Record<string, number> = { Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7, Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17 };
          const antarYears = currentAntar.years;
          const antarStart = new Date(currentAntar.startDate);
          const startIdx = DASHA_LORDS.indexOf(currentAntar.lord);
          const pratyantars: { lord: string; start: Date; end: Date; current: boolean }[] = [];
          let pDate = new Date(antarStart);
          for (let j = 0; j < 9; j++) {
            const pIdx = (startIdx + j) % 9;
            const pLord = DASHA_LORDS[pIdx];
            const pYears = (antarYears * DASHA_YEARS[pLord]) / 120;
            const pStart = new Date(pDate);
            const pEnd = new Date(pDate);
            pEnd.setFullYear(pEnd.getFullYear() + Math.floor(pYears));
            pEnd.setMonth(pEnd.getMonth() + Math.floor((pYears % 1) * 12));
            pEnd.setDate(pEnd.getDate() + Math.floor(((pYears % 1) * 12 % 1) * 30));
            const isCurrent = now >= pStart && now <= pEnd;
            pratyantars.push({ lord: pLord, start: pStart, end: pEnd, current: isCurrent });
            pDate = new Date(pEnd);
          }
          const fmtDate = (d: Date) => `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
          const lordMr = (l: string) => ({ Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगळ", Mercury: "बुध", Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु" }[l] || l);
          return (
            <PrintPage>
              <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#1c1917", marginBottom: "8px" }}>{t("प्रत्यंतर दशा (३ रा स्तर)", "Pratyantar Dasha (3rd Level)")}</h2>
              <p style={{ fontSize: "10px", color: "#8b6b4a", marginBottom: "12px" }}>
                {t("महादशा", "Mahadasha")}: {t(lordMr(currentMaha.lord), currentMaha.lord)} → {t("अंतर्दशा", "Antardasha")}: {t(lordMr(currentAntar.lord), currentAntar.lord)} → {t("प्रत्यंतर दशा", "Pratyantar")}
              </p>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10px" }}>
                <thead><tr>{[t("प्रत्यंतर दशा", "Pratyantar"), t("प्रारंभ", "Start"), t("अंत", "End"), t("स्थिती", "Status")].map((h, i) => <th key={i} style={{ background: "#3d0c0c", color: "#d4a843", padding: "6px 8px", textAlign: "left", fontSize: "9px", letterSpacing: "1px", fontWeight: 600 }}>{h}</th>)}</tr></thead>
                <tbody>
                  {pratyantars.map((p, i) => (
                    <tr key={i} style={{ background: p.current ? "#FFF8E7" : i % 2 === 1 ? "#fdfbf6" : "white" }}>
                      <td style={{ padding: "5px 8px", borderBottom: "1px solid #f5efe0", fontWeight: 600, color: "#3d0c0c" }}>
                        {t(lordMr(currentMaha.lord), currentMaha.lord)}-{t(lordMr(currentAntar.lord), currentAntar.lord)}-<span style={{ color: "#d4a843" }}>{t(lordMr(p.lord), p.lord)}</span>
                      </td>
                      <td style={{ padding: "5px 8px", borderBottom: "1px solid #f5efe0", color: "#3d0c0c" }}>{fmtDate(p.start)}</td>
                      <td style={{ padding: "5px 8px", borderBottom: "1px solid #f5efe0", color: "#3d0c0c" }}>{fmtDate(p.end)}</td>
                      <td style={{ padding: "5px 8px", borderBottom: "1px solid #f5efe0" }}>
                        {p.current && <span style={{ display: "inline-block", background: "#fff3e0", color: "#e65100", fontSize: "9px", padding: "2px 8px", borderRadius: "4px", fontWeight: 600 }}>{t("चालू", "Current")}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </PrintPage>
          );
        })()}

        {/* ══════ Remedies: split into 2 pages ══════ */}
        <PrintPage>
          <RemedySection remedies={result.analysis.remedies.slice(0, Math.ceil(result.analysis.remedies.length / 2))} />
        </PrintPage>
        <PrintPage>
          <RemedySection remedies={result.analysis.remedies.slice(Math.ceil(result.analysis.remedies.length / 2))} />
          <div style={{ margin: "20px 0", padding: "14px 18px", borderLeft: "3px solid #d4a843" }}>
            <p style={{ fontSize: "9px", color: "#8b6b4a", lineHeight: 1.6 }}>
              <strong>{t("अस्वीकरण:", "Disclaimer:")}</strong> {t("ही पत्रिका लाहिरी अयनांश पद्धतीवर आधारित अचूक खगोलीय गणनेद्वारे तयार केली आहे. ज्योतिषशास्त्र हे मार्गदर्शनासाठी आहे, अंतिम निर्णयासाठी नाही.", "This patrika is generated using precise astronomical calculations (Lahiri Ayanamsha). Astrology is for guidance, not final decisions.")} — Bhaagyavedh
            </p>
          </div>
        </PrintPage>

      </div>
    </div>
  );
}

export default function KundliResultClient() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><div className="w-10 h-10 border-3 border-[#f0c040]/30 border-t-[#8b2c2c] rounded-full animate-spin" /></div>}>
      <KundliResultContent />
    </Suspense>
  );
}

// ─── Helpers ────────────────────────────────────────────────────

function findChart(charts: DivisionalChartData[] | undefined, id: string): DivisionalChartData | null {
  return charts?.find(c => c.id === id) || null;
}

// ─── Reusable North Indian Chart SVG ────────────────────────────

const CHART_PLANET_ABBR: Record<string, { mr: string; en: string }> = {
  Sun: { mr: "र", en: "Su" },
  Moon: { mr: "चं", en: "Mo" },
  Mars: { mr: "मं", en: "Ma" },
  Mercury: { mr: "बु", en: "Me" },
  Jupiter: { mr: "गु", en: "Ju" },
  Venus: { mr: "शु", en: "Ve" },
  Saturn: { mr: "श", en: "Sa" },
  Rahu: { mr: "रा", en: "Ra" },
  Ketu: { mr: "के", en: "Ke" },
};

const RASHI_ANCHORS_NI: Record<number, { x: number; y: number }> = {
  1: { x: 200, y: 25 }, 2: { x: 100, y: 15 }, 3: { x: 15, y: 100 },
  4: { x: 25, y: 200 }, 5: { x: 15, y: 300 }, 6: { x: 100, y: 385 },
  7: { x: 200, y: 375 }, 8: { x: 300, y: 385 }, 9: { x: 385, y: 300 },
  10: { x: 375, y: 200 }, 11: { x: 385, y: 100 }, 12: { x: 300, y: 15 },
};

const PLANET_ANCHORS_NI: Record<number, { x: number; y: number }> = {
  1: { x: 200, y: 115 }, 2: { x: 100, y: 55 }, 3: { x: 55, y: 100 },
  4: { x: 115, y: 200 }, 5: { x: 55, y: 300 }, 6: { x: 100, y: 345 },
  7: { x: 200, y: 285 }, 8: { x: 300, y: 345 }, 9: { x: 345, y: 300 },
  10: { x: 285, y: 200 }, 11: { x: 345, y: 100 }, 12: { x: 300, y: 55 },
};

const DIAMOND_HOUSES_NI = new Set([1, 4, 7, 10]);
const THIN_TRIANGLES_NI = new Set([2, 3, 5, 6, 8, 9, 11, 12]);

function getChartLayoutRules(n: number, house: number) {
  if (n <= 2) return { fontSize: 13, lineH: 14, useAbbrev: false, cols: 1 };
  if (n === 3) return { fontSize: 11, lineH: 12, useAbbrev: false, cols: 1 };
  if (n === 4) return { fontSize: 10, lineH: 11, useAbbrev: false, cols: 1 };
  if (n === 5) {
    if (DIAMOND_HOUSES_NI.has(house)) return { fontSize: 10, lineH: 11, useAbbrev: false, cols: 2 };
    return { fontSize: 9, lineH: 10, useAbbrev: false, cols: 1 };
  }
  if (DIAMOND_HOUSES_NI.has(house)) return { fontSize: 9, lineH: 10, useAbbrev: false, cols: 2 };
  return { fontSize: 9, lineH: 10, useAbbrev: THIN_TRIANGLES_NI.has(house), cols: 1 };
}

type NIPlanet = { id: string; nameMr: string; name?: string; isRetrograde: boolean };

function NorthIndianChartSVG({
  houseMap,
  label,
  lagnaRashi,
}: {
  houseMap: Record<number, NIPlanet[]>;
  label?: string;
  lagnaRashi: number;
}) {
  const { t, lang } = useLang();
  const stroke = "#8b2c2c";
  const bg = "#fafaf8";
  const rashiColor = "#8b2c2c";
  const planetColor = "#1f2937";
  const retroColor = "#dc2626";
  const labelColor = "#dc2626";

  const rashiFor = (house: number) => ((lagnaRashi + house - 1) % 12) + 1;
  const nMr = (v: number) => String(v).replace(/[0-9]/g, (d) => "०१२३४५६७८९"[parseInt(d)]);

  const renderPlanet = (p: NIPlanet, x: number, y: number, fontSize: number, useAbbrev: boolean) => {
    const abbr = CHART_PLANET_ABBR[p.id];
    const base = useAbbrev && abbr ? (lang === "mr" ? abbr.mr : abbr.en) : t(p.nameMr, p.name || p.id);
    const retroMark = p.isRetrograde ? t("(व)", "(R)") : "";
    return (
      <text
        key={`${p.id}-${x}-${y}`}
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={fontSize}
        fontWeight="700"
        fill={p.isRetrograde ? retroColor : planetColor}
        style={{ paintOrder: "stroke", stroke: bg, strokeWidth: 3, strokeLinejoin: "round" }}
      >
        {base}
        {retroMark}
      </text>
    );
  };

  return (
    <svg viewBox="-12 -12 424 424" className="w-full max-w-md" style={{ background: bg, border: `2px solid ${stroke}` }}>
      <rect x="0" y="0" width="400" height="400" fill="none" stroke={stroke} strokeWidth="2" />
      <line x1="0" y1="0" x2="400" y2="400" stroke={stroke} strokeWidth="1.5" />
      <line x1="400" y1="0" x2="0" y2="400" stroke={stroke} strokeWidth="1.5" />
      <polygon points="200,0 400,200 200,400 0,200" fill="none" stroke={stroke} strokeWidth="1.5" />

      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((house) => {
        const planets = houseMap[house] || [];
        const n = planets.length;
        const rules = getChartLayoutRules(n, house);
        const ra = RASHI_ANCHORS_NI[house];
        const pa = PLANET_ANCHORS_NI[house];

        let planetNodes: React.ReactNode[] = [];
        if (rules.cols === 2 && n >= 5) {
          const half = Math.ceil(n / 2);
          const left = planets.slice(0, half);
          const right = planets.slice(half);
          const dx = 28;
          const renderCol = (col: NIPlanet[], xOff: number) =>
            col.map((p, i) => {
              const off = (i - (col.length - 1) / 2) * rules.lineH;
              return renderPlanet(p, pa.x + xOff, pa.y + off, rules.fontSize, rules.useAbbrev);
            });
          planetNodes = [...renderCol(left, -dx / 2), ...renderCol(right, dx / 2)];
        } else {
          planetNodes = planets.map((p, i) => {
            const off = (i - (n - 1) / 2) * rules.lineH;
            return renderPlanet(p, pa.x, pa.y + off, rules.fontSize, rules.useAbbrev);
          });
        }

        const rashiText = lang === "mr" ? nMr(rashiFor(house)) : String(rashiFor(house));

        return (
          <g key={house}>
            <text
              x={ra.x}
              y={ra.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="14"
              fontWeight="700"
              fill={rashiColor}
              style={{ paintOrder: "stroke", stroke: bg, strokeWidth: 4, strokeLinejoin: "round" }}
            >
              {rashiText}
            </text>
            {house === 1 && label && (
              <text
                x={pa.x}
                y={pa.y - (n === 0 ? 0 : Math.ceil(n / 2) * rules.lineH + 10)}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="11"
                fontWeight="700"
                fill={labelColor}
                style={{ paintOrder: "stroke", stroke: bg, strokeWidth: 3, strokeLinejoin: "round" }}
              >
                {label}
              </text>
            )}
            {planetNodes}
          </g>
        );
      })}
    </svg>
  );
}

function getChartLagnaRashi(planets: ChartPlanetData[]): number {
  if (!planets.length) return 0;
  const ref = planets[0];
  return ((ref.rashiIndex - (ref.house - 1)) % 12 + 12) % 12;
}

// ─── Sub Components ─────────────────────────────────────────────

function DivisionalChartSection({ chart, description }: { chart: DivisionalChartData | null; description: string }) {
  const { t, lang } = useLang();
  const n = (v: string | number) => lang === "mr" ? toMr(v) : String(v);

  if (!chart) return <p className="text-stone-500">{t("चार्ट उपलब्ध नाही","Chart not available")}</p>;

  const houseMap: Record<number, ChartPlanetData[]> = {};
  for (let i = 1; i <= 12; i++) houseMap[i] = [];
  chart.planets.forEach((p) => { if (houseMap[p.house]) houseMap[p.house].push(p); });

  return (
    <div>
      <h2 className="text-lg font-bold text-stone-800 mb-1">{t(chart.nameMr, chart.name)}</h2>
      <p className="text-sm text-stone-500 mb-4">{description}</p>
      <div className="flex justify-center mb-6">
        <NorthIndianChartSVG houseMap={houseMap} label={chart.id === "chandra" ? t("चंद्र","Moon") : undefined} lagnaRashi={getChartLagnaRashi(chart.planets)} />
      </div>
      {/* Planet placement table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-[#d4a843]/30">
              <th className="text-left py-2 px-3">{t("ग्रह","Planet")}</th>
              <th className="text-left py-2 px-3">{t("राशी","Sign")}</th>
              <th className="text-center py-2 px-3">{t("भाव","House")}</th>
              <th className="text-center py-2 px-3">{t("वक्री","Retro")}</th>
            </tr>
          </thead>
          <tbody>
            {chart.planets.map((p) => (
              <tr key={p.id} className="border-b border-gray-100 hover:bg-[#FFF8E7]">
                <td className="py-2 px-3 font-semibold">{t(p.nameMr, p.name)}</td>
                <td className="py-2 px-3">{t(p.rashiMr, p.rashi)}</td>
                <td className="py-2 px-3 text-center">{n(p.house)}</td>
                <td className="py-2 px-3 text-center">{p.isRetrograde ? t("वक्री","R") : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AllChartsGrid({ planets, divisionalCharts, lagnaRashi }: { planets: PlanetData[]; divisionalCharts: DivisionalChartData[]; lagnaRashi: number }) {
  const { t } = useLang();

  const buildHouseMap = (planetList: { id: string; nameMr: string; name?: string; house: number; isRetrograde: boolean }[]) => {
    const map: Record<number, typeof planetList> = {};
    for (let i = 1; i <= 12; i++) map[i] = [];
    planetList.forEach((p) => { if (map[p.house]) map[p.house].push(p); });
    return map;
  };

  const lagnaMap = buildHouseMap(planets);

  const allCharts = [
    { id: "lagna", name: t("लग्न कुंडली", "Lagna Kundli"), houseMap: lagnaMap, label: t("लग्न", "Asc"), lagnaRashi },
    ...divisionalCharts.map(c => ({
      id: c.id,
      name: t(c.nameMr, c.name),
      houseMap: buildHouseMap(c.planets),
      label: c.id === "chandra" ? t("चंद्र", "Moon") : undefined,
      lagnaRashi: getChartLagnaRashi(c.planets),
    })),
  ];

  return (
    <div>
      <h2 className="text-lg font-bold text-stone-800 mb-6">{t("सर्व कुंडली चार्ट", "All Kundli Charts")}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allCharts.map((chart) => (
          <div key={chart.id} className="text-center print-avoid-break">
            <h3 className="text-sm font-bold mb-2" style={{ color: "#3d0c0c" }}>{chart.name}</h3>
            <NorthIndianChartSVG houseMap={chart.houseMap} label={chart.label} lagnaRashi={chart.lagnaRashi} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartSection({ planets, lagnaRashi }: { planets: PlanetData[]; lagnaRashi: number }) {
  const { t } = useLang();
  const houseMap: Record<number, PlanetData[]> = {};
  for (let i = 1; i <= 12; i++) houseMap[i] = [];
  planets.forEach((p) => { if (houseMap[p.house]) houseMap[p.house].push(p); });

  return (
    <div>
      <h2 className="text-lg font-bold text-stone-800 mb-4">{t("लग्न कुंडली", "Birth Chart (North Indian)")}</h2>
      <div className="flex justify-center">
        <NorthIndianChartSVG houseMap={houseMap} label={t("लग्न","Asc")} lagnaRashi={lagnaRashi} />
      </div>
    </div>
  );
}

function PlanetTable({ planets, combustion }: { planets: PlanetData[]; combustion?: { id: string; isCombust: boolean; distance: number }[] }) {
  const { t, lang } = useLang();
  const n = (v: string | number) => lang === "mr" ? toMr(v) : String(v);
  return (
    <div>
      <h2 className="text-lg font-bold text-stone-800 mb-4">{t("निरयण ग्रह स्पष्ट", "Nirayana Planet Positions")}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-[#d4a843]/30">
              <th className="text-left py-2 px-3">{t("ग्रह","Planet")}</th>
              <th className="text-left py-2 px-3">{t("राशी","Sign")}</th>
              <th className="text-left py-2 px-3">{t("अंश","Degree")}</th>
              <th className="text-left py-2 px-3">{t("नक्षत्र","Nakshatra")}</th>
              <th className="text-left py-2 px-3">{t("नक्ष. स्वामी","Nak. Lord")}</th>
              <th className="text-center py-2 px-3">{t("पद","Pada")}</th>
              <th className="text-center py-2 px-3">{t("भाव","House")}</th>
              <th className="text-center py-2 px-3">{t("वक्री","Retro")}</th>
              <th className="text-center py-2 px-3">{t("अस्त","Combust")}</th>
            </tr>
          </thead>
          <tbody>
            {planets.map((p) => {
              const comb = combustion?.find(c => c.id === p.id);
              return (
                <tr key={p.id} className="border-b border-gray-100 hover:bg-[#FFF8E7]">
                  <td className="py-2 px-3 font-semibold">{t(p.nameMr, p.name||p.id)}</td>
                  <td className="py-2 px-3">{t(p.rashiMr, p.rashi)}</td>
                  <td className="py-2 px-3 font-mono text-xs">{n(p.degreeDMS)}</td>
                  <td className="py-2 px-3">{t(p.nakshatraMr, p.nakshatra)}</td>
                  <td className="py-2 px-3">{t(PLANET_LORD_MR[p.nakshatraLord] || p.nakshatraLord, p.nakshatraLord)}</td>
                  <td className="py-2 px-3 text-center">{n(p.pada)}</td>
                  <td className="py-2 px-3 text-center">{n(p.house)}</td>
                  <td className="py-2 px-3 text-center">{p.isRetrograde ? t("वक्री","R") : "—"}</td>
                  <td className="py-2 px-3 text-center">{comb?.isCombust ? t("अस्त","Yes") : "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StrengthSection({ strengths }: { strengths: PlanetStrengthData[] }) {
  const { t, lang } = useLang();
  const n = (v: string | number) => lang === "mr" ? toMr(v) : String(v);
  return (
    <div>
      <h2 className="text-lg font-bold text-stone-800 mb-4">{t("ग्रह बल विश्लेषण","Planetary Strength Analysis")}</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-[#d4a843]/30">
              <th className="text-left py-2 px-3">{t("ग्रह","Planet")}</th>
              <th className="text-left py-2 px-3">{t("स्थिती","Dignity")}</th>
              <th className="text-center py-2 px-3">{t("भाव","House")}</th>
              <th className="text-center py-2 px-3">{t("बल","Strength")}</th>
              <th className="text-center py-2 px-3">{t("विशेष","Special")}</th>
            </tr>
          </thead>
          <tbody>
            {strengths.map((s) => (
              <tr key={s.id} className="border-b border-gray-100 hover:bg-[#FFF8E7] print-avoid-break">
                <td className="py-2 px-3 font-semibold">{t(s.nameMr, s.nameEn)}</td>
                <td className="py-2 px-3">{t(s.dignityMr, s.dignityEn)}</td>
                <td className="py-2 px-3 text-center">{n(s.house)}</td>
                <td className="py-2 px-3 text-center">{n(s.strengthScore)}%</td>
                <td className="py-2 px-3 text-center">
                  {s.isRetrograde && s.id !== "Rahu" && s.id !== "Ketu" ? t("वक्री","Retro") : ""}
                  {s.isCombust ? t(" अस्त"," Combust") : ""}
                  {!(s.isRetrograde && s.id !== "Rahu" && s.id !== "Ketu") && !s.isCombust ? "—" : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function YogaSection({ yogas }: { yogas: YogaData[] }) {
  const { t } = useLang();
  return (
    <div>
      <h2 className="text-lg font-bold text-stone-800 mb-4">{t("योग विश्लेषण","Yoga Analysis")}</h2>
      {yogas.length === 0 ? <p className="text-stone-500">{t("कोणतेही विशेष योग नाहीत.","No special yogas found.")}</p> : (
        <div className="space-y-4">
          {yogas.map((y, i) => (
            <div key={i} className={`rounded-xl border p-4 print-avoid-break ${y.type==="benefic"?"bg-green-50 border-green-200":y.type==="malefic"?"bg-red-50 border-red-200":"bg-gray-50 border-gray-200"}`}>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold">{t(y.nameMr, y.nameEn)}</h4>
                <span className={`text-xs px-2 py-0.5 rounded-full ${y.type==="benefic"?"bg-green-200 text-green-800":"bg-red-200 text-red-800"}`}>{y.strength}</span>
              </div>
              <p className="text-sm text-stone-600">{t(y.descriptionMr, y.descriptionEn)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DoshaSection({ doshas }: { doshas: DoshaData[] }) {
  const { t } = useLang();
  return (
    <div>
      <h2 className="text-lg font-bold text-stone-800 mb-4">{t("दोष विश्लेषण","Dosha Analysis")}</h2>
      <div className="space-y-4">
        {doshas.map((d, i) => (
          <div key={i} className={`rounded-xl border-2 p-4 print-avoid-break ${d.present?"bg-red-50 border-red-200":"bg-green-50 border-green-200"}`}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold">{t(d.nameMr, d.nameEn)}</h4>
              <span className={`text-xs px-3 py-1 rounded-full font-semibold ${d.present?"bg-red-500 text-white":"bg-green-500 text-white"}`}>
                {d.present ? t("उपस्थित","Present") : t("अनुपस्थित","Absent")}
              </span>
            </div>
            <p className="text-sm text-stone-600 mb-2">{t(d.descriptionMr, d.descriptionEn)}</p>
            {d.present && <div className="bg-white/70 rounded-lg p-3 border border-stone-200"><p className="text-sm">{t(d.remedyMr, d.remedyEn)}</p></div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function PredictionSection({ predictions }: { predictions: HousePredictionData[] }) {
  const { t, lang } = useLang();
  const n = (v: string | number) => lang === "mr" ? toMr(v) : String(v);
  return (
    <div>
      <h2 className="text-lg font-bold text-stone-800 mb-4">{t("भावनिहाय भविष्यकथन","House-wise Predictions")}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {predictions.map((p) => (
          <div key={p.house} className="border border-stone-200 rounded-xl p-4 hover:shadow-md transition-shadow print-avoid-break">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded bg-[#FFF8E7] text-[#5c1a1a] text-xs font-bold flex items-center justify-center">{n(p.house)}</span>
                <h4 className="font-bold text-sm">{t(`${n(p.house)}वा भाव`,`House ${p.house}`)} — {t(p.titleMr, p.titleEn)}</h4>
              </div>
              <div className="text-[#d4a843] text-sm">{"★".repeat(p.rating)}{"☆".repeat(5-p.rating)}</div>
            </div>
            <p className="text-sm text-stone-600">{t(p.predictionMr, p.predictionEn)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashaSection({ interp }: { interp: DashaInterpData | null }) {
  const { t } = useLang();
  if (!interp) return <p className="text-stone-500">{t("सध्याची दशा माहिती उपलब्ध नाही.","Current dasha info not available.")}</p>;
  return (
    <div>
      <h2 className="text-lg font-bold text-stone-800 mb-2">{t(`चालू ${interp.lordMr} महादशा फल`,`Current ${interp.lordEn} Mahadasha`)}</h2>
      <p className="text-sm text-stone-500 mb-4">{t(interp.periodMr, interp.periodEn)}</p>
      <div className="space-y-4">
        {[
          { mr: "करिअर / व्यवसाय", en: "Career", valMr: interp.careerMr, valEn: interp.careerEn },
          { mr: "आर्थिक / धन", en: "Finance", valMr: interp.financeMr, valEn: interp.financeEn },
          { mr: "आरोग्य", en: "Health", valMr: interp.healthMr, valEn: interp.healthEn },
          { mr: "संबंध / कुटुंब", en: "Relationships", valMr: interp.relationshipMr, valEn: interp.relationshipEn },
        ].map((area, i) => (
          <div key={i} className="border-b border-stone-100 pb-3 print-avoid-break">
            <h4 className="text-sm font-bold text-stone-800 mb-1">{t(area.mr, area.en)}</h4>
            <p className="text-sm text-stone-600">{t(area.valMr, area.valEn)}</p>
          </div>
        ))}
        <div className="bg-[#FFF8E7] rounded-xl p-4 border border-[#d4a843]/20">
          <h4 className="text-sm font-bold text-[#3d0c0c] mb-1">{t("उपाय व सल्ला","Remedies & Advice")}</h4>
          <p className="text-sm">{t(interp.adviceMr, interp.adviceEn)}</p>
        </div>
      </div>
    </div>
  );
}

function TimelineSection({ dashas }: { dashas: DashaData[] }) {
  const { t, lang } = useLang();
  const [expanded, setExpanded] = useState<number | null>(null);
  const locale = lang === "mr" ? "mr-IN" : "en-IN";
  const n = (v: string | number) => lang === "mr" ? toMr(v) : String(v);
  return (
    <div>
      <h2 className="text-lg font-bold text-stone-800 mb-4">{t("विंशोत्तरी दशा कालावधी","Vimshottari Dasha Timeline")}</h2>
      <div className="space-y-2">
        {dashas.map((d, i) => {
          const start = new Date(d.startDate);
          const end = new Date(d.endDate);
          const now = new Date();
          const isCurrent = now >= start && now <= end;
          const isOpen = expanded === i;
          return (
            <div key={i}>
              <button onClick={() => setExpanded(isOpen ? null : i)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-all ${isCurrent ? "bg-[#FFF8E7] border-2 border-[#d4a843]" : "bg-stone-50 hover:bg-stone-100"}`}>
                <div className="flex items-center gap-3">
                  {isCurrent && <span className="text-xs bg-[#5c1a1a] text-white px-2 py-0.5 rounded-full">{t("चालू","Current")}</span>}
                  <span className="font-bold text-stone-800">{t(PLANET_LORD_MR[d.lord]||d.lord, d.lord)} {t("महादशा","Mahadasha")}</span>
                  <span className="text-xs text-stone-400">{isOpen ? "▲" : "▼"}</span>
                </div>
                <div className="text-right text-sm text-stone-600">
                  <p>{start.toLocaleDateString(locale)} — {end.toLocaleDateString(locale)}</p>
                  <p className="text-xs">{n(d.years.toFixed(1))} {t("वर्षे","years")}</p>
                </div>
              </button>
              {/* Antardasha sub-periods */}
              {isOpen && d.antardashas && (
                <div className="ml-6 mt-1 mb-2 space-y-1">
                  {d.antardashas.map((ad, j) => {
                    const adStart = new Date(ad.startDate);
                    const adEnd = new Date(ad.endDate);
                    const adCurrent = now >= adStart && now <= adEnd;
                    return (
                      <div key={j} className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs ${adCurrent ? "bg-[#FFF3D6] border border-[#d4a843]" : "bg-white border border-stone-100"}`}>
                        <div className="flex items-center gap-2">
                          {adCurrent && <span className="w-1.5 h-1.5 rounded-full bg-[#d4a843]" />}
                          <span className="font-semibold text-stone-700">{t(PLANET_LORD_MR[ad.lord]||ad.lord, ad.lord)}</span>
                          <span className="text-stone-400">{t("अंतर्दशा","Antardasha")}</span>
                        </div>
                        <div className="text-right text-stone-500">
                          <span>{adStart.toLocaleDateString(locale)} — {adEnd.toLocaleDateString(locale)}</span>
                          <span className="ml-2 text-stone-400">({n(ad.years.toFixed(2))} {t("वर्षे","yr")})</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PrintTimelineMahadashas({ dashas }: { dashas: DashaData[] }) {
  const { t, lang } = useLang();
  const locale = lang === "mr" ? "mr-IN" : "en-IN";
  const n = (v: string | number) => lang === "mr" ? toMr(v) : String(v);
  const now = new Date();
  return (
    <div>
      <h2 className="text-lg font-bold text-stone-800 mb-4">{t("विंशोत्तरी दशा कालावधी","Vimshottari Dasha Timeline")}</h2>
      <div className="space-y-2">
        {dashas.map((d, i) => {
          const start = new Date(d.startDate);
          const end = new Date(d.endDate);
          const isCurrent = now >= start && now <= end;
          return (
            <div key={i} className={`p-3 rounded-xl ${isCurrent ? "bg-[#FFF8E7] border-2 border-[#d4a843]" : "bg-stone-50"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isCurrent && <span className="text-xs bg-[#5c1a1a] text-white px-2 py-0.5 rounded-full">{t("चालू","Current")}</span>}
                  <span className="font-bold text-stone-800">{t(PLANET_LORD_MR[d.lord]||d.lord, d.lord)} {t("महादशा","Mahadasha")}</span>
                </div>
                <div className="text-right text-sm text-stone-600">
                  <p>{start.toLocaleDateString(locale)} — {end.toLocaleDateString(locale)}</p>
                  <p className="text-xs">{n(d.years.toFixed(1))} {t("वर्षे","years")}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PrintTimelineAntardashas({ dashas }: { dashas: DashaData[] }) {
  const { t, lang } = useLang();
  const locale = lang === "mr" ? "mr-IN" : "en-IN";
  const n = (v: string | number) => lang === "mr" ? toMr(v) : String(v);
  const now = new Date();
  const currentDasha = dashas.find(d => now >= new Date(d.startDate) && now <= new Date(d.endDate));
  if (!currentDasha || !currentDasha.antardashas) return null;
  return (
    <div>
      <h2 className="text-lg font-bold text-stone-800 mb-2">{t("चालू","Current")} {t(PLANET_LORD_MR[currentDasha.lord]||currentDasha.lord, currentDasha.lord)} {t("महादशा — अंतर्दशा","Mahadasha — Antardashas")}</h2>
      <p className="text-sm text-stone-500 mb-4">{new Date(currentDasha.startDate).toLocaleDateString(locale)} — {new Date(currentDasha.endDate).toLocaleDateString(locale)}</p>
      <div className="space-y-1">
        {currentDasha.antardashas.map((ad, j) => {
          const adStart = new Date(ad.startDate);
          const adEnd = new Date(ad.endDate);
          const adCurrent = now >= adStart && now <= adEnd;
          return (
            <div key={j} className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs ${adCurrent ? "bg-[#FFF3D6] border border-[#d4a843]" : "bg-white border border-stone-100"}`}>
              <div className="flex items-center gap-2">
                {adCurrent && <span className="w-1.5 h-1.5 rounded-full bg-[#d4a843]" />}
                <span className="font-semibold text-stone-700">{t(PLANET_LORD_MR[ad.lord]||ad.lord, ad.lord)}</span>
                <span className="text-stone-400">{t("अंतर्दशा","Antardasha")}</span>
              </div>
              <div className="text-right text-stone-500">
                <span>{adStart.toLocaleDateString(locale)} — {adEnd.toLocaleDateString(locale)}</span>
                <span className="ml-2 text-stone-400">({n(ad.years.toFixed(2))} {t("वर्षे","yr")})</span>
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
    <div>
      <h2 className="text-lg font-bold text-stone-800 mb-4">{t("उपाय व रत्न सुचना","Remedies & Recommendations")}</h2>
      <div className="space-y-6">
        {remedies.map((r, i) => (
          <div key={i} className="print-avoid-break">
            <h3 className="font-bold text-sm text-stone-900 mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-[#d4a843] rounded-full" />
              {t(r.categoryMr, r.categoryEn)}
            </h3>
            <div className="ml-4 space-y-2">
              {r.items.map((item, j) => (
                <div key={j} className="bg-[#FFF8E7] rounded-lg p-3">
                  <p className="text-sm text-stone-700">{t(item.mr, item.en)}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-4">
        <p className="text-xs text-slate-700">
          {t("सूचना: रत्न धारण करण्यापूर्वी अनुभवी ज्योतिषाचा सल्ला अवश्य घ्या.","Note: Always consult an experienced astrologer before wearing gemstones.")}
        </p>
      </div>
    </div>
  );
}
