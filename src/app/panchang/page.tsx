import { pageMeta } from "@/lib/seo";
import PanchangPageClient from "./panchang-client";
import { JsonLd, serviceSchema, breadcrumbSchema } from "@/components/json-ld";

export const metadata = pageMeta({
  title: "Today's Panchang — आजचे पंचांग | Tithi, Nakshatra, Yoga & Karana",
  description:
    "Check today's Hindu Panchang with accurate Tithi, Nakshatra, Yoga, Karana, Rahu Kaal, sunrise and sunset times. Daily Vedic calendar for auspicious timing in English and Marathi.",
  path: "/panchang",
  keywords: [
    "panchang today",
    "today panchang",
    "daily panchang",
    "tithi today",
    "पंचांग",
    "आजचे पंचांग",
  ],
});

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
