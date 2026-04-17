import { pageMetaI18n, type Lang } from "@/lib/seo";
import { JsonLd, breadcrumbSchema } from "@/components/json-ld";
import ComparePageClient from "./compare-client";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const l: Lang = lang === "en" ? "en" : "mr";
  return pageMetaI18n({
    lang: l,
    path: "/compare",
    mr: {
      title: "दोन कुंडलींची तुलना — Kundli Compare Marathi | भाग्यवेध",
      description:
        "दोन कुंडली एकत्र पाहा आणि तुलना करा. ग्रह स्थिती, नवमांश, दशा यांची तुलना. Kundali compare marathi, do kundalikanchi tulna.",
      keywords: [
        "कुंडली तुलना", "दोन कुंडली तुलना", "कुंडली compare", "कुंडली मेळ मराठी",
        "kundali compare marathi", "two kundali comparison", "kundli tulna",
        "kundli compare", "two charts comparison", "synastry chart",
      ],
    },
    en: {
      title: "Compare Two Kundlis Side by Side — Chart Comparison | Bhaagyavedh",
      description:
        "Compare two janam kundlis side by side. View planetary positions, navamsha, dashas together. Free kundali compare tool in Marathi and English.",
      keywords: [
        "kundli compare", "compare two kundlis", "chart comparison",
        "synastry vedic", "kundali comparison",
        "kundali compare marathi", "kundli tulna",
        "कुंडली तुलना", "कुंडली compare",
      ],
    },
  });
}

export default function ComparePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://bhaagyavedh.com" },
        { name: "Compare", url: "https://bhaagyavedh.com/compare" },
      ])} />
      <ComparePageClient />
    </>
  );
}
