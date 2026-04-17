import HomePageClient from "./home-client";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Bhaagyavedh — भाग्यवेध | मोफत कुंडली, राशीफल, पंचांग, गुण मिलान",
  description:
    "अचूक वैदिक ज्योतिष सेवा — मोफत जन्म कुंडली, दैनिक राशीफल, गुण मिलान, पंचांग, शुभ मुहूर्त, आणि यात्रा मार्गदर्शन. Free Vedic kundli, daily rashifal, panchang, matching and muhurat.",
  path: "/",
  keywords: [
    "kundli", "janam kundli", "rashifal", "panchang", "muhurat",
    "gun milan", "matching", "vedic astrology", "marathi kundli",
    "भाग्यवेध", "कुंडली", "राशीफल", "पंचांग", "मुहूर्त",
  ],
});

export default function HomePage() {
  return <HomePageClient />;
}
