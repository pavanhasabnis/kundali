"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLang } from "@/lib/astrology/language-context";

type Tier = "free" | "premium" | "plus";

interface Product {
  id: string;
  nameMr: string;
  nameEn: string;
  nameHi: string;
  tagMr: string;
  tagEn: string;
  tagHi: string;
  descMr: string;
  descEn: string;
  descHi: string;
  emoji: string;
  pricing: Record<Tier, { amount: number; free?: boolean; label: string }>;
  features: { mr: string; en: string; hi: string }[];
}

const PRODUCTS: Product[] = [
  {
    id: "kundli-book",
    nameMr: "बांधील कुंडली पुस्तक",
    nameEn: "Bound Kundli Book",
    nameHi: "बाउंड कुंडली पुस्तक",
    tagMr: "८०+ पानी हार्डबाउंड",
    tagEn: "80+ pg hardbound",
    tagHi: "80+ पृष्ठ हार्डबाउंड",
    descMr: "संपूर्ण जन्मकुंडली, दशा विश्लेषण, ग्रह स्थिती, उपाय — सुंदर बांधील पुस्तक स्वरूपात घरपोच पाठवले जाते. डिजिटल PDF अमर्यादित डाउनलोड (Premium/Plus); छापील पुस्तक — Plus मध्ये वर्षी १ मोफत.",
    descEn: "Complete birth chart, dasha analysis, planetary positions, remedies — delivered as a beautifully bound hardcover book to your home. Digital PDF unlimited downloads (Premium/Plus); printed book — 1 free/year in Plus.",
    descHi: "संपूर्ण जन्म कुंडली, दशा विश्लेषण, ग्रह स्थिति, उपाय — सुंदर हार्डबाउंड पुस्तक आपके घर पहुंचाई जाएगी. डिजिटल PDF असीमित (Premium/Plus); मुद्रित पुस्तक — Plus में 1 मुफ्त/वर्ष.",
    emoji: "📖",
    pricing: {
      free:    { amount: 799, label: "non-subscriber" },
      premium: { amount: 649, label: "20% off" },
      plus:    { amount: 0, free: true, label: "FREE · 1/year" },
    },
    features: [
      { mr: "लग्न कुंडली, नवमांश, षोडशवर्ग", en: "Lagna, Navamsa, 16 divisional charts", hi: "लग्न, नवमांश, 16 वर्ग चार्ट" },
      { mr: "विंशोत्तरी दशा सविस्तर", en: "Full Vimshottari dasha tables", hi: "विंशोत्तरी दशा विस्तार" },
      { mr: "योग, दोष, उपाय", en: "Yogas, doshas, remedies", hi: "योग, दोष, उपाय" },
      { mr: "प्रीमियम हार्डकव्हर बाइंडिंग", en: "Premium hardcover binding", hi: "प्रीमियम हार्डकवर बाइंडिंग" },
      { mr: "महाराष्ट्रभर मोफत शिपिंग", en: "Free shipping across Maharashtra", hi: "महाराष्ट्र में मुफ्त शिपिंग" },
    ],
  },
  {
    id: "printed-calendar",
    nameMr: "छापील वार्षिक दिनदर्शिका",
    nameEn: "Printed Annual Calendar",
    nameHi: "मुद्रित वार्षिक पंचांग",
    tagMr: "१४×२२ इंच भिंतीसाठी · मराठी + इंग्रजी",
    tagEn: "14×22\" wall · Marathi + English",
    tagHi: "14×22\" दीवार · मराठी + अंग्रेजी",
    descMr: "संपूर्ण वर्षाची तिथी, नक्षत्र, सण, मुहूर्त, राहुकाळ — सुंदर छापील दिनदर्शिका दरवर्षी घरपोच.",
    descEn: "Full year of tithis, nakshatras, festivals, muhurat, rahu-kaal — beautifully printed calendar shipped to your home every year.",
    descHi: "पूरे वर्ष की तिथि, नक्षत्र, त्यौहार, मुहूर्त, राहुकाल — सुंदर मुद्रित पंचांग हर साल आपके घर.",
    emoji: "🗓️",
    pricing: {
      free:    { amount: 199, label: "standalone" },
      premium: { amount: 0, free: true, label: "FREE" },
      plus:    { amount: 0, free: true, label: "FREE" },
    },
    features: [
      { mr: "१२ महिन्यांची पूर्ण पंचांग तक्ता", en: "12-month full panchang grid", hi: "12 माह पूर्ण पंचांग ग्रिड" },
      { mr: "सर्व हिंदू सण व व्रत चिन्हांकित", en: "All Hindu festivals + vrats marked", hi: "सभी हिंदू त्यौहार व व्रत चिह्नित" },
      { mr: "दैनिक राहुकाळ, शुभ मुहूर्त", en: "Daily rahu-kaal, shubh muhurat", hi: "दैनिक राहुकाल, शुभ मुहूर्त" },
      { mr: "लाहिरी अयनांश · IST वेळा", en: "Lahiri Ayanamsa · IST times", hi: "लाहिरी अयनांश · IST" },
      { mr: "महाराष्ट्रभर मोफत शिपिंग", en: "Free shipping across Maharashtra", hi: "महाराष्ट्र में मुफ्त शिपिंग" },
    ],
  },
];

function useT() {
  const { t, lang } = useLang();
  return { t, lang };
}

function PriceRow({ tier, data, active }: { tier: Tier; data: Product["pricing"][Tier]; active: boolean }) {
  const { t } = useT();
  const tierLabel = tier === "free"
    ? t("नॉन-सब्सक्राइबर", "Non-subscriber", "नॉन-सब्सक्राइबर")
    : tier === "premium"
    ? t("Premium सदस्य", "Premium Member", "Premium सदस्य")
    : t("Plus सदस्य", "Plus Member", "Plus सदस्य");
  const tierBadge = tier === "free" ? "#9b8b6e" : tier === "premium" ? "#d4a843" : "#2d6b2d";
  const rowBg = active ? "#fff3d6" : "transparent";
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 12, padding: "10px 12px", background: rowBg, borderBottom: "1px solid #e5d5b5", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: tierBadge }} />
        <span style={{ fontSize: 14, color: "#3d0c0c", fontWeight: active ? 700 : 500 }}>{tierLabel}</span>
        {active && <span style={{ fontSize: 10, fontWeight: 700, color: "#2d6b2d", background: "#d4f0d4", padding: "1px 6px", borderRadius: 4 }}>{t("तुम्ही", "You", "आप")}</span>}
      </div>
      <div style={{ textAlign: "right", fontSize: 14, fontWeight: 700, color: data.free ? "#2d6b2d" : "#3d0c0c" }}>
        {data.free ? (
          <span>{t("मोफत", "FREE", "मुफ्त")}</span>
        ) : (
          <span>₹{data.amount}</span>
        )}
        <span style={{ fontSize: 11, fontWeight: 400, color: "#6b5b3e", marginLeft: 6 }}>· {data.label}</span>
      </div>
    </div>
  );
}

function BookMockup() {
  return (
    <div style={{ width: "100%", height: "100%", minHeight: 320, background: "linear-gradient(135deg, #2a0808 0%, #3d0c0c 50%, #2a0808 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative" }}>
      <div style={{
        width: 200, height: 280,
        background: "#FFF8E7",
        borderRadius: "3px 6px 6px 3px",
        boxShadow: "-4px 6px 24px rgba(0,0,0,0.5), inset 3px 0 8px rgba(0,0,0,0.15)",
        position: "relative", overflow: "hidden",
        fontFamily: "'Noto Serif Devanagari', serif",
      }}>
        <div style={{ position: "absolute", inset: 4, border: "1.5px solid #8B0000", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 8, border: "0.75px solid #8B0000", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 18, border: "1px solid #8B0000", pointerEvents: "none" }} />
        <div style={{ position: "relative", padding: "24px 18px 18px", display: "flex", flexDirection: "column", alignItems: "center", height: "100%", textAlign: "center", zIndex: 2 }}>
          <div style={{
            width: 28, height: 28, borderRadius: "50%",
            border: "1.2px solid #8B0000", background: "#FFFDF5",
            display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4,
            overflow: "hidden",
          }}>
            <img src="/images/kundli/ganesha-classic.svg" alt="Ganesha" style={{
              width: 22, height: 22,
              filter: "brightness(0) saturate(100%) invert(8%) sepia(85%) saturate(5000%) hue-rotate(355deg) brightness(95%) contrast(115%)",
            }} />
          </div>
          <div style={{ fontSize: 7, fontWeight: 700, color: "#8B0000", letterSpacing: "1px", marginBottom: 3 }}>
            ॥ अथ श्रीगणेशाय नमः ॥
          </div>
          <div style={{ fontSize: 5, color: "#8B0000", lineHeight: 1.5, marginBottom: 8, fontStyle: "italic", opacity: 0.9 }}>
            गजवदनमचिन्त्यं तीक्ष्णदृष्टं गणेशं,<br />
            विघ्नराजं नमामि पशुपतिसुतमीशं॥
          </div>
          <div style={{ fontSize: 6.5, fontWeight: 600, color: "#8B0000", letterSpacing: "2px", marginBottom: 2 }}>
            सम्पूर्ण षडवर्गीय
          </div>
          <div style={{
            fontSize: 22, fontWeight: 900, color: "#8B0000",
            letterSpacing: "1.5px", marginBottom: 8,
            textShadow: "1px 1px 0 #d4a843",
          }}>
            जन्म पत्रिका
          </div>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            border: "1.8px solid #8B0000",
            background: "radial-gradient(circle, #FFFDF5 0%, #FFF8E7 100%)",
            display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10,
            overflow: "hidden",
          }}>
            <img src="/images/kundli/ganesha-classic.svg" alt="Lord Ganesha" style={{
              width: 58, height: 58,
              filter: "brightness(0) saturate(100%) invert(8%) sepia(85%) saturate(5000%) hue-rotate(355deg) brightness(95%) contrast(115%)",
            }} />
          </div>
          <div style={{ width: "100%", marginTop: "auto" }}>
            <div style={{ fontSize: 5.5, fontWeight: 700, color: "#d4a843", background: "#8B0000", padding: "1.5px 0", letterSpacing: "1.5px" }}>
              जातक माहिती
            </div>
            <div style={{ borderBottom: "0.5px dotted #8B0000", padding: "1.5px 0", fontSize: 5.5, display: "flex", justifyContent: "space-between", color: "#8B0000" }}>
              <span style={{ fontWeight: 700 }}>नाव</span>
              <span style={{ color: "#3d0c0c" }}>________</span>
            </div>
            <div style={{ borderBottom: "0.5px dotted #8B0000", padding: "1.5px 0", fontSize: 5.5, display: "flex", justifyContent: "space-between", color: "#8B0000" }}>
              <span style={{ fontWeight: 700 }}>जन्मतारीख</span>
              <span style={{ color: "#3d0c0c" }}>________</span>
            </div>
            <div style={{ padding: "1.5px 0", fontSize: 5.5, display: "flex", justifyContent: "space-between", color: "#8B0000" }}>
              <span style={{ fontWeight: 700 }}>जन्मस्थळ</span>
              <span style={{ color: "#3d0c0c" }}>________</span>
            </div>
          </div>
          <div style={{ fontSize: 6, color: "#8B0000", marginTop: 6, letterSpacing: "1px", fontWeight: 700 }}>भाग्यवेध</div>
        </div>
      </div>
    </div>
  );
}

function CalendarMockup() {
  return (
    <div style={{ width: "100%", height: "100%", minHeight: 320, background: "linear-gradient(135deg, #2a0808 0%, #3d0c0c 50%, #2a0808 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative" }}>
      <div style={{
        width: 180, height: 260,
        background: "#FFF8E7",
        borderRadius: 4,
        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        display: "flex", flexDirection: "column", overflow: "hidden",
        border: "1px solid #d4a843",
      }}>
        <div style={{ background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)", color: "#d4a843", padding: "8px 10px", borderBottom: "2px solid #d4a843", textAlign: "center" }}>
          <div style={{ fontSize: 11, fontWeight: 700 }}>जानेवारी</div>
          <div style={{ fontSize: 9, opacity: 0.9 }}>२०२६</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", background: "#5c1a1a", color: "#d4a843", fontSize: 6, fontWeight: 700, padding: "2px 0" }}>
          {["र", "सो", "मं", "बु", "गु", "शु", "श"].map((d, i) => (
            <div key={i} style={{ textAlign: "center", color: i === 0 ? "#ff9999" : "#d4a843" }}>{d}</div>
          ))}
        </div>
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gridAutoRows: "1fr", background: "#FFF8E7", gap: "0.5px", padding: "0.5px" }}>
          {Array.from({ length: 35 }).map((_, i) => {
            const day = i + 1;
            const isSunday = i % 7 === 0;
            const isFest = [1, 14, 26].includes(day);
            return (
              <div key={i} style={{
                background: isFest ? "#fff3d6" : "#FFF8E7",
                padding: "1px 2px", fontSize: 6, color: isSunday ? "#b91c1c" : "#3d0c0c",
                fontWeight: 600, borderRight: "0.3px solid #e5d5b5", borderBottom: "0.3px solid #e5d5b5",
              }}>
                {day <= 31 ? day : ""}
                {isFest && <div style={{ width: 2, height: 2, background: "#b91c1c", borderRadius: "50%", marginTop: 1 }} />}
              </div>
            );
          })}
        </div>
        <div style={{ background: "#3d0c0c", color: "#d4a843", padding: "3px 6px", fontSize: 6, borderTop: "1px solid #d4a843", textAlign: "center" }}>
          भाग्यवेध · bhaagyavedh.com
        </div>
      </div>
    </div>
  );
}

function ProductImage({ id }: { id: string }) {
  if (id === "kundli-book") return <BookMockup />;
  if (id === "printed-calendar") return <CalendarMockup />;
  return null;
}

function ProductCard({ product, currentTier, lang: langProp }: { product: Product; currentTier: Tier; lang: string }) {
  const { t, lang } = useT();
  const name = lang === "mr" ? product.nameMr : lang === "hi" ? product.nameHi : product.nameEn;
  const tagline = lang === "mr" ? product.tagMr : lang === "hi" ? product.tagHi : product.tagEn;
  const desc = lang === "mr" ? product.descMr : lang === "hi" ? product.descHi : product.descEn;
  const price = product.pricing[currentTier];
  return (
    <div style={{
      background: "#fffdf6", borderRadius: 12, border: "1px solid #e5d5b5",
      overflow: "hidden", boxShadow: "0 2px 12px rgba(61,12,12,0.06)",
      display: "grid", gridTemplateColumns: "260px 1fr",
    }}
    className="shop-product-card">
      <div style={{ borderRight: "1px solid #e5d5b5", display: "flex" }}>
        <ProductImage id={product.id} />
      </div>
      <div style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#3d0c0c", letterSpacing: "-0.3px" }}>{name}</div>
          <div style={{ fontSize: 12, color: "#9b8b6e", marginTop: 3 }}>{tagline}</div>
        </div>
        <p style={{ fontSize: 14, color: "#5c1a1a", lineHeight: 1.5, margin: 0 }}>{desc}</p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
          {product.features.map((f, i) => (
            <li key={i} style={{ fontSize: 13, color: "#3d0c0c", display: "flex", gap: 8, alignItems: "flex-start" }}>
              <span style={{ color: "#d4a843", fontWeight: 700, flexShrink: 0 }}>✓</span>
              <span>{lang === "mr" ? f.mr : lang === "hi" ? f.hi : f.en}</span>
            </li>
          ))}
        </ul>
        <div style={{ marginTop: 4, border: "1px solid #e5d5b5", borderRadius: 8, overflow: "hidden", background: "#fff" }}>
          <div style={{ background: "#f5efe0", padding: "8px 12px", fontSize: 11, fontWeight: 700, color: "#5c1a1a", letterSpacing: "0.5px", textTransform: "uppercase" }}>
            {t("किंमत तक्ता", "Price Matrix", "मूल्य तालिका")}
          </div>
          <PriceRow tier="free" data={product.pricing.free} active={currentTier === "free"} />
          <PriceRow tier="premium" data={product.pricing.premium} active={currentTier === "premium"} />
          <PriceRow tier="plus" data={product.pricing.plus} active={currentTier === "plus"} />
        </div>
        <div style={{ marginTop: "auto", display: "flex", gap: 8, flexDirection: "column" }}>
          {product.id === "kundli-book" ? (
            <Link href={`/${langProp}/shop/claim-book`} style={{
              padding: "12px 16px",
              background: price.free ? "#d4f0d4" : "linear-gradient(135deg, #3d0c0c, #5c1a1a)",
              color: price.free ? "#2d6b2d" : "#d4a843",
              border: price.free ? "1px solid #2d6b2d" : "1px solid #d4a843",
              borderRadius: 8, fontWeight: 700, fontSize: 15, textAlign: "center", textDecoration: "none",
            }}>
              {price.free
                ? `✓ ${t("मोफत पुस्तक मागवा (Plus)", "Claim FREE Book (Plus)", "मुफ्त पुस्तक लें (Plus)")}`
                : t(`मागवा — ₹${price.amount}`, `Order Now — ₹${price.amount}`, `ऑर्डर करें — ₹${price.amount}`)}
            </Link>
          ) : price.free ? (
            <button disabled style={{ padding: "12px 16px", background: "#d4f0d4", color: "#2d6b2d", border: "1px solid #2d6b2d", borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: "default" }}>
              ✓ {t("तुमच्या योजनेत समाविष्ट", "Included in your plan", "आपकी योजना में शामिल")}
            </button>
          ) : (
            <button style={{ padding: "12px 16px", background: "linear-gradient(135deg, #3d0c0c, #5c1a1a)", color: "#d4a843", border: "1px solid #d4a843", borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
              {t(`मागवा — ₹${price.amount}`, `Order Now — ₹${price.amount}`, `ऑर्डर करें — ₹${price.amount}`)}
            </button>
          )}
          {currentTier !== "plus" && (
            <Link href={`/${langProp}/pricing`} style={{ textAlign: "center", fontSize: 12, color: "#5c1a1a", textDecoration: "underline" }}>
              {currentTier === "free"
                ? t("Premium किंवा Plus घ्या — अधिक सवलत", "Upgrade to Premium or Plus for discount", "Premium या Plus लें")
                : t("Plus घ्या — हे मोफत मिळवा", "Upgrade to Plus — get this FREE", "Plus लें — मुफ्त पाएं")}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPageClient() {
  const { t, lang } = useT();
  const [currentTier, setCurrentTier] = useState<Tier>("free");

  useEffect(() => {
    fetch("/api/auth/session")
      .then(r => r.json())
      .then(data => {
        if (data?.user?.email) {
          fetch("/api/user").then(r => r.json()).then(u => {
            const plan = u?.plan;
            if (plan === "premium" || plan === "plus") setCurrentTier(plan);
          }).catch(() => {});
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#fffaf0" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "50px 20px 20px", textAlign: "center" }}>
        <h1 style={{ fontSize: 36, color: "#3d0c0c", margin: 0, fontWeight: 700, letterSpacing: "-0.5px" }}>
          {t("भाग्यवेध शॉप", "Bhaagyavedh Shop", "भाग्यवेध शॉप")}
        </h1>
        <p style={{ fontSize: 15, color: "#6b5b3e", marginTop: 10, maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
          {t(
            "वैदिक पंचांग आणि कुंडली आधारित छापील उत्पादने — घरपोच. सदस्य म्हणून बचत करा.",
            "Printed products based on Vedic panchang and kundli — shipped to your home. Members save more.",
            "वैदिक पंचांग और कुंडली आधारित मुद्रित उत्पाद — घर पर. सदस्य अधिक बचत करें।"
          )}
        </p>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 20px 40px", display: "flex", flexDirection: "column", gap: 20 }}>
        {PRODUCTS.map(p => (
          <ProductCard key={p.id} product={p} currentTier={currentTier} lang={lang} />
        ))}
      </div>
      <style>{`
        @media (max-width: 720px) {
          .shop-product-card { grid-template-columns: 1fr !important; }
          .shop-product-card > div:first-child { border-right: none !important; border-bottom: 1px solid #e5d5b5 !important; }
        }
      `}</style>

      <div style={{ background: "#3d0c0c", color: "#FFF8E7", padding: "28px 20px", marginTop: 20 }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: "#d4a843", marginBottom: 8 }}>
            {t("सदस्य व्हा आणि ३०-६०% बचत करा", "Become a member and save 30-60%", "सदस्य बनें और 30-60% बचाएं")}
          </div>
          <p style={{ fontSize: 14, opacity: 0.9, marginBottom: 20, maxWidth: 620, marginLeft: "auto", marginRight: "auto" }}>
            {t(
              "Premium (₹५९९/महिना) — मोफत दिनदर्शिका + अमर्यादित कुंडली PDF · Plus (₹१४९९/महिना) — मोफत पुस्तक + मोफत दिनदर्शिका + १ सल्लामसलत",
              "Premium (₹599/mo) — free calendar + unlimited kundli PDF · Plus (₹1499/mo) — free book + free calendar + 1 consultation",
              "Premium (₹599/माह) — मुफ्त पंचांग + असीमित कुंडली PDF · Plus (₹1499/माह) — मुफ्त पुस्तक + मुफ्त पंचांग + 1 परामर्श"
            )}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href={`/${lang}/pricing`} style={{ padding: "12px 24px", background: "#d4a843", color: "#3d0c0c", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
              {t("योजना पहा", "View Plans", "योजनाएं देखें")}
            </Link>
            <Link href={`/${lang}/kundli`} style={{ padding: "12px 24px", background: "transparent", color: "#d4a843", border: "1px solid #d4a843", borderRadius: 8, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
              {t("कुंडली बनवा", "Create Kundli", "कुंडली बनाएं")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
