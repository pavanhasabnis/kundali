import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSangrahItem, getAllSangrahSlugs, SANGRAH_CATEGORIES } from "@/lib/sangrah-reader";
import { SITE_URL } from "@/lib/seo";
import SangrahDetailClient from "./detail-client";

export function generateStaticParams() {
  return getAllSangrahSlugs();
}

const OG_IMAGE = {
  url: `${SITE_URL}/logos/og-image.png`,
  width: 1200,
  height: 630,
  alt: "Bhaagyavedh — भाग्यवेध | Vedic Astrology",
};

type Props = { params: Promise<{ category: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;
  const item = getSangrahItem(slug);
  if (!item) return {};

  const cat = SANGRAH_CATEGORIES.find((c) => c.id === category);
  const title = `${item.titleEn} — ${item.title}`;
  const description = `${item.titleEn} with Sanskrit text, transliteration & meaning. ${item.title} — ${cat?.labelMr || category}. Read, learn and recite.`;
  const url = `${SITE_URL}/sangrah/${category}/${slug}`;

  return {
    title,
    description,
    keywords: item.tags.join(", "),
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Bhaagyavedh",
      locale: "mr_IN",
      type: "article",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
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
