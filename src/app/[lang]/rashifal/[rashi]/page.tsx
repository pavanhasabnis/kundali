import { notFound } from "next/navigation";
import { RASHI_LIST, getRashiBySlug } from "@/lib/rashi-data";
import { pageMetaI18n, type Lang } from "@/lib/seo";
import { predictRashifal } from "@/lib/astrology/rashifal-predictor";
import RashiPageClient from "./rashi-page-client";

export function generateStaticParams() {
  return RASHI_LIST.flatMap((r) => [
    { lang: "mr", rashi: r.slug },
    { lang: "en", rashi: r.slug },
  ]);
}

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

type Props = { params: Promise<{ lang: string; rashi: string }> };

export async function generateMetadata({ params }: Props) {
  const { lang, rashi: slug } = await params;
  const rashi = getRashiBySlug(slug);
  if (!rashi) return {};

  const l: Lang = lang === "en" ? "en" : lang === "hi" ? "hi" : "mr";
  const today = new Date();
  const dateEn = today.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const dateMr = today.toLocaleDateString("mr-IN", { day: "numeric", month: "long", year: "numeric" });
  const roman = ROMAN_MARATHI[slug]?.[0] || slug;
  const romanExtras = ROMAN_MARATHI[slug] || [];

  return pageMetaI18n({
    lang: l,
    path: `/rashifal/${slug}`,
    ogType: "article",
    mr: {
      title: `${rashi.mr} राशीफल आज — ${roman} Rashi Bhavishya`,
      description: `${rashi.mr} राशीचे आजचे भविष्य (${dateMr}) — करिअर, प्रेम, आरोग्य, आर्थिक. ${roman} rashi aaj cha bhavishya — ग्रह गोचरावर आधारित अचूक दैनिक भविष्य.`,
      keywords: [
        `${rashi.mr} राशी`,
        `${rashi.mr} राशीफल`,
        `${rashi.mr} राशीफल आज`,
        `${rashi.mr} राशीभविष्य`,
        `${rashi.mr} राशी चे भविष्य`,
        ...romanExtras.map((r) => `${r} rashi`),
        ...romanExtras.map((r) => `${r} rashifal`),
        ...romanExtras.map((r) => `${r} rashi bhavishya`),
        ...romanExtras.map((r) => `${r} rashi aaj`),
        ...romanExtras.map((r) => `aajcha ${r} rashifal`),
        `${rashi.en} horoscope`,
        `${rashi.en} horoscope today`,
        `${rashi.en} daily horoscope`,
        ...rashi.keywordsMr,
      ],
    },
    en: {
      title: `${rashi.en} Horoscope Today — ${roman} Rashi Bhavishya`,
      description: `${rashi.en} daily horoscope ${dateEn} — career, love, health, finance. ${roman} rashi bhavishya (${rashi.mr}) marathi — real Vedic transits, daily.`,
      keywords: [
        `${rashi.en} horoscope`,
        `${rashi.en} horoscope today`,
        `${rashi.en} daily horoscope`,
        `${rashi.en} zodiac today`,
        ...romanExtras.map((r) => `${r} rashi`),
        ...romanExtras.map((r) => `${r} rashifal`),
        ...romanExtras.map((r) => `${r} rashi bhavishya`),
        ...romanExtras.map((r) => `aajcha ${r} rashifal`),
        `${rashi.mr} राशीफल`,
        `${rashi.mr} राशीभविष्य`,
        ...rashi.keywordsEn,
      ],
    },
  });
}

export const dynamic = "force-dynamic";

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
