"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/lib/astrology/language-context";
import { formatDateTimeMarathi, getMarathiPeriod } from "@/lib/astrology/time-format";

interface PlanetPos { id: string; name: string; nameMr: string; rashi: string; rashiMr: string; degreeDMS: string; nakshatra: string; nakshatraMr: string; house: number; isRetrograde: boolean; }

const RASHI_SYMBOL: Record<string, string> = {
  "मेष": "♈", "वृषभ": "♉", "मिथुन": "♊", "कर्क": "♋", "सिंह": "♌", "कन्या": "♍",
  "तुला": "♎", "वृश्चिक": "♏", "धनु": "♐", "मकर": "♑", "कुंभ": "♒", "मीन": "♓",
};

export default function CurrentPlanetsPageClient() {
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

  const dateStr = new Date().toLocaleDateString(lang === "mr" ? "mr-IN" : lang === "hi" ? "hi-IN" : "en-IN", { year: "numeric", month: "long", day: "numeric", weekday: "long" });

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <section className="relative py-16 sm:py-24 overflow-hidden" style={{ background: "linear-gradient(135deg, #3d0c0c 0%, #5c1a1a 50%, #3d0c0c 100%)" }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a843' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#d4a843] mb-3">{t("आत्ताचे ग्रह स्थिती", "Current Planet Positions", "वर्तमान ग्रह स्थिति")}</h1>
          <p className="text-white/60 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">{t("सध्या आकाशातील सर्व ९ ग्रहांची वास्तविक स्थिती", "Real-time positions of all 9 planets in the sky right now", "अभी आकाश में सभी ९ ग्रहों की वास्तविक स्थिति")}</p>
        </div>
      </section>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6 py-6">

        {/* Time Display */}
        <div className="text-center p-4 rounded-xl relative" style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)" }}>
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-bold text-red-400">LIVE</span>
          </div>
          <p className="text-sm" style={{ color: "#d4a843" }}>{dateStr}</p>
          <p className="text-3xl font-bold text-white mt-1 font-mono tracking-wider">{liveClock}</p>
          <p className="text-xs text-white/40 mt-1">IST | {t("दर ६० सेकंदांनी ग्रह स्थिती अपडेट होते", "Planet positions update every 60 seconds", "हर ६० सेकंड में ग्रह स्थिति अपडेट होती है")}</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-3 border-[#f0c040]/30 border-t-[#8b2c2c] rounded-full animate-spin mx-auto" />
            <p className="text-sm text-stone-500 mt-3">{t("ग्रह स्थिती गणना चालू...", "Calculating planet positions...", "ग्रह स्थिति गणना चल रही...")}</p>
          </div>
        ) : planets ? (
          <>
            {/* Lagna */}
            <div className="bg-white rounded-xl border border-stone-200 p-4 text-center">
              <p className="text-xs text-stone-400 uppercase">{t("सध्याचे लग्न (उदय राशी)", "Current Ascendant (Rising Sign)", "वर्तमान लग्न (उदय राशि)")}</p>
              <p className="text-2xl font-bold mt-1" style={{ color: "#5c1a1a" }}>
                {RASHI_SYMBOL[lagnaRashiMr] || ""} {t(lagnaRashiMr, lagnaRashi, lagnaRashiMr)}
              </p>
            </div>

            {/* Planet Table */}
            <div className="flex items-center justify-between mb-1 px-1">
              <p className="text-xs text-stone-400">{t("शेवटचे अपडेट:", "Last updated:", "अंतिम अपडेट:")} {time}</p>
              <p className="text-[10px] text-stone-300">{t("पुढील अपडेट ६० सेकंदांत", "Next update in 60s", "अगला अपडेट ६० सेकंड में")}</p>
            </div>
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm">
              <div className="grid grid-cols-5 text-xs font-bold py-3 px-4 text-white" style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)" }}>
                <div>{t("ग्रह", "Planet", "ग्रह")}</div>
                <div>{t("राशी", "Sign", "राशि")}</div>
                <div>{t("अंश", "Degree", "अंश")}</div>
                <div>{t("नक्षत्र", "Nakshatra", "नक्षत्र")}</div>
                <div className="text-center">{t("भाव", "House", "भाव")}</div>
              </div>
              {planets.map((p, i) => (
                <div key={i} className={`grid grid-cols-5 text-sm py-3 px-4 border-b border-stone-50 ${i % 2 === 0 ? "bg-white" : "bg-stone-50/50"}`}>
                  <div className="font-semibold" style={{ color: p.isRetrograde ? "#dc2626" : "#3d0c0c" }}>
                    {t(p.nameMr, p.name, p.nameMr)} {p.isRetrograde ? t("(व)", "(R)", "(व)") : ""}
                  </div>
                  <div>
                    <span className="mr-1">{RASHI_SYMBOL[p.rashiMr] || ""}</span>
                    {t(p.rashiMr, p.rashi, p.rashiMr)}
                  </div>
                  <div className="font-mono text-xs text-stone-600">{p.degreeDMS}</div>
                  <div className="text-xs">{t(p.nakshatraMr, p.nakshatra, p.nakshatraMr)}</div>
                  <div className="text-center font-semibold">{p.house}</div>
                </div>
              ))}
            </div>

            {/* Note */}
            <div className="text-center p-4 bg-white rounded-xl border border-stone-200">
              <p className="text-xs text-stone-500">
                {t(
                  "सूचना: हे तुमचे जन्म कुंडली नाही. हे सध्याच्या क्षणातील ग्रहांची वास्तविक स्थिती आहे. तुमच्या वैयक्तिक कुंडलीसाठी जन्म माहिती भरा.",
                  "Note: This is NOT your birth chart. These are real-time planetary positions right now. For your personal kundli, enter your birth details.",
                  "सूचना: यह आपकी जन्म कुंडली नहीं है. यह वर्तमान क्षण में ग्रहों की वास्तविक स्थिति है. अपनी व्यक्तिगत कुंडली के लिए जन्म जानकारी भरें."
                )}
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-12 text-stone-500">{t("ग्रह स्थिती उपलब्ध नाही", "Planet positions not available", "ग्रह स्थिति उपलब्ध नहीं")}</div>
        )}
      </div>
    </div>
  );
}
