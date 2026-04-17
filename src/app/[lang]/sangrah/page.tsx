import { pageMetaI18n, type Lang } from "@/lib/seo";
import { getAllSangrahItems, getSangrahCategoryCounts } from "@/lib/sangrah-reader";
import SangrahPageClient from "./sangrah-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l: Lang = lang === "en" ? "en" : lang === "hi" ? "hi" : "mr";
  return pageMetaI18n({
    lang: l,
    path: "/sangrah",
    mr: {
      title: "संग्रह — आरती, स्तोत्र, चालीसा, मंत्र, व्रत कथा",
      description:
        "मराठी संग्रह — आरती, स्तोत्र, चालीसा, मंत्र, व्रत कथा, दैनिक प्रार्थना, नामावली. Marathi aarti sangrah, stotra, chalisa संग्रह मोफत डाउनलोड.",
      keywords: [
        "मराठी आरती", "मराठी स्तोत्र", "चालीसा मराठी", "मंत्र मराठी",
        "व्रत कथा मराठी", "दैनिक प्रार्थना",
        "marathi aarti", "marathi stotra", "chalisa marathi", "mantra marathi",
        "vrat katha marathi",
        "aarti collection", "sanskrit stotra", "hindu chalisa", "vrat katha",
      ],
    },
    en: {
      title: "Sangrah — Aarti, Stotra, Chalisa, Mantra, Vrat Katha",
      description:
        "Collection of aartis, stotras, chalisas, mantras & vrat kathas in Sanskrit and Marathi with English meaning. Marathi aarti sangrah — free download.",
      keywords: [
        "aarti collection", "sanskrit stotra", "hindu chalisa", "mantra list",
        "vrat katha english",
        "marathi aarti", "marathi stotra", "chalisa marathi", "vrat katha marathi",
        "मराठी आरती", "मराठी स्तोत्र",
      ],
    },
  });
}

export default function SangrahPage() {
  const items = getAllSangrahItems();
  const counts = getSangrahCategoryCounts();
  return <SangrahPageClient items={JSON.parse(JSON.stringify(items))} counts={counts} />;
}
