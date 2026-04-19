"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/astrology/language-context";

type Tier = "free" | "premium" | "plus";

interface PlanFeature {
  mr: string;
  en: string;
  hi: string;
  tiers: Record<Tier, boolean | string>;
}

function translateToken(token: string, lang: string): string {
  const map: Record<string, { en: string; hi: string; mr: string }> = {
    "अमर्यादित": { mr: "अमर्यादित", en: "Unlimited", hi: "असीमित" },
    "१": { mr: "१", en: "1", hi: "1" },
    "२०% सवलत": { mr: "२०% सवलत", en: "20% off", hi: "20% छूट" },
    "दरमहा १": { mr: "दरमहा १", en: "1 / month", hi: "1 / माह" },
    "वर्षी १ मोफत": { mr: "वर्षी १ मोफत", en: "1 free / year", hi: "1 मुफ्त / वर्ष" },
  };
  const entry = map[token];
  if (!entry) return token;
  return entry[lang as "mr" | "en" | "hi"] ?? entry.mr;
}

const PLAN_FEATURES: PlanFeature[] = [
  { mr: "कुंडली (जन्म पत्रिका)", en: "Kundli (birth chart)", hi: "कुंडली (जन्म पत्रिका)", tiers: { free: "१", premium: "अमर्यादित", plus: "अमर्यादित" } },
  { mr: "सविस्तर कुंडली PDF डाउनलोड (अमर्यादित)", en: "Detailed kundli PDF download (unlimited)", hi: "विस्तृत कुंडली PDF डाउनलोड (असीमित)", tiers: { free: false, premium: true, plus: true } },
  { mr: "दशा विश्लेषण व उपाय", en: "Dasha analysis & remedies", hi: "दशा विश्लेषण व उपाय", tiers: { free: false, premium: true, plus: true } },
  { mr: "गुण मिलान (३६ गुण)", en: "Gun Milaan (36 guna)", hi: "गुण मिलान (36 गुण)", tiers: { free: true, premium: true, plus: true } },
  { mr: "पंचांग, राशीफल, कॅलेंडर", en: "Panchang, rashifal, calendar", hi: "पंचांग, राशिफल, कैलेंडर", tiers: { free: true, premium: true, plus: true } },
  { mr: "मुहूर्त शोधक", en: "Muhurat finder", hi: "मुहूर्त खोजक", tiers: { free: true, premium: true, plus: true } },
  { mr: "छापील दिनदर्शिका घरपोच", en: "Printed calendar shipped home", hi: "मुद्रित पंचांग घर पर", tiers: { free: false, premium: true, plus: true } },
  { mr: "बांधील छापील कुंडली पुस्तक (घरपोच)", en: "Bound printed kundli book (shipped)", hi: "बाउंड मुद्रित कुंडली पुस्तक (घर पर)", tiers: { free: false, premium: "२०% सवलत", plus: "वर्षी १ मोफत" } },
  { mr: "ज्योतिषाशी सल्लामसलत", en: "Consultation with astrologer", hi: "ज्योतिषी परामर्श", tiers: { free: false, premium: false, plus: "दरमहा १" } },
  { mr: "पूजा बुकिंग सवलत", en: "Pooja booking discount", hi: "पूजा बुकिंग छूट", tiers: { free: false, premium: false, plus: true } },
  { mr: "प्राधान्य समर्थन", en: "Priority support", hi: "प्राथमिकता समर्थन", tiers: { free: false, premium: true, plus: true } },
];

const FAQS = [
  {
    qMr: "सदस्यता कशी कार्य करते?",
    qEn: "How does the subscription work?",
    qHi: "सदस्यता कैसे काम करती है?",
    aMr: "Premium ₹५९९/महिना — दरमहा आकारणी, कोणत्याही वेळी रद्द करा. Plus ₹१५००/महिना — समान अटी, अतिरिक्त फायदे.",
    aEn: "Premium ₹599/month — billed monthly, cancel anytime. Plus ₹1500/month — same terms, extra perks.",
    aHi: "Premium ₹599/माह — मासिक बिलिंग, कभी भी रद्द करें. Plus ₹1500/माह — वही शर्तें, अतिरिक्त लाभ.",
  },
  {
    qMr: "अमर्यादित PDF व १ छापील पुस्तक यात फरक काय?",
    qEn: "What's the difference between unlimited PDF and 1 printed book?",
    qHi: "असीमित PDF और 1 मुद्रित पुस्तक में क्या अंतर?",
    aMr: "Premium व Plus सदस्यांना अमर्यादित डिजिटल PDF कुंडल्या डाउनलोड करता येतात — स्वतःची, कुटुंबाची, मित्रांची. छापील बांधील पुस्तक मात्र घरपोच येते — छपाई व शिपिंग खर्चामुळे Plus मध्ये वर्षी १ मोफत, Premium मध्ये २०% सवलतीत.",
    aEn: "Premium and Plus members can download unlimited digital kundli PDFs — for themselves, family, friends. The printed bound book is shipped physically — due to print + shipping costs, Plus includes 1 free per year, Premium gets 20% off.",
    aHi: "Premium व Plus सदस्य असीमित डिजिटल PDF कुंडली डाउनलोड कर सकते हैं — अपनी, परिवार, मित्रों की. मुद्रित बाउंड पुस्तक घर पर भेजी जाती है — छपाई + शिपिंग लागत के कारण Plus में 1 मुफ्त/वर्ष, Premium में 20% छूट.",
  },
  {
    qMr: "छापील दिनदर्शिका कशी मिळते?",
    qEn: "How do I get the printed calendar?",
    qHi: "मुद्रित पंचांग कैसे मिलता है?",
    aMr: "दरवर्षी डिसेंबर-जानेवारीमध्ये तुमच्या नोंदणीकृत पत्त्यावर पाठवली जाते. फक्त Premium व Plus सदस्यांसाठी.",
    aEn: "Shipped every December-January to your registered address. Only for Premium and Plus members.",
    aHi: "हर साल दिसंबर-जनवरी में आपके पंजीकृत पते पर भेजा जाता है. केवल Premium और Plus सदस्यों के लिए.",
  },
  {
    qMr: "वैयक्तिक सल्लामसलत कशी होते?",
    qEn: "How does personal consultation work?",
    qHi: "व्यक्तिगत परामर्श कैसे होता है?",
    aMr: "Plus सदस्यांना दरमहा एक ३०-मिनिट सल्लामसलत — WhatsApp/फोन/व्हिडिओ. तुमच्या कुंडलीनुसार वैयक्तिक सल्ला.",
    aEn: "Plus members get one 30-minute consultation per month via WhatsApp/call/video — personal advice based on your kundli.",
    aHi: "Plus सदस्यों को मासिक 30-मिनट परामर्श — WhatsApp/कॉल/वीडियो. आपकी कुंडली के अनुसार सलाह.",
  },
  {
    qMr: "कोणती पेमेंट पद्धत स्वीकारता?",
    qEn: "What payment methods do you accept?",
    qHi: "कौन से भुगतान स्वीकार करते हैं?",
    aMr: "UPI, क्रेडिट/डेबिट कार्ड, नेट बँकिंग, वॉलेट — Razorpay द्वारे सुरक्षित.",
    aEn: "UPI, credit/debit cards, net banking, wallets — secured via Razorpay.",
    aHi: "UPI, क्रेडिट/डेबिट कार्ड, नेट बैंकिंग, वॉलेट — Razorpay द्वारा सुरक्षित.",
  },
  {
    qMr: "सदस्यता रद्द करता येते का?",
    qEn: "Can I cancel my subscription?",
    qHi: "क्या मैं सदस्यता रद्द कर सकता हूं?",
    aMr: "होय, कोणत्याही वेळी. अकाउंट पेजवरून रद्द करा. पुढील बिलिंग चक्र थांबते.",
    aEn: "Yes, anytime. Cancel from your account page. Next billing cycle stops.",
    aHi: "हां, किसी भी समय. अकाउंट पेज से रद्द करें. अगला बिलिंग चक्र रुक जाता है.",
  },
];

interface PlanCardProps {
  tier: Tier;
  featured?: boolean;
  lang: string;
  t: (mr: string, en: string, hi?: string) => string;
  currentPlan: string | null;
  isLoggedIn: boolean;
}

function PlanCard({ tier, featured, lang, t, currentPlan, isLoggedIn }: PlanCardProps) {
  const titles = {
    free: { mr: "Free", en: "Free", hi: "Free" },
    premium: { mr: "Premium", en: "Premium", hi: "Premium" },
    plus: { mr: "Premium Plus", en: "Premium Plus", hi: "Premium Plus" },
  };
  const prices = {
    free: { amount: 0, label: t("कायम", "Forever", "हमेशा") },
    premium: { amount: 599, label: `/${t("महिना", "month", "माह")}` },
    plus: { amount: 1500, label: `/${t("महिना", "month", "माह")}` },
  };
  const subtitles = {
    free: t("सुरुवात करण्यासाठी", "To get started", "शुरू करने के लिए"),
    premium: t("सर्वाधिक लोकप्रिय", "Most popular", "सबसे लोकप्रिय"),
    plus: t("पूर्ण अनुभव", "Complete experience", "पूर्ण अनुभव"),
  };
  const ctaText = {
    free: t("विनामूल्य सुरुवात", "Start Free", "मुफ्त शुरू करें"),
    premium: t("Premium घ्या", "Get Premium", "Premium लें"),
    plus: t("Plus घ्या", "Get Plus", "Plus लें"),
  };

  const title = titles[tier][lang as "mr" | "en" | "hi"] ?? titles[tier].mr;
  const price = prices[tier];
  const accent = tier === "plus" ? "#d4a843" : tier === "premium" ? "#d4a843" : "#9b8b6e";
  const isCurrent = currentPlan === tier;
  const borderColor = isCurrent ? "#2d6b2d" : featured ? "#d4a843" : "#e5d5b5";
  const borderWidth = isCurrent || featured ? 2 : 1;

  const tierFeatures = PLAN_FEATURES.filter(f => f.tiers[tier] !== false);
  const ctaHref = tier === "free"
    ? (isLoggedIn ? `/${lang}/account` : `/${lang}/login?redirect=/${lang}/account`)
    : (isLoggedIn ? `/${lang}/account?tab=payments` : `/${lang}/login?redirect=/${lang}/account?tab=payments`);

  return (
    <div style={{
      background: "#fffdf6",
      border: `${borderWidth}px solid ${borderColor}`,
      borderRadius: 12,
      padding: "28px 24px",
      boxShadow: featured ? "0 8px 24px rgba(212,168,67,0.2)" : "0 2px 10px rgba(61,12,12,0.05)",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: 18,
      transform: featured ? "scale(1.02)" : "none",
    }}>
      {isCurrent && (
        <span style={{
          position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
          background: "#2d6b2d", color: "#fff", fontSize: 11, fontWeight: 700,
          padding: "4px 14px", borderRadius: 20, letterSpacing: "0.5px",
          textTransform: "uppercase", whiteSpace: "nowrap",
        }}>
          ✓ {t("तुमची योजना", "Your Plan", "आपकी योजना")}
        </span>
      )}
      {!isCurrent && featured && (
        <span style={{
          position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
          background: "linear-gradient(135deg, #d4a843, #b88f38)",
          color: "#3d0c0c", fontSize: 11, fontWeight: 700,
          padding: "4px 14px", borderRadius: 20, letterSpacing: "0.5px",
          textTransform: "uppercase", whiteSpace: "nowrap",
        }}>
          ⭐ {t("शिफारस", "Recommended", "अनुशंसित")}
        </span>
      )}
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#3d0c0c", letterSpacing: "-0.5px" }}>{title}</div>
        <div style={{ fontSize: 12, color: accent, fontWeight: 600, marginTop: 3, letterSpacing: "0.3px", textTransform: "uppercase" }}>
          {subtitles[tier]}
        </div>
      </div>
      <div style={{ borderBottom: "1px solid #e5d5b5", paddingBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
          <span style={{ fontSize: 36, fontWeight: 700, color: "#3d0c0c", lineHeight: 1 }}>
            {price.amount === 0 ? t("मोफत", "FREE", "मुफ्त") : `₹${price.amount}`}
          </span>
          {price.amount > 0 && (
            <span style={{ fontSize: 14, color: "#6b5b3e" }}>{price.label}</span>
          )}
          {price.amount === 0 && (
            <span style={{ fontSize: 12, color: "#6b5b3e", marginLeft: 4 }}>· {price.label}</span>
          )}
        </div>
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        {tierFeatures.map((f, i) => {
          const label = lang === "mr" ? f.mr : lang === "hi" ? f.hi : f.en;
          const val = f.tiers[tier];
          const valStr = typeof val === "string" ? val : null;
          return (
            <li key={i} style={{ fontSize: 13, color: "#3d0c0c", display: "flex", gap: 10, alignItems: "flex-start", lineHeight: 1.4 }}>
              <span style={{ color: "#2d6b2d", fontWeight: 700, flexShrink: 0, fontSize: 15 }}>✓</span>
              <span style={{ flex: 1 }}>
                {label}
                {valStr && <strong style={{ color: accent, marginLeft: 4 }}>({translateToken(valStr, lang)})</strong>}
              </span>
            </li>
          );
        })}
      </ul>
      {isCurrent ? (
        <div style={{
          padding: "14px 20px", background: "#d4f0d4", color: "#2d6b2d",
          border: "1.5px solid #2d6b2d", borderRadius: 8, fontWeight: 700,
          fontSize: 15, textAlign: "center",
        }}>
          ✓ {t("सध्याची योजना", "Current Plan", "वर्तमान योजना")}
        </div>
      ) : (
        <Link href={ctaHref} style={{
          padding: "14px 20px",
          background: tier === "free"
            ? "#fff"
            : "linear-gradient(135deg, #3d0c0c, #5c1a1a)",
          color: tier === "free" ? "#3d0c0c" : "#d4a843",
          border: tier === "free" ? "1.5px solid #3d0c0c" : "1.5px solid #d4a843",
          borderRadius: 8,
          fontWeight: 700,
          fontSize: 15,
          textAlign: "center",
          textDecoration: "none",
          display: "block",
          transition: "all 0.2s",
        }}>
          {ctaText[tier]}
        </Link>
      )}
      {tier !== "free" && !isCurrent && (
        <div style={{ fontSize: 11, color: "#6b5b3e", textAlign: "center", marginTop: -6 }}>
          {t("कधीही रद्द करा · सुरक्षित पेमेंट", "Cancel anytime · Secure payment", "कभी भी रद्द करें · सुरक्षित भुगतान")}
        </div>
      )}
    </div>
  );
}

function FAQItem({ q, a, lang }: { q: { mr: string; en: string; hi: string }; a: { mr: string; en: string; hi: string }; lang: string }) {
  const [open, setOpen] = useState(false);
  const question = lang === "mr" ? q.mr : lang === "hi" ? q.hi : q.en;
  const answer = lang === "mr" ? a.mr : lang === "hi" ? a.hi : a.en;
  return (
    <div style={{ borderBottom: "1px solid #e5d5b5", padding: "16px 0" }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
        background: "transparent", border: "none", cursor: "pointer", padding: 0, textAlign: "left",
        fontSize: 15, fontWeight: 600, color: "#3d0c0c",
      }}>
        <span>{question}</span>
        <span style={{ color: "#d4a843", fontSize: 20, transform: open ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
      </button>
      {open && (
        <div style={{ fontSize: 14, color: "#5c1a1a", lineHeight: 1.6, marginTop: 10, paddingRight: 30 }}>
          {answer}
        </div>
      )}
    </div>
  );
}

export default function PricingPageClient() {
  const { t, lang } = useLang();
  const [currentPlan, setCurrentPlan] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session")
      .then(r => r.json())
      .then(data => {
        if (data?.user?.email) {
          setIsLoggedIn(true);
          return fetch("/api/user").then(r => r.json()).then(u => setCurrentPlan(u?.plan ?? null)).catch(() => {});
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#fffaf0" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "60px 20px 30px", textAlign: "center" }}>
        <div style={{ display: "inline-block", padding: "5px 14px", background: "#fff3d6", color: "#5c1a1a", fontSize: 11, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", borderRadius: 20, marginBottom: 16 }}>
          {t("सदस्यता योजना", "Subscription Plans", "सदस्यता योजनाएं")}
        </div>
        <h1 style={{ fontSize: 40, color: "#3d0c0c", margin: 0, fontWeight: 700, letterSpacing: "-1px", lineHeight: 1.1 }}>
          {t("तुमच्यासाठी योग्य योजना निवडा", "Choose the plan that's right for you", "आपके लिए सही योजना चुनें")}
        </h1>
        <p style={{ fontSize: 16, color: "#6b5b3e", marginTop: 14, maxWidth: 600, marginLeft: "auto", marginRight: "auto", lineHeight: 1.5 }}>
          {t(
            "विनामूल्य कुंडली व पंचांग — किंवा Premium सदस्य व्हा आणि अमर्यादित कुंडली, छापील दिनदर्शिका व अधिक मिळवा.",
            "Free kundli & panchang — or become a Premium member for unlimited kundlis, printed calendar, and more.",
            "मुफ्त कुंडली व पंचांग — या Premium सदस्य बनें और असीमित कुंडली, मुद्रित पंचांग और अधिक पाएं."
          )}
        </p>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 20px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, alignItems: "stretch" }}>
          <PlanCard tier="free" lang={lang} t={t} currentPlan={currentPlan} isLoggedIn={isLoggedIn} />
          <PlanCard tier="premium" featured lang={lang} t={t} currentPlan={currentPlan} isLoggedIn={isLoggedIn} />
          <PlanCard tier="plus" lang={lang} t={t} currentPlan={currentPlan} isLoggedIn={isLoggedIn} />
        </div>
      </div>

      <div style={{ background: "#fff", borderTop: "1px solid #e5d5b5", borderBottom: "1px solid #e5d5b5" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "50px 20px" }}>
          <h2 style={{ fontSize: 28, color: "#3d0c0c", textAlign: "center", margin: "0 0 36px", fontWeight: 700 }}>
            {t("सर्व तुलना", "Compare all plans", "सभी योजनाओं की तुलना")}
          </h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #d4a843" }}>
                  <th style={{ textAlign: "left", padding: "12px 16px", color: "#6b5b3e", fontWeight: 600, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.5px" }}>{t("वैशिष्ट्य", "Feature", "विशेषता")}</th>
                  <th style={{ textAlign: "center", padding: "12px 16px", color: "#3d0c0c", fontWeight: 700 }}>Free</th>
                  <th style={{ textAlign: "center", padding: "12px 16px", color: "#3d0c0c", fontWeight: 700, background: "#fff3d6" }}>
                    Premium<br /><span style={{ fontSize: 11, fontWeight: 400, color: "#6b5b3e" }}>₹599/{t("महिना", "mo", "माह")}</span>
                  </th>
                  <th style={{ textAlign: "center", padding: "12px 16px", color: "#3d0c0c", fontWeight: 700 }}>
                    Plus<br /><span style={{ fontSize: 11, fontWeight: 400, color: "#6b5b3e" }}>₹1500/{t("महिना", "mo", "माह")}</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {PLAN_FEATURES.map((f, i) => {
                  const label = lang === "mr" ? f.mr : lang === "hi" ? f.hi : f.en;
                  const render = (v: boolean | string) => {
                    if (v === true) return <span style={{ color: "#2d6b2d", fontSize: 18, fontWeight: 700 }}>✓</span>;
                    if (v === false) return <span style={{ color: "#d4c0a0", fontSize: 18 }}>—</span>;
                    return <span style={{ color: "#d4a843", fontWeight: 700, fontSize: 13 }}>{translateToken(v, lang)}</span>;
                  };
                  return (
                    <tr key={i} style={{ borderBottom: "1px solid #f0e5cc" }}>
                      <td style={{ padding: "12px 16px", color: "#3d0c0c" }}>{label}</td>
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>{render(f.tiers.free)}</td>
                      <td style={{ padding: "12px 16px", textAlign: "center", background: "rgba(255,243,214,0.4)" }}>{render(f.tiers.premium)}</td>
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>{render(f.tiers.plus)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "50px 20px 30px" }}>
        <h2 style={{ fontSize: 28, color: "#3d0c0c", textAlign: "center", margin: "0 0 16px", fontWeight: 700 }}>
          {t("वारंवार विचारले जाणारे प्रश्न", "Frequently Asked Questions", "अक्सर पूछे जाने वाले प्रश्न")}
        </h2>
        <div style={{ marginTop: 24 }}>
          {FAQS.map((f, i) => (
            <FAQItem key={i} q={{ mr: f.qMr, en: f.qEn, hi: f.qHi }} a={{ mr: f.aMr, en: f.aEn, hi: f.aHi }} lang={lang} />
          ))}
        </div>
      </div>

      <div style={{ background: "#3d0c0c", color: "#FFF8E7", padding: "44px 20px", marginTop: 20 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: 26, color: "#d4a843", margin: 0, fontWeight: 700 }}>
            {t("अजून प्रश्न आहेत?", "Still have questions?", "अभी भी प्रश्न हैं?")}
          </h2>
          <p style={{ fontSize: 15, opacity: 0.9, marginTop: 10, marginBottom: 22 }}>
            {t("आमच्याशी संपर्क साधा — आम्ही तुम्हाला योग्य योजना निवडण्यात मदत करू.", "Get in touch — we'll help you pick the right plan.", "हमसे संपर्क करें — हम आपको सही योजना चुनने में मदद करेंगे.")}
          </p>
          <Link href={`/${lang}/contact`} style={{
            display: "inline-block", padding: "14px 32px",
            background: "#d4a843", color: "#3d0c0c",
            borderRadius: 8, fontWeight: 700, fontSize: 15, textDecoration: "none",
          }}>
            {t("संपर्क करा", "Contact Us", "संपर्क करें")}
          </Link>
        </div>
      </div>
    </div>
  );
}
