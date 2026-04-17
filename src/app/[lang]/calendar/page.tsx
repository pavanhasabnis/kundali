import { pageMetaI18n, type Lang } from "@/lib/seo";
import CalendarPageClient from "./calendar-client";
import { JsonLd, breadcrumbSchema } from "@/components/json-ld";

const CURRENT_YEAR = new Date().getFullYear();

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l: Lang = lang === "en" ? "en" : lang === "hi" ? "hi" : "mr";
  return pageMetaI18n({
    lang: l,
    path: "/calendar",
    mr: {
      title: `हिंदू दिनदर्शिका ${CURRENT_YEAR} — मराठी कॅलेंडर | Marathi Calendar | भाग्यवेध`,
      description: `मराठी हिंदू दिनदर्शिका ${CURRENT_YEAR} — सर्व सण, व्रत, तिथी, नक्षत्र, शुभ मुहूर्त. Marathi calendar ${CURRENT_YEAR} festivals, vrat, muhurat. मराठी महिने आणि पंचांग.`,
      keywords: [
        "मराठी कॅलेंडर", "हिंदू दिनदर्शिका", "मराठी पंचांग", "मराठी महिने",
        `सण व्रत ${CURRENT_YEAR}`,
        `marathi calendar ${CURRENT_YEAR}`, "marathi panchang", "hindu calendar marathi",
        `marathi festivals ${CURRENT_YEAR}`,
        `hindu calendar ${CURRENT_YEAR}`, "vedic calendar", `festivals ${CURRENT_YEAR}`,
      ],
    },
    en: {
      title: `Hindu Marathi Calendar ${CURRENT_YEAR} — Festivals, Tithi & Muhurat | Bhaagyavedh`,
      description: `Complete Hindu Vedic Marathi calendar ${CURRENT_YEAR} with daily tithi, nakshatra, festivals, vrat, and shubh muhurat. Marathi calendar ${CURRENT_YEAR} in English and Marathi.`,
      keywords: [
        `hindu calendar ${CURRENT_YEAR}`, `marathi calendar ${CURRENT_YEAR}`,
        "vedic calendar", `festivals ${CURRENT_YEAR}`, "hindu festivals calendar",
        "marathi calendar", "hindu calendar marathi", "marathi panchang",
        "मराठी कॅलेंडर", "हिंदू दिनदर्शिका",
      ],
    },
  });
}

const today = new Date().toISOString().split("T")[0];

export default async function CalendarPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const base = `https://bhaagyavedh.com/${lang}`;
  const url = `${base}/calendar`;
  const calendarArticleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Hindu Vedic Calendar ${CURRENT_YEAR} — हिंदू कॅलेंडर`,
    description: `Hindu Vedic calendar ${CURRENT_YEAR} — daily tithis, nakshatras, festivals, shubh muhurat, and panchang based on Lahiri Ayanamsa.`,
    url,
    image: "https://bhaagyavedh.com/logos/og-image.png",
    datePublished: `${CURRENT_YEAR}-01-01`,
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
  return (
    <>
      <JsonLd data={calendarArticleSchema} />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: base },
        { name: "Calendar", url },
      ])} />
      <CalendarPageClient />
    </>
  );
}
