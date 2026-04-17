import { pageMeta } from "@/lib/seo";
import CalendarPageClient from "./calendar-client";
import { JsonLd, breadcrumbSchema } from "@/components/json-ld";

const CURRENT_YEAR = new Date().getFullYear();

export const metadata = pageMeta({
  title: `Hindu Vedic Calendar ${CURRENT_YEAR} — हिंदू कॅलेंडर | Festivals, Tithis & Muhurat`,
  description: `Complete Hindu Vedic calendar ${CURRENT_YEAR} with daily panchang, tithis, nakshatras, festivals, and shubh muhurat. Based on real astronomical calculations.`,
  path: "/calendar",
  keywords: [`hindu calendar ${CURRENT_YEAR}`, "vedic calendar", "panchang calendar", "हिंदू कॅलेंडर", "वैदिक कॅलेंडर"],
});

const today = new Date().toISOString().split("T")[0];

const calendarArticleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: `Hindu Vedic Calendar ${CURRENT_YEAR} — हिंदू कॅलेंडर`,
  description: `Hindu Vedic calendar ${CURRENT_YEAR} — daily tithis, nakshatras, festivals, shubh muhurat, and panchang based on Lahiri Ayanamsa.`,
  url: "https://bhaagyavedh.com/calendar",
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
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://bhaagyavedh.com/calendar" },
  inLanguage: ["mr", "en"],
};

export default function CalendarPage() {
  return (
    <>
      <JsonLd data={calendarArticleSchema} />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://bhaagyavedh.com" },
        { name: "Calendar", url: "https://bhaagyavedh.com/calendar" },
      ])} />
      <CalendarPageClient />
    </>
  );
}
