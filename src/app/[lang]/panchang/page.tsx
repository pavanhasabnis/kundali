import { pageMetaI18n, type Lang } from "@/lib/seo";
import PanchangPageClient from "./panchang-client";
import { JsonLd, serviceSchema, breadcrumbSchema } from "@/components/json-ld";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l: Lang = lang === "en" ? "en" : "mr";
  return pageMetaI18n({
    lang: l,
    path: "/panchang",
    mr: {
      title: "आजचे पंचांग — तिथी, नक्षत्र, योग, करण | Panchang Marathi Today | भाग्यवेध",
      description:
        "आजचे पंचांग — तिथी, नक्षत्र, योग, करण, राहू काळ, सूर्योदय, सूर्यास्त. Aaj cha panchang marathi pune. मुंबई, नागपूर, औरंगाबाद साठी दैनिक पंचांग.",
      keywords: [
        "आजचे पंचांग", "पंचांग मराठी", "दैनिक पंचांग", "तिथी आज", "नक्षत्र आज",
        "राहू काळ", "सूर्योदय वेळ", "पुणे पंचांग", "मुंबई पंचांग",
        "aaj cha panchang", "aajcha panchang", "panchang marathi", "panchang today",
        "rahu kaal marathi", "tithi today",
        "today panchang", "daily panchang", "vedic panchang", "rahu kaal",
      ],
    },
    en: {
      title: "Today's Panchang — Tithi, Nakshatra, Rahu Kaal | Panchang Marathi | Bhaagyavedh",
      description:
        "Daily Hindu Panchang with Tithi, Nakshatra, Yoga, Karana, Rahu Kaal, sunrise, sunset. Aaj cha panchang marathi for Pune, Mumbai, Nagpur. Based on precise astronomical calculations.",
      keywords: [
        "panchang today", "today panchang", "daily panchang", "hindu panchang",
        "vedic panchang", "rahu kaal today", "tithi today",
        "aaj cha panchang", "aajcha panchang", "panchang marathi", "rahu kaal marathi",
        "आजचे पंचांग", "पंचांग मराठी",
      ],
    },
  });
}

const today = new Date().toISOString().split("T")[0];

const panchangArticleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Today's Panchang — आजचे पंचांग",
  description:
    "Daily Hindu Panchang with Tithi, Nakshatra, Yoga, Karana, Rahu Kaal, sunrise, sunset — calculated using Lahiri Ayanamsa and precise astronomical data.",
  url: "https://bhaagyavedh.com/panchang",
  image: "https://bhaagyavedh.com/logos/og-image.png",
  datePublished: today,
  dateModified: today,
  author: { "@type": "Organization", name: "Bhaagyavedh", url: "https://bhaagyavedh.com" },
  publisher: {
    "@type": "Organization",
    name: "Bhaagyavedh",
    url: "https://bhaagyavedh.com",
    logo: { "@type": "ImageObject", url: "https://bhaagyavedh.com/logos/logo-dark.svg" },
  },
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://bhaagyavedh.com/panchang" },
  inLanguage: ["mr", "en"],
};

export default function PanchangPage() {
  return (
    <>
      <JsonLd data={panchangArticleSchema} />
      <JsonLd data={serviceSchema({
        name: "Daily Panchang — दैनिक पंचांग",
        description: "Daily panchang with Tithi, Nakshatra, Yoga, Karana, and Rahu Kaal calculations.",
        url: "https://bhaagyavedh.com/panchang",
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://bhaagyavedh.com" },
        { name: "Panchang", url: "https://bhaagyavedh.com/panchang" },
      ])} />
      <PanchangPageClient />
    </>
  );
}
