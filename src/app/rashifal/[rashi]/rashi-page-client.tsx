"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLang } from "@/lib/astrology/language-context";
import { RASHI_LIST } from "@/lib/rashi-data";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/json-ld";

interface TransitInfo { planet: string; planetMr: string; house: number; effect: "good" | "bad" | "neutral" }
interface Prediction {
  rashiId: number;
  rashiMr: string;
  rashiEn: string;
  overall: { mr: string; en: string };
  career: { mr: string; en: string };
  love: { mr: string; en: string };
  health: { mr: string; en: string };
  advice: { mr: string; en: string };
  rating: number;
  transits: TransitInfo[];
  luckyColor: { mr: string; en: string };
  luckyNumber: number;
}

interface Props {
  rashiSlug: string;
  rashiId: number;
  initialPrediction?: Prediction | null;
}

export default function RashiPageClient({ rashiSlug, rashiId, initialPrediction = null }: Props) {
  const { t, lang } = useLang();
  const [pred, setPred] = useState<Prediction | null>(initialPrediction);
  const [loading, setLoading] = useState(!initialPrediction);

  const rashi = RASHI_LIST[rashiId];
  const todayStr = new Date().toLocaleDateString(lang === "mr" ? "mr-IN" : "en-IN", {
    year: "numeric", month: "long", day: "numeric", weekday: "long",
  });

  useEffect(() => {
    if (initialPrediction) return;
    fetch(`/api/rashifal?rashi=${rashiId}`)
      .then((r) => r.json())
      .then((data) => {
        setPred(data.prediction);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [rashiId, initialPrediction]);

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Structured Data */}
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://bhaagyavedh.com" },
          { name: t("राशीफल", "Rashifal"), url: "https://bhaagyavedh.com/rashifal" },
          { name: t(rashi.mr, rashi.en), url: `https://bhaagyavedh.com/rashifal/${rashiSlug}` },
        ])}
      />
      <JsonLd
        data={faqSchema([
          {
            question: `${rashi.en} (${rashi.mr}) राशीचे आजचे भविष्य काय आहे?`,
            answer: `आजचे ${rashi.mr} राशीफल वैदिक ग्रह गोचरावर आधारित आहे. करिअर, प्रेम, आरोग्य आणि आर्थिक भविष्य दररोज अपडेट होते. भाग्यवेध वर पूर्ण भविष्य वाचा.`,
          },
          {
            question: `What is today's horoscope for ${rashi.en}?`,
            answer: `Today's ${rashi.en} horoscope is based on real Vedic planetary transits calculated using precise astronomical data. Get daily predictions for career, love, health & finance at Bhaagyavedh.`,
          },
          {
            question: `${rashi.mr} राशीसाठी भाग्यशाली रंग आणि अंक कोणता?`,
            answer: `${rashi.mr} राशीचे आजचे भाग्यशाली रंग आणि भाग्यांक दररोज ग्रह स्थितीनुसार बदलतात. भाग्यवेध वर अचूक दैनिक माहिती मिळवा.`,
          },
        ])}
      />
      {/* Article structured data for daily freshness */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: `${rashi.mr} राशीफल आज — ${rashi.en} Horoscope Today`,
          description: t(rashi.descMr, rashi.descEn),
          image: "https://bhaagyavedh.com/logos/og-image.png",
          url: `https://bhaagyavedh.com/rashifal/${rashiSlug}`,
          datePublished: new Date().toISOString().split("T")[0],
          dateModified: new Date().toISOString().split("T")[0],
          author: { "@type": "Organization", name: "Bhaagyavedh", url: "https://bhaagyavedh.com" },
          publisher: {
            "@type": "Organization",
            name: "Bhaagyavedh",
            url: "https://bhaagyavedh.com",
            logo: { "@type": "ImageObject", url: "https://bhaagyavedh.com/logos/logo-dark.svg" },
          },
          mainEntityOfPage: { "@type": "WebPage", "@id": `https://bhaagyavedh.com/rashifal/${rashiSlug}` },
          inLanguage: ["mr", "en"],
        }}
      />

      {/* Hero */}
      <section
        className="relative py-12 sm:py-16 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #3d0c0c 0%, #5c1a1a 50%, #3d0c0c 100%)" }}
      >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4a843' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        <div className="max-w-3xl mx-auto px-4 text-center relative z-10">
          <Link href="/rashifal" className="inline-block text-white/50 hover:text-[#d4a843] text-sm mb-4 transition">
            ← {t("सर्व राशी", "All Signs")}
          </Link>
          <div className="w-16 h-16 mx-auto mb-3 rounded-xl flex items-center justify-center text-3xl text-white" style={{ background: "linear-gradient(135deg, #7B2D8E, #9B59B6)" }}>
            {rashi.symbol}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#d4a843] mb-2">
            {t(`${rashi.mr} राशीफल आज`, `${rashi.en} Horoscope Today`)}
          </h1>
          <p className="text-white/60 text-sm sm:text-base">{todayStr}</p>
          <p className="text-white/40 text-xs mt-1">
            {t("वैदिक ग्रह गोचरावर आधारित", "Based on Vedic planetary transits")}
          </p>
          <p className="text-white/30 text-[10px] mt-2">
            {t("वास्तविक ग्रह गोचरावर आधारित", "Based on real planetary transits")}
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-3 border-[#f0c040]/30 border-t-[#8b2c2c] rounded-full animate-spin" />
            <p className="mt-4 text-stone-500">{t("गोचर गणना चालू...", "Calculating transits...")}</p>
          </div>
        ) : pred ? (
          <>
            {/* Lucky Info Strip */}
            <div className="grid grid-cols-3 rounded-xl overflow-hidden" style={{ border: "1px solid rgba(212,168,67,0.2)" }}>
              <div className="p-4 text-center bg-[#FFF8E7]" style={{ borderRight: "1px solid rgba(212,168,67,0.15)" }}>
                <p className="text-[10px] uppercase tracking-wider text-[#8b6914]">{t("भाग्यशाली रंग", "Lucky Color")}</p>
                <p className="font-semibold text-sm mt-1 text-[#3d0c0c]">{t(pred.luckyColor.mr, pred.luckyColor.en)}</p>
              </div>
              <div className="p-4 text-center bg-[#FFF8E7]" style={{ borderRight: "1px solid rgba(212,168,67,0.15)" }}>
                <p className="text-[10px] uppercase tracking-wider text-[#8b6914]">{t("भाग्यांक", "Lucky Number")}</p>
                <p className="font-semibold text-sm mt-1 text-[#3d0c0c]">{pred.luckyNumber}</p>
              </div>
              <div className="p-4 text-center bg-[#FFF8E7]">
                <p className="text-[10px] uppercase tracking-wider text-[#8b6914]">{t("दिनांक", "Date")}</p>
                <p className="font-semibold text-sm mt-1 text-[#3d0c0c]">
                  {new Date().toLocaleDateString(lang === "mr" ? "mr-IN" : "en-IN", { day: "numeric", month: "long" })}
                </p>
              </div>
            </div>

            {/* Prediction Sections */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ border: "1px solid rgba(212,168,67,0.2)" }}>
              {[
                { title: t("आजचे एकंदर भविष्य", "Overall Prediction"), text: t(pred.overall.mr, pred.overall.en), highlight: true },
                { title: t("करिअर व आर्थिक", "Career & Finance"), text: t(pred.career.mr, pred.career.en) },
                { title: t("प्रेम व कुटुंब", "Love & Family"), text: t(pred.love.mr, pred.love.en) },
                { title: t("आरोग्य", "Health"), text: t(pred.health.mr, pred.health.en) },
                { title: t("आजचा सल्ला", "Today's Advice"), text: t(pred.advice.mr, pred.advice.en) },
              ].map((sec, i) => (
                <div
                  key={i}
                  className={`p-5 md:p-6 ${sec.highlight ? "bg-[#FFF8E7]/50" : ""}`}
                  style={i > 0 ? { borderTop: "1px solid rgba(212,168,67,0.1)" } : {}}
                >
                  <h2 className="text-sm font-bold mb-2 text-[#5c1a1a]">{sec.title}</h2>
                  <p className="text-sm leading-relaxed text-[#4a3a2a]">{sec.text}</p>
                </div>
              ))}
            </div>

            {/* Transit Details */}
            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm" style={{ border: "1px solid rgba(212,168,67,0.2)" }}>
              <h2 className="text-sm font-bold mb-3 text-[#5c1a1a]">
                {t(`${rashi.mr} राशीवरील आजचे गोचर`, `Today's Transits for ${rashi.en}`)}
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {pred.transits.map((tr) => (
                  <div
                    key={tr.planet}
                    className="text-center p-2.5 rounded-lg text-xs"
                    style={
                      tr.effect === "good"
                        ? { background: "#FFF8E7", border: "1px solid rgba(212,168,67,0.2)", color: "#3d0c0c" }
                        : { background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b" }
                    }
                  >
                    <p className="font-semibold">{t(tr.planetMr, tr.planet)}</p>
                    <p className="mt-0.5">{t(`${tr.house}वा भाव`, `House ${tr.house}`)}</p>
                    <p className="text-[10px] mt-0.5 font-semibold">
                      {tr.effect === "good" ? t("शुभ", "Good") : t("सावध", "Caution")}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-[10px] mt-3 text-[#8b2c2c]/40">
                {t("वरील भविष्य वास्तविक ग्रह गोचरावर आधारित आहे (लाहिरी अयनांश)", "Based on real planetary transit positions (Lahiri Ayanamsa)")}
              </p>
            </div>

            {/* Other Rashis Navigation */}
            <div>
              <h2 className="text-base font-bold text-[#3d0c0c] mb-3">
                {t("इतर राशींचे आजचे भविष्य", "Today's Horoscope for Other Signs")}
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {RASHI_LIST.filter((r) => r.id !== rashiId).map((r) => (
                  <Link
                    key={r.slug}
                    href={`/rashifal/${r.slug}`}
                    className="flex flex-col items-center p-3 rounded-xl bg-white hover:shadow-md hover:-translate-y-0.5 transition-all text-center"
                    style={{ border: "1px solid rgba(212,168,67,0.15)" }}
                  >
                    <span className="w-10 h-10 mx-auto mb-1 rounded-lg flex items-center justify-center text-lg text-white" style={{ background: "linear-gradient(135deg, #7B2D8E, #9B59B6)" }}>
                      {r.symbol}
                    </span>
                    <span className="text-xs font-bold text-[#3d0c0c]">{t(r.mr, r.en)}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* FAQ Section — unique per rashi for SEO */}
            <section className="py-6">
              <h2 className="text-lg font-bold mb-4 text-[#5c1a1a]">
                {t(`${rashi.mr} राशीबद्दल सामान्य प्रश्न`, `FAQ about ${rashi.en} Horoscope`)}
              </h2>
              <div className="space-y-3">
                {[
                  {
                    q: t(`आजचे ${rashi.mr} राशीफल कसे तपासावे?`, `How to check today's ${rashi.en} horoscope?`),
                    a: t(
                      `भाग्यवेध वर ${rashi.mr} राशीचे दैनिक भविष्य वाचा. आमचे राशीफल वास्तविक ग्रह गोचरावर आधारित आहे — कॉपी-पेस्ट नाही. दररोज सकाळी अपडेट होते.`,
                      `Read ${rashi.en} daily horoscope on Bhaagyavedh. Our predictions are based on real planetary transits using precise astronomical data — not copy-pasted text. Updated every morning.`
                    ),
                  },
                  {
                    q: t(`${rashi.mr} राशीचे वैशिष्ट्य काय?`, `What are ${rashi.en} personality traits?`),
                    a: t(
                      `${rashi.mr} (${rashi.en}) राशीचे दैनिक भविष्य भाग्यवेध वर वाचा. वैदिक ज्योतिषात चंद्र राशी प्रमुख मानली जाते. दैनिक ग्रह गोचर या राशीवर कसा परिणाम करतो ते पहा.`,
                      `Read daily ${rashi.en} (${rashi.mr}) horoscope on Bhaagyavedh. In Vedic astrology, Moon sign is the primary reference. See how daily planetary transits affect this sign.`
                    ),
                  },
                  {
                    q: t(`${rashi.mr} राशीफल किती वेळा अपडेट होते?`, `How often is ${rashi.en} horoscope updated?`),
                    a: t(
                      `आमचे ${rashi.mr} राशीफल दररोज रिअल-टाइम ग्रह गोचर गणनेवर आधारित तयार होते. ग्रह वेगवेगळ्या राशींत संचार करतात तेव्हा भविष्य बदलते.`,
                      `Our ${rashi.en} horoscope is generated daily based on real-time planetary transit calculations. Predictions change as planets move through different signs.`
                    ),
                  },
                ].map((faq, i) => (
                  <details key={i} className="bg-white rounded-xl border border-[#d4a843]/20 overflow-hidden">
                    <summary className="px-5 py-4 cursor-pointer font-semibold text-sm text-[#5c1a1a] hover:bg-[#d4a843]/5">
                      {faq.q}
                    </summary>
                    <p className="px-5 pb-4 text-sm text-[#5c1a1a]/70 leading-relaxed">{faq.a}</p>
                  </details>
                ))}
              </div>
            </section>

            {/* SEO content block — helps Google understand page topic */}
            <section className="bg-[#FFF8E7]/50 rounded-2xl p-5 md:p-6" style={{ border: "1px solid rgba(212,168,67,0.1)" }}>
              <h2 className="text-sm font-bold mb-2 text-[#5c1a1a]">
                {t(`${rashi.mr} राशीफल — ${rashi.en} Horoscope Today`, `${rashi.en} Horoscope Today — ${rashi.mr} राशीफल`)}
              </h2>
              <p className="text-xs leading-relaxed text-[#5c1a1a]/60">
                {t(
                  `भाग्यवेध वर ${rashi.mr} (${rashi.en}) राशीचे दैनिक राशीफल वाचा. आमचे राशीफल वैदिक ज्योतिषशास्त्रातील ग्रह गोचर (planetary transits) गणनेवर आधारित आहे. लाहिरी अयनांश वापरून अचूक ग्रह स्थिती मोजली जाते. करिअर, प्रेम, आरोग्य आणि आर्थिक भविष्य दररोज अपडेट होते.`,
                  `Read daily ${rashi.en} (${rashi.mr}) horoscope at Bhaagyavedh. Our predictions are based on Vedic planetary transit calculations with Lahiri Ayanamsa for accurate sidereal positions. Career, love, health & finance predictions updated daily.`
                )}
              </p>
            </section>
          </>
        ) : (
          <div className="text-center py-16 text-stone-500">
            {t("राशीफल उपलब्ध नाही", "Horoscope not available")}
          </div>
        )}
      </div>
    </div>
  );
}
