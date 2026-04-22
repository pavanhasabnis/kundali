"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/astrology/language-context";
import { TIERS, type BillingCycle } from "@/lib/pricing";

function T(lang: string, mr: string, en: string, hi?: string): string {
  if (lang === "en") return en;
  if (lang === "hi") return hi ?? mr;
  return mr;
}

/** Path for CTA that leads to checkout. Unauth → login with redirect.
 *  Auth → /account?tab=payments with pre-filled plan + cycle query. */
function checkoutHref(args: {
  lang: string;
  plan: string;
  cycle?: BillingCycle;
  isLoggedIn: boolean;
}): string {
  const base = `/${args.lang}/account?tab=payments&plan=${args.plan}`;
  const qsCycle = args.cycle ? `&cycle=${args.cycle}` : "";
  if (args.isLoggedIn) return `${base}${qsCycle}`;
  const redirect = encodeURIComponent(`${base}${qsCycle}`);
  return `/${args.lang}/login?redirect=${redirect}`;
}

/* ─── Comparison matrix ─────────────────────────────────────── */

type CellValue = boolean | { mr: string; en: string; hi?: string };

interface ComparisonRow {
  featureMr: string;
  featureEn: string;
  featureHi: string;
  values: {
    free: CellValue;
    starter: CellValue;
    premium: CellValue;
    plus: CellValue;
  };
}

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    featureMr: "कुंडली निर्मिती",
    featureEn: "Kundli generation",
    featureHi: "कुंडली निर्माण",
    values: {
      free: { mr: "१/दिवस", en: "1/day", hi: "1/दिन" },
      starter: { mr: "३० एकूण", en: "30 total", hi: "30 कुल" },
      premium: { mr: "अमर्यादित", en: "Unlimited", hi: "असीमित" },
      plus: { mr: "अमर्यादित", en: "Unlimited", hi: "असीमित" },
    },
  },
  {
    featureMr: "सविस्तर कुंडली PDF (८०+ पान)",
    featureEn: "Detailed kundli PDF (80+ pages)",
    featureHi: "विस्तृत कुंडली PDF (80+ पृष्ठ)",
    values: { free: false, starter: true, premium: true, plus: true },
  },
  {
    featureMr: "गुण मिलान (३६-गुण)",
    featureEn: "Gun Milan (36-point)",
    featureHi: "गुण मिलान (36-गुण)",
    values: { free: true, starter: true, premium: true, plus: true },
  },
  {
    featureMr: "पंचांग, मुहूर्त शोध",
    featureEn: "Panchang, muhurat search",
    featureHi: "पंचांग, मुहूर्त खोज",
    values: { free: true, starter: true, premium: true, plus: true },
  },
  {
    featureMr: "दैनिक राशीभविष्य",
    featureEn: "Daily rashifal",
    featureHi: "दैनिक राशिफल",
    values: { free: true, starter: true, premium: true, plus: true },
  },
  {
    featureMr: "वार्षिक भविष्य रिपोर्ट (८०+ पान)",
    featureEn: "Yearly forecast report (80+ pages)",
    featureHi: "वार्षिक भविष्य (80+ पृष्ठ)",
    values: { free: false, starter: false, premium: true, plus: true },
  },
  {
    featureMr: "पंचांग WhatsApp alerts",
    featureEn: "Panchang WhatsApp alerts",
    featureHi: "पंचांग WhatsApp",
    values: { free: false, starter: false, premium: true, plus: true },
  },
  {
    featureMr: "छापील दिनदर्शिका घरपोच (वार्षिक)",
    featureEn: "Printed calendar shipped (yearly)",
    featureHi: "मुद्रित पंचांग घर पर (वार्षिक)",
    values: {
      free: false,
      starter: false,
      premium: { mr: "मोफत", en: "Free", hi: "मुफ्त" },
      plus: { mr: "मोफत", en: "Free", hi: "मुफ्त" },
    },
  },
  {
    featureMr: "बांधील कुंडली पुस्तक (घरपोच)",
    featureEn: "Bound kundli book (shipped)",
    featureHi: "बाउंड कुंडली पुस्तक",
    values: {
      free: { mr: "₹७९९", en: "₹799", hi: "₹799" },
      starter: { mr: "₹७९९", en: "₹799", hi: "₹799" },
      premium: { mr: "₹६४९", en: "₹649", hi: "₹649" },
      plus: { mr: "१ मोफत/वर्ष", en: "1 free/yr", hi: "1 मुफ्त/वर्ष" },
    },
  },
  {
    featureMr: "ज्योतिष सल्ला (१ तास/महिना)",
    featureEn: "Astrologer consultation (1hr/month)",
    featureHi: "ज्योतिष परामर्श (1 घंटे/माह)",
    values: { free: false, starter: false, premium: false, plus: true },
  },
  {
    featureMr: "प्राधान्य WhatsApp समर्थन",
    featureEn: "Priority WhatsApp support",
    featureHi: "प्राथमिकता WhatsApp",
    values: { free: false, starter: false, premium: false, plus: true },
  },
  {
    featureMr: "पूजा/यात्रा सेवेवर सवलत",
    featureEn: "Pooja/yatra service discount",
    featureHi: "पूजा/यात्रा छूट",
    values: {
      free: false,
      starter: false,
      premium: false,
      plus: { mr: "१०% सवलत", en: "10% off", hi: "10% छूट" },
    },
  },
];

const FAQS = [
  {
    qMr: "स्टार्टर ₹९९ आणि प्रीमियम मध्ये कोणती निवडावी?",
    qEn: "Starter ₹99 vs Premium — which should I pick?",
    qHi: "स्टार्टर ₹99 या प्रीमियम — क्या चुनें?",
    aMr: "स्टार्टर एकरकमी — ३० दिवसांच्या कालावधीत ३० सविस्तर कुंडल्या (कुटुंब, नातेवाईक, मित्रांसाठी). PDF तुमच्याकडे कायमच्या. प्रीमियम मासिक सदस्यता — अमर्यादित कुंडल्या, वार्षिक भविष्य, पंचांग alerts, दरमहा रिन्यू. गुण मिलान व मुहूर्त शोध मोफतच राहतात. मोफत १ कुंडली/दिवस नेहमीच आहे.",
    aEn: "Starter is one-time — 30 detailed kundlis in a 30-day pass (family, relatives, friends). PDFs yours forever. Premium is an ongoing monthly subscription — unlimited kundlis, yearly forecast, panchang alerts, auto-renew. Gun Milan and Muhurat search stay free for everyone. Everyone also gets 1 free kundli/day forever.",
    aHi: "स्टार्टर एकबारगी — 30 दिन में 30 विस्तृत कुंडली. PDF हमेशा आपकी. प्रीमियम मासिक — असीमित कुंडली, वार्षिक भविष्य. गुण मिलान व मुहूर्त मुफ्त रहते हैं. मुफ्त 1 कुंडली/दिन हमेशा है.",
  },
  {
    qMr: "वार्षिक योजनेत किती बचत?",
    qEn: "How much do I save with yearly billing?",
    qHi: "वार्षिक योजना में कितनी बचत?",
    aMr: "प्रीमियम वार्षिक ₹४,९९९ — मासिक ₹५९९ × १२ = ₹७,१८८ तुलनेत ₹२,१८९ बचत (३०%). प्लस वार्षिक ₹१२,९९९ — मासिक तुलनेत ₹४,९८९ बचत (२८%).",
    aEn: "Premium Yearly ₹4,999 saves ₹2,189 vs monthly (30% off). Plus Yearly ₹12,999 saves ₹4,989 vs monthly (28% off).",
    aHi: "प्रीमियम वार्षिक ₹4,999 में ₹2,189 बचत (30%). प्लस वार्षिक ₹12,999 में ₹4,989 बचत (28%).",
  },
  {
    qMr: "Plus मध्ये काय मिळते?",
    qEn: "What does Plus include?",
    qHi: "Plus में क्या मिलता है?",
    aMr: "Plus — प्रीमियमचे सर्व फायदे + १ तास तज्ञ ज्योतिष सल्ला/महिना + बांधील कुंडली पुस्तक वार्षिक मोफत + प्राधान्य WhatsApp + पूजा/यात्रेवर १०% सवलत.",
    aEn: "Plus includes everything in Premium + 1hr expert consultation/month + 1 bound kundli book free yearly + priority WhatsApp support + 10% off pooja and yatra services.",
    aHi: "Plus में प्रीमियम के सभी फायदे + 1 घंटे परामर्श/माह + बाउंड कुंडली पुस्तक वार्षिक + प्राथमिकता WhatsApp.",
  },
  {
    qMr: "सदस्यता रद्द करता येते का?",
    qEn: "Can I cancel my subscription?",
    qHi: "क्या मैं सदस्यता रद्द कर सकता हूं?",
    aMr: "होय, कोणत्याही वेळी अकाउंट पेजवरून. पुढील बिलिंग चक्र थांबते. स्टार्टर एकरकमी असल्याने रद्द करण्याचा प्रश्न नाही.",
    aEn: "Yes, anytime from your account page. Next billing cycle stops. Starter is one-time so there's no cancellation.",
    aHi: "हां, अकाउंट पेज से कभी भी. अगला बिलिंग चक्र रुक जाता है. स्टार्टर एकबारगी है.",
  },
  {
    qMr: "पेमेंट सुरक्षित आहे का?",
    qEn: "Is the payment secure?",
    qHi: "भुगतान सुरक्षित है?",
    aMr: "UPI, क्रेडिट/डेबिट कार्ड, नेट बँकिंग, वॉलेट — Razorpay (PCI-DSS प्रमाणित) द्वारे सुरक्षित. कार्ड माहिती कधीही आमच्या सर्व्हरवर साठवली जात नाही.",
    aEn: "UPI, credit/debit cards, net banking, wallets — secured via Razorpay (PCI-DSS certified). Card data never touches our servers.",
    aHi: "UPI, कार्ड, नेट बैंकिंग, वॉलेट — Razorpay (PCI-DSS) द्वारा सुरक्षित.",
  },
];

export default function PricingPageClient() {
  const { lang } = useLang();
  const [billing, setBilling] = useState<BillingCycle>("monthly");
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        if (data?.user?.email) {
          setIsLoggedIn(true);
          return fetch("/api/user")
            .then((r) => r.json())
            .then((u) => setCurrentPlan(u?.plan ?? null))
            .catch(() => {});
        }
      })
      .catch(() => {});
  }, []);

  const t = (mr: string, en: string, hi?: string) => T(lang, mr, en, hi);

  // Resolve prices based on selected cycle. Starter is always onetime.
  const starterTier = TIERS["starter:onetime"];
  const premiumTier = billing === "yearly" ? TIERS["premium:yearly"] : TIERS["premium:monthly"];
  const plusTier = billing === "yearly" ? TIERS["plus:yearly"] : TIERS["plus:monthly"];

  const priceSuffix = useMemo(
    () =>
      billing === "yearly"
        ? t("/वर्ष", "/year", "/वर्ष")
        : t("/महिना", "/month", "/माह"),
    [billing, lang],
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAFAF8] to-white">
      {/* ─── Hero ─── */}
      <section className="max-w-5xl mx-auto px-4 pt-14 pb-8 text-center">
        <p className="text-[#d4a843] text-sm font-semibold tracking-wider uppercase mb-3">
          {t("भाग्यवेध सदस्यता", "Bhaagyavedh Membership", "भाग्यवेध सदस्यता")}
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-[#3d0c0c] leading-tight mb-4">
          {t(
            "फक्त कुंडली नव्हे — वर्षभराचे वैदिक मार्गदर्शन",
            "Not just a kundli — a year of Vedic guidance",
            "सिर्फ कुंडली नहीं — साल भर का मार्गदर्शन",
          )}
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
          {t(
            "Parashara परंपरा · लाहिरी अयनांश · NASA JPL खगोलीय डेटा — तुमच्या जीवनाच्या प्रत्येक टप्प्यासाठी अचूक वैदिक मार्गदर्शन.",
            "Parashara tradition · Lahiri Ayanamsa · NASA JPL ephemeris — accurate Vedic guidance for every stage of your life.",
            "Parashara परंपरा · लाहिरी अयनांश · NASA JPL डेटा — आपके जीवन के हर चरण के लिए सटीक वैदिक मार्गदर्शन.",
          )}
        </p>

        {/* Billing toggle */}
        <div className="inline-flex items-center gap-2 mt-8 p-1 rounded-full border border-[#d4a843]/30 bg-white">
          <button
            onClick={() => setBilling("monthly")}
            className={`px-5 py-2 text-sm font-semibold rounded-full transition ${
              billing === "monthly" ? "bg-[#3d0c0c] text-[#d4a843]" : "text-gray-500"
            }`}
          >
            {t("मासिक", "Monthly", "मासिक")}
          </button>
          <button
            onClick={() => setBilling("yearly")}
            className={`px-5 py-2 text-sm font-semibold rounded-full transition ${
              billing === "yearly" ? "bg-[#3d0c0c] text-[#d4a843]" : "text-gray-500"
            }`}
          >
            {t("वार्षिक", "Yearly", "वार्षिक")}{" "}
            <span className="ml-1 text-[10px] bg-[#d4a843] text-[#3d0c0c] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
              {t("३०% सवलत", "Save 30%", "30% छूट")}
            </span>
          </button>
        </div>
      </section>

      {/* ─── Tier cards: Free, Starter, Premium, Plus ─── */}
      <section className="max-w-7xl mx-auto px-4 pt-6 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
          <PlanCard
            title={t("प्रारंभ (मोफत)", "Starter (Free)", "शुरुआत (मुफ्त)")}
            tagline={t("चाचणी करून पहा", "Try it out", "आज़माएं")}
            price="₹0"
            priceSuffix={t("कायम", "forever", "हमेशा")}
            outcome={t("१ कुंडली/दिवस + पंचांग + राशीभविष्य", "1 kundli/day + panchang + rashifal", "1 कुंडली/दिन + पंचांग + राशिफल")}
            bullets={[
              t("१ कुंडली PDF/दिवस", "1 kundli PDF/day", "1 कुंडली PDF/दिन"),
              t("दैनिक पंचांग + १२ राशी भविष्य", "Daily panchang + 12 rashi forecast", "दैनिक पंचांग + 12 राशि"),
              t("संग्रह — आरती, स्तोत्र, मंत्र", "Sangrah — aarti, stotra, mantra", "संग्रह — आरती, स्तोत्र"),
            ]}
            ctaLabel={t("मोफत सुरू करा", "Start free", "मुफ्त शुरू करें")}
            ctaHref={`/${lang}/kundli`}
            theme="neutral"
            isCurrent={currentPlan === "free"}
          />

          <PlanCard
            badge={t("लग्न · जन्म · उद्घाटन", "Wedding · Birth · Launch", "विवाह · जन्म · उद्घाटन")}
            title={t("स्टार्टर", "Starter", "स्टार्टर")}
            tagline={t("एकरकमी — नेहमीसाठी तुमची", "One-time — yours forever", "एक बार — हमेशा आपकी")}
            price={`₹${starterTier.rupees}`}
            priceSuffix={t("एकरकमी", "one-time", "एक बार")}
            outcome={t(
              "३० सविस्तर कुंडली — ३० दिवसांसाठी",
              "30 detailed kundlis — 30-day pass",
              "30 विस्तृत कुंडली — 30 दिन",
            )}
            bullets={[
              t("३० सविस्तर कुंडली (८०+ पान प्रत्येकी)", "30 detailed kundlis (80+ pages each)", "30 विस्तृत कुंडली (80+ पृष्ठ)"),
              t("PDF कायमची — डाउनलोड करून ठेवा", "PDFs yours forever — download + keep", "PDF हमेशा आपकी"),
              t("प्रिंट-रेडी · भेट म्हणून पाठवा", "Print-ready · share as gift", "प्रिंट-रेडी · उपहार"),
              t("डिजिटल-केवळ योजना — कोणतेही मासिक शुल्क नाही", "Digital-only plan — no recurring charges", "डिजिटल-केवल — कोई मासिक शुल्क नहीं"),
              t("अपग्रेडवर ₹९९ क्रेडिट", "₹99 credited on upgrade", "अपग्रेड पर ₹99 क्रेडिट"),
            ]}
            ctaLabel={`₹${starterTier.rupees} — ${t("घ्या", "Get", "लें")}`}
            ctaHref={checkoutHref({ lang, plan: "starter", cycle: "onetime", isLoggedIn })}
            theme="bronze"
            isCurrent={currentPlan === "starter"}
          />

          <PlanCard
            badge={t("सर्वाधिक लोकप्रिय", "Most popular", "सबसे लोकप्रिय")}
            title={t("प्रीमियम", "Premium", "प्रीमियम")}
            tagline={t("कुटुंब + वर्षभराचे मार्गदर्शन", "For families · year-round", "परिवार · साल भर")}
            price={`₹${premiumTier.rupees.toLocaleString("en-IN")}`}
            priceSuffix={priceSuffix}
            priceStrike={
              billing === "yearly" && premiumTier.monthlyEquivalentRupees
                ? `₹${premiumTier.monthlyEquivalentRupees.toLocaleString("en-IN")}`
                : undefined
            }
            outcome={t(
              "अमर्यादित कुंडली + वार्षिक भविष्य + पंचांग alerts",
              "Unlimited kundlis + yearly forecast + panchang alerts",
              "असीमित कुंडली + वार्षिक भविष्य",
            )}
            bullets={[
              t("अमर्यादित कुंडली PDF डाउनलोड", "Unlimited kundli PDF downloads", "असीमित कुंडली PDF"),
              t("वार्षिक भविष्य (८०+ पाने)", "Yearly forecast (80+ pages)", "वार्षिक भविष्य (80+ पृष्ठ)"),
              t("दैनिक पंचांग WhatsApp alerts", "Daily panchang WhatsApp alerts", "दैनिक पंचांग WhatsApp"),
              t("मोफत छापील दिनदर्शिका घरपोच (वार्षिक)", "Free printed calendar shipped home (yearly)", "मुफ्त मुद्रित पंचांग घर पर (वार्षिक)"),
              t("कुंडली पुस्तकावर २०% सवलत", "20% off kundli book", "कुंडली पुस्तक 20% छूट"),
            ]}
            ctaLabel={
              billing === "monthly"
                ? t(`₹${premiumTier.rupees} — मासिक घ्या`, `₹${premiumTier.rupees} — Subscribe`, `₹${premiumTier.rupees} — मासिक लें`)
                : t(`₹${premiumTier.rupees.toLocaleString("en-IN")} — वार्षिक घ्या`, `₹${premiumTier.rupees.toLocaleString("en-IN")} — Get yearly`, `₹${premiumTier.rupees.toLocaleString("en-IN")} — वार्षिक लें`)
            }
            ctaHref={checkoutHref({ lang, plan: "premium", cycle: billing, isLoggedIn })}
            theme="gold"
            highlight
            isCurrent={currentPlan === "premium"}
          />

          <PlanCard
            badge={t("सर्वोत्तम मूल्य", "Best value", "सर्वोत्तम")}
            title={t("प्लस", "Plus", "प्लस")}
            tagline={t("ज्योतिष सल्ला + पुस्तक", "Astrologer + book", "ज्योतिष + पुस्तक")}
            price={`₹${plusTier.rupees.toLocaleString("en-IN")}`}
            priceSuffix={priceSuffix}
            priceStrike={
              billing === "yearly" && plusTier.monthlyEquivalentRupees
                ? `₹${plusTier.monthlyEquivalentRupees.toLocaleString("en-IN")}`
                : undefined
            }
            scarcity={t("२० जागा/महिना", "20 slots/month", "20 सीटें/माह")}
            outcome={t(
              "१ तास तज्ञ सल्ला + बांधील पुस्तक + Premium",
              "1hr expert call + bound book + Premium",
              "1 घंटे परामर्श + बाउंड पुस्तक + Premium",
            )}
            bullets={[
              t("प्रीमियमचे सर्व फायदे", "Everything in Premium", "प्रीमियम सब"),
              t("१ तास ज्योतिष सल्ला/महिना", "1hr consultation/month", "1 घंटे/माह"),
              t("बांधील कुंडली पुस्तक वार्षिक मोफत", "Bound kundli book — 1 free/yr", "बाउंड पुस्तक 1 मुफ्त/वर्ष"),
              t("मोफत छापील दिनदर्शिका घरपोच (वार्षिक)", "Free printed calendar shipped home (yearly)", "मुफ्त मुद्रित पंचांग घर पर (वार्षिक)"),
              t("प्राधान्य WhatsApp (४८ तास)", "Priority WhatsApp (48h)", "प्राथमिकता WhatsApp"),
              t("पूजा/यात्रेवर १०% सवलत", "10% off pooja/yatra", "पूजा/यात्रा 10% छूट"),
            ]}
            ctaLabel={t("Plus घ्या", "Get Plus", "Plus लें")}
            ctaHref={checkoutHref({ lang, plan: "plus", cycle: billing, isLoggedIn })}
            theme="dark"
            isCurrent={currentPlan === "plus"}
          />

        </div>
      </section>

      {/* ─── Comparison table ─── */}
      <section className="max-w-5xl mx-auto px-4 pb-16 hidden md:block">
        <h2 className="text-2xl font-bold text-[#3d0c0c] text-center mb-6">
          {t("पूर्ण तुलना", "Full comparison", "पूरी तुलना")}
        </h2>
        <div className="overflow-x-auto bg-white border border-[#e5d5b5] rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#3d0c0c] text-[#d4a843]">
                <th className="text-left py-3 px-4 font-semibold">
                  {t("फीचर", "Feature", "फ़ीचर")}
                </th>
                <th className="text-center py-3 px-4 font-semibold">
                  {t("मोफत", "Free", "मुफ्त")}
                </th>
                <th className="text-center py-3 px-4 font-semibold">
                  {t("स्टार्टर ₹९९", "Starter ₹99", "स्टार्टर ₹99")}
                </th>
                <th className="text-center py-3 px-4 font-semibold bg-[#5c1a1a]">
                  {t("प्रीमियम", "Premium", "प्रीमियम")}
                </th>
                <th className="text-center py-3 px-4 font-semibold">
                  {t("प्लस", "Plus", "प्लस")}
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-[#faf7ee]" : "bg-white"}>
                  <td className="py-3 px-4 text-[#3d0c0c] font-medium">
                    {lang === "mr" ? row.featureMr : lang === "hi" ? row.featureHi : row.featureEn}
                  </td>
                  {(["free", "starter", "premium", "plus"] as const).map((tier) => {
                    const val = row.values[tier];
                    return (
                      <td
                        key={tier}
                        className={`py-3 px-4 text-center text-xs ${
                          tier === "premium" ? "bg-[#fff9eb]" : ""
                        }`}
                      >
                        {val === true ? (
                          <span className="text-emerald-700 font-bold">✓</span>
                        ) : val === false ? (
                          <span className="text-gray-300">—</span>
                        ) : (
                          <span className="text-[#3d0c0c] font-semibold">
                            {lang === "mr" ? val.mr : lang === "hi" ? val.hi ?? val.mr : val.en}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="max-w-3xl mx-auto px-4 pb-20">
        <h2 className="text-2xl font-bold text-[#3d0c0c] text-center mb-6">
          {t("वारंवार विचारले जाणारे प्रश्न", "Frequently Asked Questions", "सामान्य प्रश्न")}
        </h2>
        <div className="bg-white rounded-xl border border-[#e5d5b5] p-2">
          {FAQS.map((f, i) => (
            <FAQItem
              key={i}
              q={{ mr: f.qMr, en: f.qEn, hi: f.qHi }}
              a={{ mr: f.aMr, en: f.aEn, hi: f.aHi }}
              lang={lang}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

/* ─── Plan card ──────────────────────────────────────────────── */

interface PlanCardProps {
  badge?: string;
  title: string;
  tagline: string;
  price: string;
  priceSuffix?: string;
  priceStrike?: string;
  outcome: string;
  bullets: string[];
  ctaLabel: string;
  ctaHref: string;
  scarcity?: string;
  theme: "neutral" | "bronze" | "gold" | "dark";
  highlight?: boolean;
  isCurrent?: boolean;
}

function PlanCard(p: PlanCardProps) {
  const themes = {
    neutral: { bg: "bg-white", border: "border-gray-200", title: "text-[#3d0c0c]", price: "text-[#3d0c0c]" },
    bronze: { bg: "bg-white", border: "border-amber-700/40", title: "text-amber-900", price: "text-amber-900" },
    gold: { bg: "bg-white", border: "border-[#d4a843]", title: "text-[#3d0c0c]", price: "text-[#3d0c0c]" },
    dark: { bg: "bg-[#3d0c0c]", border: "border-[#3d0c0c]", title: "text-white", price: "text-[#d4a843]" },
  } as const;
  const th = themes[p.theme];
  const dark = p.theme === "dark";

  return (
    <div
      className={`relative rounded-2xl border-2 ${th.border} ${th.bg} p-6 flex flex-col ${
        p.highlight ? "shadow-xl md:scale-[1.03]" : "shadow-sm"
      }`}
    >
      {p.isCurrent && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-emerald-700 text-white">
          ✓ Current
        </div>
      )}
      {!p.isCurrent && p.badge && (
        <div
          className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase whitespace-nowrap ${
            p.highlight ? "bg-[#d4a843] text-[#3d0c0c]" : "bg-[#3d0c0c] text-[#d4a843]"
          }`}
        >
          {p.badge}
        </div>
      )}

      <h3 className={`text-xl font-bold mt-2 ${th.title}`}>{p.title}</h3>
      <p className={`text-xs mt-1 min-h-[2.25rem] ${dark ? "text-white/60" : "text-gray-500"}`}>
        {p.tagline}
      </p>

      <div className="mt-5 flex items-baseline flex-wrap gap-x-2 gap-y-1 min-h-[3rem]">
        {p.priceStrike && (
          <span className={`text-sm line-through ${dark ? "text-white/40" : "text-gray-400"}`}>
            {p.priceStrike}
          </span>
        )}
        <span className={`text-3xl font-bold leading-none ${th.price}`}>{p.price}</span>
        {p.priceSuffix && (
          <span className={`text-sm ${dark ? "text-white/60" : "text-gray-500"}`}>
            {p.priceSuffix}
          </span>
        )}
      </div>

      <div className="min-h-[1.5rem]">
        {p.scarcity && (
          <p className="mt-2 text-xs font-semibold text-red-600">⚡ {p.scarcity}</p>
        )}
      </div>

      <div className={`mt-3 py-3 px-3 rounded-lg text-sm font-medium min-h-[5rem] flex items-center ${dark ? "bg-white/5 text-white" : "bg-[#3d0c0c]/5 text-[#3d0c0c]"}`}>
        {p.outcome}
      </div>

      <ul className={`mt-4 space-y-2 text-sm flex-1 ${dark ? "text-white/80" : "text-gray-600"}`}>
        {p.bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-[#d4a843] mt-0.5">✓</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>

      {p.isCurrent ? (
        <div className="mt-6 py-3 text-center rounded-xl font-semibold text-sm bg-emerald-100 text-emerald-800 border border-emerald-200">
          ✓ Current plan
        </div>
      ) : (
        <Link
          href={p.ctaHref}
          className={`mt-6 block text-center py-3 rounded-xl text-sm font-semibold transition hover:scale-[1.02] ${
            p.theme === "neutral"
              ? "bg-white border-2 border-[#3d0c0c] text-[#3d0c0c]"
              : p.theme === "bronze"
                ? "bg-amber-700 text-white"
                : "text-[#3d0c0c]"
          }`}
          style={
            p.theme === "gold" || p.theme === "dark"
              ? { background: "linear-gradient(135deg, #d4a843, #e5bc5a)" }
              : undefined
          }
        >
          {p.ctaLabel}
        </Link>
      )}
    </div>
  );
}

function FAQItem({
  q,
  a,
  lang,
}: {
  q: { mr: string; en: string; hi: string };
  a: { mr: string; en: string; hi: string };
  lang: string;
}) {
  const [open, setOpen] = useState(false);
  const question = lang === "mr" ? q.mr : lang === "hi" ? q.hi : q.en;
  const answer = lang === "mr" ? a.mr : lang === "hi" ? a.hi : a.en;
  return (
    <div className="border-b border-[#e5d5b5] last:border-b-0 p-4">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center bg-transparent border-0 cursor-pointer p-0 text-left text-sm font-semibold text-[#3d0c0c]"
      >
        <span>{question}</span>
        <span
          className={`text-[#d4a843] text-xl transition-transform ${open ? "rotate-45" : ""}`}
        >
          +
        </span>
      </button>
      {open && (
        <div className="text-sm text-[#5c1a1a] leading-relaxed mt-3 pr-6">{answer}</div>
      )}
    </div>
  );
}
