import { notFound } from "next/navigation";
import { RASHI_LIST, getRashiBySlug } from "@/lib/rashi-data";
import { pageMetaI18n, type Lang } from "@/lib/seo";
import { predictRashifal } from "@/lib/astrology/rashifal-predictor";
import RashiPageClient from "../rashi-page-client";
import { JsonLd } from "@/components/json-ld";

export const revalidate = 86400;

const GREG_MONTHS_MR = ["जानेवारी","फेब्रुवारी","मार्च","एप्रिल","मे","जून","जुलै","ऑगस्ट","सप्टेंबर","ऑक्टोबर","नोव्हेंबर","डिसेंबर"];
const GREG_MONTHS_HI = ["जनवरी","फरवरी","मार्च","अप्रैल","मई","जून","जुलाई","अगस्त","सितंबर","अक्टूबर","नवंबर","दिसंबर"];
const GREG_MONTHS_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const ROMAN_MARATHI: Record<string, string[]> = {
  mesh: ["mesh", "mesha"],
  vrishabh: ["vrishabh", "vrushabh", "vrishaba"],
  mithun: ["mithun"],
  kark: ["kark", "karka"],
  singh: ["singh", "simha"],
  kanya: ["kanya"],
  tula: ["tula"],
  vrishchik: ["vrishchik", "vrushchik"],
  dhanu: ["dhanu"],
  makar: ["makar"],
  kumbh: ["kumbh"],
  meen: ["meen", "meena"],
};

function parseDate(dateStr: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return null;
  const [y, m, d] = dateStr.split("-").map(Number);
  if (y < 1900 || y > 2100) return null;
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null;
  return dt;
}

function formatDate(d: Date, lang: Lang): string {
  const day = d.getDate();
  const year = d.getFullYear();
  const months = lang === "en" ? GREG_MONTHS_EN : lang === "hi" ? GREG_MONTHS_HI : GREG_MONTHS_MR;
  return `${day} ${months[d.getMonth()]} ${year}`;
}

type Props = { params: Promise<{ lang: string; rashi: string; date: string }> };

export async function generateMetadata({ params }: Props) {
  const { lang, rashi: slug, date: dateStr } = await params;
  const rashi = getRashiBySlug(slug);
  if (!rashi) return {};
  const d = parseDate(dateStr);
  if (!d) return { title: "Invalid date", robots: { index: false, follow: false } };

  const l: Lang = lang === "en" ? "en" : lang === "hi" ? "hi" : "mr";
  const dateLabel = formatDate(d, l);
  const roman = ROMAN_MARATHI[slug]?.[0] || slug;
  const romanExtras = ROMAN_MARATHI[slug] || [];

  return pageMetaI18n({
    lang: l,
    path: `/rashifal/${slug}/${dateStr}`,
    ogType: "article",
    mr: {
      title: `${rashi.mr} राशीफल ${dateLabel} — ${roman} Rashi Bhavishya`,
      description: `${rashi.mr} राशीचे ${dateLabel} चे भविष्य — करिअर, प्रेम, आरोग्य, आर्थिक. ${roman} rashi bhavishya ${dateLabel} — ग्रह गोचरावर आधारित अचूक दैनिक भविष्य.`,
      keywords: [
        `${rashi.mr} राशीफल ${dateLabel}`,
        `${rashi.mr} राशीभविष्य ${dateLabel}`,
        `${rashi.mr} राशीफल`,
        `${rashi.mr} राशी`,
        ...romanExtras.map((r) => `${r} rashifal ${dateStr}`),
        ...romanExtras.map((r) => `${r} rashifal ${dateLabel}`),
        ...romanExtras.map((r) => `${r} rashi bhavishya`),
        `${rashi.en} horoscope ${dateLabel}`,
        `${rashi.en} horoscope`,
        ...rashi.keywordsMr,
      ],
    },
    en: {
      title: `${rashi.en} Horoscope ${dateLabel} — ${roman} Rashi Bhavishya`,
      description: `${rashi.en} horoscope for ${dateLabel} — career, love, health, finance. ${roman} rashi bhavishya ${dateLabel} (${rashi.mr}) — real Vedic transits.`,
      keywords: [
        `${rashi.en} horoscope ${dateLabel}`,
        `${rashi.en} horoscope ${dateStr}`,
        `${rashi.en} daily horoscope`,
        ...romanExtras.map((r) => `${r} rashifal ${dateLabel}`),
        ...romanExtras.map((r) => `${r} rashi ${dateLabel}`),
        `${rashi.mr} राशीफल`,
        ...rashi.keywordsEn,
      ],
    },
    hi: {
      title: `${rashi.mr} राशिफल ${dateLabel} — ${roman} Rashi Bhavishya`,
      description: `${rashi.mr} राशि का ${dateLabel} का भविष्य — करियर, प्रेम, स्वास्थ्य, वित्त. ${roman} rashi bhavishya ${dateLabel} — ग्रह गोचर आधारित.`,
      keywords: [
        `${rashi.mr} राशिफल ${dateLabel}`,
        `${rashi.mr} राशि भविष्य ${dateLabel}`,
        `${rashi.mr} राशिफल`,
        ...romanExtras.map((r) => `${r} rashifal ${dateLabel}`),
      ],
    },
  });
}

export default async function DatedRashiPage({ params }: Props) {
  const { lang, rashi: slug, date: dateStr } = await params;
  const rashi = getRashiBySlug(slug);
  if (!rashi) notFound();
  const d = parseDate(dateStr);
  if (!d) notFound();

  const l: Lang = lang === "en" ? "en" : lang === "hi" ? "hi" : "mr";
  const dateLabel = formatDate(d, l);
  const base = `https://bhaagyavedh.com/${lang}`;
  const url = `${base}/rashifal/${slug}/${dateStr}`;

  let initialPrediction = null;
  try {
    initialPrediction = predictRashifal(rashi.id, d);
  } catch {
    // swisseph unavailable during build/SSR
  }

  const headline = l === "mr"
    ? `${rashi.mr} राशीफल ${dateLabel}`
    : l === "hi"
    ? `${rashi.mr} राशिफल ${dateLabel}`
    : `${rashi.en} Horoscope ${dateLabel}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description: l === "mr"
      ? `${rashi.mr} राशीचे ${dateLabel} चे भविष्य — करिअर, प्रेम, आरोग्य, आर्थिक.`
      : l === "hi"
      ? `${rashi.mr} राशि का ${dateLabel} का भविष्य.`
      : `${rashi.en} horoscope for ${dateLabel} — career, love, health, finance.`,
    url,
    image: "https://bhaagyavedh.com/opengraph-image.png",
    datePublished: dateStr,
    dateModified: dateStr,
    author: { "@type": "Organization", name: "Bhaagyavedh", url: "https://bhaagyavedh.com" },
    publisher: {
      "@type": "Organization",
      name: "Bhaagyavedh",
      url: "https://bhaagyavedh.com",
      logo: { "@type": "ImageObject", url: "https://bhaagyavedh.com/logos/logo-dark.svg" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    inLanguage: l === "en" ? "en-IN" : l === "hi" ? "hi-IN" : "mr-IN",
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <RashiPageClient
        rashiSlug={slug}
        rashiId={rashi.id}
        initialPrediction={initialPrediction}
        initialDate={dateStr}
      />
    </>
  );
}

export function generateStaticParams() {
  const today = new Date();
  const iso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return RASHI_LIST.flatMap((r) => [
    { lang: "mr", rashi: r.slug, date: iso },
    { lang: "en", rashi: r.slug, date: iso },
    { lang: "hi", rashi: r.slug, date: iso },
  ]);
}
