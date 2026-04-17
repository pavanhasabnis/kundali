import { pageMeta } from "@/lib/seo";
import MatchingPageClient from "./matching-client";

export const metadata = pageMeta({
  title: "Kundli Matching for Marriage — गुण मिलान | Free Gun Milan Online",
  description:
    "Free Ashtakoot Kundli matching for marriage compatibility. Check 36-point Guna Milan with Varna, Vashya, Tara, Yoni, Maitri, Gana, Bhakoot & Nadi analysis in English and Marathi.",
  path: "/matching",
  keywords: [
    "kundli matching",
    "gun milan",
    "guna matching for marriage",
    "कुंडली जुळवणी",
    "गुण मिलान",
  ],
});

export default function MatchingPage() {
  return <MatchingPageClient />;
}
