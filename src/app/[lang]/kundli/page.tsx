import { pageMetaI18n, type Lang } from "@/lib/seo";
import KundliPageClient from "./kundli-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l: Lang = lang === "en" ? "en" : lang === "hi" ? "hi" : "mr";
  return pageMetaI18n({
    lang: l,
    path: "/kundli",
    mr: {
      title: "मोफत जन्म कुंडली ऑनलाइन — Mofat Janam Kundli",
      description:
        "मोफत जन्म कुंडली तयार करा. जन्म तारीख, वेळ, ठिकाण टाका आणि अचूक लग्न कुंडली, ग्रह, दशा, योग मिळवा. Mofat kundali marathi, लाहिरी अयनांश.",
      keywords: [
        "मोफत कुंडली", "जन्म कुंडली", "जन्म पत्रिका", "ऑनलाइन कुंडली", "लग्न कुंडली",
        "कुंडली मराठी", "वैदिक कुंडली", "ग्रह स्थिती",
        "mofat kundli", "janam kundali marathi", "online kundli marathi", "kundali maker marathi",
        "free kundli marathi", "janam patrika",
        "free kundli online", "birth chart free", "vedic kundli",
      ],
    },
    en: {
      title: "Free Kundli Online — Janam Kundali Maker | Bhaagyavedh",
      description:
        "Free janam kundli online. Enter birth date, time, place — get accurate lagna chart, planetary positions, dashas & yogas. Mofat kundali marathi maker.",
      keywords: [
        "free kundli online", "free janam kundli", "kundli maker online", "birth chart free",
        "lagna chart", "vedic kundli",
        "mofat kundli", "janam kundali marathi", "kundali maker", "kundli in marathi",
        "online kundali marathi",
        "जन्म कुंडली", "मोफत कुंडली",
      ],
    },
    hi: {
      title: "मुफ्त जन्म कुंडली ऑनलाइन — Free Janam Kundali Hindi",
      description:
        "मुफ्त जन्म कुंडली बनाएँ. जन्म तिथि, समय, स्थान भरें और सटीक लग्न कुंडली, ग्रह स्थिति, दशा, योग पाएँ. Free kundli hindi, लाहिरी अयनांश.",
      keywords: [
        "मुफ्त कुंडली", "जन्म कुंडली", "जन्म पत्रिका", "ऑनलाइन कुंडली", "लग्न कुंडली",
        "कुंडली हिंदी", "वैदिक कुंडली", "ग्रह स्थिति",
        "free kundli hindi", "janam kundali hindi", "online kundli hindi", "kundali maker hindi",
        "free kundli online", "birth chart hindi", "vedic kundli hindi", "janam patrika hindi",
      ],
    },
  });
}

export default function KundliPage() {
  return <KundliPageClient />;
}
