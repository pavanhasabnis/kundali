import { pageMetaI18n, type Lang } from "@/lib/seo";
import { getAllSangrahItems, getSangrahCategoryCounts } from "@/lib/sangrah-reader";
import type { SangrahPopularItem } from "@/lib/sangrah-types";
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

// Popular slugs shown in the "Quick Access" strip on the index.
// Kept in sync with the filter previously in the client component.
const POPULAR_SLUGS = [
  "aarti-ganpati",
  "stotra-ramraksha",
  "chalisa-hanuman",
  "stotra-ganpati-atharvashirsha",
  "mantra-gayatri",
  "mantra-mahamrityunjay",
  "aarti-shankar",
  "aarti-vitthal",
  "aarti-saibaba",
] as const;

export default function SangrahPage() {
  const items = getAllSangrahItems();
  const counts = getSangrahCategoryCounts();
  const totalCount = items.length;

  // Ship only minimal fields for the 9 popular items — avoids serializing
  // 90+ full devotional texts into the HTML payload (~1.5 MB → <20 KB).
  const popular: SangrahPopularItem[] = items
    .filter((i) => (POPULAR_SLUGS as readonly string[]).includes(i.slug))
    .map((i) => ({
      slug: i.slug,
      title: i.title,
      titleEn: i.titleEn,
      category: i.category,
      deityMrInitial: i.deityMr[0] ?? "",
      deityEnInitial: i.deityEn[0] ?? "",
    }));

  return <SangrahPageClient totalCount={totalCount} counts={counts} popular={popular} />;
}
