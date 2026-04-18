"use client";

import { useState } from "react";
import { useLang } from "@/lib/astrology/language-context";

interface PlanetData { id: string; nameMr: string; name: string; rashi: string; rashiMr: string; house: number; isRetrograde: boolean; }
interface KundliSummary { lagnaRashi: string; lagnaRashiMr: string; moonRashi: string; moonRashiMr: string; moonNakshatra: string; moonNakshatraMr: string; planets: PlanetData[]; }

export default function ComparePageClient() {
  const { t, lang } = useLang();
  const [kundli1, setKundli1] = useState<KundliSummary | null>(null);
  const [kundli2, setKundli2] = useState<KundliSummary | null>(null);
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [loading, setLoading] = useState<1 | 2 | null>(null);

  // Simple form fields
  const [form1, setForm1] = useState({ year: "", month: "", day: "", hour: "12", minute: "0", lat: "18.52", lng: "73.85" });
  const [form2, setForm2] = useState({ year: "", month: "", day: "", hour: "12", minute: "0", lat: "18.52", lng: "73.85" });

  async function fetchKundli(form: typeof form1, setResult: (k: KundliSummary) => void, which: 1 | 2) {
    setLoading(which);
    try {
      const res = await fetch("/api/kundli", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: +form.year, month: +form.month, day: +form.day, hour: +form.hour, minute: +form.minute, latitude: +form.lat, longitude: +form.lng, timezone: 5.5 }),
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch { /* silent */ }
    setLoading(null);
  }

  function PersonForm({ form, setForm, name, setName, onSubmit, which }: { form: typeof form1; setForm: (f: typeof form1) => void; name: string; setName: (n: string) => void; onSubmit: () => void; which: 1 | 2 }) {
    return (
      <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-3">
        <input type="text" placeholder={t("नाव", "Name", "नाम")} value={name} onChange={e => setName(e.target.value)} className="w-full min-h-[44px] px-3 py-2 border border-gray-300 rounded-lg text-base" autoComplete="name" />
        <div className="grid grid-cols-3 gap-2">
          <input type="number" placeholder="DD" value={form.day} onChange={e => setForm({ ...form, day: e.target.value })} className="min-h-[44px] px-3 py-2 border border-gray-300 rounded-lg text-base" />
          <input type="number" placeholder="MM" value={form.month} onChange={e => setForm({ ...form, month: e.target.value })} className="min-h-[44px] px-3 py-2 border border-gray-300 rounded-lg text-base" />
          <input type="number" placeholder="YYYY" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} className="min-h-[44px] px-3 py-2 border border-gray-300 rounded-lg text-base" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <input type="number" placeholder={t("तास", "Hour", "घंटा")} value={form.hour} onChange={e => setForm({ ...form, hour: e.target.value })} className="min-h-[44px] px-3 py-2 border border-gray-300 rounded-lg text-base" />
          <input type="number" placeholder={t("मिनिटे", "Min", "मिनट")} value={form.minute} onChange={e => setForm({ ...form, minute: e.target.value })} className="min-h-[44px] px-3 py-2 border border-gray-300 rounded-lg text-base" />
        </div>
        <button onClick={onSubmit} disabled={loading === which || !form.year} className="w-full min-h-[44px] py-2.5 rounded-lg text-sm font-bold text-white disabled:opacity-50" style={{ background: "linear-gradient(135deg, #5c1a1a, #3d0c0c)" }}>
          {loading === which ? t("गणना...", "Calculating...", "गणना...") : t("कुंडली बनवा", "Generate", "कुंडली बनाएँ")}
        </button>
      </div>
    );
  }

  const PLANET_MR: Record<string, string> = { Sun: "सूर्य", Moon: "चंद्र", Mars: "मंगळ", Mercury: "बुध", Jupiter: "गुरु", Venus: "शुक्र", Saturn: "शनि", Rahu: "राहु", Ketu: "केतु" };

  return (
    <div className="bg-[#FAFAF8] py-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">{t("कुंडली तुलना", "Kundli Comparison", "कुंडली तुलना")}</h1>
          <p className="text-gray-600 mt-2 text-sm">{t("दोन कुंडल्या शेजारी पहा — पती-पत्नी, पालक-मूल", "View two charts side-by-side — husband-wife, parent-child", "दो कुंडलियाँ साथ-साथ देखें — पति-पत्नी, माता-पिता-बच्चा")}</p>
        </div>

        {/* Input Forms */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-bold mb-2" style={{ color: "#3d0c0c" }}>{t("पहिली कुंडली", "First Kundli", "पहली कुंडली")}</h3>
            <PersonForm form={form1} setForm={setForm1} name={name1} setName={setName1} which={1} onSubmit={() => fetchKundli(form1, setKundli1, 1)} />
          </div>
          <div>
            <h3 className="text-sm font-bold mb-2" style={{ color: "#3d0c0c" }}>{t("दुसरी कुंडली", "Second Kundli", "दूसरी कुंडली")}</h3>
            <PersonForm form={form2} setForm={setForm2} name={name2} setName={setName2} which={2} onSubmit={() => fetchKundli(form2, setKundli2, 2)} />
          </div>
        </div>

        {/* Comparison Table */}
        {kundli1 && kundli2 && (
          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm overflow-x-auto">
            <div className="min-w-[480px]">
            <div className="grid grid-cols-3 text-center text-sm font-bold py-3" style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)", color: "#d4a843" }}>
              <div>{t("ग्रह", "Planet", "ग्रह")}</div>
              <div>{name1 || t("पहिली", "First", "पहली")}</div>
              <div>{name2 || t("दुसरी", "Second", "दूसरी")}</div>
            </div>

            {/* Lagna */}
            <div className="grid grid-cols-3 text-center text-sm py-2 border-b border-stone-100 bg-[#FFF8E7]">
              <div className="font-bold" style={{ color: "#5c1a1a" }}>{t("लग्न", "Lagna", "लग्न")}</div>
              <div>{t(kundli1.lagnaRashiMr, kundli1.lagnaRashi, kundli1.lagnaRashiMr)}</div>
              <div>{t(kundli2.lagnaRashiMr, kundli2.lagnaRashi, kundli2.lagnaRashiMr)}</div>
            </div>

            {/* Moon */}
            <div className="grid grid-cols-3 text-center text-sm py-2 border-b border-stone-100">
              <div className="font-bold" style={{ color: "#5c1a1a" }}>{t("चंद्र राशी", "Moon Sign", "चंद्र राशि")}</div>
              <div>{t(kundli1.moonRashiMr, kundli1.moonRashi, kundli1.moonRashiMr)}</div>
              <div>{t(kundli2.moonRashiMr, kundli2.moonRashi, kundli2.moonRashiMr)}</div>
            </div>

            {/* Nakshatra */}
            <div className="grid grid-cols-3 text-center text-sm py-2 border-b border-stone-100 bg-[#FFF8E7]">
              <div className="font-bold" style={{ color: "#5c1a1a" }}>{t("नक्षत्र", "Nakshatra", "नक्षत्र")}</div>
              <div>{t(kundli1.moonNakshatraMr, kundli1.moonNakshatra, kundli1.moonNakshatraMr)}</div>
              <div>{t(kundli2.moonNakshatraMr, kundli2.moonNakshatra, kundli2.moonNakshatraMr)}</div>
            </div>

            {/* Planets */}
            {kundli1.planets.map((p1, i) => {
              const p2 = kundli2.planets[i];
              const sameRashi = p1.rashi === p2?.rashi;
              return (
                <div key={i} className={`grid grid-cols-3 text-center text-xs py-2 border-b border-stone-50 ${i % 2 === 0 ? "" : "bg-stone-50/50"}`}>
                  <div className="font-semibold">{t(PLANET_MR[p1.id] || p1.id, p1.id)}</div>
                  <div>{t(p1.rashiMr, p1.rashi)} (H{p1.house}){p1.isRetrograde ? t(" व","R") : ""}</div>
                  <div style={{ color: sameRashi ? "#2d6b2d" : "inherit" }}>
                    {p2 ? `${t(p2.rashiMr, p2.rashi)} (H${p2.house})${p2.isRetrograde ? t(" व","R") : ""}` : "—"}
                    {sameRashi && " ●"}
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
