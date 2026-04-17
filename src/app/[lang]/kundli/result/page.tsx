import { pageMeta } from "@/lib/seo";
import KundliResultClient from "./kundli-result-client";

export const metadata = pageMeta({
  title: "Your Kundli Result — तुमची कुंडली | Birth Chart Analysis",
  description: "View your complete Vedic birth chart analysis — planetary positions, dasha periods, yogas, doshas, and detailed house predictions.",
  path: "/kundli/result",
  noindex: true,
});

export default function KundliResultPage() {
  return <KundliResultClient />;
}
