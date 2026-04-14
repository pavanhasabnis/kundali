"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
interface KundliData {
  lagnaRashiMr: string; lagnaRashi: string; lagnaDMS: string; lagnaNakshatraMr: string; lagnaNakshatra: string;
  moonRashiMr: string; moonRashi: string; moonNakshatraMr: string; moonNakshatra: string; moonNakshatraLord: string; moonPada: number; ayanamsa: number;
  planets: PlanetData[]; dashas: DashaData[];
  analysis: { planetaryStrength: PlanetStrengthData[]; yogas: YogaData[]; doshas: DoshaData[]; housePredictions: HousePredictionData[]; currentDasha: DashaInterpData | null; remedies: RemedyData[]; };
  divisionalCharts: DivisionalChartData[];
}

const PLANET_LORD_MR: Record<string, string> = { Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगळ", Mercury: "बुध", Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु" };

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

function KundliResultContent() {
  const { t, lang } = useLang();
  const searchParams = useSearchParams();
  const [result, setResult] = useState<KundliData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all-charts");

  const name = searchParams.get("name") || "";

  useEffect(() => {
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
      } catch {
        setError(t("कुंडली गणना करताना त्रुटी आली.", "Error calculating Kundli."));
      } finally {
        setLoading(false);
      }
    }
    fetchKundli();
  }, [searchParams, t]);

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
              {name ? `${name} — ` : ""}{t("कुंडली", "Kundli")}
            </h1>
            <div className="flex gap-2">
              {/* Save Kundli */}
              <button onClick={() => {
                const saved = JSON.parse(localStorage.getItem("savedKundlis") || "[]");
                const entry = { name: name || t("कुंडली", "Kundli"), date: new Date().toISOString(), params: Object.fromEntries(searchParams.entries()) };
                // Avoid duplicates by name+params
                const exists = saved.findIndex((s: { name: string }) => s.name === entry.name);
                if (exists >= 0) saved[exists] = entry; else saved.push(entry);
                localStorage.setItem("savedKundlis", JSON.stringify(saved));
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
              {activeTab === "all-charts" && <AllChartsGrid planets={result.planets} divisionalCharts={result.divisionalCharts} />}
              {activeTab === "chart" && <ChartSection planets={result.planets} />}
              {activeTab === "chandra" && <DivisionalChartSection chart={findChart(result.divisionalCharts, "chandra")} description={t("चंद्र कुंडलीमध्ये भाव चंद्राच्या राशीपासून मोजले जातात. हे मानसिक स्थिती, भावना आणि लोकप्रियता दर्शवते.","In Chandra Kundli, houses are counted from Moon sign. It shows mental disposition, emotions, and public image.")} />}
              {activeTab === "navamsha" && <DivisionalChartSection chart={findChart(result.divisionalCharts, "navamsha")} description={t("नवमांश कुंडली विवाह, भाग्य आणि आध्यात्मिक प्रगती दर्शवते. हा सर्वात महत्त्वाचा वर्ग चार्ट आहे.","Navamsha chart reveals marriage, fortune, and spiritual progress. This is the most important divisional chart.")} />}
              {activeTab === "bhav-chalit" && <DivisionalChartSection chart={findChart(result.divisionalCharts, "bhav-chalit")} description={t("भाव चलित कुंडलीमध्ये ग्रह भाव मध्यबिंदूनुसार स्थानांतरित होऊ शकतात. भविष्यवाणीसाठी हे अधिक अचूक आहे.","In Bhav Chalit, planets may shift houses based on cusp midpoints. This is more accurate for predictions.")} />}
              {activeTab === "dashamsha" && <DivisionalChartSection chart={findChart(result.divisionalCharts, "dashamsha")} description={t("दशमांश कुंडली करिअर, व्यवसाय आणि सामाजिक स्थान दर्शवते.","Dashamsha chart shows career, profession, and social standing.")} />}
              {activeTab === "saptamsha" && <DivisionalChartSection chart={findChart(result.divisionalCharts, "saptamsha")} description={t("सप्तांश कुंडली संतती, मुलांचे भाग्य आणि सृजनशीलता दर्शवते.","Saptamsha chart reveals children, progeny fortune, and creativity.")} />}
              {activeTab === "dwadashamsha" && <DivisionalChartSection chart={findChart(result.divisionalCharts, "dwadashamsha")} description={t("द्वादशांश कुंडली आई-वडील, पूर्वज आणि वंशपरंपरा दर्शवते.","Dwadashamsha chart shows parents, ancestors, and lineage.")} />}
              {activeTab === "shodashamsha" && <DivisionalChartSection chart={findChart(result.divisionalCharts, "shodashamsha")} description={t("षोडशांश कुंडली वाहने, संपत्ती आणि भौतिक सुखसोयी दर्शवते.","Shodashamsha chart reveals vehicles, property, and material comforts.")} />}
              {activeTab === "trimshamsha" && <DivisionalChartSection chart={findChart(result.divisionalCharts, "trimshamsha")} description={t("त्रिंशांश कुंडली अरिष्ट, संकट आणि दुर्दैवी घटना दर्शवते.","Trimshamsha chart indicates misfortunes, calamities, and adversities.")} />}
              {activeTab === "planets" && <PlanetTable planets={result.planets} />}
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
                <p className="text-[10px] tracking-[0.15em] shrink-0" style={{ color: "rgba(139,44,44,0.3)" }}>वेंकटेश ज्योतिष पत्रिका</p>
                <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(212,168,67,0.2), transparent)" }} />
              </div>
            </div>

            {/* Page curl / bottom edge shadow */}
            <div className="h-1" style={{ background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.04))" }} />
          </div>
        </div>
      </div>

      {/* ─── Print-only: renders ALL sections so full kundli prints ─── */}
      <div className="print-only">
        {/* Print Header */}
        <div className="text-center mb-4" style={{ borderBottom: "2px solid #8b2c2c", paddingBottom: 12 }}>
          <p className="text-xs tracking-[0.15em]" style={{ color: "#8b2c2c" }}>॥ श्री गणेशाय नमः ॥</p>
          <h1 className="text-xl font-bold mt-1" style={{ color: "#3d0c0c" }}>
            {name ? `${name} — ` : ""}{t("कुंडली पत्रिका", "Kundli Patrika")}
          </h1>
          <div className="flex justify-center gap-6 mt-2 text-sm">
            <span><strong>{t("लग्न", "Asc")}:</strong> {t(result.lagnaRashiMr, result.lagnaRashi)}</span>
            <span><strong>{t("राशी", "Moon")}:</strong> {t(result.moonRashiMr, result.moonRashi)}</span>
            <span><strong>{t("नक्षत्र", "Nak")}:</strong> {t(result.moonNakshatraMr, result.moonNakshatra)}</span>
          </div>
        </div>

        {/* All Charts */}
        <AllChartsGrid planets={result.planets} divisionalCharts={result.divisionalCharts} />

        {/* Planet Positions */}
        <div className="print-page-break">
          <PlanetTable planets={result.planets} />
        </div>

        {/* Planet Strength */}
        <div className="print-page-break">
          <StrengthSection strengths={result.analysis.planetaryStrength} />
        </div>

        {/* Yogas */}
        <div className="print-page-break">
          <YogaSection yogas={result.analysis.yogas} />
        </div>

        {/* Doshas */}
        <div className="print-page-break">
          <DoshaSection doshas={result.analysis.doshas} />
        </div>

        {/* Predictions */}
        <div className="print-page-break">
          <PredictionSection predictions={result.analysis.housePredictions} />
        </div>

        {/* Current Dasha */}
        <div className="print-page-break">
          <DashaSection interp={result.analysis.currentDasha} />
        </div>

        {/* Dasha Timeline */}
        <div className="print-page-break">
          <PrintTimelineSection dashas={result.dashas} />
        </div>

        {/* Remedies */}
        <div className="print-page-break">
          <RemedySection remedies={result.analysis.remedies} />
        </div>

        {/* Print Footer */}
        <div className="text-center mt-8 pt-4" style={{ borderTop: "1px solid rgba(212,168,67,0.3)" }}>
          <p className="text-xs" style={{ color: "rgba(139,44,44,0.4)" }}>वेंकटेश ज्योतिष पत्रिका</p>
        </div>
      </div>
    </div>
  );
}

export default function KundliResultPage() {
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

function NorthIndianChartSVG({ houseMap, label }: { houseMap: Record<number, { id: string; nameMr: string; name?: string; isRetrograde: boolean }[]>; label?: string }) {
  const { t } = useLang();

  const zones = [
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

  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-md" style={{ background: '#fafaf8', border: '2px solid #8b2c2c' }}>
      <line x1="100" y1="0" x2="100" y2="300" stroke="#8b2c2c" strokeWidth="1" />
      <line x1="200" y1="0" x2="200" y2="300" stroke="#8b2c2c" strokeWidth="1" />
      <line x1="0" y1="100" x2="300" y2="100" stroke="#8b2c2c" strokeWidth="1" />
      <line x1="0" y1="200" x2="300" y2="200" stroke="#8b2c2c" strokeWidth="1" />
      <line x1="0" y1="0" x2="40" y2="40" stroke="#8b2c2c" strokeWidth="1" />
      <line x1="60" y1="60" x2="150" y2="150" stroke="#8b2c2c" strokeWidth="1" />
      <line x1="300" y1="0" x2="260" y2="40" stroke="#8b2c2c" strokeWidth="1" />
      <line x1="240" y1="60" x2="150" y2="150" stroke="#8b2c2c" strokeWidth="1" />
      <line x1="0" y1="300" x2="40" y2="260" stroke="#8b2c2c" strokeWidth="1" />
      <line x1="60" y1="240" x2="150" y2="150" stroke="#8b2c2c" strokeWidth="1" />
      <line x1="300" y1="300" x2="260" y2="260" stroke="#8b2c2c" strokeWidth="1" />
      <line x1="240" y1="240" x2="150" y2="150" stroke="#8b2c2c" strokeWidth="1" />
      {zones.map((z) => {
        const pl = houseMap[z.id] || [];
        const isCorner = [2, 5, 7, 10].includes(z.id);
        const fs = pl.length >= 3 ? 9 : isCorner ? 9 : 11;
        const lh = pl.length >= 3 ? 11 : isCorner ? 11 : 13;
        return (
          <foreignObject key={z.id} x={z.x} y={z.y} width={z.w} height={z.h}>
            <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent: (z.id===5||z.id===7)?'flex-end':(z.id===2||z.id===10)?'flex-start':'center', overflow:'hidden' }}>
              {z.id === 1 && label && <span style={{color:'#dc2626',fontWeight:'bold',fontSize:10,lineHeight:1}}>{label}</span>}
              {pl.map((p) => (
                <span key={p.id} style={{ fontSize:fs, fontWeight:'bold', lineHeight:`${lh}px`, color:p.isRetrograde?'#dc2626':'#1f2937', whiteSpace:'nowrap' }}>
                  {t(p.nameMr, p.name || p.id)}{p.isRetrograde ? t("(व)","(R)") : ""}
                </span>
              ))}
            </div>
          </foreignObject>
        );
      })}
    </svg>
  );
}

// ─── Sub Components ─────────────────────────────────────────────

function DivisionalChartSection({ chart, description }: { chart: DivisionalChartData | null; description: string }) {
  const { t } = useLang();

  if (!chart) return <p className="text-stone-500">{t("चार्ट उपलब्ध नाही","Chart not available")}</p>;

  const houseMap: Record<number, ChartPlanetData[]> = {};
  for (let i = 1; i <= 12; i++) houseMap[i] = [];
  chart.planets.forEach((p) => { if (houseMap[p.house]) houseMap[p.house].push(p); });

  return (
    <div>
      <h2 className="text-lg font-bold text-stone-800 mb-1">{t(chart.nameMr, chart.name)}</h2>
      <p className="text-sm text-stone-500 mb-4">{description}</p>
      <div className="flex justify-center mb-6">
        <NorthIndianChartSVG houseMap={houseMap} label={chart.id === "chandra" ? t("चंद्र","Moon") : undefined} />
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
                <td className="py-2 px-3 text-center">{p.house}</td>
                <td className="py-2 px-3 text-center">{p.isRetrograde ? t("वक्री","R") : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AllChartsGrid({ planets, divisionalCharts }: { planets: PlanetData[]; divisionalCharts: DivisionalChartData[] }) {
  const { t } = useLang();

  // Build house maps for each chart
  const buildHouseMap = (planetList: { id: string; nameMr: string; name?: string; house: number; isRetrograde: boolean }[]) => {
    const map: Record<number, typeof planetList> = {};
    for (let i = 1; i <= 12; i++) map[i] = [];
    planetList.forEach((p) => { if (map[p.house]) map[p.house].push(p); });
    return map;
  };

  // Lagna chart house map
  const lagnaMap = buildHouseMap(planets);

  // All charts: lagna + 8 divisional
  const allCharts = [
    { id: "lagna", name: t("लग्न कुंडली", "Lagna Kundli"), houseMap: lagnaMap, label: t("लग्न", "Asc") },
    ...divisionalCharts.map(c => ({
      id: c.id,
      name: t(c.nameMr, c.name),
      houseMap: buildHouseMap(c.planets),
      label: c.id === "chandra" ? t("चंद्र", "Moon") : undefined,
    })),
  ];

  return (
    <div>
      <h2 className="text-lg font-bold text-stone-800 mb-6">{t("सर्व कुंडली चार्ट", "All Kundli Charts")}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allCharts.map((chart) => (
          <div key={chart.id} className="text-center print-avoid-break">
            <h3 className="text-sm font-bold mb-2" style={{ color: "#3d0c0c" }}>{chart.name}</h3>
            <NorthIndianChartSVG houseMap={chart.houseMap} label={chart.label} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartSection({ planets }: { planets: PlanetData[] }) {
  const { t } = useLang();
  const houseMap: Record<number, PlanetData[]> = {};
  for (let i = 1; i <= 12; i++) houseMap[i] = [];
  planets.forEach((p) => { if (houseMap[p.house]) houseMap[p.house].push(p); });

  return (
    <div>
      <h2 className="text-lg font-bold text-stone-800 mb-4">{t("लग्न कुंडली", "Birth Chart (North Indian)")}</h2>
      <div className="flex justify-center">
        <NorthIndianChartSVG houseMap={houseMap} label={t("लग्न","Asc")} />
      </div>
    </div>
  );
}

function PlanetTable({ planets }: { planets: PlanetData[] }) {
  const { t } = useLang();
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
              <th className="text-center py-2 px-3">{t("पद","Pada")}</th>
              <th className="text-center py-2 px-3">{t("भाव","House")}</th>
              <th className="text-center py-2 px-3">{t("वक्री","Retro")}</th>
            </tr>
          </thead>
          <tbody>
            {planets.map((p) => (
              <tr key={p.id} className="border-b border-gray-100 hover:bg-[#FFF8E7]">
                <td className="py-2 px-3 font-semibold">{t(p.nameMr, p.name||p.id)}</td>
                <td className="py-2 px-3">{t(p.rashiMr, p.rashi)}</td>
                <td className="py-2 px-3 font-mono text-xs">{p.degreeDMS}</td>
                <td className="py-2 px-3">{t(p.nakshatraMr, p.nakshatra)}</td>
                <td className="py-2 px-3 text-center">{p.pada}</td>
                <td className="py-2 px-3 text-center">{p.house}</td>
                <td className="py-2 px-3 text-center">{p.isRetrograde ? t("वक्री","R") : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StrengthSection({ strengths }: { strengths: PlanetStrengthData[] }) {
  const { t } = useLang();
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
                <td className="py-2 px-3 text-center">{s.house}</td>
                <td className="py-2 px-3 text-center">{s.strengthScore}%</td>
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
  const { t } = useLang();
  return (
    <div>
      <h2 className="text-lg font-bold text-stone-800 mb-4">{t("भावनिहाय भविष्यकथन","House-wise Predictions")}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {predictions.map((p) => (
          <div key={p.house} className="border border-stone-200 rounded-xl p-4 hover:shadow-md transition-shadow print-avoid-break">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded bg-[#FFF8E7] text-[#5c1a1a] text-xs font-bold flex items-center justify-center">{p.house}</span>
                <h4 className="font-bold text-sm">{t(`${p.house}वा भाव`,`House ${p.house}`)} — {t(p.titleMr, p.titleEn)}</h4>
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
                  <p className="text-xs">{d.years.toFixed(1)} {t("वर्षे","years")}</p>
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
                          <span className="ml-2 text-stone-400">({ad.years.toFixed(2)} {t("वर्षे","yr")})</span>
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

function PrintTimelineSection({ dashas }: { dashas: DashaData[] }) {
  const { t, lang } = useLang();
  const locale = lang === "mr" ? "mr-IN" : "en-IN";
  const now = new Date();
  return (
    <div>
      <h2 className="text-lg font-bold text-stone-800 mb-4">{t("विंशोत्तरी दशा कालावधी","Vimshottari Dasha Timeline")}</h2>
      <div className="space-y-3">
        {dashas.map((d, i) => {
          const start = new Date(d.startDate);
          const end = new Date(d.endDate);
          const isCurrent = now >= start && now <= end;
          return (
            <div key={i} className="print-avoid-break">
              <div className={`p-3 rounded-xl ${isCurrent ? "bg-[#FFF8E7] border-2 border-[#d4a843]" : "bg-stone-50"}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isCurrent && <span className="text-xs bg-[#5c1a1a] text-white px-2 py-0.5 rounded-full">{t("चालू","Current")}</span>}
                    <span className="font-bold text-stone-800">{t(PLANET_LORD_MR[d.lord]||d.lord, d.lord)} {t("महादशा","Mahadasha")}</span>
                  </div>
                  <div className="text-right text-sm text-stone-600">
                    <p>{start.toLocaleDateString(locale)} — {end.toLocaleDateString(locale)}</p>
                    <p className="text-xs">{d.years.toFixed(1)} {t("वर्षे","years")}</p>
                  </div>
                </div>
              </div>
              {isCurrent && d.antardashas && (
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
