import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllSangrahItems, SANGRAH_CATEGORIES } from "@/lib/sangrah-reader";
import { SITE_URL } from "@/lib/seo";
import CategoryPageClient from "./category-client";

export function generateStaticParams() {
  return SANGRAH_CATEGORIES.map((cat) => ({ category: cat.id }));
}

const OG_IMAGE = {
  url: `${SITE_URL}/logos/og-image.png`,
  width: 1200,
  height: 630,
  alt: "Bhaagyavedh — भाग्यवेध | Vedic Astrology",
};

type Props = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = SANGRAH_CATEGORIES.find((c) => c.id === category);
  if (!cat) return {};

  const title = `${cat.labelEn} — ${cat.labelMr}`;
  const description = `${cat.descriptionEn}. ${cat.description}. Browse all ${cat.labelEn.toLowerCase()} with Sanskrit text, transliteration & meaning.`;
  const url = `${SITE_URL}/sangrah/${category}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Bhaagyavedh",
      locale: "mr_IN",
      type: "website",
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
