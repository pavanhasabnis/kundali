"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/lib/astrology/language-context";
import { formatDateTimeMarathi, getMarathiPeriod } from "@/lib/astrology/time-format";

interface PlanetPos { id: string; name: string; nameMr: string; rashi: string; rashiMr: string; degreeDMS: string; nakshatra: string; nakshatraMr: string; house: number; isRetrograde: boolean; }

const RASHI_SYMBOL: Record<string, string> = {
  "मेष": "♈", "वृषभ": "♉", "मिथुन": "♊", "कर्क": "♋", "सिंह": "♌", "कन्या": "♍",
  "तुला": "♎", "वृश्चिक": "♏", "धनु": "♐", "मकर": "♑", "कुंभ": "♒", "मीन": "♓",
};

export default function CurrentPlanetsPage() {
  const { t, lang } = useLang();
  const [planets, setPlanets] = useState<PlanetPos[] | null>(null);
  const [lagnaRashi, setLagnaRashi] = useState("");
  const [lagnaRashiMr, setLagnaRashiMr] = useState("");
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState("");

  useEffect(() => {
    async function fetchCurrent() {
      const now = new Date();
      setTime(formatDateTimeMarathi(now, lang));

      try {
        const res = await fetch("/api/kundli", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate(),
            hour: now.getHours(), minute: now.getMinutes(),
            latitude: 18.5204, longitude: 73.8567, timezone: 5.5,
          }),
        });
        if (res.ok) {
          const data = await res.json();
          setPlanets(data.planets);
          setLagnaRashi(data.lagnaRashi);
          setLagnaRashiMr(data.lagnaRashiMr);
        }
      } catch { /* silent */ }
      setLoading(false);
    }

    fetchCurrent();

    // Auto-refresh every 60 seconds — planets move in real time
    const interval = setInterval(fetchCurrent, 60000);
    return () => clearInterval(interval);
  }, [lang]);

  // Live clock — updates every second
  const [liveClock, setLiveClock] = useState("");
  useEffect(() => {
    const digits = "०१२३४५६७८९";
    const toD = (n: number) => String(n).padStart(2, "0").split("").map(c => digits[parseInt(c)] || c).join("");
    const tick = () => {
      const now = new Date();
      if (lang === "mr") {
        setLiveClock(`${getMarathiPeriod(now.getHours())} ${toD(now.getHours() % 12 || 12)}:${toD(now.getMinutes())}:${toD(now.getSeconds())}`);
      } else {
        setLiveClock(now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
      }
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lang]);

  const dateStr = new Date().toLocaleDateString(lang === "mr" ? "mr-IN" : "en-IN", { year: "numeric", month: "long", day: "numeric", weekday: "long" });

  return (
    <div className="bg-[#FAFAF8] py-6">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">{t("आत्ताचे ग्रह स्थिती", "Current Planet Positions")}</h1>
          <p className="text-gray-600 mt-2">{t("सध्या आकाशातील सर्व ९ ग्रहांची वास्तविक स्थिती", "Real-time positions of all 9 planets in the sky right now")}</p>
        </div>

        {/* Time Display */}
        <div className="text-center p-4 rounded-xl relative" style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)" }}>
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-bold text-red-400">LIVE</span>
          </div>
          <p className="text-sm" style={{ color: "#d4a843" }}>{dateStr}</p>
          <p className="text-3xl font-bold text-white mt-1 font-mono tracking-wider">{liveClock}</p>
          <p className="text-xs text-white/40 mt-1">IST | {t("दर ६० सेकंदांनी ग्रह स्थिती अपडेट होते", "Planet positions update every 60 seconds")}</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-3 border-[#f0c040]/30 border-t-[#8b2c2c] rounded-full animate-spin mx-auto" />
            <p className="text-sm text-stone-500 mt-3">{t("ग्रह स्थिती गणना चालू...", "Calculating planet positions...")}</p>
          </div>
        ) : planets ? (
          <>
            {/* Lagna */}
            <div className="bg-white rounded-xl border border-stone-200 p-4 text-center">
              <p className="text-xs text-stone-400 uppercase">{t("सध्याचे लग्न (उदय राशी)", "Current Ascendant (Rising Sign)")}</p>
              <p className="text-2xl font-bold mt-1" style={{ color: "#5c1a1a" }}>
                {RASHI_SYMBOL[lagnaRashiMr] || ""} {t(lagnaRashiMr, lagnaRashi)}
              </p>
            </div>

            {/* Planet Table */}
            <div className="flex items-center justify-between mb-1 px-1">
              <p className="text-xs text-stone-400">{t("शेवटचे अपडेट:", "Last updated:")} {time}</p>
              <p className="text-[10px] text-stone-300">{t("पुढील अपडेट ६० सेकंदांत", "Next update in 60s")}</p>
            </div>
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
              <div className="grid grid-cols-5 text-xs font-bold py-3 px-4 text-white" style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)" }}>
                <div>{t("ग्रह", "Planet")}</div>
                <div>{t("राशी", "Sign")}</div>
                <div>{t("अंश", "Degree")}</div>
                <div>{t("नक्षत्र", "Nakshatra")}</div>
                <div className="text-center">{t("भाव", "House")}</div>
              </div>
              {planets.map((p, i) => (
                <div key={i} className={`grid grid-cols-5 text-sm py-3 px-4 border-b border-stone-50 ${i % 2 === 0 ? "bg-white" : "bg-stone-50/50"}`}>
                  <div className="font-semibold" style={{ color: p.isRetrograde ? "#dc2626" : "#3d0c0c" }}>
                    {t(p.nameMr, p.name)} {p.isRetrograde ? t("(व)", "(R)") : ""}
                  </div>
                  <div>
                    <span className="mr-1">{RASHI_SYMBOL[p.rashiMr] || ""}</span>
                    {t(p.rashiMr, p.rashi)}
                  </div>
                  <div className="font-mono text-xs text-stone-600">{p.degreeDMS}</div>
                  <div className="text-xs">{t(p.nakshatraMr, p.nakshatra)}</div>
                  <div className="text-center font-semibold">{p.house}</div>
                </div>
              ))}
            </div>

            {/* Note */}
            <div className="text-center p-4 bg-white rounded-xl border border-stone-200">
              <p className="text-xs text-stone-500">
                {t(
                  "सूचना: हे तुमचे जन्म कुंडली नाही. हे सध्याच्या क्षणातील ग्रहांची वास्तविक स्थिती आहे. तुमच्या वैयक्तिक कुंडलीसाठी जन्म माहिती भरा.",
                  "Note: This is NOT your birth chart. These are real-time planetary positions right now. For your personal kundli, enter your birth details."
                )}
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-stone-500">{t("ग्रह स्थिती उपलब्ध नाही", "Planet positions not available")}</div>
        )}
      </div>
    </div>
  );
}
