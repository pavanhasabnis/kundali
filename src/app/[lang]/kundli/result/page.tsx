import { pageMetaI18n, type Lang } from "@/lib/seo";
import KundliResultClient from "./kundli-result-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l: Lang = lang === "en" ? "en" : "mr";
  return pageMetaI18n({
    lang: l,
    path: "/kundli/result",
    noindex: true,
    mr: {
      title: "तुमची कुंडली — Janam Kundli Result | भाग्यवेध",
      description: "तुमच्या जन्म कुंडलीचे संपूर्ण विश्लेषण — ग्रह स्थिती, दशा, योग, दोष आणि भाव भविष्य.",
      keywords: ["कुंडली result", "janam kundli result", "birth chart result"],
    },
    en: {
      title: "Your Kundli Result — Janam Kundli Analysis | Bhaagyavedh",
      description: "Complete Vedic birth chart analysis — planetary positions, dasha periods, yogas, doshas, and detailed house predictions.",
      keywords: ["kundli result", "janam kundli result", "birth chart analysis"],
    },
  });
}

export default function KundliResultPage() {
  return <KundliResultClient />;
}
