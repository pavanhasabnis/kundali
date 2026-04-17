import { pageMeta } from "@/lib/seo";
import ComparePageClient from "./compare-client";

export const metadata = pageMeta({
  title: "Kundli Comparison — कुंडली तुलना | Compare Two Birth Charts Side by Side",
  description: "Compare two kundlis side by side. View planetary positions, lagna, moon sign, and nakshatra differences for husband-wife or parent-child charts.",
  path: "/compare",
  keywords: ["kundli comparison", "birth chart comparison", "horoscope comparison", "कुंडली तुलना"],
});

export default function ComparePage() {
  return <ComparePageClient />;
}
