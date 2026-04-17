import { pageMeta } from "@/lib/seo";
import CurrentPlanetsPageClient from "./graha-sthiti-client";

export const metadata = pageMeta({
  title: "Today's Planetary Positions — आजची ग्रह स्थिती | Navagraha Transit Live",
  description: "Live planetary positions of all 9 Navagraha with rashi, nakshatra, and degree. Real-time graha sthiti updated every 60 seconds.",
  path: "/graha-sthiti",
  keywords: ["planetary positions today", "graha sthiti", "planet transit", "ग्रह स्थिती", "navagraha position"],
});

export default function GrahaSthitiPage() {
  return <CurrentPlanetsPageClient />;
}
