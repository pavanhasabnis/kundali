import { pageMeta } from "@/lib/seo";
import { getAllSangrahItems, getSangrahCategoryCounts } from "@/lib/sangrah-reader";
import SangrahPageClient from "./sangrah-client";

export const metadata = pageMeta({
  title: "Sangrah — आरती स्तोत्र मंत्र संग्रह",
  description:
    "200+ aartis, stotras, chalisas, mantras, vrat kathas & daily prayers in Marathi & Sanskrit. आरती, स्तोत्र, चालीसा, मंत्र, व्रत कथा संग्रह.",
  path: "/sangrah",
  keywords: [
    "aarti sangrah", "आरती संग्रह", "stotra", "स्तोत्र",
    "chalisa", "चालीसा", "mantra", "मंत्र", "vrat katha", "व्रत कथा",
    "ganpati aarti", "hanuman chalisa", "ramraksha stotra",
    "marathi aarti", "hindu prayers", "daily prayers",
  ],
});

export default function SangrahPage() {
  const items = getAllSangrahItems();
  const counts = getSangrahCategoryCounts();
  return <SangrahPageClient items={JSON.parse(JSON.stringify(items))} counts={counts} />;
}
