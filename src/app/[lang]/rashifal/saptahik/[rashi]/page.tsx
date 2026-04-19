import { notFound } from "next/navigation";
import { RASHI_LIST, getRashiBySlug } from "@/lib/rashi-data";
import { pageMetaI18n, type Lang } from "@/lib/seo";
import SaptahikRashiClient from "./saptahik-rashi-client";

export function generateStaticParams() {
  return RASHI_LIST.flatMap((r) => [
    { lang: "mr", rashi: r.slug },
    { lang: "en", rashi: r.slug },
    { lang: "hi", rashi: r.slug },
  ]);
}

type Props = { params: Promise<{ lang: string; rashi: string }> };

export async function generateMetadata({ params }: Props) {
  const { lang, rashi: slug } = await params;
  const rashi = getRashiBySlug(slug);
  if (!rashi) return {};

  const l: Lang = lang === "en" ? "en" : lang === "hi" ? "hi" : "mr";
  return pageMetaI18n({
    lang: l,
    path: `/rashifal/saptahik/${slug}`,
    ogType: "article",
    mr: {
      title: `${rashi.mr} साप्ताहिक राशिभविष्य | Weekly ${rashi.en} Rashifal`,
      description: `${rashi.mr} राशीचे या आठवड्याचे भविष्य — करिअर, प्रेम, आरोग्य, आर्थिक. वैदिक ग्रह गोचरावर आधारित अचूक साप्ताहिक भविष्य.`,
      keywords: [
        `${rashi.mr} साप्ताहिक राशिभविष्य`, `${rashi.mr} साप्ताहिक`,
        `${rashi.mr} weekly rashifal`, `weekly ${rashi.en} horoscope`,
        `${rashi.en} weekly rashifal marathi`, `${rashi.mr} या आठवड्याचे भविष्य`,
      ],
    },
    en: {
      title: `${rashi.en} Weekly Horoscope — ${rashi.mr} साप्ताहिक राशिभविष्य`,
      description: `${rashi.en} (${rashi.mr}) weekly horoscope — career, love, health, finance. Based on real Vedic planetary transits.`,
      keywords: [
        `${rashi.en} weekly horoscope`, `${rashi.en} weekly rashifal`,
        `weekly ${rashi.en} marathi`, `${rashi.mr} साप्ताहिक`,
      ],
    },
    hi: {
      title: `${rashi.mr} साप्ताहिक राशिफल | Weekly ${rashi.en} Rashifal Hindi`,
      description: `${rashi.mr} राशि का इस सप्ताह का भविष्य — करियर, प्रेम, स्वास्थ्य, वित्त.`,
      keywords: [
        `${rashi.mr} साप्ताहिक राशिफल`, `${rashi.en} weekly rashifal hindi`,
      ],
    },
  });
}

export const dynamic = "force-dynamic";

export default async function SaptahikRashiPage({ params }: Props) {
  const { rashi: slug } = await params;
  const rashi = getRashiBySlug(slug);
  if (!rashi) notFound();
  return <SaptahikRashiClient rashiId={rashi.id} rashiSlug={slug} />;
}
