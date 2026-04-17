import { pageMeta } from "@/lib/seo";
import TemplesPageClient from "./temples-client";

export const metadata = pageMeta({
  title: "Famous Temples in India — मंदिर माहिती | Jyotirlinga, Ashtavinayak & Char Dham Guide",
  description: "Complete guide to 50+ famous Hindu temples — 12 Jyotirlinga, 8 Ashtavinayak, Char Dham, Shakti Peeth temples. Darshan timings, significance, how to reach, history & travel info.",
  path: "/temples",
  keywords: ["temples in india", "famous temples", "hindu temples", "मंदिर", "12 jyotirlinga", "ashtavinayak", "char dham", "shakti peeth", "temple darshan timings", "temple guide"],
});

export default function TemplesPage() {
  return <TemplesPageClient />;
}
