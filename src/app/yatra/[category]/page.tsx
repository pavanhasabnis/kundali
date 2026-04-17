import { pageMeta } from "@/lib/seo";
import YatraCategoryPageClient from "./yatra-category-client";

export const metadata = pageMeta({
  title: "Yatra Packages — तीर्थयात्रा पॅकेज",
  description:
    "Browse yatra packages by category — Jyotirlinga, Char Dham, Ashtavinayak, Shakti Peeth and more pilgrimage tours. तीर्थयात्रा पॅकेज.",
  path: "/yatra",
  keywords: [
    "yatra packages",
    "pilgrimage tour",
    "temple tour",
    "तीर्थयात्रा",
  ],
});

export default function YatraCategoryPage() {
  return <YatraCategoryPageClient />;
}
