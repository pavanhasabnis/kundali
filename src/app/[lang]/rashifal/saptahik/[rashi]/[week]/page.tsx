import { notFound, redirect } from "next/navigation";
import { RASHI_LIST, getRashiBySlug } from "@/lib/rashi-data";
import { pageMetaI18n, type Lang } from "@/lib/seo";
import SaptahikRashiClient from "../saptahik-rashi-client";
import { JsonLd } from "@/components/json-ld";
import { computeWeeklyForecast, getWeekStart } from "@/lib/astrology/gochar-weekly";

export const revalidate = 86400;

const GREG_MONTHS_MR = ["जानेवारी","फेब्रुवारी","मार्च","एप्रिल","मे","जून","जुलै","ऑगस्ट","सप्टेंबर","ऑक्टोबर","नोव्हेंबर","डिसेंबर"];
const GREG_MONTHS_HI = ["जनवरी","फरवरी","मार्च","अप्रैल","मई","जून","जुलाई","अगस्त","सितंबर","अक्टूबर","नवंबर","दिसंबर"];
const GREG_MONTHS_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function parseDate(s: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const [y, m, d] = s.split("-").map(Number);
  if (y < 1900 || y > 2100) return null;
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null;
  return dt;
}

function fmtDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDate(d: Date, lang: Lang): string {
  const months = lang === "en" ? GREG_MONTHS_EN : lang === "hi" ? GREG_MONTHS_HI : GREG_MONTHS_MR;
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

type Props = { params: Promise<{ lang: string; rashi: string; week: string }> };

export async function generateMetadata({ params }: Props) {
  const { lang, rashi: slug, week } = await params;
  const rashi = getRashiBySlug(slug);
  if (!rashi) return {};
  const d = parseDate(week);
  if (!d) return { title: "Invalid week", robots: { index: false, follow: false } };

  const start = getWeekStart(d);
  const end = new Date(start); end.setDate(end.getDate() + 6);
  const l: Lang = lang === "en" ? "en" : lang === "hi" ? "hi" : "mr";
  const startLabel = formatDate(start, l);
  const endLabel = formatDate(end, l);
  const range = `${startLabel} – ${endLabel}`;

  return pageMetaI18n({
    lang: l,
    path: `/rashifal/saptahik/${slug}/${fmtDate(start)}`,
    ogType: "article",
    mr: {
      title: `${rashi.mr} साप्ताहिक राशीफल ${range} | Weekly ${rashi.en}`,
      description: `${rashi.mr} राशीचे ${range} चे साप्ताहिक भविष्य — करिअर, प्रेम, आरोग्य, आर्थिक. वैदिक ग्रह गोचरावर आधारित अचूक साप्ताहिक भविष्य.`,
      keywords: [
        `${rashi.mr} साप्ताहिक राशीफल ${startLabel}`,
        `${rashi.mr} साप्ताहिक राशिभविष्य`,
        `${rashi.mr} साप्ताहिक`,
        `${rashi.mr} या आठवड्याचे भविष्य`,
        `${rashi.en} weekly rashifal`,
        `${rashi.en} weekly horoscope`,
        `weekly ${rashi.en} marathi`,
      ],
    },
    en: {
      title: `${rashi.en} Weekly Horoscope ${range} — ${rashi.mr} साप्ताहिक`,
      description: `${rashi.en} (${rashi.mr}) weekly horoscope ${range} — career, love, health, finance. Based on real Vedic planetary transits.`,
      keywords: [
        `${rashi.en} weekly horoscope ${startLabel}`,
        `${rashi.en} weekly rashifal`,
        `${rashi.en} weekly horoscope`,
        `${rashi.mr} साप्ताहिक`,
      ],
    },
    hi: {
      title: `${rashi.mr} साप्ताहिक राशिफल ${range} | Weekly ${rashi.en}`,
      description: `${rashi.mr} राशि का ${range} का साप्ताहिक भविष्य — करियर, प्रेम, स्वास्थ्य, वित्त.`,
      keywords: [
        `${rashi.mr} साप्ताहिक राशिफल ${startLabel}`,
        `${rashi.en} weekly rashifal hindi`,
      ],
    },
  });
}

export default async function SaptahikDatedPage({ params }: Props) {
  const { lang, rashi: slug, week } = await params;
  const rashi = getRashiBySlug(slug);
  if (!rashi) notFound();
  const d = parseDate(week);
  if (!d) notFound();

  const start = getWeekStart(d);
  const startIso = fmtDate(start);

  // Canonicalize: if week param isn't the Monday of the week, redirect.
  if (week !== startIso) {
    redirect(`/${lang}/rashifal/saptahik/${slug}/${startIso}`);
  }

  const end = new Date(start); end.setDate(end.getDate() + 6);
  const l: Lang = lang === "en" ? "en" : lang === "hi" ? "hi" : "mr";
  const startLabel = formatDate(start, l);
  const endLabel = formatDate(end, l);
  const range = `${startLabel} – ${endLabel}`;
  const base = `https://bhaagyavedh.com/${lang}`;
  const url = `${base}/rashifal/saptahik/${slug}/${startIso}`;

  const headline = l === "mr"
    ? `${rashi.mr} साप्ताहिक राशीफल ${range}`
    : l === "hi"
    ? `${rashi.mr} साप्ताहिक राशिफल ${range}`
    : `${rashi.en} Weekly Horoscope ${range}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description: l === "mr"
      ? `${rashi.mr} राशीचे ${range} चे साप्ताहिक भविष्य.`
      : l === "hi"
      ? `${rashi.mr} राशि का ${range} का साप्ताहिक भविष्य.`
      : `${rashi.en} (${rashi.mr}) weekly horoscope ${range}.`,
    url,
    image: "https://bhaagyavedh.com/opengraph-image.png",
    datePublished: startIso,
    dateModified: startIso,
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

  // Precompute weekly forecast server-side for SSR hydration (SEO-critical).
  let initialData = null;
  try {
    initialData = computeWeeklyForecast(start);
  } catch {
    // swisseph unavailable during build — client will fetch on mount.
  }

  return (
    <>
      <JsonLd data={articleSchema} />
      <SaptahikRashiClient rashiId={rashi.id} rashiSlug={slug} initialWeek={startIso} initialData={initialData} />
    </>
  );
}

export function generateStaticParams() {
  const now = new Date();
  const monday = getWeekStart(now);
  const iso = fmtDate(monday);
  return RASHI_LIST.flatMap((r) => [
    { lang: "mr", rashi: r.slug, week: iso },
    { lang: "en", rashi: r.slug, week: iso },
    { lang: "hi", rashi: r.slug, week: iso },
  ]);
}
