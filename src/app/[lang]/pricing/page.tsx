import { pageMetaI18n, type Lang } from "@/lib/seo";
import PricingPageClient from "./pricing-client";
import { JsonLd, breadcrumbSchema } from "@/components/json-ld";

const PRICING_FAQS: { lang: Lang; items: { q: string; a: string }[] }[] = [
  {
    lang: "mr",
    items: [
      { q: "सदस्यता कशी कार्य करते?", a: "Premium ₹५९९/महिना — दरमहा आकारणी, कोणत्याही वेळी रद्द करा. Plus ₹१४९९/महिना — समान अटी, अतिरिक्त फायदे." },
      { q: "अमर्यादित PDF व १ छापील पुस्तक यात फरक काय?", a: "Premium व Plus सदस्यांना अमर्यादित डिजिटल PDF कुंडल्या डाउनलोड करता येतात — स्वतःची, कुटुंबाची, मित्रांची. छापील बांधील पुस्तक मात्र घरपोच येते — छपाई व शिपिंग खर्चामुळे Plus मध्ये वर्षी १ मोफत, Premium मध्ये २०% सवलतीत." },
      { q: "छापील दिनदर्शिका कशी मिळते?", a: "दरवर्षी डिसेंबर-जानेवारीमध्ये तुमच्या नोंदणीकृत पत्त्यावर पाठवली जाते. फक्त Premium व Plus सदस्यांसाठी." },
      { q: "वैयक्तिक सल्लामसलत कशी होते?", a: "Plus सदस्यांना दरमहा एक ३०-मिनिट सल्लामसलत — WhatsApp/फोन/व्हिडिओ. तुमच्या कुंडलीनुसार वैयक्तिक सल्ला." },
      { q: "कोणती पेमेंट पद्धत स्वीकारता?", a: "UPI, क्रेडिट/डेबिट कार्ड, नेट बँकिंग, वॉलेट — Razorpay द्वारे सुरक्षित." },
      { q: "सदस्यता रद्द करता येते का?", a: "होय, कोणत्याही वेळी. अकाउंट पेजवरून रद्द करा. पुढील बिलिंग चक्र थांबते." },
    ],
  },
  {
    lang: "en",
    items: [
      { q: "How does the subscription work?", a: "Premium ₹599/month — billed monthly, cancel anytime. Plus ₹1499/month — same terms, extra perks." },
      { q: "What's the difference between unlimited PDF and 1 printed book?", a: "Premium and Plus members can download unlimited digital kundli PDFs — for themselves, family, friends. The printed bound book is shipped physically — due to print + shipping costs, Plus includes 1 free per year, Premium gets 20% off." },
      { q: "How do I get the printed calendar?", a: "Shipped every December-January to your registered address. Only for Premium and Plus members." },
      { q: "How does personal consultation work?", a: "Plus members get one 30-minute consultation per month via WhatsApp/call/video — personal advice based on your kundli." },
      { q: "What payment methods do you accept?", a: "UPI, credit/debit cards, net banking, wallets — secured via Razorpay." },
      { q: "Can I cancel my subscription?", a: "Yes, anytime. Cancel from your account page. Next billing cycle stops." },
    ],
  },
  {
    lang: "hi",
    items: [
      { q: "सदस्यता कैसे काम करती है?", a: "Premium ₹599/माह — मासिक बिलिंग, कभी भी रद्द करें. Plus ₹1499/माह — वही शर्तें, अतिरिक्त लाभ." },
      { q: "असीमित PDF और 1 मुद्रित पुस्तक में क्या अंतर?", a: "Premium व Plus सदस्य असीमित डिजिटल PDF कुंडली डाउनलोड कर सकते हैं — अपनी, परिवार, मित्रों की. मुद्रित बाउंड पुस्तक घर पर भेजी जाती है — छपाई + शिपिंग लागत के कारण Plus में 1 मुफ्त/वर्ष, Premium में 20% छूट." },
      { q: "मुद्रित पंचांग कैसे मिलता है?", a: "हर साल दिसंबर-जनवरी में आपके पंजीकृत पते पर भेजा जाता है. केवल Premium और Plus सदस्यों के लिए." },
      { q: "व्यक्तिगत परामर्श कैसे होता है?", a: "Plus सदस्यों को मासिक 30-मिनट परामर्श — WhatsApp/कॉल/वीडियो. आपकी कुंडली के अनुसार सलाह." },
      { q: "कौन से भुगतान स्वीकार करते हैं?", a: "UPI, क्रेडिट/डेबिट कार्ड, नेट बैंकिंग, वॉलेट — Razorpay द्वारा सुरक्षित." },
      { q: "क्या मैं सदस्यता रद्द कर सकता हूं?", a: "हां, किसी भी समय. अकाउंट पेज से रद्द करें. अगला बिलिंग चक्र रुक जाता है." },
    ],
  },
];

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l: Lang = lang === "en" ? "en" : lang === "hi" ? "hi" : "mr";
  return pageMetaI18n({
    lang: l,
    path: "/pricing",
    mr: {
      title: "सदस्यता योजना — Free, Premium ₹५९९/महिना, Plus ₹१४९९/महिना",
      description: "भाग्यवेध सदस्यता योजना — मोफत कुंडली, Premium अमर्यादित कुंडली + छापील दिनदर्शिका, Plus सल्लामसलत व अधिक. सुरक्षित पेमेंट.",
      keywords: ["भाग्यवेध सदस्यता", "कुंडली सबस्क्रिप्शन", "premium कुंडली", "ज्योतिष सदस्यता", "vedic astrology subscription"],
    },
    en: {
      title: "Pricing Plans — Free, Premium ₹599/mo, Plus ₹1499/mo",
      description: "Bhaagyavedh subscription plans — Free kundli, Premium unlimited + printed calendar, Plus with astrologer consultation. Secure Razorpay payments, cancel anytime.",
      keywords: ["vedic astrology pricing", "kundli subscription", "premium kundli plan", "bhaagyavedh pricing", "hindu astrology membership"],
    },
  });
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l: Lang = lang === "en" ? "en" : lang === "hi" ? "hi" : "mr";
  const faqSet = PRICING_FAQS.find(f => f.lang === l) ?? PRICING_FAQS[0];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqSet.items.map(item => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const base = `https://bhaagyavedh.com/${lang}`;
  const pricingLabel = l === "mr" ? "सदस्यता योजना" : l === "hi" ? "सदस्यता योजना" : "Pricing";
  const homeLabel = l === "mr" ? "मुख्यपृष्ठ" : l === "hi" ? "मुख्य पृष्ठ" : "Home";

  return (
    <>
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbSchema([
        { name: homeLabel, url: base },
        { name: pricingLabel, url: `${base}/pricing` },
      ])} />
      <PricingPageClient />
    </>
  );
}
