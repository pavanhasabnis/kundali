import { pageMetaI18n, type Lang } from "@/lib/seo";
import PricingPageClient from "./pricing-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l: Lang = lang === "en" ? "en" : lang === "hi" ? "hi" : "mr";
  return pageMetaI18n({
    lang: l,
    path: "/pricing",
    mr: {
      title: "सदस्यता योजना — Free, Premium ₹५९९/महिना, Plus ₹१५००/महिना | भाग्यवेध",
      description: "भाग्यवेध सदस्यता योजना — मोफत कुंडली, Premium अमर्यादित कुंडली + छापील दिनदर्शिका, Plus सल्लामसलत व अधिक. सुरक्षित पेमेंट.",
      keywords: ["भाग्यवेध सदस्यता", "कुंडली सबस्क्रिप्शन", "premium कुंडली", "ज्योतिष सदस्यता", "vedic astrology subscription"],
    },
    en: {
      title: "Pricing Plans — Free, Premium ₹599/mo, Plus ₹1500/mo | Bhaagyavedh",
      description: "Bhaagyavedh subscription plans — Free kundli, Premium unlimited + printed calendar, Plus with astrologer consultation. Secure Razorpay payments, cancel anytime.",
      keywords: ["vedic astrology pricing", "kundli subscription", "premium kundli plan", "bhaagyavedh pricing", "hindu astrology membership"],
    },
  });
}

export default function Page() {
  return <PricingPageClient />;
}
