import { notFound } from "next/navigation";
import { getSangrahItem, getAllSangrahSlugs, SANGRAH_CATEGORIES } from "@/lib/sangrah-reader";
import { pageMetaI18n, type Lang } from "@/lib/seo";
import SangrahDetailClient from "./detail-client";

export function generateStaticParams() {
  const base = getAllSangrahSlugs();
  return base.flatMap((p) => [
    { lang: "mr", ...p },
    { lang: "en", ...p },
  ]);
}

type Props = { params: Promise<{ lang: string; category: string; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { lang, category, slug } = await params;
  const item = getSangrahItem(slug);
  if (!item) return {};
  const l: Lang = lang === "en" ? "en" : "mr";

  const cat = SANGRAH_CATEGORIES.find((c) => c.id === category);
  const catMr = cat?.labelMr || category;
  const catEn = cat?.labelEn || category;
  const deity = item.deityEn || "";

  return pageMetaI18n({
    lang: l,
    path: `/sangrah/${category}/${slug}`,
    ogType: "article",
    mr: {
      title: `${item.title} — ${item.titleEn} मराठी | ${catMr} | भाग्यवेध`,
      description: `${item.title} (${item.titleEn}) — संपूर्ण संस्कृत पाठ, मराठी लिप्यंतर आणि अर्थ. ${catMr} संग्रह. ${deity} ${catMr.toLowerCase()}.`,
      keywords: [
        `${item.title}`, `${item.title} मराठी`, `${item.title} lyrics`,
        `${item.titleEn} marathi`, `${item.titleEn} lyrics`,
        `${item.titleEn}`, `${item.titleEn} sanskrit`,
        ...(item.tags || []),
        `${catMr}`, `मराठी ${catMr}`,
      ],
    },
    en: {
      title: `${item.titleEn} — ${item.title} Marathi ${catEn} Lyrics | Bhaagyavedh`,
      description: `${item.titleEn} (${item.title}) ${catEn.toLowerCase()} — complete Sanskrit text with Marathi transliteration and English meaning. ${deity} prayer.`,
      keywords: [
        `${item.titleEn}`, `${item.titleEn} lyrics`, `${item.titleEn} sanskrit`,
        `${item.titleEn} meaning`, `${item.titleEn} marathi`,
        `${item.title}`, `${item.title} मराठी`,
        ...(item.tags || []),
        `${catEn.toLowerCase()} lyrics`, `${catEn.toLowerCase()} sanskrit`,
      ],
    },
  });
}

export default async function SangrahDetailPage({ params }: Props) {
  const { category, slug } = await params;
  const item = getSangrahItem(slug);
  if (!item) notFound();

  const cat = SANGRAH_CATEGORIES.find((c) => c.id === category);

  return (
    <SangrahDetailClient
      item={JSON.parse(JSON.stringify(item))}
      categoryLabel={cat ? { mr: cat.labelMr, en: cat.labelEn } : { mr: category, en: category }}
    />
  );
}
