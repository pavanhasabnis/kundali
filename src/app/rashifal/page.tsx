import { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";
import RashifalPageClient from "./rashifal-client";

const OG_IMAGE = {
  url: `${SITE_URL}/logos/og-image.png`,
  width: 1200,
  height: 630,
  alt: "Bhaagyavedh — भाग्यवेध | Vedic Astrology",
};

export async function generateMetadata(): Promise<Metadata> {
  const today = new Date();
  const dateEn = today.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const dateMr = today.toLocaleDateString("mr-IN", { day: "numeric", month: "long", year: "numeric" });

  const title = `आजचे राशीफल ${dateMr} — Daily Horoscope Today ${dateEn} | Bhaagyavedh`;
  const description = `आजचे राशीफल ${dateMr} — मेष ते मीन सर्व १२ राशींचे दैनिक भविष्य. Read today's horoscope ${dateEn} for all 12 zodiac signs. Career, love, health & finance predictions based on real Vedic planetary transits.`;
  const url = `${SITE_URL}/rashifal`;

  return {
    title,
    description,
    keywords: [
      "rashifal", "rashifal today", "आजचे राशीफल", "horoscope today",
      "daily horoscope", "today horoscope", "राशीफल", "दैनिक राशीफल",
      "horoscope today marathi", "rashifal marathi", "mesh rashifal",
      "aaj ka rashifal", "zodiac horoscope today",
    ].join(", "),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Bhaagyavedh",
      locale: "mr_IN",
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}

export const dynamic = "force-dynamic";

export default function RashifalPage() {
  return <RashifalPageClient />;
}
