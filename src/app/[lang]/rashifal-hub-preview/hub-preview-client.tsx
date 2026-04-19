"use client";

import { useState } from "react";
import { useLang } from "@/lib/astrology/language-context";

// ─── Rashi data ─────────────────────────────────────────────────
const RASHIS = [
  { id: "mesh", symbol: "♈", mr: "मेष", en: "Aries", hi: "मेष", lord: "मंगळ", element: "अग्नि" },
  { id: "vrishabh", symbol: "♉", mr: "वृषभ", en: "Taurus", hi: "वृषभ", lord: "शुक्र", element: "पृथ्वी" },
  { id: "mithun", symbol: "♊", mr: "मिथुन", en: "Gemini", hi: "मिथुन", lord: "बुध", element: "वायू" },
  { id: "karka", symbol: "♋", mr: "कर्क", en: "Cancer", hi: "कर्क", lord: "चंद्र", element: "जल" },
  { id: "simha", symbol: "♌", mr: "सिंह", en: "Leo", hi: "सिंह", lord: "सूर्य", element: "अग्नि" },
  { id: "kanya", symbol: "♍", mr: "कन्या", en: "Virgo", hi: "कन्या", lord: "बुध", element: "पृथ्वी" },
  { id: "tula", symbol: "♎", mr: "तुला", en: "Libra", hi: "तुला", lord: "शुक्र", element: "वायू" },
  { id: "vrishchik", symbol: "♏", mr: "वृश्चिक", en: "Scorpio", hi: "वृश्चिक", lord: "मंगळ", element: "जल" },
  { id: "dhanu", symbol: "♐", mr: "धनु", en: "Sagittarius", hi: "धनु", lord: "गुरु", element: "अग्नि" },
  { id: "makar", symbol: "♑", mr: "मकर", en: "Capricorn", hi: "मकर", lord: "शनि", element: "पृथ्वी" },
  { id: "kumbh", symbol: "♒", mr: "कुंभ", en: "Aquarius", hi: "कुंभ", lord: "शनि", element: "वायू" },
  { id: "meen", symbol: "♓", mr: "मीन", en: "Pisces", hi: "मीन", lord: "गुरु", element: "जल" },
];

const NAKSHATRAS_MR = ["अश्विनी", "भरणी", "कृत्तिका", "रोहिणी", "मृगशीर्ष", "आर्द्रा", "पुनर्वसू", "पुष्य", "आश्लेषा", "मघा", "पूर्वा फाल्गुनी", "उत्तरा फाल्गुनी", "हस्त", "चित्रा", "स्वाती", "विशाखा", "अनुराधा", "ज्येष्ठा", "मूळ", "पूर्वाषाढा", "उत्तराषाढा", "श्रवण", "धनिष्ठा", "शततारका", "पूर्वा भाद्रपदा", "उत्तरा भाद्रपदा", "रेवती"];

// ─── Tab definitions ────────────────────────────────────────────
type TabId =
  | "daily" | "weekly" | "monthly" | "yearly"
  | "moonsign" | "sadesati" | "mangal" | "compat"
  | "nakshatra" | "transit" | "gem";

const TABS: { id: TabId; mr: string; en: string; hi: string; icon: string }[] = [
  { id: "daily", mr: "दैनिक", en: "Daily", hi: "दैनिक", icon: "☀" },
  { id: "weekly", mr: "साप्ताहिक", en: "Weekly", hi: "साप्ताहिक", icon: "📅" },
  { id: "monthly", mr: "मासिक", en: "Monthly", hi: "मासिक", icon: "🌙" },
  { id: "yearly", mr: "वार्षिक", en: "Yearly", hi: "वार्षिक", icon: "🎯" },
  { id: "moonsign", mr: "चंद्र राशी", en: "Moon Sign", hi: "चंद्र राशि", icon: "☽" },
  { id: "sadesati", mr: "साडेसाती", en: "Sade Sati", hi: "साढ़ेसाती", icon: "🪐" },
  { id: "mangal", mr: "मंगळ दोष", en: "Mangal Dosha", hi: "मंगल दोष", icon: "♂" },
  { id: "compat", mr: "राशी मिलन", en: "Compatibility", hi: "राशि मिलान", icon: "❤" },
  { id: "nakshatra", mr: "नक्षत्र", en: "Nakshatra", hi: "नक्षत्र", icon: "✨" },
  { id: "transit", mr: "ग्रह गोचर", en: "Transits", hi: "ग्रह गोचर", icon: "🌌" },
  { id: "gem", mr: "रत्न-रंग-अंक", en: "Gem-Color-Number", hi: "रत्न-रंग-अंक", icon: "💎" },
];

// ─── Tab components (mock content shapes) ───────────────────────
function RashiGrid({ period, subtitle }: { period: string; subtitle: string }) {
  const { lang } = useLang();
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-bold" style={{ color: "#3d0c0c" }}>{period}</h2>
        <p className="text-xs text-stone-500 mt-1">{subtitle}</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {RASHIS.map((r) => (
          <a key={r.id} href="#" className="group block p-4 rounded-xl border border-stone-200 bg-white hover:border-[#d4a843] hover:shadow-md transition">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl" style={{ color: "#8b2c2c" }}>{r.symbol}</span>
              <div>
                <div className="font-bold text-sm" style={{ color: "#3d0c0c" }}>{lang === "en" ? r.en : r.mr}</div>
                <div className="text-[10px] text-stone-500">{r.lord} · {r.element}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[11px] mb-2">
              <span className="px-1.5 py-0.5 rounded" style={{ background: "#FFF3D6", color: "#8b2c2c" }}>★★★★☆</span>
              <span className="text-stone-500">{lang === "mr" ? "शुभ" : "Favorable"}</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
              {lang === "mr"
                ? "या कालावधीत करिअरमध्ये प्रगतीच्या संधी मिळतील. आर्थिक स्थितीत सुधारणा. प्रेमसंबंधात गोडवा..."
                : "Career opportunities ahead. Financial improvement expected. Warmth in relationships..."}
            </p>
            <div className="mt-2 text-[10px] font-bold" style={{ color: "#8b2c2c" }}>
              {lang === "mr" ? "अधिक वाचा →" : "Read more →"}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function DailyTab() {
  const { t } = useLang();
  return (
    <div>
      <div className="mb-4 flex items-center gap-3 flex-wrap">
        <div className="inline-flex rounded-lg border border-stone-300 overflow-hidden">
          <button className="px-3 py-1.5 text-xs font-bold bg-[#3d0c0c] text-white">{t("सूर्य राशी", "Sun Sign", "सूर्य राशि")}</button>
          <button className="px-3 py-1.5 text-xs font-bold bg-white">{t("चंद्र राशी", "Moon Sign", "चंद्र राशि")}</button>
        </div>
        <span className="text-xs text-stone-500">
          {new Date().toLocaleDateString("mr-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </span>
      </div>
      <RashiGrid
        period={t("आजचे राशीभविष्य", "Today's Horoscope", "आज का राशिफल")}
        subtitle={t("१२ राशींचे दैनिक भविष्य — ग्रहगोचर आधारित", "12 signs daily forecast based on planetary transits", "१२ राशियों का दैनिक भविष्य")}
      />
    </div>
  );
}

function WeeklyTab() {
  const { t } = useLang();
  const now = new Date();
  const weekEnd = new Date(now); weekEnd.setDate(now.getDate() + 6);
  const range = `${now.toLocaleDateString("mr-IN", { day: "numeric", month: "short" })} – ${weekEnd.toLocaleDateString("mr-IN", { day: "numeric", month: "short" })}`;
  return <RashiGrid period={t("साप्ताहिक राशिभविष्य", "Weekly Horoscope", "साप्ताहिक राशिफल")} subtitle={range} />;
}

function MonthlyTab() {
  const { t } = useLang();
  const m = new Date().toLocaleDateString("mr-IN", { month: "long", year: "numeric" });
  return <RashiGrid period={t(`${m} — मासिक राशिभविष्य`, `${m} — Monthly`, `${m} — मासिक`)} subtitle={t("प्रत्येक राशीसाठी संपूर्ण महिन्याचे भविष्य", "Full-month forecast per sign", "संपूर्ण महीने का भविष्य")} />;
}

function YearlyTab() {
  const { t } = useLang();
  const y = new Date().getFullYear();
  return (
    <div>
      <RashiGrid period={t(`${y} — वार्षिक राशिभविष्य`, `${y} — Yearly Horoscope`, `${y} — वार्षिक राशिफल`)} subtitle={t("करिअर · विवाह · आरोग्य · धन · शिक्षण · कुटुंब", "Career · Marriage · Health · Wealth · Education · Family", "कैरियर · विवाह · स्वास्थ्य · धन")} />
      <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-[#FFF3D6] to-[#FFF8E7] border border-[#d4a843]">
        <h3 className="font-bold mb-2" style={{ color: "#5c1a1a" }}>{t("व्यक्तिगत वार्षिक अहवाल", "Personal Yearly Report", "व्यक्तिगत वार्षिक रिपोर्ट")}</h3>
        <p className="text-xs text-stone-600 mb-3">
          {t("जन्म तारीख + जन्म वेळ टाकून पूर्ण वार्षिक अहवाल मिळवा — दशा, अंतर्दशा, गोचर संयोग",
             "Enter birth date + time for full yearly report — dasha, antardasha, transit combinations",
             "जन्म तिथि + समय डालकर पूर्ण वार्षिक रिपोर्ट पाएं")}
        </p>
        <button className="px-4 py-2 text-xs font-bold rounded-lg bg-[#5c1a1a] text-white">{t("अहवाल तयार करा →", "Generate Report →", "रिपोर्ट बनाएं →")}</button>
      </div>
    </div>
  );
}

function MoonSignTab() {
  const { t, lang } = useLang();
  return (
    <div>
      <div className="mb-4 p-4 rounded-xl bg-[#f5efe0] border border-[#d4a843]">
        <p className="text-xs leading-relaxed" style={{ color: "#5c1a1a" }}>
          <strong>{t("चंद्र राशी आधारित भविष्य", "Moon-sign based forecast", "चंद्र राशि आधारित भविष्य")}:</strong>{" "}
          {t("वैदिक परंपरेनुसार जन्मवेळेच्या चंद्र राशीवर आधारित भविष्य सर्वात अचूक मानले जाते. तुमची जन्म चंद्र राशी निवडा.",
             "Vedic tradition uses birth Moon sign as the most accurate predictor. Select your birth Moon sign.",
             "वैदिक परंपरा में जन्म चंद्र राशि सबसे सटीक मानी जाती है.")}
        </p>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 mb-4">
        {RASHIS.map((r) => (
          <button key={r.id} className="p-3 rounded-lg border border-stone-200 hover:border-[#d4a843] hover:bg-[#FFF8E7] transition text-center">
            <div className="text-2xl" style={{ color: "#8b2c2c" }}>{r.symbol}</div>
            <div className="text-xs font-bold mt-1" style={{ color: "#3d0c0c" }}>{lang === "en" ? r.en : r.mr}</div>
          </button>
        ))}
      </div>
      <p className="text-xs text-stone-500">
        {t("माहित नाही? ", "Don't know? ", "नहीं पता? ")}
        <a href="/mr/kundli" className="font-bold" style={{ color: "#8b2c2c" }}>
          {t("जन्म तारीख टाकून शोधा →", "Find via birth date →", "जन्म तिथि से पता करें →")}
        </a>
      </p>
    </div>
  );
}

function SadeSatiTab() {
  const { t } = useLang();
  const phases = [
    { name: t("पहिली साडेसाती", "First Sade Sati", "पहली साढ़ेसाती"), desc: t("शनी चंद्र राशीच्या 12व्या भावात", "Saturn in 12th from Moon", "शनि १२वें भाव में"), bg: "#fef3c7" },
    { name: t("मुख्य साडेसाती", "Peak Sade Sati", "मुख्य साढ़ेसाती"), desc: t("शनी चंद्र राशीवर", "Saturn on Moon", "शनि चंद्र पर"), bg: "#fecaca" },
    { name: t("शेवटची साडेसाती", "Final Sade Sati", "अंतिम साढ़ेसाती"), desc: t("शनी चंद्र राशीच्या 2र्या भावात", "Saturn in 2nd from Moon", "शनि २रे भाव में"), bg: "#e9d5ff" },
  ];
  return (
    <div>
      <div className="mb-4 flex items-center gap-3 flex-wrap">
        <select className="px-3 py-2 border border-stone-300 rounded-lg text-sm font-semibold">
          <option>{t("तुमची जन्म चंद्र राशी निवडा", "Select your Moon sign", "चंद्र राशि चुनें")}</option>
          {RASHIS.map((r) => <option key={r.id}>{r.mr}</option>)}
        </select>
        <button className="px-4 py-2 text-xs font-bold rounded-lg bg-[#5c1a1a] text-white">{t("तपासा", "Check", "जांचें")}</button>
      </div>
      <div className="p-4 rounded-xl border border-stone-200 bg-white mb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-full bg-[#5c1a1a] flex items-center justify-center text-[#d4a843] text-2xl">🪐</div>
          <div>
            <p className="font-bold" style={{ color: "#3d0c0c" }}>{t("सध्याची स्थिती", "Current Status", "वर्तमान स्थिति")}</p>
            <p className="text-xs text-stone-500">{t("वृश्चिक राशी — साडेसाती चालू आहे", "Scorpio — Sade Sati active", "वृश्चिक — साढ़ेसाती चालू")}</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {phases.map((p, i) => (
          <div key={i} className="p-4 rounded-xl border border-stone-200" style={{ background: p.bg }}>
            <div className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-1">{t("टप्पा", "Phase", "चरण")} {i+1}</div>
            <div className="font-bold mb-1" style={{ color: "#3d0c0c" }}>{p.name}</div>
            <div className="text-xs text-stone-700 mb-2">{p.desc}</div>
            <div className="text-[10px] text-stone-600">{t("कालावधी", "Duration", "अवधि")}: 2.5 {t("वर्षे", "years", "वर्ष")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MangalDoshaTab() {
  const { t } = useLang();
  return (
    <div>
      <h3 className="font-bold mb-2" style={{ color: "#3d0c0c" }}>{t("मंगळ दोष तपासणी", "Mangal Dosha Check", "मंगल दोष जांच")}</h3>
      <p className="text-xs text-stone-600 mb-4">
        {t("जन्मकुंडलीत मंगळ 1/2/4/7/8/12 भावात असल्यास मंगळ दोष. विवाहावर परिणाम करू शकतो.",
           "Mangal in 1/2/4/7/8/12 house causes Mangal Dosha. Can impact marriage.",
           "१/२/४/७/८/१२ भाव में मंगल से मंगल दोष.")}
      </p>
      <div className="p-4 rounded-xl bg-white border border-stone-200 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input type="date" className="px-3 py-2 border border-stone-300 rounded-lg text-sm" />
          <input type="time" className="px-3 py-2 border border-stone-300 rounded-lg text-sm" />
          <input type="text" placeholder={t("जन्मठिकाण", "Birth place", "जन्मस्थान")} className="px-3 py-2 border border-stone-300 rounded-lg text-sm" />
        </div>
        <button className="mt-3 px-4 py-2 text-xs font-bold rounded-lg bg-[#5c1a1a] text-white">{t("तपासा", "Check", "जांचें")}</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl border-2 border-green-300 bg-green-50">
          <div className="font-bold text-green-800">✓ {t("अदोष", "No Dosha", "निर्दोष")}</div>
          <p className="text-xs text-green-700 mt-1">{t("विवाहात अडथळा नाही", "No marriage obstacle", "विवाह में अड़चन नहीं")}</p>
        </div>
        <div className="p-4 rounded-xl border-2 border-orange-300 bg-orange-50">
          <div className="font-bold text-orange-800">◐ {t("अंशदोष", "Mild Dosha", "अंश दोष")}</div>
          <p className="text-xs text-orange-700 mt-1">{t("सौम्य उपाय पुरेसे", "Mild remedies suffice", "हल्के उपाय")}</p>
        </div>
        <div className="p-4 rounded-xl border-2 border-red-300 bg-red-50">
          <div className="font-bold text-red-800">● {t("पूर्ण मंगळ दोष", "Full Mangal", "पूर्ण मंगल")}</div>
          <p className="text-xs text-red-700 mt-1">{t("कुंभ विवाह/विशेष उपाय", "Kumbh Vivah/remedies", "कुंभ विवाह/उपाय")}</p>
        </div>
      </div>
    </div>
  );
}

function CompatTab() {
  const { t, lang } = useLang();
  return (
    <div>
      <h3 className="font-bold mb-2" style={{ color: "#3d0c0c" }}>{t("राशी सुसंगता", "Rashi Compatibility", "राशि मिलान")}</h3>
      <p className="text-xs text-stone-600 mb-4">
        {t("दोन राशींची तुलना — प्रेम, विवाह, मैत्री, व्यावसायिक भागीदारी.",
           "Compare two signs — love, marriage, friendship, business partnership.",
           "दो राशियों की तुलना.")}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-4 items-center mb-4">
        <div className="p-5 rounded-xl bg-white border border-stone-200 text-center">
          <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-2">{t("तुमची राशी", "Your Sign", "आपकी राशि")}</div>
          <div className="text-4xl mb-2" style={{ color: "#8b2c2c" }}>♈</div>
          <select className="w-full px-2 py-1.5 border border-stone-300 rounded text-sm">
            {RASHIS.map((r) => <option key={r.id}>{lang === "en" ? r.en : r.mr}</option>)}
          </select>
        </div>
        <div className="text-4xl" style={{ color: "#dc2626" }}>♥</div>
        <div className="p-5 rounded-xl bg-white border border-stone-200 text-center">
          <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-2">{t("जोडीदाराची राशी", "Partner Sign", "साथी की राशि")}</div>
          <div className="text-4xl mb-2" style={{ color: "#8b2c2c" }}>♎</div>
          <select className="w-full px-2 py-1.5 border border-stone-300 rounded text-sm">
            {RASHIS.map((r) => <option key={r.id}>{lang === "en" ? r.en : r.mr}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {[
          { label: t("एकूण", "Overall", "कुल"), pct: 85, color: "#10b981" },
          { label: t("प्रेम", "Love", "प्रेम"), pct: 90, color: "#dc2626" },
          { label: t("संवाद", "Comm.", "संवाद"), pct: 75, color: "#3b82f6" },
          { label: t("व्यवसाय", "Business", "व्यापार"), pct: 70, color: "#d4a843" },
        ].map((s) => (
          <div key={s.label} className="p-3 rounded-xl bg-white border border-stone-200 text-center">
            <div className="text-2xl font-bold" style={{ color: s.color }}>{s.pct}%</div>
            <div className="text-[11px] text-stone-600 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      <p className="text-xs text-stone-500">
        {t("अधिक अचूकतेसाठी ", "For precise match, use ", "सटीकता के लिए ")}
        <a href="/mr/kundli" className="font-bold" style={{ color: "#8b2c2c" }}>{t("अष्टकूट गुण मिलन", "Ashtakoot Guna Milan", "अष्टकूट गुण मिलान")} →</a>
      </p>
    </div>
  );
}

function NakshatraTab() {
  const { t, lang } = useLang();
  return (
    <div>
      <h3 className="font-bold mb-3" style={{ color: "#3d0c0c" }}>{t("आजचे नक्षत्र भविष्य", "Today's Nakshatra Forecast", "आज का नक्षत्र भविष्य")}</h3>
      <p className="text-xs text-stone-600 mb-4">{t("२७ नक्षत्रांसाठी दैनिक भविष्य — जन्मनक्षत्रानुसार अचूक", "27-nakshatra daily forecast — precise by birth nakshatra", "२७ नक्षत्रों के लिए दैनिक भविष्य")}</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {NAKSHATRAS_MR.map((n, i) => (
          <a key={i} href="#" className="p-3 rounded-lg border border-stone-200 bg-white hover:border-[#d4a843] transition">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold text-stone-400">#{lang === "en" ? i + 1 : String(i + 1).replace(/\d/g, (c) => "०१२३४५६७८९"[parseInt(c)])}</span>
              <span className="text-xs" style={{ color: "#d4a843" }}>★★★★☆</span>
            </div>
            <div className="font-bold text-sm" style={{ color: "#3d0c0c" }}>{n}</div>
            <div className="text-[10px] text-stone-500 mt-1 line-clamp-2">{t("आजचा शुभ संकेत...", "Today's auspicious signs...", "आज के शुभ संकेत...")}</div>
          </a>
        ))}
      </div>
    </div>
  );
}

function TransitTab() {
  const { t } = useLang();
  const transits = [
    { planet: "सूर्य", rashi: "मेष", entry: "14 Apr", exit: "15 May", effect: t("शुभ", "Positive", "शुभ"), color: "#10b981" },
    { planet: "चंद्र", rashi: "मेष", entry: "आज", exit: "12:31", effect: t("शुभ", "Positive", "शुभ"), color: "#10b981" },
    { planet: "मंगळ", rashi: "मीन", entry: "3 Apr", exit: "11 May", effect: t("तटस्थ", "Neutral", "तटस्थ"), color: "#6b7280" },
    { planet: "बुध", rashi: "मीन", entry: "5 Apr", exit: "3 May", effect: t("शुभ", "Positive", "शुभ"), color: "#10b981" },
    { planet: "गुरु", rashi: "मिथुन", entry: "2 May 2025", exit: "30 May 2026", effect: t("शुभ", "Positive", "शुभ"), color: "#10b981" },
    { planet: "शुक्र", rashi: "मेष", entry: "3 Apr", exit: "28 Apr", effect: t("शुभ", "Positive", "शुभ"), color: "#10b981" },
    { planet: "शनि", rashi: "कुंभ", entry: "17 Jan 2023", exit: "29 Mar 2027", effect: t("अशुभ", "Challenging", "चुनौती"), color: "#dc2626" },
    { planet: "राहु", rashi: "कुंभ", entry: "30 Oct 2023", exit: "28 May 2026", effect: t("अशुभ", "Challenging", "चुनौती"), color: "#dc2626" },
    { planet: "केतु", rashi: "सिंह", entry: "30 Oct 2023", exit: "28 May 2026", effect: t("अशुभ", "Challenging", "चुनौती"), color: "#dc2626" },
  ];
  return (
    <div>
      <h3 className="font-bold mb-3" style={{ color: "#3d0c0c" }}>{t("आजची ग्रह गोचर स्थिती", "Today's Planetary Transits", "आज की ग्रह गोचर स्थिति")}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#f5efe0]">
            <tr>
              <th className="px-3 py-2 text-left font-bold">{t("ग्रह", "Planet", "ग्रह")}</th>
              <th className="px-3 py-2 text-left font-bold">{t("राशी", "Sign", "राशि")}</th>
              <th className="px-3 py-2 text-left font-bold">{t("प्रवेश", "Entry", "प्रवेश")}</th>
              <th className="px-3 py-2 text-left font-bold">{t("निर्गमन", "Exit", "निकास")}</th>
              <th className="px-3 py-2 text-left font-bold">{t("प्रभाव", "Effect", "प्रभाव")}</th>
            </tr>
          </thead>
          <tbody>
            {transits.map((tr, i) => (
              <tr key={i} className="border-b border-stone-200">
                <td className="px-3 py-2 font-bold">{tr.planet}</td>
                <td className="px-3 py-2">{tr.rashi}</td>
                <td className="px-3 py-2 text-xs text-stone-600">{tr.entry}</td>
                <td className="px-3 py-2 text-xs text-stone-600">{tr.exit}</td>
                <td className="px-3 py-2">
                  <span className="px-2 py-0.5 rounded text-xs font-bold text-white" style={{ background: tr.color }}>{tr.effect}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GemTab() {
  const { t, lang } = useLang();
  const gems: Record<string, { stone: string; color: string; colorHex: string; lucky: number[]; metal: string; day: string }> = {
    mesh: { stone: "पोवळा (Coral)", color: "लाल", colorHex: "#dc2626", lucky: [9, 18, 27], metal: "तांबे", day: "मंगळवार" },
    vrishabh: { stone: "हिरा (Diamond)", color: "पांढरा/गुलाबी", colorHex: "#ec4899", lucky: [6, 15, 24], metal: "चांदी", day: "शुक्रवार" },
    mithun: { stone: "पाचू (Emerald)", color: "हिरवा", colorHex: "#10b981", lucky: [5, 14, 23], metal: "सोने", day: "बुधवार" },
    karka: { stone: "मोती (Pearl)", color: "पांढरा/मलई", colorHex: "#f5f5f4", lucky: [2, 11, 20], metal: "चांदी", day: "सोमवार" },
    simha: { stone: "माणिक (Ruby)", color: "सोनेरी/लाल", colorHex: "#d4a843", lucky: [1, 10, 19], metal: "सोने", day: "रविवार" },
    kanya: { stone: "पाचू (Emerald)", color: "हिरवा/पिवळा", colorHex: "#84cc16", lucky: [5, 14, 23], metal: "सोने", day: "बुधवार" },
    tula: { stone: "हिरा (Diamond)", color: "पांढरा/गुलाबी", colorHex: "#f472b6", lucky: [6, 15, 24], metal: "चांदी", day: "शुक्रवार" },
    vrishchik: { stone: "पोवळा (Coral)", color: "लाल", colorHex: "#b91c1c", lucky: [9, 18, 27], metal: "तांबे", day: "मंगळवार" },
    dhanu: { stone: "पुखराज (Yellow Sapph.)", color: "पिवळा", colorHex: "#eab308", lucky: [3, 12, 21], metal: "सोने", day: "गुरुवार" },
    makar: { stone: "नीळम (Blue Sapph.)", color: "निळा/काळा", colorHex: "#1e3a8a", lucky: [8, 17, 26], metal: "लोह", day: "शनिवार" },
    kumbh: { stone: "नीळम (Blue Sapph.)", color: "निळा", colorHex: "#3b82f6", lucky: [8, 17, 26], metal: "लोह", day: "शनिवार" },
    meen: { stone: "पुखराज (Yellow Sapph.)", color: "पिवळा/मलई", colorHex: "#fbbf24", lucky: [3, 12, 21], metal: "सोने", day: "गुरुवार" },
  };
  return (
    <div>
      <h3 className="font-bold mb-3" style={{ color: "#3d0c0c" }}>{t("राशी-विशिष्ट रत्न, रंग, अंक", "Rashi-specific Gem, Color, Number", "राशि-विशेष रत्न")}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {RASHIS.map((r) => {
          const g = gems[r.id];
          return (
            <div key={r.id} className="p-4 rounded-xl bg-white border border-stone-200">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-stone-100">
                <span className="text-2xl" style={{ color: "#8b2c2c" }}>{r.symbol}</span>
                <div>
                  <div className="font-bold" style={{ color: "#3d0c0c" }}>{lang === "en" ? r.en : r.mr}</div>
                  <div className="text-[10px] text-stone-500">{r.lord}</div>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between"><span className="text-stone-600">{t("रत्न", "Gem", "रत्न")}</span><span className="font-bold">{g.stone}</span></div>
                <div className="flex justify-between items-center">
                  <span className="text-stone-600">{t("रंग", "Color", "रंग")}</span>
                  <span className="flex items-center gap-1"><span className="w-4 h-4 rounded-full border border-stone-300" style={{ background: g.colorHex }} /><span className="font-bold">{g.color}</span></span>
                </div>
                <div className="flex justify-between"><span className="text-stone-600">{t("अंक", "Numbers", "अंक")}</span><span className="font-bold">{g.lucky.join(", ")}</span></div>
                <div className="flex justify-between"><span className="text-stone-600">{t("धातू", "Metal", "धातु")}</span><span className="font-bold">{g.metal}</span></div>
                <div className="flex justify-between"><span className="text-stone-600">{t("शुभ वार", "Day", "शुभ दिन")}</span><span className="font-bold">{g.day}</span></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main hub ───────────────────────────────────────────────────
export default function HubPreviewClient() {
  const { t, lang } = useLang();
  const [tab, setTab] = useState<TabId>("daily");

  const tabLabel = (x: typeof TABS[number]) => lang === "en" ? x.en : lang === "hi" ? x.hi : x.mr;

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-16">
      {/* Hero */}
      <section className="py-10 sm:py-14" style={{ background: "linear-gradient(135deg, #3d0c0c 0%, #5c1a1a 50%, #3d0c0c 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl sm:text-4xl font-bold text-[#d4a843] mb-2">
            {t("राशीभविष्य केंद्र", "Rashifal Hub", "राशिफल केंद्र")}
          </h1>
          <p className="text-white/70 text-sm sm:text-base max-w-3xl mx-auto">
            {t("दैनिक · साप्ताहिक · मासिक · वार्षिक भविष्य · साडेसाती · मंगळ दोष · सुसंगता · नक्षत्र · गोचर · रत्न",
               "Daily · Weekly · Monthly · Yearly · Sade Sati · Mangal Dosha · Compatibility · Nakshatra · Transits · Gems",
               "दैनिक · साप्ताहिक · मासिक · वार्षिक")}
          </p>
        </div>
      </section>

      {/* Tab strip */}
      <div className="bg-white border-b border-stone-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide py-2">
            {TABS.map((x) => (
              <button
                key={x.id}
                onClick={() => setTab(x.id)}
                className={`shrink-0 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition whitespace-nowrap ${
                  tab === x.id
                    ? "bg-[#5c1a1a] text-white"
                    : "bg-white text-stone-700 hover:bg-stone-100"
                }`}
              >
                <span className="mr-1">{x.icon}</span>
                {tabLabel(x)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        {tab === "daily" && <DailyTab />}
        {tab === "weekly" && <WeeklyTab />}
        {tab === "monthly" && <MonthlyTab />}
        {tab === "yearly" && <YearlyTab />}
        {tab === "moonsign" && <MoonSignTab />}
        {tab === "sadesati" && <SadeSatiTab />}
        {tab === "mangal" && <MangalDoshaTab />}
        {tab === "compat" && <CompatTab />}
        {tab === "nakshatra" && <NakshatraTab />}
        {tab === "transit" && <TransitTab />}
        {tab === "gem" && <GemTab />}
      </div>
    </div>
  );
}
