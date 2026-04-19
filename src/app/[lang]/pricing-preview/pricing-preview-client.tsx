"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/astrology/language-context";

type Tier = "free" | "premium" | "plus";
type Billing = "monthly" | "yearly";

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
  };
  const entry = map[token];
  if (!entry) return token;
  return entry[lang as "mr" | "en" | "hi"] ?? entry.mr;
}

const PLAN_FEATURES: PlanFeature[] = [
  { mr: "कुंडली (जन्म पत्रिका)", en: "Kundli (birth chart)", hi: "कुंडली (जन्म पत्रिका)", tiers: { free: "१", premium: "अमर्यादित", plus: "अमर्यादित" } },
  { mr: "सविस्तर कुंडली PDF डाउनलोड", en: "Detailed kundli PDF download", hi: "विस्तृत कुंडली PDF डाउनलोड", tiers: { free: false, premium: true, plus: true } },
  { mr: "दशा विश्लेषण व उपाय", en: "Dasha analysis & remedies", hi: "दशा विश्लेषण व उपाय", tiers: { free: false, premium: true, plus: true } },
  { mr: "गुण मिलान (३६ गुण)", en: "Gun Milaan (36 guna)", hi: "गुण मिलान (36 गुण)", tiers: { free: true, premium: true, plus: true } },
  { mr: "पंचांग, राशीफल, कॅलेंडर", en: "Panchang, rashifal, calendar", hi: "पंचांग, राशिफल, कैलेंडर", tiers: { free: true, premium: true, plus: true } },
  { mr: "मुहूर्त शोधक", en: "Muhurat finder", hi: "मुहूर्त खोजक", tiers: { free: true, premium: true, plus: true } },
  { mr: "छापील दिनदर्शिका घरपोच", en: "Printed calendar shipped home", hi: "मुद्रित पंचांग घर पर", tiers: { free: false, premium: true, plus: true } },
  { mr: "बांधील कुंडली पुस्तक (वर्षी १)", en: "Bound kundli book (1/year)", hi: "बाउंड कुंडली पुस्तक (1/वर्ष)", tiers: { free: false, premium: "२०% सवलत", plus: true } },
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
}

function PlanCard({ tier, featured, lang, t }: PlanCardProps) {
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
  const borderColor = featured ? "#d4a843" : "#e5d5b5";
  const borderWidth = featured ? 2 : 1;

  const tierFeatures = PLAN_FEATURES.filter(f => {
    const v = f.tiers[tier];
    return v !== false;
  });

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
      {featured && (
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
      <Link href={`/${lang}/login?redirect=/${lang}/account`} style={{
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
      {tier !== "free" && (
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

export default function PricingPreviewClient() {
  const { t, lang } = useLang();

  return (
    <div style={{ minHeight: "100vh", background: "#fffaf0" }}>
      {/* Hero */}
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

      {/* Pricing cards */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 20px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, alignItems: "stretch" }}>
          <PlanCard tier="free" lang={lang} t={t} />
          <PlanCard tier="premium" featured lang={lang} t={t} />
          <PlanCard tier="plus" lang={lang} t={t} />
        </div>
      </div>

      {/* Feature comparison table */}
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

      {/* FAQ */}
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

      {/* Bottom CTA */}
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

      {/* Preview-only note */}
      <div style={{ maxWidth: 900, margin: "30px auto", padding: "18px 24px", background: "#fff", border: "1px dashed #d4a843", borderRadius: 10, fontSize: 13, color: "#5c1a1a" }}>
        <div style={{ fontWeight: 700, color: "#3d0c0c", marginBottom: 6 }}>📍 {t("पूर्वावलोकन टीप", "Preview Note", "पूर्वावलोकन नोट")}:</div>
        {t(
          "ही पानाची सार्वजनिक (लॉगिन विना) आवृत्ती आहे. 'Premium घ्या' क्लिक केल्यावर — लॉग इन असल्यास थेट चेकआउट, नसल्यास लॉगिन मग चेकआउट.",
          "This is the public (no-login) version of the page. Clicking 'Get Premium' — if logged in goes to checkout, else login → back to checkout.",
          "यह पेज का सार्वजनिक (बिना लॉगिन) संस्करण है. 'Premium लें' क्लिक पर — लॉग इन हो तो सीधे चेकआउट, नहीं तो लॉगिन फिर चेकआउट."
        )}
      </div>
    </div>
  );
}
