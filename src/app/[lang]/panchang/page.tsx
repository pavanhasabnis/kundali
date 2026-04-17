import { pageMetaI18n, type Lang } from "@/lib/seo";
import PanchangPageClient from "./panchang-client";
import { JsonLd, serviceSchema, breadcrumbSchema } from "@/components/json-ld";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l: Lang = lang === "en" ? "en" : lang === "hi" ? "hi" : "mr";
  return pageMetaI18n({
    lang: l,
    path: "/panchang",
    mr: {
      title: "आजचे पंचांग — तिथी, नक्षत्र, राहू काळ | Panchang Marathi",
      description:
        "आजचे पंचांग — तिथी, नक्षत्र, योग, करण, राहू काळ, सूर्योदय, सूर्यास्त. Aaj cha panchang marathi — पुणे, मुंबई, नागपूर, औरंगाबादसाठी दैनिक पंचांग.",
      keywords: [
        "आजचे पंचांग", "पंचांग मराठी", "दैनिक पंचांग", "तिथी आज", "नक्षत्र आज",
        "राहू काळ", "सूर्योदय वेळ", "पुणे पंचांग", "मुंबई पंचांग",
        "aaj cha panchang", "aajcha panchang", "panchang marathi", "panchang today",
        "rahu kaal marathi", "tithi today",
        "today panchang", "daily panchang", "vedic panchang", "rahu kaal",
      ],
    },
    en: {
      title: "Today's Panchang — Tithi, Nakshatra, Rahu Kaal | Bhaagyavedh",
      description:
        "Daily Hindu Panchang — Tithi, Nakshatra, Yoga, Karana, Rahu Kaal, sunrise, sunset. Aaj cha panchang marathi for Pune, Mumbai & Nagpur. Precise astronomical data.",
      keywords: [
        "panchang today", "today panchang", "daily panchang", "hindu panchang",
        "vedic panchang", "rahu kaal today", "tithi today",
        "aaj cha panchang", "aajcha panchang", "panchang marathi", "rahu kaal marathi",
        "आजचे पंचांग", "पंचांग मराठी",
      ],
    },
    hi: {
      title: "आज का पंचांग — तिथि, नक्षत्र, राहु काल | Panchang Hindi",
      description:
        "आज का पंचांग — तिथि, नक्षत्र, योग, करण, राहु काल, सूर्योदय, सूर्यास्त. Aaj ka panchang hindi — दिल्ली, मुंबई, पुणे, जयपुर के लिए दैनिक पंचांग.",
      keywords: [
        "आज का पंचांग", "पंचांग हिंदी", "दैनिक पंचांग", "तिथि आज", "नक्षत्र आज",
        "राहु काल", "सूर्योदय समय", "दिल्ली पंचांग", "मुंबई पंचांग",
        "aaj ka panchang", "panchang hindi", "panchang today hindi",
        "rahu kaal hindi", "tithi today hindi",
        "today panchang", "daily panchang hindi", "vedic panchang",
      ],
    },
  });
}

const today = new Date().toISOString().split("T")[0];

export default async function PanchangPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const base = `https://bhaagyavedh.com/${lang}`;
  const url = `${base}/panchang`;
  const panchangArticleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Today's Panchang — आजचे पंचांग",
    description:
      "Daily Hindu Panchang with Tithi, Nakshatra, Yoga, Karana, Rahu Kaal, sunrise, sunset — calculated using Lahiri Ayanamsa and precise astronomical data.",
    url,
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
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    inLanguage: lang === "en" ? "en-IN" : lang === "hi" ? "hi-IN" : "mr-IN",
  };
  const panchangFaqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "आजचे पंचांग म्हणजे काय?",
        acceptedAnswer: { "@type": "Answer", text: "आजचे पंचांग म्हणजे आजच्या तिथी, नक्षत्र, योग, करण आणि वाराची माहिती — दैनिक वैदिक दिनदर्शिकेचा पाया." },
      },
      {
        "@type": "Question",
        name: "What is Panchang and why is it important?",
        acceptedAnswer: { "@type": "Answer", text: "Panchang is the Hindu Vedic calendar with five elements — Tithi, Nakshatra, Yoga, Karana, and Vara. It is used to determine auspicious timings (muhurat) for all activities." },
      },
      {
        "@type": "Question",
        name: "राहू काळ म्हणजे काय आणि कसा काढतात?",
        acceptedAnswer: { "@type": "Answer", text: "राहू काळ हा दिवसातील १.५ तासांचा अशुभ कालावधी असतो. सूर्योदय ते सूर्यास्तामधला हा काल वारानुसार बदलतो — उदा. सोमवारी दुपार, शनिवारी सकाळ." },
      },
      {
        "@type": "Question",
        name: "How is Rahu Kaal calculated?",
        acceptedAnswer: { "@type": "Answer", text: "Rahu Kaal is an inauspicious 90-minute period each day based on the weekday. The day length (sunrise to sunset) is divided into 8 parts and Rahu Kaal falls on a specific part per weekday." },
      },
      {
        "@type": "Question",
        name: "आज का पंचांग क्या है?",
        acceptedAnswer: { "@type": "Answer", text: "आज का पंचांग आज की तिथि, नक्षत्र, योग, करण और वार की जानकारी है — दैनिक वैदिक कैलेंडर का आधार. हर शुभ कार्य के लिए पंचांग देखा जाता है." },
      },
      {
        "@type": "Question",
        name: "राहु काल क्या होता है?",
        acceptedAnswer: { "@type": "Answer", text: "राहु काल दिन का १.५ घंटे का अशुभ समय है. सूर्योदय से सूर्यास्त तक का समय वार के अनुसार बदलता है — जैसे सोमवार को दोपहर, शनिवार को सुबह." },
      },
    ],
  };
  return (
    <>
      <JsonLd data={panchangArticleSchema} />
      <JsonLd data={serviceSchema({
        name: "Daily Panchang — दैनिक पंचांग",
        description: "Daily panchang with Tithi, Nakshatra, Yoga, Karana, and Rahu Kaal calculations.",
        url,
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: base },
        { name: "Panchang", url },
      ])} />
      <JsonLd data={panchangFaqSchema} />
      <PanchangPageClient />
    </>
  );
}
