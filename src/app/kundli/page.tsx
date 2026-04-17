import { pageMeta } from "@/lib/seo";
import KundliPageClient from "./kundli-client";

export const metadata = pageMeta({
  title: "Free Kundli Maker Online — जन्मकुंडली तयार करा | Birth Chart Generator",
  description:
    "Generate your free Janam Kundli online with accurate birth chart, planetary positions, dashas, and predictions. Create detailed Kundali in English and Marathi using Vedic astrology.",
  path: "/kundli",
  keywords: [
    "kundli maker",
    "kundali maker online free",
    "free kundli",
    "birth chart",
    "janam kundali",
    "जन्म कुंडली",
  ],
});

export default function KundliPage() {
  return <KundliPageClient />;
}
