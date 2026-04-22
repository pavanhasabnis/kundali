"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLang } from "@/lib/astrology/language-context";
import { RASHI_LIST } from "@/lib/rashi-data";
import { JsonLd, breadcrumbSchema, faqSchema } from "@/components/json-ld";
import { ZodiacBadge } from "@/components/zodiac-badge";

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
  narrative?: { mr: string; en: string };
  rating: number;
  transits: TransitInfo[];
  luckyColor: { mr: string; en: string };
  luckyNumber: number;
}

interface Props {
  rashiSlug: string;
  rashiId: number;
  initialPrediction?: Prediction | null;
  initialDate?: string;
}

export default function RashiPageClient({ rashiSlug, rashiId, initialPrediction = null, initialDate }: Props) {
  const { t, lang } = useLang();
  const [pred, setPred] = useState<Prediction | null>(initialPrediction);
  const [loading, setLoading] = useState(!initialPrediction);

  const rashi = RASHI_LIST[rashiId];
  const displayDate = initialDate
    ? (() => {
        const [y, m, d] = initialDate.split("-").map(Number);
        return new Date(y, m - 1, d);
      })()
    : new Date();
  const todayStr = displayDate.toLocaleDateString(lang === "mr" ? "mr-IN" : lang === "hi" ? "hi-IN" : "en-IN", {
    year: "numeric", month: "long", day: "numeric", weekday: "long",
  });

  useEffect(() => {
    if (initialPrediction) return;
    const q = initialDate ? `?rashi=${rashiId}&date=${initialDate}` : `?rashi=${rashiId}`;
    fetch(`/api/rashifal${q}`)
      .then((r) => r.json())
      .then((data) => {
        setPred(data.prediction);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [rashiId, initialPrediction, initialDate]);

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Structured Data */}
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: `https://bhaagyavedh.com/${lang}` },
          { name: t("राशीफल", "Rashifal", "राशिफल"), url: `https://bhaagyavedh.com/${lang}/rashifal` },
          { name: t(rashi.mr, rashi.en, rashi.mr), url: `https://bhaagyavedh.com/${lang}/rashifal/${rashiSlug}` },
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
          description: t(rashi.descMr, rashi.descEn, rashi.descMr),
          image: "https://bhaagyavedh.com/opengraph-image.png",
          url: `https://bhaagyavedh.com/${lang}/rashifal/${rashiSlug}`,
          datePublished: new Date().toISOString().split("T")[0],
          dateModified: new Date().toISOString().split("T")[0],
          author: { "@type": "Organization", name: "Bhaagyavedh", url: "https://bhaagyavedh.com" },
          publisher: {
            "@type": "Organization",
            name: "Bhaagyavedh",
            url: "https://bhaagyavedh.com",
            logo: { "@type": "ImageObject", url: "https://bhaagyavedh.com/logos/logo-dark.svg" },
          },
          mainEntityOfPage: { "@type": "WebPage", "@id": `https://bhaagyavedh.com/${lang}/rashifal/${rashiSlug}` },
          inLanguage: lang === "en" ? "en-IN" : lang === "hi" ? "hi-IN" : "mr-IN",
        }}
      />

      {/* Cinematic Hero — matches /mr/rashifal */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(145deg, #1a0505 0%, #3d0c0c 40%, #5c1a1a 100%)" }}>
        <svg aria-hidden className="absolute inset-0 w-full h-full opacity-15" preserveAspectRatio="xMidYMid slice">
          <defs>
            <pattern id="stars-rashi-sub" width="80" height="80" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="20" r="0.8" fill="#d4a843" />
              <circle cx="40" cy="55" r="1.2" fill="#d4a843" />
              <circle cx="65" cy="15" r="0.6" fill="#d4a843" />
              <circle cx="70" cy="70" r="0.9" fill="#d4a843" />
              <circle cx="20" cy="65" r="0.5" fill="#d4a843" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#stars-rashi-sub)" />
        </svg>

        <div className="relative max-w-6xl mx-auto px-4 py-14 sm:py-20 text-center">
          <div className="mb-6 flex justify-center">
            <Link href={`/${lang}/rashifal`} className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold hover:opacity-80" style={{ color: "#d4a843" }}>
              ← {t("सर्व राशी", "All Signs", "सभी राशियाँ")}
            </Link>
          </div>
          <div className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] font-semibold mb-5" style={{ color: "#d4a843" }}>
            <span className="h-px w-8" style={{ background: "#d4a843" }} />
            {t("वास्तविक ग्रह गोचर", "Live Transit", "वास्तविक ग्रह गोचर")}
            <span className="h-px w-8" style={{ background: "#d4a843" }} />
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-3" style={{ color: "#f5e6c8", fontFamily: "var(--font-heading)", letterSpacing: "-0.01em" }}>
            {t(`${rashi.mr} राशीफल आज`, `${rashi.en} Horoscope Today`, `${rashi.mr} राशिफल आज`)}
          </h1>
          <p className="text-lg sm:text-xl font-semibold tracking-wide" style={{ color: "#d4a843" }}>
            {todayStr}
          </p>
          <p className="mt-4 text-sm max-w-2xl mx-auto" style={{ color: "rgba(245,230,200,0.7)" }}>
            {t(`${rashi.mr} राशीचे आजचे अचूक भविष्य — लाहिरी अयनांशावर आधारित वैदिक गोचर.`,
               `${rashi.en}'s precise daily horoscope — Vedic transits via Lahiri ayanamsa.`,
               `${rashi.mr} राशि का आज का सटीक भविष्य — लाहिरी अयनांश आधारित.`)}
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-8 h-8 border-3 border-[#f0c040]/30 border-t-[#8b2c2c] rounded-full animate-spin" />
            <p className="mt-4 text-stone-500">{t("गोचर गणना चालू...", "Calculating transits...", "गोचर गणना चल रही...")}</p>
          </div>
        ) : pred ? (
          <>
            {/* Lucky Info Strip */}
            <div className="grid grid-cols-3 rounded-xl overflow-hidden" style={{ border: "1px solid rgba(212,168,67,0.2)" }}>
              <div className="p-4 text-center bg-[#FFF8E7]" style={{ borderRight: "1px solid rgba(212,168,67,0.15)" }}>
                <p className="text-[10px] uppercase tracking-wider text-[#8b6914]">{t("भाग्यशाली रंग", "Lucky Color", "भाग्यशाली रंग")}</p>
                <p className="font-semibold text-sm mt-1 text-[#3d0c0c]">{t(pred.luckyColor.mr, pred.luckyColor.en, pred.luckyColor.mr)}</p>
              </div>
              <div className="p-4 text-center bg-[#FFF8E7]" style={{ borderRight: "1px solid rgba(212,168,67,0.15)" }}>
                <p className="text-[10px] uppercase tracking-wider text-[#8b6914]">{t("भाग्यांक", "Lucky Number", "भाग्यांक")}</p>
                <p className="font-semibold text-sm mt-1 text-[#3d0c0c]">{pred.luckyNumber}</p>
              </div>
              <div className="p-4 text-center bg-[#FFF8E7]">
                <p className="text-[10px] uppercase tracking-wider text-[#8b6914]">{t("दिनांक", "Date", "दिनांक")}</p>
                <p className="font-semibold text-sm mt-1 text-[#3d0c0c]">
                  {new Date().toLocaleDateString(lang === "mr" ? "mr-IN" : lang === "hi" ? "hi-IN" : "en-IN", { day: "numeric", month: "long" })}
                </p>
              </div>
            </div>

            {/* Pure narrative — jargon-free flowing prose */}
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8" style={{ border: "1px solid rgba(212,168,67,0.2)" }}>
              <h2 className="text-[11px] uppercase tracking-wider font-bold mb-4" style={{ color: "#8b6914" }}>
                {t(`${rashi.mr} राशीचे आजचे भविष्य`, `${rashi.en} — Today's Horoscope`, `${rashi.mr} राशि का आज का भविष्य`)}
              </h2>
              <div className="space-y-4">
                {(pred.narrative ? t(pred.narrative.mr, pred.narrative.en, pred.narrative.mr) : t(pred.overall.mr, pred.overall.en, pred.overall.mr))
                  .split("\n\n").map((p) => p.trim()).filter(Boolean).map((para, i) => (
                    <p
                      key={i}
                      className={`text-[17px] leading-[1.85] ${i === 0 ? "first-letter:text-5xl first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-[0.9]" : ""}`}
                      style={{ color: "#3d0c0c", fontFamily: "serif" }}
                    >
                      {para}
                    </p>
                  ))}
              </div>
              <div className="mt-6 pt-5 rounded-xl p-5 flex items-start gap-4" style={{ background: "linear-gradient(135deg, #FFF8E7, #FFFDF5)", border: "1px solid rgba(212,168,67,0.3)" }}>
                <div className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: "linear-gradient(135deg, #d4a843, #b38a2d)" }}>!</div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider font-bold mb-1" style={{ color: "#8b6914" }}>
                    {t("आजचा सल्ला", "Today's Advice", "आज की सलाह")}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "#3d0c0c" }}>{t(pred.advice.mr, pred.advice.en, pred.advice.mr)}</p>
                </div>
              </div>
            </div>

            {/* Transit Details */}
            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm" style={{ border: "1px solid rgba(212,168,67,0.2)" }}>
              <h2 className="text-sm font-bold mb-3 text-[#5c1a1a]">
                {t(`${rashi.mr} राशीवरील आजचे गोचर`, `Today's Transits for ${rashi.en}`, `${rashi.mr} राशि पर आज का गोचर`)}
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
                    <p className="font-semibold">{t(tr.planetMr, tr.planet, tr.planetMr)}</p>
                    <p className="mt-0.5">{t(`${tr.house}वा भाव`, `House ${tr.house}`, `${tr.house}वाँ भाव`)}</p>
                    <p className="text-[10px] mt-0.5 font-semibold">
                      {tr.effect === "good" ? t("शुभ", "Good", "शुभ") : t("सावध", "Caution", "सावधान")}
                    </p>
                  </div>
                ))}
              </div>
              <p className="text-[10px] mt-3 text-[#8b2c2c]/40">
                {t("वरील भविष्य वास्तविक ग्रह गोचरावर आधारित आहे (लाहिरी अयनांश)", "Based on real planetary transit positions (Lahiri Ayanamsa)", "उपरोक्त भविष्य वास्तविक ग्रह गोचर पर आधारित है (लाहिरी अयनांश)")}
              </p>
            </div>

            {/* Other Rashis Navigation */}
            <div>
              <h2 className="text-base font-bold text-[#3d0c0c] mb-3">
                {t("इतर राशींचे आजचे भविष्य", "Today's Horoscope for Other Signs", "अन्य राशियों का आज का भविष्य")}
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {RASHI_LIST.filter((r) => r.id !== rashiId).map((r) => (
                  <Link
                    key={r.slug}
                    href={`/rashifal/${r.slug}`}
                    className="flex flex-col items-center p-3 rounded-xl bg-white hover:shadow-md hover:-translate-y-0.5 transition-all text-center"
                    style={{ border: "1px solid rgba(212,168,67,0.15)" }}
                  >
                    <ZodiacBadge slug={r.slug} size={40} />
                    <span className="text-xs font-bold text-[#3d0c0c]">{t(r.mr, r.en, r.mr)}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* FAQ Section — unique per rashi for SEO */}
            <section className="py-6">
              <h2 className="text-lg font-bold mb-4 text-[#5c1a1a]">
                {t(`${rashi.mr} राशीबद्दल सामान्य प्रश्न`, `FAQ about ${rashi.en} Horoscope`, `${rashi.mr} राशि के बारे में सामान्य प्रश्न`)}
              </h2>
              <div className="space-y-3">
                {[
                  {
                    q: t(`आजचे ${rashi.mr} राशीफल कसे तपासावे?`, `How to check today's ${rashi.en} horoscope?`, `आज का ${rashi.mr} राशिफल कैसे देखें?`),
                    a: t(
                      `भाग्यवेध वर ${rashi.mr} राशीचे दैनिक भविष्य वाचा. आमचे राशीफल वास्तविक ग्रह गोचरावर आधारित आहे — कॉपी-पेस्ट नाही. दररोज सकाळी अपडेट होते.`,
                      `Read ${rashi.en} daily horoscope on Bhaagyavedh. Our predictions are based on real planetary transits using precise astronomical data — not copy-pasted text. Updated every morning.`,
                      `भाग्यवेध पर ${rashi.mr} राशि का दैनिक भविष्य पढ़ें. हमारा राशिफल वास्तविक ग्रह गोचर पर आधारित है — कॉपी-पेस्ट नहीं. प्रतिदिन सुबह अपडेट होता है.`
                    ),
                  },
                  {
                    q: t(`${rashi.mr} राशीचे वैशिष्ट्य काय?`, `What are ${rashi.en} personality traits?`, `${rashi.mr} राशि की विशेषता क्या है?`),
                    a: t(
                      `${rashi.mr} (${rashi.en}) राशीचे दैनिक भविष्य भाग्यवेध वर वाचा. वैदिक ज्योतिषात चंद्र राशी प्रमुख मानली जाते. दैनिक ग्रह गोचर या राशीवर कसा परिणाम करतो ते पहा.`,
                      `Read daily ${rashi.en} (${rashi.mr}) horoscope on Bhaagyavedh. In Vedic astrology, Moon sign is the primary reference. See how daily planetary transits affect this sign.`,
                      `${rashi.mr} (${rashi.en}) राशि का दैनिक भविष्य भाग्यवेध पर पढ़ें. वैदिक ज्योतिष में चंद्र राशि प्रमुख मानी जाती है. दैनिक ग्रह गोचर का इस राशि पर प्रभाव देखें.`
                    ),
                  },
                  {
                    q: t(`${rashi.mr} राशीफल किती वेळा अपडेट होते?`, `How often is ${rashi.en} horoscope updated?`, `${rashi.mr} राशिफल कितनी बार अपडेट होता है?`),
                    a: t(
                      `आमचे ${rashi.mr} राशीफल दररोज रिअल-टाइम ग्रह गोचर गणनेवर आधारित तयार होते. ग्रह वेगवेगळ्या राशींत संचार करतात तेव्हा भविष्य बदलते.`,
                      `Our ${rashi.en} horoscope is generated daily based on real-time planetary transit calculations. Predictions change as planets move through different signs.`,
                      `हमारा ${rashi.mr} राशिफल प्रतिदिन रियल-टाइम ग्रह गोचर गणना के आधार पर तैयार होता है. जब ग्रह विभिन्न राशियों में संचार करते हैं तो भविष्य बदलता है.`
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
                {t(`${rashi.mr} राशीफल — ${rashi.en} Horoscope Today`, `${rashi.en} Horoscope Today — ${rashi.mr} राशीफल`, `${rashi.mr} राशिफल — ${rashi.en} Horoscope Today`)}
              </h2>
              <p className="text-xs leading-relaxed text-[#5c1a1a]/60">
                {t(
                  `भाग्यवेध वर ${rashi.mr} (${rashi.en}) राशीचे दैनिक राशीफल वाचा. आमचे राशीफल वैदिक ज्योतिषशास्त्रातील ग्रह गोचर (planetary transits) गणनेवर आधारित आहे. लाहिरी अयनांश वापरून अचूक ग्रह स्थिती मोजली जाते. करिअर, प्रेम, आरोग्य आणि आर्थिक भविष्य दररोज अपडेट होते.`,
                  `Read daily ${rashi.en} (${rashi.mr}) horoscope at Bhaagyavedh. Our predictions are based on Vedic planetary transit calculations with Lahiri Ayanamsa for accurate sidereal positions. Career, love, health & finance predictions updated daily.`,
                  `भाग्यवेध पर ${rashi.mr} (${rashi.en}) राशि का दैनिक राशिफल पढ़ें. हमारा राशिफल वैदिक ज्योतिष के ग्रह गोचर (planetary transits) गणना पर आधारित है. लाहिरी अयनांश का उपयोग करके सटीक ग्रह स्थिति मापी जाती है. करियर, प्रेम, स्वास्थ्य और वित्त का भविष्य प्रतिदिन अपडेट होता है.`
                )}
              </p>
            </section>
          </>
        ) : (
          <div className="text-center py-16 text-stone-500">
            {t("राशीफल उपलब्ध नाही", "Horoscope not available", "राशिफल उपलब्ध नहीं")}
          </div>
        )}
      </div>
    </div>
  );
}
