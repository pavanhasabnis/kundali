import { notFound } from "next/navigation";
import { getAllSangrahItems, SANGRAH_CATEGORIES } from "@/lib/sangrah-reader";
import { pageMetaI18n, type Lang } from "@/lib/seo";
import CategoryPageClient from "./category-client";

export function generateStaticParams() {
  return SANGRAH_CATEGORIES.flatMap((cat) => [
    { lang: "mr", category: cat.id },
    { lang: "en", category: cat.id },
  ]);
}

type Props = { params: Promise<{ lang: string; category: string }> };

export async function generateMetadata({ params }: Props) {
  const { lang, category } = await params;
  const cat = SANGRAH_CATEGORIES.find((c) => c.id === category);
  if (!cat) return {};
  const l: Lang = lang === "en" ? "en" : "mr";

  return pageMetaI18n({
    lang: l,
    path: `/sangrah/${category}`,
    mr: {
      title: `${cat.labelMr} संग्रह — ${cat.labelEn} Marathi | भाग्यवेध`,
      description: `मराठी ${cat.labelMr} संग्रह — ${cat.description}. संस्कृत मुळ, मराठी लिप्यंतर आणि अर्थासह.`,
      keywords: [
        `${cat.labelMr}`, `मराठी ${cat.labelMr}`, `${cat.labelMr} संग्रह`,
        `${cat.labelEn.toLowerCase()} marathi`, `marathi ${cat.labelEn.toLowerCase()}`,
        `${cat.labelEn.toLowerCase()}`, `${cat.labelEn.toLowerCase()} collection`,
        "sanskrit text", "hindu prayers",
      ],
    },
    en: {
      title: `${cat.labelEn} Collection — ${cat.labelMr} | Sanskrit + Marathi | Bhaagyavedh`,
      description: `Complete ${cat.labelEn.toLowerCase()} collection in Sanskrit with Marathi transliteration and English meaning. ${cat.descriptionEn}.`,
      keywords: [
        `${cat.labelEn.toLowerCase()}`, `${cat.labelEn.toLowerCase()} collection`,
        `${cat.labelEn.toLowerCase()} list`, `${cat.labelEn.toLowerCase()} lyrics`,
        `${cat.labelEn.toLowerCase()} marathi`, `marathi ${cat.labelEn.toLowerCase()}`,
        `${cat.labelMr}`, `मराठी ${cat.labelMr}`,
      ],
    },
  });
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = SANGRAH_CATEGORIES.find((c) => c.id === category);
  if (!cat) notFound();

  const items = getAllSangrahItems(category);
  return (
    <CategoryPageClient
      category={cat}
      items={JSON.parse(JSON.stringify(items))}
    />
  );
}
