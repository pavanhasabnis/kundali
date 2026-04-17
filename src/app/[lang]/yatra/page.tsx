import { pageMeta } from "@/lib/seo";
import YatraPageClient from "./yatra-client";

export const metadata = pageMeta({
  title: "Temple Yatra Packages — तीर्थयात्रा | Jyotirlinga, Char Dham & Pilgrimage Tours",
  description:
    "Guided pilgrimage tours — Jyotirlinga Darshan, Char Dham Yatra, Ashtavinayak Tour, Shakti Peeth and more from Pune. तीर्थयात्रा पॅकेजेस.",
  path: "/yatra",
  keywords: [
    "temple tour packages",
    "yatra packages india",
    "pilgrimage tour",
    "तीर्थयात्रा",
    "religious tour packages",
  ],
});

export default function YatraPage() {
  return <YatraPageClient />;
}
