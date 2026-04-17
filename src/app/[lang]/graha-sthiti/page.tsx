import { pageMetaI18n, type Lang } from "@/lib/seo";
import { JsonLd, serviceSchema, breadcrumbSchema } from "@/components/json-ld";
import CurrentPlanetsPageClient from "./graha-sthiti-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l: Lang = lang === "en" ? "en" : lang === "hi" ? "hi" : "mr";
  return pageMetaI18n({
    lang: l,
    path: "/graha-sthiti",
    mr: {
      title: "आजची ग्रह स्थिती — ९ ग्रह संचार | Graha Sthiti Marathi | भाग्यवेध",
      description:
        "आजची ग्रह स्थिती — सूर्य, चंद्र, मंगळ, बुध, गुरू, शुक्र, शनी, राहू, केतू. Aaj chi graha sthiti marathi. वास्तविक ग्रह गोचर आणि संचार.",
      keywords: [
        "ग्रह स्थिती", "ग्रह संचार", "आजचे ग्रह", "ग्रह गोचर", "9 ग्रह स्थिती",
        "वैदिक ग्रह",
        "aaj chi graha sthiti", "graha sthiti marathi", "planetary position marathi",
        "planetary positions today", "vedic planets today", "graha gochar",
      ],
    },
    en: {
      title: "Planetary Positions Today — 9 Grahas Live | Graha Sthiti | Bhaagyavedh",
      description:
        "Live planetary positions — Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu. Real-time vedic graha sthiti with rashi and nakshatra positions.",
      keywords: [
        "planetary positions today", "graha sthiti", "vedic planets", "graha gochar",
        "9 grahas", "planetary transit",
        "graha sthiti marathi", "aaj chi graha sthiti", "planetary position marathi",
        "ग्रह स्थिती", "ग्रह गोचर",
      ],
    },
  });
}

export default async function GrahaSthitiPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const base = `https://bhaagyavedh.com/${lang}`;
  const url = `${base}/graha-sthiti`;
  return (
    <>
      <JsonLd data={serviceSchema({
        name: "Planetary Positions — ग्रह स्थिती",
        description: "Live positions of 9 Navagraha — Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu — in rashi and nakshatra (Lahiri Ayanamsa).",
        url,
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: base },
        { name: "Graha Sthiti", url },
      ])} />
      <CurrentPlanetsPageClient />
    </>
  );
}
