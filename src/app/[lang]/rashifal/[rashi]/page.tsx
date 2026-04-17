import { Metadata } from "next";
import { notFound } from "next/navigation";
import { RASHI_LIST, getRashiBySlug } from "@/lib/rashi-data";
import { SITE_URL } from "@/lib/seo";
import { predictRashifal } from "@/lib/astrology/rashifal-predictor";
import RashiPageClient from "./rashi-page-client";

export function generateStaticParams() {
  return RASHI_LIST.map((r) => ({ rashi: r.slug }));
}

const OG_IMAGE = {
  url: `${SITE_URL}/logos/og-image.png`,
  width: 1200,
  height: 630,
  alt: "Bhaagyavedh — भाग्यवेध | Vedic Astrology",
};

type Props = { params: Promise<{ rashi: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { rashi: slug } = await params;
  const rashi = getRashiBySlug(slug);
  if (!rashi) return {};

  // Include today's date for freshness signal
  const today = new Date();
  const dateEn = today.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const dateMr = today.toLocaleDateString("mr-IN", { day: "numeric", month: "long", year: "numeric" });

  const title = `${rashi.mr} राशीफल आज ${dateMr} — ${rashi.en} Horoscope Today ${dateEn} | Bhaagyavedh`;
  const description = `${rashi.descMr} ${rashi.descEn} ${dateEn}.`;
  const url = `${SITE_URL}/rashifal/${slug}`;
  const keywords = [...rashi.keywordsMr, ...rashi.keywordsEn, "daily horoscope", "आजचे राशीफल", "rashifal today", "horoscope today marathi"];

  return {
    title,
    description,
    keywords: keywords.join(", "),
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

export const dynamic = "force-dynamic"; // Must be dynamic — date changes daily

export default async function RashiPage({ params }: Props) {
  const { rashi: slug } = await params;
  const rashi = getRashiBySlug(slug);
  if (!rashi) notFound();

  let initialPrediction = null;
  try {
    initialPrediction = predictRashifal(rashi.id);
  } catch {
    // swisseph unavailable during build/SSR — fall back to client fetch
  }

  return <RashiPageClient rashiSlug={slug} rashiId={rashi.id} initialPrediction={initialPrediction} />;
}
